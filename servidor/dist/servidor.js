// servidor/src/servidor.ts
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// src/checklist-padrao.ts
var CHECKLIST_PADRAO = [
  {
    titulo: "Materiais",
    itens: [
      { descricao: "Agulha desc", maximo: 5, opcoes: ["40x12", "25x7"] },
      { descricao: "Aparelho de tricotomia", maximo: 1 },
      { descricao: "C\xE2nula de Guedel n\xBA 4", maximo: 1 },
      { descricao: "C\xE2nula traqueostomia", maximo: 1, opcoes: ["n\xBA 7,0", "n\xBA 7,5", "n\xBA 8,0", "n\xBA 8,5"] },
      { descricao: "Capa sanfonada videolaparoscopia 15x250cm", maximo: 1 },
      { descricao: "Cateter venoso central 7 FR (duplo l\xFAmen)", maximo: 1 },
      { descricao: "Cateter intrav. de seguran\xE7a (19mm) (Abocath)", maximo: 2, opcoes: ["n\xBA 16", "n\xBA 18", "n\xBA 20", "n\xBA 22", "n\xBA 24"] },
      { descricao: "Coletor de urina sistema aberto 1200ml", maximo: 1 },
      { descricao: "Conex\xE3o para infus\xE3o 2 vias (Polifix)", maximo: 2 },
      { descricao: "Curativo filme imperme\xE1vel respir\xE1vel 8,5x11,5cm (Tegaderm)", maximo: 1 },
      { descricao: "Eletrodo desc adulto", maximo: 10 },
      { descricao: "Equipo FS bomba de infus\xE3o Bene Fusion", maximo: 1 },
      { descricao: "Equipo bomba de infus\xE3o Bene Fusion", maximo: 4 },
      { descricao: "Equipo macrogotas", maximo: 2 },
      { descricao: "Filtro HEPA", maximo: 1 },
      { descricao: "Filtro HMEF", maximo: 1 },
      { descricao: "Fixador est\xE9ril cateter perif\xE9rico (IV Fix)", maximo: 1 },
      { descricao: "Luva cir\xFArgica est\xE9ril", maximo: 1, opcoes: ["n\xBA 6,5", "n\xBA 7,0", "n\xBA 7,5"] },
      { descricao: "M\xE1scara lar\xEDngea n\xBA 4", maximo: 1 },
      { descricao: "Seringa desc s/ rosca", maximo: 5, opcoes: ["10ml", "20ml"] },
      { descricao: "Sonda para aspira\xE7\xE3o traqueal n\xBA 12", maximo: 3 },
      { descricao: "Sonda nasog\xE1strica longa n\xBA 18", maximo: 1 },
      { descricao: "Torneirinha 3 vias c/ rosca", maximo: 3 },
      { descricao: "Sonda endotraqueal c/ bal\xE3o", maximo: 2, opcoes: ["n\xBA 6,0", "n\xBA 6,5", "n\xBA 7,0", "n\xBA 7,5", "n\xBA 8,0", "n\xBA 8,5"] },
      { descricao: "Tubo extensor para oxig\xEAnio n\xBA 16 (2m)", maximo: 1 },
      { descricao: "Kit material cateter venoso central adulto", maximo: 1, unidade: "kit" },
      { descricao: "Kit material de pun\xE7\xE3o press\xE3o invasiva (PAI)", maximo: 1, unidade: "kit" }
    ]
  },
  {
    titulo: "Materiais CME",
    itens: [
      { descricao: "Ambu", maximo: 1, opcoes: ["Adulto", "Pedi\xE1trico"] },
      { descricao: "Fio guia", maximo: 1, opcoes: ["Adulto", "Pedi\xE1trico"] },
      { descricao: "Cadar\xE7o", maximo: 5 },
      { descricao: "Fio guia bougie", maximo: 1 },
      { descricao: "Garrote", maximo: 1 },
      { descricao: "Gel", maximo: 1, unidade: "fr" },
      { descricao: "Lanterna pequena", maximo: 1, semValidade: true },
      { descricao: "Luva pl\xE1stica desc", maximo: 10 },
      { descricao: "Luva procedimento M", maximo: 1, unidade: "cx" },
      { descricao: "Micropore", maximo: 1, unidade: "rolo" },
      { descricao: "Laringosc\xF3pio com pilha", maximo: 3, semValidade: true },
      { descricao: "L\xE2mina para laringosc\xF3pio", maximo: 2, opcoes: ["Curva n\xBA 3", "Curva n\xBA 4", "Reta n\xBA 3", "Reta n\xBA 4"] }
    ]
  },
  {
    titulo: "Medicamentos",
    itens: [
      { descricao: "Adenosina 3mg/ml amp 2ml", maximo: 3, unidade: "amp" },
      { descricao: "Adrenalina / Epinefrina 1mg/ml amp 1ml", maximo: 15, unidade: "amp" },
      { descricao: "\xC1gua destilada amp 10ml", maximo: 10, unidade: "amp" },
      { descricao: "Amiodarona 50mg/ml amp 3ml", maximo: 3, unidade: "amp" },
      { descricao: "Atropina 0,5mg/ml amp 1ml", maximo: 3, unidade: "amp" },
      { descricao: "Gluconato de c\xE1lcio 10% amp 10ml", maximo: 4, unidade: "amp" },
      { descricao: "Diazepam 10mg/2ml amp 2ml", maximo: 1, unidade: "amp" },
      { descricao: "Etomidato 2mg/ml amp 10ml", maximo: 1, unidade: "amp" },
      { descricao: "Fenito\xEDna 50mg/ml amp 5ml", maximo: 4, unidade: "amp" },
      { descricao: "Fentanila 0,05mg/ml amp 2ml", maximo: 3, unidade: "amp" },
      { descricao: "Flumazenil 0,1mg/ml amp 5ml", maximo: 1, unidade: "amp" },
      { descricao: "Furosemida 10mg/ml amp 2ml", maximo: 2, unidade: "amp" },
      { descricao: "Glicose 50% amp 10ml", maximo: 5, unidade: "amp" },
      { descricao: "Hidrocortisona 500mg", maximo: 1, unidade: "fr" },
      { descricao: "Lidoca\xEDna 2% sem vaso amp 20ml", maximo: 1, unidade: "amp" },
      { descricao: "Midazolam 5mg/ml amp 3ml", maximo: 2, unidade: "amp" },
      { descricao: "Naloxona 0,4mg/ml amp 1ml", maximo: 1, unidade: "amp" },
      { descricao: "Nitroglicerina 5mg/ml amp 10ml", maximo: 1, unidade: "amp" },
      { descricao: "Bicarbonato de s\xF3dio 8,4% fr 250ml", maximo: 2, unidade: "fr" },
      { descricao: "Nitroprussiato de s\xF3dio 50mg", maximo: 1, unidade: "amp" },
      { descricao: "Sulfato de magn\xE9sio 10% amp 10ml", maximo: 2, unidade: "amp" },
      { descricao: "Suxamet\xF4nio 100mg", maximo: 1, unidade: "amp" }
    ]
  },
  {
    titulo: "Especificidades",
    itens: [
      { descricao: "Deslanos\xEDdeo 0,2mg/ml amp 2ml", maximo: 2, unidade: "amp" },
      { descricao: "Escetamina, cloridrato de 50mg/ml amp 2ml", maximo: 1, unidade: "amp" },
      { descricao: "Bicarbonato de s\xF3dio 8,4% amp 10ml", maximo: 15, unidade: "amp" }
    ]
  },
  {
    titulo: "Kits",
    itens: [
      { descricao: "Amiodarona 150mg dose manuten\xE7\xE3o (6 amp)", maximo: 1, unidade: "kit" },
      { descricao: "Fentanila 0,5mg/10ml concentrado (10 amp)", maximo: 1, unidade: "kit" },
      { descricao: "Midazolam 50mg/10ml concentrado (10 amp)", maximo: 1, unidade: "kit" },
      { descricao: "Noradrenalina 8mg/4ml simples (4 amp)", maximo: 1, unidade: "kit" }
    ]
  },
  {
    titulo: "Solu\xE7\xF5es",
    itens: [
      { descricao: "Cloreto de s\xF3dio 0,9% 500ml", maximo: 1, unidade: "fr" },
      { descricao: "Glicose 5% 250ml", maximo: 2, unidade: "fr" },
      { descricao: "Ringer lactato 500ml", maximo: 2, unidade: "fr" }
    ]
  }
];

