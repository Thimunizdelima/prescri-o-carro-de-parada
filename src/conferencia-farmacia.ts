import { CHECKLIST_PADRAO } from "./checklist-padrao.js";
import { diasParaVencer, problemaDoLote, somarLote, statusDaLinha, TEXTO_PROBLEMA, type StatusLinha } from "./conferencia-regras.js";
import { ESTILOS } from "./estilos.js";
import { criarEnvioHttp, type ConfigGHosp } from "./ghosp-client.js";
import { lerCodigo, normalizarGtin, type LeituraGS1 } from "./gs1.js";
import { ClienteServico } from "./integracao.js";
import { CANAL_PADRAO, novoId } from "./prescricao-carro-emergencia.js";
import type {
  Checklist,
  ConferenciaReposicao,
  EntradaLote,
  FuncaoEnvioConferencia,
  ItemConferido,
  ItemPrescricao,
  MotivoFalta,
  PrescricaoCarroEmergencia,
  ResultadoEnvio,
} from "./types.js";

interface LinhaConf {
  item: ItemPrescricao;
  semValidade: boolean;
  lotes: EntradaLote[];
  /** Motivo da falta; a quantidade em falta é sempre o que não foi reposto. */
  falta: { motivo: MotivoFalta | ""; observacao: string } | null;
}

interface AlvoGtin {
  descricao: string;
  opcao: string | null;
}

const MOTIVOS: Record<MotivoFalta, string> = {
  SEM_ESTOQUE: "Sem estoque",
  AGUARDANDO_COMPRA: "Aguardando compra",
  ITEM_SUSPENSO: "Item suspenso/substituído",
  OUTRO: "Outro",
};

const ROTULO_STATUS: Record<StatusLinha, string> = {
  PENDENTE: "Pendente",
  PARCIAL: "Parcial",
  CONFERIDO: "Conferido",
  FALTA: "Em falta",
  ERRO: "Corrigir",
};

const CHAVE_GTIN = "pce-gtin-associados";

const esc = (s: unknown): string =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const dataBr = (iso: string): string => {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR")} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
};

const validadeBr = (iso: string): string => (iso ? iso.split("-").reverse().join("/") : "—");

const EXTRA = /* css */ `
.card{background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px;padding:14px 16px}
.meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px 18px}
.meta div{display:flex;flex-direction:column;gap:2px}
.meta small{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--pce-suave);font-weight:600}
.meta strong{font-weight:600}
.alerta{border-left:4px solid var(--pce-alerta);background:var(--pce-alerta-fundo);border-radius:6px;padding:10px 14px;font-size:14px}
.leitor{display:flex;flex-direction:column;gap:8px;background:var(--pce-superficie);border:2px solid var(--pce-primaria);border-radius:10px;padding:14px 16px}
.leitor label{font-weight:600;color:var(--pce-secundaria)}
.leitor input{font:600 18px ui-monospace,"IBM Plex Mono",monospace;padding:12px 14px;border:1px solid var(--pce-linha);border-radius:8px;width:100%}
.leitor .fb{font-size:14px;min-height:1.4em}
.fb.ok{color:#1e6b3a;font-weight:600}.fb.erro{color:var(--pce-alerta);font-weight:600}.fb.aviso{color:#8a5a00;font-weight:600}
.assoc{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:14px}
.progresso{position:sticky;top:0;z-index:2;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px;padding:10px 14px}
.barra{flex:1;min-width:160px;height:8px;border-radius:99px;background:var(--pce-cabecalho);overflow:hidden}
.barra i{display:block;height:100%;background:var(--pce-primaria);transition:width .2s}
.tabela{overflow-x:auto;background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px}
.tabela table{min-width:760px}
td.n{font-variant-numeric:tabular-nums;font-weight:600;white-space:nowrap}
.opc{display:inline-block;background:var(--pce-cabecalho);color:var(--pce-primaria);border-radius:4px;padding:0 6px;font-size:13px;font-weight:600;margin-left:4px}
.sec{display:block;font-size:12px;color:var(--pce-suave)}
.lotes{display:flex;flex-direction:column;gap:6px}
.lote{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.lote input{padding:5px 8px;font-size:14px}
.lote input.l{width:120px}.lote input.v{width:150px}
.lote .erro{color:var(--pce-alerta);font-size:12px;font-weight:600}
.lote .tag{font-size:11px;color:var(--pce-suave)}
.acoes{display:flex;gap:6px;flex-wrap:wrap}
.falta{display:flex;flex-wrap:wrap;gap:6px;align-items:center;background:var(--pce-alerta-fundo);border-radius:6px;padding:6px 8px;font-size:13px}
.falta select{font-family:inherit;border-color:var(--pce-alerta)}
.chip{display:inline-block;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:700;white-space:nowrap}
.chip.PENDENTE{background:var(--pce-cabecalho);color:var(--pce-suave)}
.chip.PARCIAL{background:#fff3d6;color:#8a5a00}
.chip.CONFERIDO{background:#dff3e6;color:#1e6b3a}
.chip.FALTA{background:var(--pce-alerta-fundo);color:var(--pce-alerta)}
.chip.ERRO{background:var(--pce-alerta);color:#fff}
tr.flash td{animation:flash .9s ease-out}
@keyframes flash{from{background:#dff3e6}to{background:transparent}}
@media (prefers-reduced-motion:reduce){tr.flash td{animation:none}.barra i{transition:none}}
.fila{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:13px}
.vazio{display:flex;flex-direction:column;gap:10px}
.vazio textarea{min-height:120px;font:13px ui-monospace,monospace}
.resultado .bloco{padding:10px 14px;border-top:1px solid var(--pce-linha);font-size:14px}
.resultado.ok h2{background:#dff3e6;color:#1e6b3a}
.resultado.pend h2{background:#fff3d6;color:#8a5a00}
`;

