import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { NomeEvento, StatusFluxo } from "../../src/types.js";
import { CHECKLIST_PADRAO } from "../../src/checklist-padrao.js";
import { ArmazenamentoJson, type Armazenamento } from "./armazenamento.js";
import { itemDoChecklist } from "./validacao.js";
import { ErroFluxo, Fluxo } from "./fluxo.js";

/**
 * Serviço de integração Prescrição → Farmácia do carro de emergência.
 *
 * Variáveis de ambiente:
 *   PORTA=3080                   porta HTTP
 *   DADOS=./dados/banco.json     arquivo de dados (piloto)
 *   SLA_MINUTOS=60               prazo para a farmácia concluir a conferência
 *   RESERVA_MINUTOS=15           tempo que a conferência fica reservada a quem assumiu
 *   TOKEN_API=                   se definido, exige "Authorization: Bearer <token>" nas gravações
 *   ORIGENS=                     origens liberadas para CORS (ex.: https://ghosp.hro.local), separadas por vírgula
 *   GHOSP_WEBHOOK_URL=           se definido, repassa cada evento ao G-HOSP (POST JSON)
 *   GHOSP_WEBHOOK_TOKEN=         token enviado no webhook
 */
const env = process.env;
const PORTA = Number(env.PORTA ?? 3080);
const SLA = Number(env.SLA_MINUTOS ?? 60);
const RESERVA = Number(env.RESERVA_MINUTOS ?? 15);
const TOKEN = env.TOKEN_API ?? "";
const ORIGENS = (env.ORIGENS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const WEBHOOK = env.GHOSP_WEBHOOK_URL ?? "";

const aqui = fileURLToPath(new URL(".", import.meta.url));
const PUBLICO = resolve(aqui, "../public");
const DIST = resolve(aqui, "../../dist");

export function criarServidor(db: Armazenamento, opcoes = { slaMinutos: SLA, reservaMinutos: RESERVA }) {
  const fluxo = new Fluxo(db, opcoes);
  const clientesSse = new Set<ServerResponse>();

  // Automação 3: todo evento vai em tempo real para as telas abertas (SSE) e, se configurado, para o G-HOSP.
  fluxo.aoEvento((evento, dados) => {
    const msg = `event: ${evento}\ndata: ${JSON.stringify(dados)}\n\n`;
    for (const c of clientesSse) c.write(msg);
    if (WEBHOOK) void repassarWebhook(evento, dados);
  });

  const timerSla = setInterval(() => fluxo.verificarSla(), 60_000);
  const timerPing = setInterval(() => clientesSse.forEach((c) => c.write(": ping\n\n")), 25_000);

  const servidor = createServer(async (req, res) => {
    try {
      cors(req, res);
      if (req.method === "OPTIONS") return fim(res, 204);
      const url = new URL(req.url ?? "/", "http://local");
      const partes = url.pathname.split("/").filter(Boolean);

      if (partes[0] !== "api") return servirArquivo(url.pathname, res);

      if (req.method !== "GET" && TOKEN && req.headers.authorization !== `Bearer ${TOKEN}`)
        return json(res, 401, { mensagem: "Token inválido." });

      // GET /api/eventos — tempo real
      if (req.method === "GET" && partes[1] === "eventos") {
        res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
        res.write("retry: 3000\n\n");
        clientesSse.add(res);
        req.on("close", () => clientesSse.delete(res));
        return;
      }

      // /api/prescricoes
      if (partes[1] === "prescricoes") {
        if (req.method === "POST" && partes.length === 2) {
          const { registro, nova } = fluxo.receberPrescricao(await corpo(req));
          return json(res, nova ? 201 : 200, {
            idPrescricao: registro.prescricao.id, status: registro.status,
            mensagem: !nova ? "Prescrição já recebida."
              : registro.status === "AGUARDANDO_ENFERMAGEM" ? "Prescrição médica finalizada. Enfermagem avisada."
              : "Prescrição encaminhada à farmácia.",
          });
        }
        if (req.method === "GET" && partes.length === 2) {
          const status = url.searchParams.get("status")?.split(",").filter(Boolean) as StatusFluxo[] | undefined;
          return json(res, 200, fluxo.listar({ status, limite: Number(url.searchParams.get("limite")) || undefined }));
        }
        if (req.method === "GET" && partes.length === 3) return json(res, 200, fluxo.obter(partes[2]));
        if (req.method === "POST" && partes[3] === "enfermagem" && partes[4] === "iniciar") {
          const b = await corpo<{ enfermeiro: string }>(req);
          return json(res, 200, fluxo.iniciarEnfermagem(partes[2], b?.enfermeiro));
        }
        if (req.method === "POST" && partes[3] === "enfermagem" && partes.length === 4) {
          const r = fluxo.liberarEnfermagem(partes[2], await corpo(req));
          return json(res, 201, {
            idPrescricao: r.prescricao.id, status: r.status,
            mensagem: r.status === "CONFORME" ? "Liberado. Nenhum item a repor." : "Liberado para a farmácia.",
          });
        }
        if (req.method === "POST" && partes[3] === "assumir") {
          const b = await corpo<{ farmaceutico: string }>(req);
          return json(res, 200, fluxo.assumir(partes[2], b.farmaceutico));
        }
      }

      if (req.method === "POST" && partes[1] === "conferencias") {
        const r = fluxo.concluirConferencia(await corpo(req));
        return json(res, 201, { idPrescricao: r.conferenciaId, status: r.status, mensagem: "Conferência registrada." });
      }
      if (req.method === "GET" && partes[1] === "conferencias" && partes[2]) {
        const c = db.ler().conferencias[partes[2]];
        return c ? json(res, 200, c) : json(res, 404, { mensagem: "Conferência não encontrada." });
      }
      if (req.method === "GET" && partes[1] === "indicadores") return json(res, 200, fluxo.indicadores());
      if (req.method === "GET" && partes[1] === "movimentos") return json(res, 200, db.ler().movimentos.slice(-500).reverse());
      if (req.method === "GET" && partes[1] === "requisicoes") {
        const st = url.searchParams.get("status");
        return json(res, 200, db.ler().requisicoes.filter((q) => !st || q.status === st).reverse());
      }
      if (req.method === "POST" && partes[1] === "requisicoes" && partes[3] === "atender") {
        const q = db.ler().requisicoes.find((x) => x.id === partes[2]);
        if (!q) return json(res, 404, { mensagem: "Requisição não encontrada." });
        db.alterar(() => (q.status = "ATENDIDA"));
        return json(res, 200, q);
      }
      // Check list com os códigos de barras aprendidos (vale para todas as estações da farmácia)
      if (req.method === "GET" && partes[1] === "checklist") {
        const g = db.ler().gtins;
        const cl = CHECKLIST_PADRAO.map((sec) => ({
          ...sec,
          itens: sec.itens.map((it) => {
            const meus = Object.entries(g).filter(([, a]) => a.descricao === it.descricao);
            const gtin = [...(it.gtin ?? []), ...meus.filter(([, a]) => !a.opcao).map(([k]) => k)];
            const porOp: Record<string, string[]> = { ...(it.gtinPorOpcao ?? {}) };
            for (const [k, a] of meus) if (a.opcao) (porOp[a.opcao] ??= []).push(k);
            return { ...it, ...(gtin.length ? { gtin } : {}), ...(Object.keys(porOp).length ? { gtinPorOpcao: porOp } : {}) };
          }),
        }));
        return json(res, 200, cl);
      }
      if (req.method === "POST" && partes[1] === "gtins") {
        const b = await corpo<{ gtin: string; descricao: string; opcao: string | null }>(req);
        const it = itemDoChecklist(b?.descricao);
        if (!/^\d{14}$/.test(b?.gtin ?? "") || !it) return json(res, 422, { mensagem: "GTIN ou item inválido." });
        db.alterar((d) => (d.gtins[b.gtin] = { descricao: b.descricao, opcao: b.opcao ?? null }));
        return json(res, 201, { mensagem: "Código de barras cadastrado." });
      }
      if (req.method === "GET" && partes[1] === "saude") return json(res, 200, { ok: true, versao: 1 });

      return json(res, 404, { mensagem: "Rota não encontrada." });
    } catch (e) {
      if (e instanceof ErroFluxo) return json(res, e.status, { mensagem: e.erros.join(" "), erros: e.erros });
      if (e instanceof SyntaxError) return json(res, 400, { mensagem: "JSON inválido." });
      console.error(e);
      return json(res, 500, { mensagem: "Erro interno do serviço." });
    }
  });

  servidor.on("close", () => {
    clearInterval(timerSla);
    clearInterval(timerPing);
    clientesSse.forEach((c) => c.end());
  });
  return { servidor, fluxo };
}

// ------------------------------------------------------------------ utilitários HTTP
function cors(req: IncomingMessage, res: ServerResponse): void {
  const origem = req.headers.origin;
  if (origem && ORIGENS.includes(origem)) {
    res.setHeader("Access-Control-Allow-Origin", origem);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Vary", "Origin");
  }
}

function fim(res: ServerResponse, status: number): void {
  res.writeHead(status).end();
}

function json(res: ServerResponse, status: number, dados: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" }).end(JSON.stringify(dados));
}

async function corpo<T = never>(req: IncomingMessage): Promise<T> {
  let total = 0;
  const partes: Buffer[] = [];
  for await (const p of req) {
    total += (p as Buffer).length;
    if (total > 1_000_000) throw new ErroFluxo(413, ["Corpo grande demais."]);
    partes.push(p as Buffer);
  }
  return JSON.parse(Buffer.concat(partes).toString("utf8") || "null") as T;
}

const TIPOS: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png",
};