// servidor/src/armazenamento.ts
import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync } from "node:fs";
import { dirname } from "node:path";
var vazio = () => ({ prescricoes: {}, conferencias: {}, movimentos: [], requisicoes: [], gtins: {} });
var ArmazenamentoJson = class {
  constructor(caminho) {
    this.caminho = caminho;
    mkdirSync(dirname(caminho), { recursive: true });
    this.banco = existsSync(caminho) ? { ...vazio(), ...JSON.parse(readFileSync(caminho, "utf8")) } : vazio();
  }
  banco;
  ler() {
    return this.banco;
  }
  alterar(fn) {
    const r = fn(this.banco);
    const tmp = `${this.caminho}.tmp`;
    writeFileSync(tmp, JSON.stringify(this.banco, null, 2));
    renameSync(tmp, this.caminho);
    return r;
  }
};

// src/conferencia-regras.ts
function diasParaVencer(validadeIso, hoje2 = /* @__PURE__ */ new Date()) {
  const [a, m, d] = validadeIso.split("-").map(Number);
  const val = Date.UTC(a, m - 1, d);
  const h = Date.UTC(hoje2.getFullYear(), hoje2.getMonth(), hoje2.getDate());
  return Math.round((val - h) / 864e5);
}
function problemaDoLote(e, validadeMinimaDias, semValidade = false) {
  if (semValidade) return null;
  if (!e.lote.trim()) return "SEM_LOTE";
  if (!e.validade) return "SEM_VALIDADE";
  const dias = diasParaVencer(e.validade);
  if (dias < 0) return "VENCIDO";
  if (dias < validadeMinimaDias) return "VALIDADE_CURTA";
  return null;
}
var TEXTO_PROBLEMA = {
  SEM_LOTE: "Informe o lote",
  SEM_VALIDADE: "Informe a validade",
  VENCIDO: "Lote vencido",
  VALIDADE_CURTA: "Validade curta"
};