/**
 * <conferencia-farmacia-carro>
 *
 * Conferência da reposição do carro de emergência na farmácia, a partir da prescrição.
 *
 * Atributos:
 *   endpoint               URL da API do G-HOSP que recebe a conferência (POST JSON).
 *   farmaceutico           Farmacêutico logado (vem do G-HOSP). Sem ele, aparece um campo.
 *   validade-minima-dias   Validade mínima aceita para repor (padrão 90 = regra dos 3 meses).
 *   prescricao-url         URL que devolve a prescrição (JSON) a conferir.
 *   checklist-url          Check list com os códigos de barras (gtin / gtinPorOpcao).
 *   servidor               URL do serviço de integração: fila, reserva, envio e tempo real.
 *   token                  Token do serviço, se exigido.
 *   canal                  BroadcastChannel para receber prescrições na hora (padrão "carro-emergencia"; "off" desliga).
 *   som                    "off" desliga os bipes de confirmação/erro.
 *
 * Propriedades / métodos:
 *   prescricao             Define a prescrição a conferir.
 *   receber(p)             Coloca uma prescrição na fila (carrega na hora se não houver outra aberta).
 *   checklist              Check list com GTINs para a leitura automática.
 *   enviar                 Função própria de envio.
 *   configurar(cfg)        Endpoint, cabeçalhos, timeout.
 *   ler(codigo)            Processa uma leitura (mesmo que bipar).
 *   obterConferencia()     Valida e devolve o JSON (lança Error com as pendências).
 *   concluir()             Mesmo que o botão "Concluir conferência".
 *
 * Eventos: conferencia-concluida (cancelável), conferencia-enviada, conferencia-erro,
 *          gtin-desconhecido, gtin-associado (para o G-HOSP gravar o novo código no cadastro).
 */
export class ConferenciaFarmaciaElement extends HTMLElement {
  enviar: FuncaoEnvioConferencia | null = null;