async function servirArquivo(caminho: string, res: ServerResponse): Promise<void> {
  const base = caminho.startsWith("/static/") ? DIST : PUBLICO;
  const rel = caminho.startsWith("/static/") ? caminho.slice(8) : caminho === "/" ? "index.html" : caminho.slice(1);
  const alvo = normalize(join(base, rel));
  if (!alvo.startsWith(base)) return json(res, 403, { mensagem: "Acesso negado." });
  try {
    const dados = await readFile(alvo);
    res.writeHead(200, { "Content-Type": TIPOS[extname(alvo)] ?? "application/octet-stream" }).end(dados);
  } catch {
    json(res, 404, { mensagem: "Arquivo não encontrado." });
  }
}

async function repassarWebhook(evento: NomeEvento, dados: unknown, tentativa = 1): Promise<void> {
  try {
    const r = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(env.GHOSP_WEBHOOK_TOKEN ? { Authorization: `Bearer ${env.GHOSP_WEBHOOK_TOKEN}` } : {}) },
      body: JSON.stringify({ evento, dados, em: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
  } catch (e) {
    if (tentativa < 5) setTimeout(() => void repassarWebhook(evento, dados, tentativa + 1), 2 ** tentativa * 1000);
    else console.error(`Webhook G-HOSP falhou para ${evento}:`, e);
  }
}

// ------------------------------------------------------------------ início
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const db = new ArmazenamentoJson(resolve(env.DADOS ?? "./dados/banco.json"));
  const { servidor } = criarServidor(db);
  servidor.listen(PORTA, () => console.log(`Serviço do carro de emergência em http://localhost:${PORTA} (SLA ${SLA} min)`));
}