// servidor/src/validacao.ts
var MOTIVOS = /* @__PURE__ */ new Set(["SEM_ESTOQUE", "AGUARDANDO_COMPRA", "ITEM_SUSPENSO", "OUTRO"]);
function itemDoChecklist(descricao, checklist = CHECKLIST_PADRAO) {
  for (const s of checklist) for (const i of s.itens) if (i.descricao === descricao) return i;
  return void 0;
}
function validarPrescricao(p, checklist = CHECKLIST_PADRAO) {
  const erros = [];
  if (p?.tipo !== "PRESCRICAO_CARRO_EMERGENCIA") return ["Corpo n\xE3o \xE9 uma prescri\xE7\xE3o de carro de emerg\xEAncia."];
  if (!p.id) erros.push("Prescri\xE7\xE3o sem id.");
  if (!p.numeroCarro?.trim()) erros.push("N\xFAmero do carro de parada ausente.");
  if (!Array.isArray(p.itens) || !p.itens.length) erros.push("Prescri\xE7\xE3o sem itens.");
  const somas = /* @__PURE__ */ new Map();
  for (const it of p.itens ?? []) {
    const ref = itemDoChecklist(it.descricao, checklist);
    if (!ref) {
      erros.push(`Item fora do check list: ${it.descricao}.`);
      continue;
    }
    if (!Number.isInteger(it.quantidade) || it.quantidade < 1) erros.push(`Quantidade inv\xE1lida em ${it.descricao}.`);
    if (ref.opcoes && (!it.opcao || !ref.opcoes.includes(it.opcao))) erros.push(`Op\xE7\xE3o inv\xE1lida em ${it.descricao}.`);
    somas.set(it.descricao, (somas.get(it.descricao) ?? 0) + it.quantidade);
  }
  for (const [d, soma] of somas) {
    const max = itemDoChecklist(d, checklist).maximo;
    if (soma > max) erros.push(`${d}: ${soma} ultrapassa o quantitativo do check list (${max}).`);
  }
  return erros;
}
function validarConferencia(c, p, checklist = CHECKLIST_PADRAO) {
  const erros = [];
  if (c?.tipo !== "CONFERENCIA_REPOSICAO_CARRO") return ["Corpo n\xE3o \xE9 uma confer\xEAncia de reposi\xE7\xE3o."];
  if (c.prescricaoId !== p.id) erros.push("A confer\xEAncia n\xE3o corresponde a esta prescri\xE7\xE3o.");
  if (!c.lacreAplicado?.trim()) erros.push("Lacre aplicado ausente.");
  if (!c.farmaceutico?.trim()) erros.push("Farmac\xEAutico ausente.");
  const minimo = Number.isFinite(c.validadeMinimaDias) ? Math.max(c.validadeMinimaDias, 0) : 90;
  const chave = (d, o) => `${d}|${o ?? ""}`;
  const conferidos = new Map(c.itens.map((i) => [chave(i.descricao, i.opcao), i]));
  for (const it of p.itens) {
    const nome = `${it.descricao}${it.opcao ? " \u2014 " + it.opcao : ""}`;
    const ci = conferidos.get(chave(it.descricao, it.opcao));
    if (!ci) {
      erros.push(`${nome} n\xE3o foi conferido.`);
      continue;
    }
    const somaLotes = ci.lotes.reduce((s, l) => s + l.quantidade, 0);
    if (somaLotes !== ci.reposto) erros.push(`${nome}: soma dos lotes difere do reposto.`);
    if (ci.reposto > it.quantidade) erros.push(`${nome}: reposto (${ci.reposto}) maior que o prescrito (${it.quantidade}).`);
    const falta = ci.falta?.quantidade ?? 0;
    if (ci.reposto + falta !== it.quantidade) erros.push(`${nome}: reposto + falta deve ser igual ao prescrito.`);
    if (ci.falta && !MOTIVOS.has(ci.falta.motivo)) erros.push(`${nome}: motivo de falta inv\xE1lido.`);
    const semValidade = !!itemDoChecklist(it.descricao, checklist)?.semValidade;
    for (const l of ci.lotes) {
      const prob = problemaDoLote(l, minimo, semValidade);
      if (prob) erros.push(`${nome}: ${TEXTO_PROBLEMA[prob].toLowerCase()} (lote ${l.lote || "\u2014"}).`);
    }
  }
  if (c.itens.length !== p.itens.length) erros.push("A confer\xEAncia tem itens que n\xE3o est\xE3o na prescri\xE7\xE3o.");
  return erros;
}