  private _p: PrescricaoCarroEmergencia | null = null;
  private _checklist: Checklist = CHECKLIST_PADRAO;
  private _cfg: ConfigGHosp | null = null;
  private linhas: LinhaConf[] = [];
  private fila: PrescricaoCarroEmergencia[] = [];
  private gtins = new Map<string, AlvoGtin>();
  private associados: Record<string, AlvoGtin> = {};
  private pendenteAssoc: LeituraGS1 | null = null;
  private inicio = 0;
  private concluida = false;
  private canal: BroadcastChannel | null = null;
  private audio: AudioContext | null = null;
  private root: ShadowRoot;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.root.addEventListener("click", (e) => this.aoClicar(e));
    this.root.addEventListener("change", (e) => this.aoMudar(e));
    this.root.addEventListener("input", (e) => this.aoDigitar(e));
    this.root.addEventListener("keydown", (e) => this.aoTeclar(e as KeyboardEvent));
    try {
      this.associados = JSON.parse(localStorage.getItem(CHAVE_GTIN) || "{}");
    } catch {
      this.associados = {};
    }
  }

  // ------------------------------------------------------------------ ciclo de vida
  connectedCallback(): void {
    const ep = this.getAttribute("endpoint");
    if (ep && !this._cfg) this._cfg = { endpoint: ep };
    this.indexarGtins();
    this.renderizar();
    const canal = this.getAttribute("canal") ?? CANAL_PADRAO;
    if (canal !== "off" && typeof BroadcastChannel !== "undefined") {
      this.canal = new BroadcastChannel(canal);
      this.canal.onmessage = (ev) => {
        if (ev.data?.tipo === "prescricao" && ev.data.prescricao) this.receber(ev.data.prescricao);
      };
    }
    const cl = this.getAttribute("checklist-url");
    if (cl) void this.buscarJson<Checklist>(cl).then((c) => c && (this.checklist = c));
    const cli = this.cliente;
    if (cli) {
      void cli.checklist().then((c) => c && (this.checklist = c));
      // Carrega a fila pendente e passa a receber novas prescrições em tempo real.
      void cli.listar(["AGUARDANDO_FARMACIA", "EM_CONFERENCIA"]).then((regs) => {
        regs
          .sort((a, b) => a.recebidaEm.localeCompare(b.recebidaEm))
          .filter((r) => r.status === "AGUARDANDO_FARMACIA" || r.farmaceutico === this.nomeFarmaceutico)
          .forEach((r) => this.receber(r.prescricao));
      });
      this.pararEscuta = cli.ouvir((evento, dados) => {
        const reg = evento === "conferencia-concluida" ? dados.registro : dados;
        const id = reg?.prescricao?.id;
        if (evento === "prescricao-recebida") this.receber(reg.prescricao);
        else if ((evento === "conferencia-iniciada" && reg.farmaceutico !== this.nomeFarmaceutico) || evento === "conferencia-concluida") {
          if (this.fila.some((f) => f.id === id)) {
            this.fila = this.fila.filter((f) => f.id !== id);
            this.renderizarFila();
          }
        } else if (evento === "alerta-sla" && this.fila.some((f) => f.id === id)) {
          this.avisar(`Carro nº ${reg.prescricao.numeroCarro} passou do prazo de conferência.`, "aviso");
        }
      });
    }
    const pu = this.getAttribute("prescricao-url");
    if (pu) void this.buscarJson<PrescricaoCarroEmergencia>(pu).then((p) => p && (this.prescricao = p));
  }

  disconnectedCallback(): void {
    this.pararEscuta?.();
    this.canal?.close();
    this.canal = null;
  }

  // ------------------------------------------------------------------ API pública
  get prescricao(): PrescricaoCarroEmergencia | null {
    return this._p;
  }
  set prescricao(p: PrescricaoCarroEmergencia | null) {
    this._p = p;
    this.fila = this.fila.filter((f) => f.id !== p?.id);
    this.linhas = (p?.itens ?? []).map((item) => ({
      item,
      semValidade: this.itemSemValidade(item.descricao),
      lotes: [],
      falta: null,
    }));
    this.inicio = Date.now();
    this.concluida = false;
    this.pendenteAssoc = null;
    if (this.isConnected) {
      this.renderizar();
      this.$<HTMLInputElement>("#leitor")?.focus();
    }
  }

  get checklist(): Checklist {
    return this._checklist;
  }
  set checklist(c: Checklist) {
    this._checklist = c;
    this.indexarGtins();
    if (this._p) this.linhas.forEach((l) => (l.semValidade = this.itemSemValidade(l.item.descricao)));
  }

  configurar(cfg: ConfigGHosp): void {
    this._cfg = cfg;
  }

  receber(p: PrescricaoCarroEmergencia): void {
    if (p?.tipo !== "PRESCRICAO_CARRO_EMERGENCIA") return;
    if (this._p?.id === p.id || this.abrindo.has(p.id) || this.fila.some((f) => f.id === p.id)) return;
    if (!this._p || this.concluida) {
      void this.abrir(p).then((ok) => ok && this.avisar(`Prescrição do carro nº ${p.numeroCarro} carregada.`, "ok"));
    } else {
      this.fila.push(p);
      this.renderizarFila();
      this.avisar(`Nova prescrição na fila: carro nº ${p.numeroCarro}.`, "aviso");
    }
  }

  /**
   * Abre uma prescrição para conferir. Com o serviço de integração, reserva a conferência
   * para este farmacêutico; se outra pessoa já estiver conferindo, não abre.
   */
  async abrir(p: PrescricaoCarroEmergencia): Promise<boolean> {
    if (this.abrindo.has(p.id)) return false;
    this.abrindo.add(p.id);
    try {
      return await this.abrirReservando(p);
    } finally {
      this.abrindo.delete(p.id);
    }
  }

  private abrindo = new Set<string>();

  private async abrirReservando(p: PrescricaoCarroEmergencia): Promise<boolean> {
    const farm = this.nomeFarmaceutico;
    if (this.cliente && farm) {
      try {
        const r = await this.cliente.assumir(p.id, farm);
        if (!r.ok) {
          this.fila = this.fila.filter((f) => f.id !== p.id);
          this.renderizarFila();
          this.avisar(`Carro nº ${p.numeroCarro}: ${r.mensagem ?? "não foi possível assumir a conferência."}`, "erro");
          return false;
        }
      } catch {
        this.avisar("Serviço de integração indisponível. A conferência segue, mas confira a conexão antes de concluir.", "aviso");
      }
    }
    this.prescricao = p;
    return true;
  }

  ler(codigo: string): void {
    const fb = (t: string, tipo: "ok" | "erro" | "aviso") => {
      this.avisar(t, tipo);
      this.bipar(tipo === "ok");
    };
    if (!this._p) return fb("Carregue uma prescrição antes de ler os itens.", "erro");
    if (this.concluida) return fb("Esta conferência já foi concluída.", "erro");

    const r = lerCodigo(codigo);
    if (!r.gtin) return fb(`Código não reconhecido: ${codigo}`, "erro");

    const alvo = this.gtins.get(r.gtin);
    if (!alvo) {
      this.pendenteAssoc = r;
      this.renderizarAssoc();
      this.emitir("gtin-desconhecido", { gtin: r.gtin, lote: r.lote, validade: r.validade });
      return fb(`Código ${r.gtin} ainda não cadastrado. Escolha a qual item ele pertence.`, "aviso");
    }

    const candidatas = this.linhas
      .map((l, i) => ({ l, i }))
      .filter(({ l }) => l.item.descricao === alvo.descricao && (alvo.opcao === null || l.item.opcao === alvo.opcao));
    if (!candidatas.length) return fb(`${alvo.descricao}${alvo.opcao ? " — " + alvo.opcao : ""} não está nesta prescrição.`, "erro");
    const livre = candidatas.find(({ l }) => this.reposto(l) < l.item.quantidade);
    if (!livre) return fb(`${alvo.descricao}: quantidade prescrita já conferida.`, "erro");
    const { l, i } = livre;

    if (!l.semValidade && r.validade) {
      const dias = diasParaVencer(r.validade);
      if (dias < 0) return fb(`LOTE VENCIDO (${validadeBr(r.validade)}). Não repor. Separe outro lote.`, "erro");
      if (dias < this.validadeMinima)
        return fb(`Validade curta: ${dias} dias (${validadeBr(r.validade)}). Mínimo ${this.validadeMinima}. Separe outro lote.`, "erro");
    }

    l.lotes = somarLote(l.lotes, {
      lote: l.semValidade ? "" : r.lote ?? "",
      validade: l.semValidade ? "" : r.validade ?? "",
      quantidade: 1,
      gtin: r.gtin,
      origem: "leitura",
    });
    if (this.reposto(l) >= l.item.quantidade) l.falta = null;
    this.renderizarLinha(i, true);
    this.atualizarProgresso();
    const falta = !l.semValidade && (!r.lote || !r.validade);
    fb(
      `${l.item.descricao}${l.item.opcao ? " — " + l.item.opcao : ""}: ${this.reposto(l)} de ${l.item.quantidade}` +
        (falta ? ". Código sem lote/validade: complete na linha." : "."),
      falta ? "aviso" : "ok",
    );
  }

  obterConferencia(): ConferenciaReposicao {
    const p = this._p;
    if (!p) throw new Error("Nenhuma prescrição carregada.");
    const pend: string[] = [];
    this.linhas.forEach((l) => {
      const st = this.status(l);
      const nome = `${l.item.descricao}${l.item.opcao ? " — " + l.item.opcao : ""}`;
      if (st === "ERRO") pend.push(`Corrija lote/validade de ${nome}.`);
      else if (st === "PENDENTE" || st === "PARCIAL") pend.push(`Confira ou marque falta em ${nome}.`);
      else if (st === "FALTA" && !l.falta?.motivo) pend.push(`Informe o motivo da falta de ${nome}.`);
    });
    const lacre = this.$<HTMLInputElement>("#lacreAplicado").value.trim();
    if (!lacre) pend.push("Informe o lacre aplicado após a reposição.");
    const farm = this.getAttribute("farmaceutico") ?? this.$<HTMLInputElement>("#farmaceutico")?.value.trim() ?? "";
    if (!farm) pend.push("Informe o farmacêutico responsável.");
    if (pend.length) throw new Error(pend.join(" "));

    const itens: ItemConferido[] = this.linhas.map((l) => {
      const reposto = this.reposto(l);
      return {
        secao: l.item.secao,
        codigo: l.item.codigo,
        descricao: l.item.descricao,
        opcao: l.item.opcao,
        unidade: l.item.unidade,
        prescrito: l.item.quantidade,
        reposto,
        lotes: l.lotes.map((x) => ({ ...x })),
        falta:
          reposto < l.item.quantidade && l.falta?.motivo
            ? { quantidade: l.item.quantidade - reposto, motivo: l.falta.motivo, observacao: l.falta.observacao.trim() || null }
            : null,
      };
    });
    return {
      tipo: "CONFERENCIA_REPOSICAO_CARRO",
      versao: 1,
      id: novoId(),
      prescricaoId: p.id,
      numeroCarro: p.numeroCarro,
      dataHoraPrescricao: p.dataHora,
      dataHoraConferencia: new Date().toISOString(),
      duracaoSegundos: Math.round((Date.now() - this.inicio) / 1000),
      farmaceutico: farm,
      lacreAplicado: lacre,
      situacao: itens.some((i) => i.falta) ? "COM_PENDENCIAS" : "CONFORME",
      itens,
      observacoes: this.$<HTMLTextAreaElement>("#obs").value.trim() || null,
      validadeMinimaDias: this.validadeMinima,
    };
  }

  async concluir(): Promise<void> {
    const msg = this.$("#msgFim");
    msg.className = "msg";
    let c: ConferenciaReposicao;
    try {
      c = this.obterConferencia();
    } catch (e) {
      msg.textContent = (e as Error).message;
      msg.classList.add("erro");
      this.bipar(false);
      return;
    }
    const continuar = this.dispatchEvent(
      new CustomEvent("conferencia-concluida", { detail: c, bubbles: true, composed: true, cancelable: true }),
    );
    let status = "Conferência entregue ao G-HOSP.";
    let erro = false;
    if (continuar) {
      const envio: FuncaoEnvioConferencia | null =
        this.enviar ?? (this._cfg?.endpoint ? criarEnvioHttp<ConferenciaReposicao>(this._cfg) : this.cliente?.enviarConferencia ?? null);
      if (!envio) status = "Envio automático ao G-HOSP ainda não configurado.";
      else {
        const btn = this.$<HTMLButtonElement>("#concluir");
        btn.disabled = true;
        btn.textContent = "Enviando…";
        try {
          const r: ResultadoEnvio = await envio(c);
          if (r.enviado) {
            status = this.cliente && !this.enviar && !this._cfg?.endpoint
              ? `${esc(r.mensagem ?? "Conferência registrada.")} Estoque baixado por lote${c.situacao === "COM_PENDENCIAS" ? " e requisição de compra aberta para as faltas" : ""}.`
              : `Conferência registrada no G-HOSP${r.idPrescricao ? ` (nº ${esc(r.idPrescricao)})` : ""}.`;
            this.emitir("conferencia-enviada", { conferencia: c, resultado: r });
          } else {
            erro = true;
            status = `O G-HOSP não aceitou a conferência${r.status ? ` (código ${r.status})` : ""}. ${esc(r.mensagem ?? "Tente de novo.")}`;
            this.emitir("conferencia-erro", { conferencia: c, erro: r });
          }
        } catch (e) {
          erro = true;
          status = "Não foi possível conectar ao G-HOSP. Verifique a rede e tente de novo.";
          this.emitir("conferencia-erro", { conferencia: c, erro: e });
        } finally {
          btn.disabled = false;
          btn.textContent = "Concluir conferência";
        }
      }
    }
    if (erro) {
      msg.innerHTML = status;
      msg.classList.add("erro");
      return;
    }
    this.concluida = true;
    try {
      this.canal?.postMessage({ tipo: "conferencia", conferencia: c });
    } catch {
      /* sem canal */
    }
    this.mostrarResultado(c, status);
    this.bipar(true);
  }

  // ------------------------------------------------------------------ internos
  private pararEscuta: (() => void) | null = null;

  private get cliente(): ClienteServico | null {
    const s = this.getAttribute("servidor");
    return s !== null ? new ClienteServico(s, this.getAttribute("token")) : null;
  }

  private get nomeFarmaceutico(): string {
    return (this.getAttribute("farmaceutico") ?? this.$<HTMLInputElement>("#farmaceutico")?.value ?? "").trim();
  }

  private get validadeMinima(): number {
    const v = Number(this.getAttribute("validade-minima-dias"));
    return Number.isFinite(v) && v >= 0 && this.hasAttribute("validade-minima-dias") ? v : 90;
  }

  private $<T extends Element = HTMLElement>(sel: string): T {
    return this.root.querySelector(sel) as T;
  }

  private emitir(nome: string, detail: unknown): void {
    this.dispatchEvent(new CustomEvent(nome, { detail, bubbles: true, composed: true }));
  }

  private async buscarJson<T>(url: string): Promise<T | null> {
    try {
      const r = await fetch(url, { credentials: "include" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return (await r.json()) as T;
    } catch (e) {
      this.emitir("conferencia-erro", { erro: `Falha ao carregar ${url}: ${String(e)}` });
      return null;
    }
  }

  private indexarGtins(): void {
    this.gtins.clear();
    for (const sec of this._checklist)
      for (const it of sec.itens) {
        for (const g of it.gtin ?? []) this.gtins.set(normalizarGtin(g), { descricao: it.descricao, opcao: null });
        for (const [op, gs] of Object.entries(it.gtinPorOpcao ?? {}))
          for (const g of gs) this.gtins.set(normalizarGtin(g), { descricao: it.descricao, opcao: op });
      }
    for (const [g, alvo] of Object.entries(this.associados)) if (!this.gtins.has(g)) this.gtins.set(g, alvo);
  }

  private itemSemValidade(descricao: string): boolean {
    for (const sec of this._checklist) for (const it of sec.itens) if (it.descricao === descricao) return !!it.semValidade;
    return false;
  }

  private reposto(l: LinhaConf): number {
    return l.lotes.reduce((s, x) => s + x.quantidade, 0);
  }

  private status(l: LinhaConf): StatusLinha {
    const faltaQtd = l.item.quantidade - this.reposto(l);
    return statusDaLinha(
      l.item.quantidade,
      l.lotes,
      l.falta ? { quantidade: faltaQtd, motivo: (l.falta.motivo || "OUTRO") as MotivoFalta, observacao: null } : null,
      this.validadeMinima,
      l.semValidade,
    );
  }

  private avisar(texto: string, tipo: "ok" | "erro" | "aviso"): void {
    const fb = this.$("#fb");
    if (!fb) return;
    fb.className = `fb ${tipo}`;
    fb.textContent = texto;
  }

  private bipar(ok: boolean): void {
    if (this.getAttribute("som") === "off") return;
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audio ??= new Ctx();
      const o = this.audio.createOscillator();
      const g = this.audio.createGain();
      o.frequency.value = ok ? 1320 : 220;
      g.gain.value = 0.06;
      o.connect(g).connect(this.audio.destination);
      o.start();
      o.stop(this.audio.currentTime + (ok ? 0.08 : 0.3));
    } catch {
      /* sem áudio */
    }
  }

  // ------------------------------------------------------------------ renderização
  private renderizar(): void {
    const p = this._p;
    const farm = this.getAttribute("farmaceutico");
    let corpo: string;
    if (!p) {
      corpo = `<div class="card vazio">
        <strong>Aguardando prescrição.</strong>
        <div class="fb" id="fb" aria-live="polite"></div>
        <span class="msg">As prescrições geradas no formulário do carro chegam aqui automaticamente. Você também pode colar o JSON da prescrição abaixo.</span>
        <textarea id="json" aria-label="JSON da prescrição" placeholder='{"tipo":"PRESCRICAO_CARRO_EMERGENCIA", ...}'></textarea>
        <div><button class="primario" type="button" data-acao="colar">Carregar prescrição</button></div>
      </div>`;
    } else {
      const c = p.contexto ?? { atendimento: null, paciente: null, prescritor: null, setor: null };
      const meta = [
        ["Carro de parada", `nº ${p.numeroCarro}`],
        ["Prescrição", dataBr(p.dataHora)],
        ["Paciente", c.paciente],
        ["Atendimento", c.atendimento],
        ["Prescritor", c.prescritor],
        ["Setor", c.setor],
        ["Lacre rompido", p.lacreRompido],
        ["Lacre novo (enfermagem)", p.lacreNovo],
      ]
        .filter(([, v]) => v)
        .map(([k, v]) => `<div><small>${k}</small><strong>${esc(v)}</strong></div>`)
        .join("");
      corpo = `
        <div class="card meta">${meta}</div>
        ${p.justificativa ? `<div class="alerta"><strong>Justificativa da enfermagem:</strong> ${esc(p.justificativa)}</div>` : ""}
        <div class="leitor">
          <label for="leitor">Bipe o código de barras (DataMatrix ou EAN) de cada unidade separada</label>
          <input id="leitor" autocomplete="off" spellcheck="false" placeholder="Aguardando leitura…">
          <div class="fb" id="fb" aria-live="polite">Cada leitura conta 1 unidade e preenche lote e validade automaticamente.</div>
          <div class="assoc" id="assoc" hidden></div>
        </div>
        <div class="progresso" aria-live="polite">
          <strong id="prog">0 de 0</strong>
          <div class="barra"><i id="barra" style="width:0"></i></div>
          <span id="alertas"></span>
          <button type="button" class="mini" data-acao="conferir-tudo" title="Marca como separado o restante de todos os itens, para informar lote e validade à mão">Separar restante manualmente</button>
        </div>
        <div class="tabela"><table>
          <thead><tr><th>Item</th><th>Prescrito</th><th>Lotes separados (lote · validade · qtd)</th><th>Situação</th></tr></thead>
          <tbody>${this.linhas.map((_, i) => `<tr id="l${i}"></tr>`).join("")}</tbody>
        </table></div>
        <div class="campos">
          <label for="lacreAplicado">Lacre aplicado após a reposição<input id="lacreAplicado" type="text" inputmode="numeric" value="${esc(p.lacreNovo ?? "")}"></label>
          ${farm ? `<label>Farmacêutico<input type="text" value="${esc(farm)}" disabled></label>` : `<label for="farmaceutico">Farmacêutico<input id="farmaceutico" type="text"></label>`}
        </div>
        <div class="just"><label for="obs">Observações da farmácia</label><textarea id="obs" placeholder="Opcional"></textarea></div>
        <div class="gerar">
          <span class="msg" id="msgFim" aria-live="polite">Conclua quando todos os itens estiverem conferidos ou com falta justificada.</span>
          <button class="primario grande" id="concluir" type="button" data-acao="concluir">Concluir conferência</button>
        </div>
        <section class="resultado" id="resultado" hidden></section>`;
    }
    this.root.innerHTML = `<style>${ESTILOS}${EXTRA}</style>
      <div class="wrap">
        <div class="topo"><h1>Conferência de Reposição · Farmácia</h1><div class="fila" id="fila"></div></div>
        ${corpo}
      </div>`;
    this.linhas.forEach((_, i) => this.renderizarLinha(i));
    this.renderizarFila();
    this.atualizarProgresso();
  }

  private renderizarFila(): void {
    const el = this.$("#fila");
    if (!el) return;
    el.innerHTML = this.fila.length
      ? `<span>Na fila:</span>${this.fila
          .map((f) => `<button type="button" class="mini" data-acao="abrir" data-id="${esc(f.id)}">Carro nº ${esc(f.numeroCarro)} · ${dataBr(f.dataHora)}</button>`)
          .join("")}`
      : "";
  }

  private renderizarAssoc(): void {
    const el = this.$("#assoc");
    const r = this.pendenteAssoc;
    if (!el) return;
    if (!r) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    const abertas = this.linhas
      .map((l, i) => ({ l, i }))
      .filter(({ l }) => this.reposto(l) < l.item.quantidade);
    el.hidden = false;
    el.innerHTML = `<span>Código <strong>${esc(r.gtin)}</strong> pertence a:</span>
      <select id="assocSel" class="opc">${abertas
        .map(({ l, i }) => `<option value="${i}">${esc(l.item.descricao)}${l.item.opcao ? " — " + esc(l.item.opcao) : ""}</option>`)
        .join("")}</select>
      <button type="button" class="primario mini" data-acao="associar">Associar e contar</button>
      <button type="button" class="mini" data-acao="cancelar-assoc">Cancelar</button>`;
  }

  private renderizarLinha(i: number, destacar = false): void {
    const l = this.linhas[i];
    const tr = this.$<HTMLTableRowElement>(`#l${i}`);
    if (!tr) return;
    const st = this.status(l);
    const reposto = this.reposto(l);
    const restante = l.item.quantidade - reposto;
    const lotes = l.lotes
      .map((x, k) => {
        const outros = reposto - x.quantidade;
        const max = l.item.quantidade - outros;
        const prob = problemaDoLote(x, this.validadeMinima, l.semValidade);
        const campos = l.semValidade
          ? `<span class="tag">sem validade</span>`
          : `<input class="l" data-i="${i}" data-k="${k}" data-f="lote" value="${esc(x.lote)}" placeholder="Lote" aria-label="Lote">
             <input class="v" type="date" data-i="${i}" data-k="${k}" data-f="validade" value="${esc(x.validade)}" aria-label="Validade">`;
        return `<div class="lote">${campos}
          <select data-i="${i}" data-k="${k}" data-f="qtd" aria-label="Quantidade">${Array.from({ length: Math.max(1, max) }, (_, n) => `<option${n + 1 === x.quantidade ? " selected" : ""}>${n + 1}</option>`).join("")}</select>
          <button type="button" class="mini" data-acao="rem-lote" data-i="${i}" data-k="${k}" aria-label="Remover lote">✕</button>
          <span class="tag">${x.origem === "leitura" ? "lido" : "manual"}</span>
          ${prob ? `<span class="erro">${TEXTO_PROBLEMA[prob]}${prob === "VALIDADE_CURTA" ? ` (mín. ${this.validadeMinima} dias)` : ""}</span>` : ""}
        </div>`;
      })
      .join("");
    const falta =
      l.falta && restante > 0
        ? `<div class="falta">Falta ${restante} ${l.item.unidade} ·
            <select data-i="${i}" data-f="motivo" aria-label="Motivo da falta"><option value="">Motivo…</option>${Object.entries(MOTIVOS)
              .map(([k, v]) => `<option value="${k}"${l.falta!.motivo === k ? " selected" : ""}>${v}</option>`)
              .join("")}</select>
            <input data-i="${i}" data-f="obs-falta" value="${esc(l.falta.observacao)}" placeholder="Observação" aria-label="Observação da falta">
            <button type="button" class="mini" data-acao="rem-falta" data-i="${i}" aria-label="Desfazer falta">✕</button></div>`
        : "";
    const acoes =
      restante > 0
        ? `<div class="acoes"><button type="button" class="mini add" data-acao="add-lote" data-i="${i}">+ lote manual</button>
           ${l.falta ? "" : `<button type="button" class="mini perigo" data-acao="falta" data-i="${i}">Em falta</button>`}</div>`
        : "";
    tr.innerHTML = `<td>${esc(l.item.descricao)}${l.item.opcao ? `<span class="opc">${esc(l.item.opcao)}</span>` : ""}<span class="sec">${esc(l.item.secao)}</span></td>
      <td class="n">${String(reposto).padStart(2, "0")} / ${String(l.item.quantidade).padStart(2, "0")} ${l.item.unidade}</td>
      <td><div class="lotes">${lotes}${falta}${acoes}</div></td>
      <td><span class="chip ${st}">${ROTULO_STATUS[st]}</span></td>`;
    if (destacar) {
      tr.classList.remove("flash");
      void tr.offsetWidth;
      tr.classList.add("flash");
    }
  }

  private atualizarProgresso(): void {
    const prog = this.$("#prog");
    if (!prog) return;
    const sts = this.linhas.map((l) => this.status(l));
    const ok = sts.filter((s) => s === "CONFERIDO" || s === "FALTA").length;
    prog.textContent = `${ok} de ${this.linhas.length} itens`;
    this.$<HTMLElement>("#barra").style.width = `${this.linhas.length ? (ok / this.linhas.length) * 100 : 0}%`;
    const erros = sts.filter((s) => s === "ERRO").length;
    const faltas = sts.filter((s) => s === "FALTA").length;
    this.$("#alertas").innerHTML =
      (erros ? `<span class="chip ERRO">${erros} a corrigir</span> ` : "") + (faltas ? `<span class="chip FALTA">${faltas} em falta</span>` : "");
  }

  private mostrarResultado(c: ConferenciaReposicao, status: string): void {
    const el = this.$<HTMLElement>("#resultado");
    const ok = c.situacao === "CONFORME";
    el.className = `resultado ${ok ? "ok" : "pend"}`;
    el.innerHTML = `<h2>${ok ? "Reposição conforme" : "Reposição com pendências"}</h2>
      <div class="bloco">Carro nº ${esc(c.numeroCarro)} · lacre ${esc(c.lacreAplicado)} · ${esc(c.farmaceutico)} · ${dataBr(c.dataHoraConferencia)} · ${Math.max(1, Math.round(c.duracaoSegundos / 60))} min</div>
      ${c.itens.filter((i) => i.falta).map((i) => `<div class="bloco"><strong>Falta:</strong> ${i.falta!.quantidade} ${i.unidade} de ${esc(i.descricao)}${i.opcao ? " — " + esc(i.opcao) : ""} (${MOTIVOS[i.falta!.motivo]})</div>`).join("")}
      <div class="bloco">${status}</div>
      <div class="bloco"><button type="button" class="primario" data-acao="copiar-termo">Copiar termo de reposição</button>
        <button type="button" data-acao="copiar-json">Copiar dados (JSON)</button>
        ${this.fila.length ? `<button type="button" data-acao="proxima">Próxima prescrição da fila</button>` : ""}</div>`;
    el.hidden = false;
    (el as HTMLElement & { _c?: ConferenciaReposicao })._c = c;
    el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  // ------------------------------------------------------------------ eventos
  private aoTeclar(e: KeyboardEvent): void {
    const alvo = e.target as HTMLElement;
    if (alvo.id === "leitor" && e.key === "Enter") {
      e.preventDefault();
      const inp = alvo as HTMLInputElement;
      const v = inp.value;
      inp.value = "";
      if (v.trim()) this.ler(v);
    }
  }

  private aoDigitar(e: Event): void {
    const t = e.target as HTMLInputElement;
    const i = Number(t.dataset.i);
    if (Number.isNaN(i) || !this.linhas[i]) return;
    const l = this.linhas[i];
    if (t.dataset.f === "lote") l.lotes[Number(t.dataset.k)].lote = t.value;
    else if (t.dataset.f === "obs-falta" && l.falta) l.falta.observacao = t.value;
    else return;
    this.atualizarStatusLinha(i);
  }

  private aoMudar(e: Event): void {
    const t = e.target as HTMLInputElement | HTMLSelectElement;
    const i = Number(t.dataset.i);
    if (Number.isNaN(i) || !this.linhas[i]) return;
    const l = this.linhas[i];
    const k = Number(t.dataset.k);
    switch (t.dataset.f) {
      case "validade":
        l.lotes[k].validade = t.value;
        this.renderizarLinha(i);
        break;
      case "qtd":
        l.lotes[k].quantidade = Number(t.value);
        if (this.reposto(l) >= l.item.quantidade) l.falta = null;
        this.renderizarLinha(i);
        break;
      case "motivo":
        if (l.falta) l.falta.motivo = t.value as MotivoFalta | "";
        break;
      default:
        return;
    }
    this.atualizarProgresso();
  }

  private atualizarStatusLinha(i: number): void {
    const tr = this.$(`#l${i}`);
    const chip = tr?.querySelector(".chip");
    if (!chip) return;
    const st = this.status(this.linhas[i]);
    chip.className = `chip ${st}`;
    chip.textContent = ROTULO_STATUS[st];
    this.atualizarProgresso();
  }

  private aoClicar(e: Event): void {
    const btn = (e.target as Element).closest("button[data-acao]") as HTMLButtonElement | null;
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const l = this.linhas[i];
    switch (btn.dataset.acao) {
      case "colar": {
        try {
          const p = JSON.parse(this.$<HTMLTextAreaElement>("#json").value);
          if (p?.tipo !== "PRESCRICAO_CARRO_EMERGENCIA") throw new Error();
          this.prescricao = p;
        } catch {
          alertaVazio(this.root, "O texto colado não é uma prescrição de carro de emergência válida.");
        }
        return;
      }
      case "abrir":
      case "proxima": {
        const p = btn.dataset.id ? this.fila.find((f) => f.id === btn.dataset.id) : this.fila[0];
        if (p) void this.abrir(p);
        return;
      }
      case "associar": {
        const r = this.pendenteAssoc;
        const idx = Number(this.$<HTMLSelectElement>("#assocSel").value);
        const linha = this.linhas[idx];
        if (!r?.gtin || !linha) return;
        const alvo = { descricao: linha.item.descricao, opcao: linha.item.opcao };
        this.gtins.set(r.gtin, alvo);
        this.associados[r.gtin] = alvo;
        try {
          localStorage.setItem(CHAVE_GTIN, JSON.stringify(this.associados));
        } catch {
          /* sem armazenamento local */
        }
        this.emitir("gtin-associado", { gtin: r.gtin, ...alvo });
        void this.cliente?.salvarGtin(r.gtin, alvo.descricao, alvo.opcao);
        this.pendenteAssoc = null;
        this.renderizarAssoc();
        this.ler(r.bruto);
        this.$<HTMLInputElement>("#leitor").focus();
        return;
      }
      case "cancelar-assoc":
        this.pendenteAssoc = null;
        this.renderizarAssoc();
        this.$<HTMLInputElement>("#leitor").focus();
        return;
      case "conferir-tudo":
        this.linhas.forEach((ln, j) => {
          const rest = ln.item.quantidade - this.reposto(ln);
          if (rest > 0 && !ln.falta) {
            ln.lotes.push({ lote: "", validade: "", quantidade: rest, gtin: null, origem: "manual" });
            this.renderizarLinha(j);
          }
        });
        this.atualizarProgresso();
        return;
      case "add-lote":
        l.lotes.push({ lote: "", validade: "", quantidade: l.item.quantidade - this.reposto(l), gtin: null, origem: "manual" });
        l.falta = null;
        this.renderizarLinha(i);
        this.atualizarProgresso();
        [...this.root.querySelectorAll<HTMLInputElement>(`#l${i} input.l`)].pop()?.focus();
        return;
      case "rem-lote":
        l.lotes.splice(Number(btn.dataset.k), 1);
        this.renderizarLinha(i);
        this.atualizarProgresso();
        return;
      case "falta":
        l.falta = { motivo: "", observacao: "" };
        this.renderizarLinha(i);
        this.atualizarProgresso();
        this.$<HTMLSelectElement>(`#l${i} select[data-f="motivo"]`)?.focus();
        return;
      case "rem-falta":
        l.falta = null;
        this.renderizarLinha(i);
        this.atualizarProgresso();
        return;
      case "concluir":
        void this.concluir();
        return;
      case "copiar-termo":
      case "copiar-json": {
        const c = (this.$("#resultado") as HTMLElement & { _c?: ConferenciaReposicao })._c;
        if (!c) return;
        const txt = btn.dataset.acao === "copiar-json" ? JSON.stringify(c, null, 2) : termoReposicao(c);
        const rot = btn.textContent;
        navigator.clipboard.writeText(txt).then(
          () => (btn.textContent = "Copiado"),
          () => (btn.textContent = "Não foi possível copiar"),
        );
        setTimeout(() => (btn.textContent = rot), 2000);
        return;
      }
    }
  }
}

function alertaVazio(root: ShadowRoot, texto: string): void {
  const m = root.querySelector(".vazio .msg");
  if (m) {
    m.textContent = texto;
    m.classList.add("erro");
  }
}

/** Termo de reposição em texto (para colar no G-HOSP, imprimir ou arquivar). */
export function termoReposicao(c: ConferenciaReposicao): string {
  let t = `TERMO DE REPOSIÇÃO — CARRO DE EMERGÊNCIA\nCarro de parada nº ${c.numeroCarro}\n`;
  t += `Prescrição: ${dataBr(c.dataHoraPrescricao)} · Conferência: ${dataBr(c.dataHoraConferencia)}\n`;
  t += `Farmacêutico: ${c.farmaceutico ?? "—"} · Lacre aplicado: ${c.lacreAplicado ?? "—"}\n`;
  t += `Situação: ${c.situacao === "CONFORME" ? "Conforme" : "Com pendências"}\n\n`;
  for (const i of c.itens) {
    t += `${String(i.reposto).padStart(2, "0")}/${String(i.prescrito).padStart(2, "0")} ${i.unidade.padEnd(4)} ${i.descricao}${i.opcao ? " — " + i.opcao : ""}\n`;
    for (const l of i.lotes) if (l.lote || l.validade) t += `        lote ${l.lote || "—"} · val. ${validadeBr(l.validade)} · ${l.quantidade}\n`;
    if (i.falta) t += `        FALTA ${i.falta.quantidade}: ${MOTIVOS[i.falta.motivo]}${i.falta.observacao ? " — " + i.falta.observacao : ""}\n`;
  }
  if (c.observacoes) t += `\nObservações: ${c.observacoes}\n`;
  return t.trimEnd();
}

if (!customElements.get("conferencia-farmacia-carro")) {
  customElements.define("conferencia-farmacia-carro", ConferenciaFarmaciaElement);
}

declare global {
  interface HTMLElementTagNameMap {
    "conferencia-farmacia-carro": ConferenciaFarmaciaElement;
  }
}