// servidor/src/fluxo.ts
import { randomUUID } from "node:crypto";
var ErroFluxo = class extends Error {
  constructor(status, erros) {
    super(erros.join(" "));
    this.status = status;
    this.erros = erros;
  }
};
var agora = () => (/* @__PURE__ */ new Date()).toISOString();
var hoje = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var Fluxo = class {
  constructor(db, op) {
    this.db = db;
    this.op = op;
  }
  ouvintes = /* @__PURE__ */ new Set();
  aoEvento(fn) {
    this.ouvintes.add(fn);
    return () => this.ouvintes.delete(fn);
  }
  emitir(evento, dados) {
    for (const fn of this.ouvintes) {
      try {
        fn(evento, dados);
      } catch {
      }
    }
  }
  // ---------------------------------------------------------------- prescrição
  receberPrescricao(p) {
    const erros = validarPrescricao(p);
    if (erros.length) throw new ErroFluxo(422, erros);
    const existente = this.db.ler().prescricoes[p.id];
    if (existente) return { registro: existente, nova: false };
    const registro = {
      prescricao: p,
      status: "AGUARDANDO_FARMACIA",
      recebidaEm: agora(),
      inicioConferenciaEm: null,
      farmaceutico: null,
      conferenciaId: null,
      concluidaEm: null,
      atrasada: false,
      historico: [{ em: agora(), evento: "Prescri\xE7\xE3o recebida", por: p.contexto?.prescritor ?? null }]
    };
    this.db.alterar((b) => b.prescricoes[p.id] = registro);
    this.emitir("prescricao-recebida", registro);
    return { registro, nova: true };
  }
  listar(filtro = {}) {
    let lista = Object.values(this.db.ler().prescricoes);
    if (filtro.status?.length) lista = lista.filter((r) => filtro.status.includes(r.status));
    lista.sort((a, b) => b.recebidaEm.localeCompare(a.recebidaEm));
    return lista.slice(0, filtro.limite ?? 200);
  }
  obter(id) {
    const r = this.db.ler().prescricoes[id];
    if (!r) throw new ErroFluxo(404, ["Prescri\xE7\xE3o n\xE3o encontrada."]);
    return r;
  }
  // ---------------------------------------------------------------- farmácia
  /** O farmacêutico assume a conferência. Evita duas pessoas conferindo o mesmo carro. */
  assumir(id, farmaceutico) {
    const r = this.obter(id);
    if (!farmaceutico?.trim()) throw new ErroFluxo(400, ["Informe o farmac\xEAutico."]);
    if (r.status === "CONFORME" || r.status === "COM_PENDENCIAS") throw new ErroFluxo(409, ["Esta prescri\xE7\xE3o j\xE1 foi conferida."]);
    if (r.status === "EM_CONFERENCIA" && r.farmaceutico !== farmaceutico) {
      const desde = Date.parse(r.inicioConferenciaEm ?? "");
      if (Date.now() - desde < this.op.reservaMinutos * 6e4)
        throw new ErroFluxo(409, [`Em confer\xEAncia por ${r.farmaceutico}.`]);
    }
    this.db.alterar(() => {
      if (r.status !== "EM_CONFERENCIA" || r.farmaceutico !== farmaceutico) {
        r.status = "EM_CONFERENCIA";
        r.farmaceutico = farmaceutico;
        r.inicioConferenciaEm = agora();
        r.historico.push({ em: agora(), evento: "Confer\xEAncia iniciada", por: farmaceutico });
      }
    });
    this.emitir("conferencia-iniciada", r);
    return r;
  }
  concluirConferencia(c) {
    const r = this.obter(c?.prescricaoId);
    const banco = this.db.ler();
    if (banco.conferencias[c.id]) return r;
    if (r.status === "CONFORME" || r.status === "COM_PENDENCIAS") throw new ErroFluxo(409, ["Esta prescri\xE7\xE3o j\xE1 foi conferida."]);
    const erros = validarConferencia(c, r.prescricao);
    if (erros.length) throw new ErroFluxo(422, erros);
    this.db.alterar((b) => {
      b.conferencias[c.id] = c;
      r.status = c.situacao === "CONFORME" ? "CONFORME" : "COM_PENDENCIAS";
      r.conferenciaId = c.id;
      r.farmaceutico = c.farmaceutico;
      r.concluidaEm = c.dataHoraConferencia;
      r.historico.push({ em: agora(), evento: r.status === "CONFORME" ? "Reposi\xE7\xE3o conforme" : "Reposi\xE7\xE3o com pend\xEAncias", por: c.farmaceutico });
      for (const i of c.itens)
        for (const l of i.lotes)
          b.movimentos.push({
            id: randomUUID(),
            tipo: "SAIDA_REPOSICAO_CARRO",
            em: c.dataHoraConferencia,
            numeroCarro: c.numeroCarro,
            conferenciaId: c.id,
            prescricaoId: c.prescricaoId,
            descricao: i.descricao,
            opcao: i.opcao,
            codigo: i.codigo,
            lote: l.lote,
            validade: l.validade,
            quantidade: l.quantidade,
            unidade: i.unidade
          });
      for (const i of c.itens)
        if (i.falta)
          b.requisicoes.push({
            id: randomUUID(),
            em: c.dataHoraConferencia,
            status: "ABERTA",
            numeroCarro: c.numeroCarro,
            conferenciaId: c.id,
            descricao: i.descricao,
            opcao: i.opcao,
            codigo: i.codigo,
            quantidade: i.falta.quantidade,
            unidade: i.unidade,
            motivo: i.falta.motivo,
            observacao: i.falta.observacao
          });
    });
    this.emitir("conferencia-concluida", { registro: r, conferencia: c });
    return r;
  }
  // ---------------------------------------------------------------- SLA e indicadores
  /** Marca prescrições paradas há mais tempo que o SLA e avisa em tempo real. Rodar a cada minuto. */
  verificarSla() {
    const limite = this.op.slaMinutos * 6e4;
    const novas = [];
    this.db.alterar((b) => {
      for (const r of Object.values(b.prescricoes)) {
        const aberta = r.status === "AGUARDANDO_FARMACIA" || r.status === "EM_CONFERENCIA";
        if (aberta && !r.atrasada && Date.now() - Date.parse(r.recebidaEm) > limite) {
          r.atrasada = true;
          r.historico.push({ em: agora(), evento: `Passou do prazo de ${this.op.slaMinutos} min`, por: null });
          novas.push(r);
        }
      }
    });
    for (const r of novas) this.emitir("alerta-sla", r);
    return novas;
  }
  indicadores() {
    const b = this.db.ler();
    const lista = Object.values(b.prescricoes);
    const hojeStr = hoje();
    const concl = lista.filter((r) => r.concluidaEm?.startsWith(hojeStr));
    const tempos = concl.map((r) => (Date.parse(r.concluidaEm) - Date.parse(r.recebidaEm)) / 6e4);
    return {
      aguardando: lista.filter((r) => r.status === "AGUARDANDO_FARMACIA").length,
      emConferencia: lista.filter((r) => r.status === "EM_CONFERENCIA").length,
      concluidasHoje: concl.length,
      comPendenciasHoje: concl.filter((r) => r.status === "COM_PENDENCIAS").length,
      atrasadas: lista.filter((r) => r.atrasada && (r.status === "AGUARDANDO_FARMACIA" || r.status === "EM_CONFERENCIA")).length,
      tempoMedioMinutos: tempos.length ? Math.round(tempos.reduce((s, t) => s + t, 0) / tempos.length) : null,
      requisicoesAbertas: b.requisicoes.filter((q) => q.status === "ABERTA").length,
      slaMinutos: this.op.slaMinutos
    };
  }
};

// servidor/src/servidor.ts
var env = process.env;
var PORTA = Number(env.PORTA ?? 3080);
var SLA = Number(env.SLA_MINUTOS ?? 60);
var RESERVA = Number(env.RESERVA_MINUTOS ?? 15);
var TOKEN = env.TOKEN_API ?? "";
var ORIGENS = (env.ORIGENS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
var WEBHOOK = env.GHOSP_WEBHOOK_URL ?? "";
var aqui = fileURLToPath(new URL(".", import.meta.url));
var PUBLICO = resolve(aqui, "../public");
var DIST = resolve(aqui, "../../dist");
function criarServidor(db, opcoes = { slaMinutos: SLA, reservaMinutos: RESERVA }) {
  const fluxo = new Fluxo(db, opcoes);
  const clientesSse = /* @__PURE__ */ new Set();
  fluxo.aoEvento((evento, dados) => {
    const msg = `event: ${evento}
data: ${JSON.stringify(dados)}

`;
    for (const c of clientesSse) c.write(msg);
    if (WEBHOOK) void repassarWebhook(evento, dados);
  });
  const timerSla = setInterval(() => fluxo.verificarSla(), 6e4);
  const timerPing = setInterval(() => clientesSse.forEach((c) => c.write(": ping\n\n")), 25e3);
  const servidor = createServer(async (req, res) => {
    try {
      cors(req, res);
      if (req.method === "OPTIONS") return fim(res, 204);
      const url = new URL(req.url ?? "/", "http://local");
      const partes = url.pathname.split("/").filter(Boolean);
      if (partes[0] !== "api") return servirArquivo(url.pathname, res);
      if (req.method !== "GET" && TOKEN && req.headers.authorization !== `Bearer ${TOKEN}`)
        return json(res, 401, { mensagem: "Token inv\xE1lido." });
      if (req.method === "GET" && partes[1] === "eventos") {
        res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
        res.write("retry: 3000\n\n");
        clientesSse.add(res);
        req.on("close", () => clientesSse.delete(res));
        return;
      }
      if (partes[1] === "prescricoes") {
        if (req.method === "POST" && partes.length === 2) {
          const { registro, nova } = fluxo.receberPrescricao(await corpo(req));
          return json(res, nova ? 201 : 200, {
            idPrescricao: registro.prescricao.id,
            status: registro.status,
            mensagem: nova ? "Prescri\xE7\xE3o encaminhada \xE0 farm\xE1cia." : "Prescri\xE7\xE3o j\xE1 recebida."
          });
        }
        if (req.method === "GET" && partes.length === 2) {
          const status = url.searchParams.get("status")?.split(",").filter(Boolean);
          return json(res, 200, fluxo.listar({ status, limite: Number(url.searchParams.get("limite")) || void 0 }));
        }
        if (req.method === "GET" && partes.length === 3) return json(res, 200, fluxo.obter(partes[2]));
        if (req.method === "POST" && partes[3] === "assumir") {
          const b = await corpo(req);
          return json(res, 200, fluxo.assumir(partes[2], b.farmaceutico));
        }
      }
      if (req.method === "POST" && partes[1] === "conferencias") {
        const r = fluxo.concluirConferencia(await corpo(req));
        return json(res, 201, { idPrescricao: r.conferenciaId, status: r.status, mensagem: "Confer\xEAncia registrada." });
      }
      if (req.method === "GET" && partes[1] === "conferencias" && partes[2]) {
        const c = db.ler().conferencias[partes[2]];
        return c ? json(res, 200, c) : json(res, 404, { mensagem: "Confer\xEAncia n\xE3o encontrada." });
      }
      if (req.method === "GET" && partes[1] === "indicadores") return json(res, 200, fluxo.indicadores());
      if (req.method === "GET" && partes[1] === "movimentos") return json(res, 200, db.ler().movimentos.slice(-500).reverse());
      if (req.method === "GET" && partes[1] === "requisicoes") {
        const st = url.searchParams.get("status");
        return json(res, 200, db.ler().requisicoes.filter((q) => !st || q.status === st).reverse());
      }
      if (req.method === "POST" && partes[1] === "requisicoes" && partes[3] === "atender") {
        const q = db.ler().requisicoes.find((x) => x.id === partes[2]);
        if (!q) return json(res, 404, { mensagem: "Requisi\xE7\xE3o n\xE3o encontrada." });
        db.alterar(() => q.status = "ATENDIDA");
        return json(res, 200, q);
      }
      if (req.method === "GET" && partes[1] === "checklist") {
        const g = db.ler().gtins;
        const cl = CHECKLIST_PADRAO.map((sec) => ({
          ...sec,
          itens: sec.itens.map((it) => {
            const meus = Object.entries(g).filter(([, a]) => a.descricao === it.descricao);
            const gtin = [...it.gtin ?? [], ...meus.filter(([, a]) => !a.opcao).map(([k]) => k)];
            const porOp = { ...it.gtinPorOpcao ?? {} };
            for (const [k, a] of meus) if (a.opcao) (porOp[a.opcao] ??= []).push(k);
            return { ...it, ...gtin.length ? { gtin } : {}, ...Object.keys(porOp).length ? { gtinPorOpcao: porOp } : {} };
          })
        }));
        return json(res, 200, cl);
      }
      if (req.method === "POST" && partes[1] === "gtins") {
        const b = await corpo(req);
        const it = itemDoChecklist(b?.descricao);
        if (!/^\d{14}$/.test(b?.gtin ?? "") || !it) return json(res, 422, { mensagem: "GTIN ou item inv\xE1lido." });
        db.alterar((d) => d.gtins[b.gtin] = { descricao: b.descricao, opcao: b.opcao ?? null });
        return json(res, 201, { mensagem: "C\xF3digo de barras cadastrado." });
      }
      if (req.method === "GET" && partes[1] === "saude") return json(res, 200, { ok: true, versao: 1 });
      return json(res, 404, { mensagem: "Rota n\xE3o encontrada." });
    } catch (e) {
      if (e instanceof ErroFluxo) return json(res, e.status, { mensagem: e.erros.join(" "), erros: e.erros });
      if (e instanceof SyntaxError) return json(res, 400, { mensagem: "JSON inv\xE1lido." });
      console.error(e);
      return json(res, 500, { mensagem: "Erro interno do servi\xE7o." });
    }
  });
  servidor.on("close", () => {
    clearInterval(timerSla);
    clearInterval(timerPing);
    clientesSse.forEach((c) => c.end());
  });
  return { servidor, fluxo };
}
function cors(req, res) {
  const origem = req.headers.origin;
  if (origem && ORIGENS.includes(origem)) {
    res.setHeader("Access-Control-Allow-Origin", origem);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Vary", "Origin");
  }
}
function fim(res, status) {
  res.writeHead(status).end();
}
function json(res, status, dados) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" }).end(JSON.stringify(dados));
}
async function corpo(req) {
  let total = 0;
  const partes = [];
  for await (const p of req) {
    total += p.length;
    if (total > 1e6) throw new ErroFluxo(413, ["Corpo grande demais."]);
    partes.push(p);
  }
  return JSON.parse(Buffer.concat(partes).toString("utf8") || "null");
}
var TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};
async function servirArquivo(caminho, res) {
  const base = caminho.startsWith("/static/") ? DIST : PUBLICO;
  const rel = caminho.startsWith("/static/") ? caminho.slice(8) : caminho === "/" ? "index.html" : caminho.slice(1);
  const alvo = normalize(join(base, rel));
  if (!alvo.startsWith(base)) return json(res, 403, { mensagem: "Acesso negado." });
  try {
    const dados = await readFile(alvo);
    res.writeHead(200, { "Content-Type": TIPOS[extname(alvo)] ?? "application/octet-stream" }).end(dados);
  } catch {
    json(res, 404, { mensagem: "Arquivo n\xE3o encontrado." });
  }
}
async function repassarWebhook(evento, dados, tentativa = 1) {
  try {
    const r = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...env.GHOSP_WEBHOOK_TOKEN ? { Authorization: `Bearer ${env.GHOSP_WEBHOOK_TOKEN}` } : {} },
      body: JSON.stringify({ evento, dados, em: (/* @__PURE__ */ new Date()).toISOString() }),
      signal: AbortSignal.timeout(1e4)
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
  } catch (e) {
    if (tentativa < 5) setTimeout(() => void repassarWebhook(evento, dados, tentativa + 1), 2 ** tentativa * 1e3);
    else console.error(`Webhook G-HOSP falhou para ${evento}:`, e);
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const db = new ArmazenamentoJson(resolve(env.DADOS ?? "./dados/banco.json"));
  const { servidor } = criarServidor(db);
  servidor.listen(PORTA, () => console.log(`Servi\xE7o do carro de emerg\xEAncia em http://localhost:${PORTA} (SLA ${SLA} min)`));
}
export {
  criarServidor
};
