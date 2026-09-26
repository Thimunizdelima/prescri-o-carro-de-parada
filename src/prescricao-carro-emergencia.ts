import { CHECKLIST_PADRAO } from "./checklist-padrao.js";
import { ESTILOS } from "./estilos.js";
import { criarEnvioHttp, type ConfigGHosp } from "./ghosp-client.js";
import { ClienteServico, ROTULO_FLUXO } from "./integracao.js";
import { SECOES_MEDICAS } from "./regras-enfermagem.js";
import { limiteDaLinha, normalizarLinhas, podeAdicionarOpcao } from "./regras.js";
import type {
  Checklist,
  ContextoAtendimento,
  FuncaoEnvio,
  ItemChecklist,
  ItemPrescricao,
  LinhaUso,
  PrescricaoCarroEmergencia,
  ResultadoEnvio,
} from "./types.js";

/** Erro de validação com a lista de pendências para mostrar ao usuário. */
export class ErroValidacao extends Error {
  constructor(public pendencias: string[]) {
    super(pendencias.join(" "));
    this.name = "ErroValidacao";
  }
}

interface Linha {
  chave: string;
  secao: string;
  item: ItemChecklist;
  busca: string;
}

const esc = (s: unknown): string =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Identificador único (UUID v4), com alternativa para navegadores sem crypto.randomUUID. */
export const novoId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

/** Canal usado para avisar a farmácia (outra aba/tela do mesmo navegador) que há prescrição nova. */
export const CANAL_PADRAO = "carro-emergencia";

const semAcento = (s: string): string => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/**
 * <prescricao-carro-emergencia>
 *
 * Atributos:
 *   endpoint       URL da API de prescrições do G-HOSP (POST JSON). Sem ele, a prescrição é só exibida.
 *   atendimento    Nº do atendimento/prontuário (vem do G-HOSP).
 *   paciente       Nome ou ID do paciente (vem do G-HOSP).
 *   prescritor     Profissional logado (vem do G-HOSP).
 *   setor          Setor onde o carro foi usado.
 *   numero-carro   Pré-preenche o número do carro de parada.
 *   checklist-url  URL de um JSON com outro check list (mesmo formato de CHECKLIST_PADRAO).
 *   modo           "medico": prescrição médica (só medicamentos). Ao finalizar, libera a prescrição de enfermagem.
 *   servidor       URL do serviço de integração (servidor/). Envia a prescrição e acompanha a farmácia em tempo real.
 *   token          Token do serviço, se exigido.
 *   canal          Nome do BroadcastChannel que avisa a conferência da farmácia (padrão "carro-emergencia"; "off" desliga).
 *
 * Propriedades / métodos:
 *   checklist               Define o check list via JavaScript.
 *   enviar                  Função própria de envio (substitui o POST padrão).
 *   configurar(cfg)         Configura endpoint, cabeçalhos e timeout do POST padrão.
 *   obterPrescricao()       Valida e devolve o objeto da prescrição (lança ErroValidacao).
 *   gerar()                 Mesmo que clicar em "Gerar Prescrição".
 *   limpar()                Zera o formulário.
 *
 * Eventos (bubbles + composed):
 *   prescricao-gerada   detail: PrescricaoCarroEmergencia. Cancelável: preventDefault() impede o envio
 *                       automático (use quando o próprio G-HOSP quiser gravar a prescrição).
 *   prescricao-enviada  detail: { prescricao, resultado }
 *   prescricao-erro     detail: { prescricao?, erro }
 */
export class PrescricaoCarroEmergenciaElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["endpoint", "checklist-url", "numero-carro"];
  }

  /** Função de envio personalizada. Tem prioridade sobre o atributo `endpoint`. */
  enviar: FuncaoEnvio | null = null;

  private _checklist: Checklist = CHECKLIST_PADRAO;
  private _cfg: ConfigGHosp | null = null;
  private uso = new Map<string, LinhaUso[]>();
  private linhas: Linha[] = [];
  private root: ShadowRoot;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.root.addEventListener("change", (e) => this.aoMudar(e));
    this.root.addEventListener("click", (e) => this.aoClicar(e));
  }

  // ---------------------------------------------------------------- ciclo de vida
  connectedCallback(): void {
    this.renderizar();
    const url = this.getAttribute("checklist-url");
    if (url) void this.carregarChecklist(url);
  }

  attributeChangedCallback(nome: string, antigo: string | null, novo: string | null): void {
    if (antigo === novo || !this.isConnected || !this.root.firstChild) return;
    if (nome === "checklist-url" && novo) void this.carregarChecklist(novo);
    if (nome === "numero-carro") this.campo("numeroCarro").value = novo ?? "";
    if (nome === "endpoint") this._cfg = novo ? { ...(this._cfg ?? {}), endpoint: novo } : null;
  }

  // ---------------------------------------------------------------- API pública
  get checklist(): Checklist {
    return this._checklist;
  }
  set checklist(valor: Checklist) {
    this._checklist = valor;
    this.uso.clear();
    if (this.isConnected) this.renderizar();
  }

  configurar(cfg: ConfigGHosp): void {
    this._cfg = cfg;
  }

  limpar(): void {
    this.uso.clear();
    this.finalizada = false;
    this.confirmando = false;
    this.pararEscuta?.();
    this.renderizar();
  }

  obterPrescricao(): PrescricaoCarroEmergencia {
    const pend: string[] = [];
    const medico = this.modoMedico;
    const numeroCarro = (this.campo("numeroCarro")?.value ?? this.getAttribute("numero-carro") ?? "").trim();
    if (!numeroCarro && !medico) pend.push("Preencha o número do carro de parada.");
    if (!this.uso.size) pend.push(medico ? "Marque pelo menos um medicamento administrado." : "Marque pelo menos um item utilizado.");
    const semOpcao = this.linhas
      .filter((l) => l.item.opcoes && this.uso.get(l.chave)?.some((u) => !u.opcao))
      .map((l) => l.item.descricao);
    if (semOpcao.length) pend.push(`Escolha a opção utilizada em: ${semOpcao.join(", ")}.`);
    if (pend.length) throw new ErroValidacao(pend);

    const itens: ItemPrescricao[] = [];
    for (const l of this.linhas) {
      for (const u of this.uso.get(l.chave) ?? []) {
        itens.push({
          secao: l.secao,
          codigo: l.item.codigo ?? null,
          descricao: l.item.descricao,
          opcao: u.opcao || null,
          quantidade: u.quantidade,
          unidade: l.item.unidade ?? "und",
          quantitativoPrevisto: l.item.maximo,
        });
      }
    }
    const contexto: ContextoAtendimento = {
      atendimento: this.getAttribute("atendimento"),
      paciente: this.getAttribute("paciente"),
      prescritor: this.getAttribute("prescritor"),
      setor: this.getAttribute("setor"),
    };
    const agora = new Date().toISOString();
    return {
      tipo: "PRESCRICAO_CARRO_EMERGENCIA",
      versao: 1,
      id: novoId(),
      dataHora: agora,
      numeroCarro,
      lacreRompido: this.campo("lacreRompido")?.value.trim() || null,
      lacreNovo: this.campo("lacreNovo")?.value.trim() || null,
      contexto,
      itens,
      justificativa: this.campo<HTMLTextAreaElement>("justificativa").value.trim() || null,
      ...(medico ? { etapa: "MEDICA" as const, finalizadaEm: agora, medico: this.getAttribute("prescritor") } : {}),
    };
  }

  async gerar(): Promise<void> {
    const msg = this.$(".msg");
    const rx = this.$<HTMLElement>(".rx");
    const botao = this.$<HTMLButtonElement>("#gerar");
    msg.classList.remove("erro");

    if (this.finalizada) return;
    let p: PrescricaoCarroEmergencia;
    try {
      p = this.obterPrescricao();
    } catch (e) {
      msg.textContent = e instanceof ErroValidacao ? e.pendencias.join(" ") : String(e);
      msg.classList.add("erro");
      rx.hidden = true;
      this.confirmando = false;
      botao.textContent = this.rotuloBotao;
      return;
    }

    // Finalizar a prescrição médica é definitivo: pede confirmação no próprio botão.
    if (this.modoMedico && !this.confirmando) {
      this.confirmando = true;
      botao.textContent = "Confirmar finalização";
      msg.textContent = `${p.itens.length} ${p.itens.length === 1 ? "item" : "itens"}. Depois de finalizada, a prescrição não pode ser alterada e a enfermagem é liberada para iniciar. Clique de novo para confirmar.`;
      return;
    }
    this.confirmando = false;

    const canal = this.getAttribute("canal") ?? CANAL_PADRAO;
    if (canal !== "off" && typeof BroadcastChannel !== "undefined") {
      try {
        const bc = new BroadcastChannel(canal);
        bc.postMessage({ tipo: "prescricao", prescricao: p });
        bc.close();
      } catch {
        /* canal indisponível: segue sem aviso local */
      }
    }

    const continuar = this.dispatchEvent(
      new CustomEvent("prescricao-gerada", { detail: p, bubbles: true, composed: true, cancelable: true }),
    );

    let status = "";
    let erro = false;
    if (!continuar) {
      status = "Prescrição entregue ao G-HOSP.";
    } else {
      const envio = this.enviar ?? (this._cfg?.endpoint ? criarEnvioHttp(this._cfg) : this.cliente?.enviarPrescricao ?? null);
      if (!envio) {
        status = "Envio automático para a aba Prescrições do G-HOSP ainda não configurado.";
      } else {
        botao.disabled = true;
        botao.textContent = "Enviando…";
        try {
          const r: ResultadoEnvio = await envio(p);
          if (r.enviado) {
            status = this.cliente && !this.enviar && !this._cfg?.endpoint
              ? esc(r.mensagem ?? "Prescrição encaminhada à farmácia.")
              : `Prescrição enviada para a aba Prescrições do G-HOSP${r.idPrescricao ? ` (nº ${esc(r.idPrescricao)})` : ""}.`;
            this.emitir("prescricao-enviada", { prescricao: p, resultado: r });
          } else {
            erro = true;
            status = `O G-HOSP não aceitou a prescrição${r.status ? ` (código ${r.status})` : ""}. ${esc(r.mensagem ?? "Confira os dados e tente de novo.")}`;
            this.emitir("prescricao-erro", { prescricao: p, erro: r });
          }
        } catch (e) {
          erro = true;
          status = "Não foi possível conectar ao G-HOSP. Verifique a rede e tente de novo.";
          this.emitir("prescricao-erro", { prescricao: p, erro: e });
        } finally {
          botao.disabled = false;
          botao.textContent = this.rotuloBotao;
        }
      }
    }

    if (this.modoMedico && !erro) {
      this.finalizada = true;
      this.root.querySelectorAll<HTMLInputElement>("input, select, textarea, button[data-acao]:not([data-acao^='copiar'])").forEach((el) => (el.disabled = true));
      botao.textContent = "Prescrição médica finalizada";
      status = `${status} A prescrição de enfermagem já pode ser iniciada.`;
    } else botao.textContent = this.rotuloBotao;
    this.mostrarPrescricao(p, status, erro);
    if (!erro && this.cliente) this.acompanhar(p.id);
    msg.textContent = `Prescrição gerada com ${p.itens.length} ${p.itens.length === 1 ? "linha" : "linhas"}.`;
  }

  // ---------------------------------------------------------------- internos
  private async carregarChecklist(url: string): Promise<void> {
    try {
      const resp = await fetch(url, { credentials: "include" });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      this.checklist = (await resp.json()) as Checklist;
    } catch (e) {
      this.emitir("prescricao-erro", { erro: `Não foi possível carregar o check list (${String(e)}).` });
    }
  }

  private emitir(nome: string, detail: unknown): void {
    this.dispatchEvent(new CustomEvent(nome, { detail, bubbles: true, composed: true }));
  }

  private $<T extends Element = HTMLElement>(sel: string): T {
    return this.root.querySelector(sel) as T;
  }

  private campo<T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement>(id: string): T {
    return this.root.getElementById(id) as T;
  }

  private renderizar(): void {
    this.linhas = [];
    const medico = this.modoMedico;
    const secoes = this._checklist.map((sec, si) => {
      if (medico && !SECOES_MEDICAS.includes(sec.titulo)) return "";
      const trs = sec.itens
        .map((item, ii) => {
          const chave = `${si}_${ii}`;
          this.linhas.push({
            chave,
            secao: sec.titulo,
            item,
            busca: semAcento(`${item.descricao} ${(item.opcoes ?? []).join(" ")}`),
          });
          const dica = item.opcoes ? `<span class="dica">${item.opcoes.map(esc).join(" · ")}</span>` : "";
          return `<tr data-chave="${chave}">
            <td><label class="item"><input type="checkbox" data-acao="marcar"><span>${esc(item.descricao)}${dica}</span></label></td>
            <td class="qtd"><div class="linhas" hidden></div></td></tr>`;
        })
        .join("");
      return `<section><h2>${esc(sec.titulo)}<small>${sec.itens.length} itens</small></h2>
        <table><thead><tr><th>Item</th><th class="dir">Utilizado</th></tr></thead><tbody>${trs}</tbody></table></section>`;
    });
    // Divide as seções em duas colunas com número de itens o mais equilibrado possível.
    const visiveis = this._checklist.filter((s) => !medico || SECOES_MEDICAS.includes(s.titulo));
    const html = secoes.filter(Boolean);
    const total = visiveis.reduce((s, sec) => s + sec.itens.length, 0);
    let meio = 0;
    for (let acc = 0, melhor = Infinity, i = 0; i <= visiveis.length; i++) {
      const dif = Math.abs(total - 2 * acc);
      if (dif < melhor) [melhor, meio] = [dif, i];
      acc += visiveis[i]?.itens.length ?? 0;
    }
    const numero = esc(this.getAttribute("numero-carro") ?? "");

    this.root.innerHTML = `<style>${ESTILOS}</style>
      <div class="wrap">
        <div class="topo">
          <h1>${medico ? "Prescrição Médica · Carro de Emergência" : "Formulário de Prescrição de Carro de Emergência"}</h1>
          <input type="search" id="busca" placeholder="Buscar item…" aria-label="Buscar item">
        </div>
        <div class="resumo" aria-live="polite">
          <span><span class="pill" id="cnt">0</span> itens utilizados</span>
          <span><span class="pill" id="tot">0</span> unidades no total</span>
          <span class="esp"></span>
          <span id="caixaLimpar"><button class="perigo" type="button" data-acao="limpar">Limpar tudo</button></span>
        </div>
        ${medico ? "" : `<div class="campos">
          <label for="numeroCarro">Número do carro de parada<input id="numeroCarro" type="text" inputmode="numeric" value="${numero}" required></label>
          <label for="lacreRompido">Lacre rompido<input id="lacreRompido" type="text" inputmode="numeric"></label>
          <label for="lacreNovo">Lacre novo<input id="lacreNovo" type="text" inputmode="numeric"></label>
        </div>`}
        <div class="grade"><div class="col">${html.slice(0, meio).join("")}</div><div class="col">${html.slice(meio).join("")}</div></div>
        <div class="just">
          <label for="justificativa">${medico ? "Observações médicas" : "Justificativa"}</label>
          <small>${medico ? "Opcional. Materiais, lacres e perdas são registrados pela enfermagem." : "Use em caso de quebra de medicamento ou de medicamento diluído e não utilizado."}</small>
          <textarea id="justificativa" placeholder="${medico ? "Observações (opcional)" : "Descreva o ocorrido (opcional)"}"></textarea>
        </div>
        <div class="gerar">
          <span class="msg" aria-live="polite">${medico ? "Marque os medicamentos administrados na parada e finalize a prescrição." : "Ao terminar de marcar os itens utilizados, gere a prescrição."}</span>
          <button class="primario grande" id="gerar" type="button" data-acao="gerar">${this.rotuloBotao}</button>
        </div>
        <section class="rx" hidden></section>
      </div>`;

    this.$("#busca").addEventListener("input", this.aoBuscar);
    this.atualizarResumo();
  }

  private linhaDe(el: Element): Linha | undefined {
    const tr = el.closest("tr[data-chave]") as HTMLElement | null;
    return tr ? this.linhas.find((l) => l.chave === tr.dataset.chave) : undefined;
  }

  private aoMudar = (e: Event): void => {
    const alvo = e.target as HTMLInputElement | HTMLSelectElement;
    const l = this.linhaDe(alvo);
    if (!l) return;
    const campo = alvo.dataset.campo;
    if (alvo.dataset.acao === "marcar") {
      if ((alvo as HTMLInputElement).checked) this.uso.set(l.chave, [{ opcao: l.item.opcoes ? "" : null, quantidade: 1 }]);
      else this.uso.delete(l.chave);
    } else if (campo === "q" || campo === "o") {
      const linhas = this.uso.get(l.chave)!;
      const k = Number(alvo.dataset.k);
      if (campo === "q") linhas[k].quantidade = Number(alvo.value);
      else linhas[k].opcao = alvo.value;
      this.uso.set(l.chave, normalizarLinhas(l.item, linhas));
    } else return;
    this.renderizarQtd(l);
    this.atualizarResumo();
  };

  private aoClicar = (e: Event): void => {
    const btn = (e.target as Element).closest("button[data-acao]") as HTMLButtonElement | null;
    if (!btn) return;
    const acao = btn.dataset.acao;
    if (acao === "gerar") return void this.gerar();
    if (acao === "limpar") return this.pedirConfirmacao();
    if (acao === "nova") return this.limpar();
    if (acao === "copiar" || acao === "copiar-json") return void this.copiar(btn, acao === "copiar-json");
    const l = this.linhaDe(btn);
    if (!l) return;
    const linhas = this.uso.get(l.chave)!;
    if (acao === "add") linhas.push({ opcao: "", quantidade: 1 });
    if (acao === "del") linhas.splice(Number(btn.dataset.k), 1);
    this.uso.set(l.chave, normalizarLinhas(l.item, linhas));
    this.renderizarQtd(l);
    this.atualizarResumo();
  };

  private aoBuscar = (e: Event): void => {
    const q = semAcento((e.target as HTMLInputElement).value.trim());
    for (const l of this.linhas) {
      const tr = this.$<HTMLElement>(`tr[data-chave="${l.chave}"]`);
      tr.hidden = !!q && !l.busca.includes(q);
    }
  };

  private renderizarQtd(l: Linha): void {
    const tr = this.$<HTMLElement>(`tr[data-chave="${l.chave}"]`);
    const caixa = tr.querySelector(".linhas") as HTMLElement;
    const linhas = this.uso.get(l.chave);
    tr.classList.toggle("on", !!linhas);
    caixa.hidden = !linhas;
    if (!linhas) {
      caixa.innerHTML = "";
      return;
    }
    const un = l.item.unidade ?? "und";
    caixa.innerHTML =
      linhas
        .map((u, k) => {
          const limite = limiteDaLinha(l.item, linhas, k);
          const ocupadas = new Set(linhas.filter((_, j) => j !== k).map((x) => x.opcao).filter(Boolean));
          const opc = l.item.opcoes
            ? `<select class="opc${u.opcao ? "" : " pend"}" data-campo="o" data-k="${k}" aria-label="Opção utilizada de ${esc(l.item.descricao)}">
                <option value="" disabled${u.opcao ? "" : " selected"}>Qual?</option>
                ${l.item.opcoes
                  .filter((o) => !ocupadas.has(o) || o === u.opcao)
                  .map((o) => `<option${o === u.opcao ? " selected" : ""}>${esc(o)}</option>`)
                  .join("")}
              </select>`
            : "";
          const qtd = Array.from({ length: limite }, (_, i) => `<option value="${i + 1}"${i + 1 === u.quantidade ? " selected" : ""}>${i + 1}</option>`).join("");
          const del = linhas.length > 1 ? `<button type="button" class="mini" data-acao="del" data-k="${k}" aria-label="Remover linha">✕</button>` : "";
          return `<div class="linha">${opc}<span class="un">${un}</span>
            <select data-campo="q" data-k="${k}" aria-label="Quantidade utilizada de ${esc(l.item.descricao)}">${qtd}</select>${del}</div>`;
        })
        .join("") +
      (podeAdicionarOpcao(l.item, linhas) ? `<button type="button" class="mini add" data-acao="add">+ outra opção</button>` : "");
  }

  private atualizarResumo(): void {
    let unidades = 0;
    this.uso.forEach((ls) => ls.forEach((u) => (unidades += u.quantidade)));
    this.$("#cnt").textContent = String(this.uso.size);
    this.$("#tot").textContent = String(unidades);
  }

  private pedirConfirmacao(): void {
    const caixa = this.$("#caixaLimpar");
    caixa.innerHTML = `<span class="confirma">Desmarcar todos os itens?
      <button class="perigo" type="button" id="sim">Sim, limpar</button>
      <button type="button" id="nao">Cancelar</button></span>`;
    const voltar = () =>
      (caixa.innerHTML = `<button class="perigo" type="button" data-acao="limpar">Limpar tudo</button>`);
    caixa.querySelector("#sim")!.addEventListener("click", (e) => {
      e.stopPropagation();
      this.limpar();
    });
    caixa.querySelector("#nao")!.addEventListener("click", (e) => {
      e.stopPropagation();
      voltar();
    });
  }

  private ultima: PrescricaoCarroEmergencia | null = null;
  private confirmando = false;
  private finalizada = false;

  /** modo="medico": só medicamentos, sem lacres; "Finalizar" libera a enfermagem. */
  private get modoMedico(): boolean {
    return this.getAttribute("modo") === "medico";
  }

  private get rotuloBotao(): string {
    return this.modoMedico ? "Finalizar prescrição médica" : "Gerar Prescrição";
  }
  private pararEscuta: (() => void) | null = null;

  /** Cliente do serviço de integração, quando o atributo `servidor` está definido. */
  private get cliente(): ClienteServico | null {
    const s = this.getAttribute("servidor");
    return s !== null ? new ClienteServico(s, this.getAttribute("token")) : null;
  }

  /** Mostra, em tempo real, o andamento da prescrição na farmácia. */
  private acompanhar(id: string): void {
    const el = this.$<HTMLElement>("#acomp");
    if (!el) return;
    const mostrar = (txt: string) => {
      el.hidden = false;
      el.innerHTML = `<strong>Andamento:</strong> ${txt}`;
    };
    mostrar(this.modoMedico ? ROTULO_FLUXO.AGUARDANDO_ENFERMAGEM : ROTULO_FLUXO.AGUARDANDO_FARMACIA);
    this.pararEscuta?.();
    const cli = this.cliente!;
    const rotulo = (reg: { status: keyof typeof ROTULO_FLUXO; enfermeiro?: string | null; farmaceutico?: string | null; atrasada?: boolean }) => {
      let t = ROTULO_FLUXO[reg.status];
      if (reg.status === "EM_ENFERMAGEM" && reg.enfermeiro) t += ` por ${esc(reg.enfermeiro)}`;
      if (reg.status === "AGUARDANDO_FARMACIA" && reg.enfermeiro) t += ` · liberado por ${esc(reg.enfermeiro)}`;
      if (reg.status === "EM_CONFERENCIA" && reg.farmaceutico) t += ` por ${esc(reg.farmaceutico)}`;
      if (reg.atrasada && reg.status !== "CONFORME" && reg.status !== "COM_PENDENCIAS") t += " · passou do prazo";
      return t;
    };
    const reler = async () => {
      const reg = await cli.obter(id);
      if (reg) mostrar(rotulo(reg));
    };
    this.pararEscuta = cli.ouvir((evento, dados) => {
      const reg = evento === "conferencia-concluida" ? dados.registro : dados;
      if (reg?.prescricao?.id !== id) return;
      if (evento === "conferencia-concluida") {
        const falt = (dados.conferencia?.itens ?? []).filter((i: { falta: unknown }) => i.falta).length;
        mostrar(`${ROTULO_FLUXO[reg.status as keyof typeof ROTULO_FLUXO]}${falt ? ` (${falt} ${falt === 1 ? "item em falta" : "itens em falta"})` : ""} · lacre ${esc(dados.conferencia?.lacreAplicado ?? "—")}`);
        this.pararEscuta?.();
        this.pararEscuta = null;
      } else mostrar(rotulo(reg));
    }, () => void reler());
  }

  disconnectedCallback(): void {
    this.pararEscuta?.();
  }

  private mostrarPrescricao(p: PrescricaoCarroEmergencia, status: string, erro: boolean): void {
    this.ultima = p;
    const d = new Date(p.dataHora);
    const quando = `${d.toLocaleDateString("pt-BR")} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    const ctx = p.contexto;
    const rx = this.$<HTMLElement>(".rx");
    rx.innerHTML = `<h2>Prescrição gerada</h2>
      <div class="meta">
        <span>Carro de parada nº ${esc(p.numeroCarro)}</span><span>${quando}</span>
        ${ctx.paciente ? `<span>Paciente: ${esc(ctx.paciente)}</span>` : ""}
        ${ctx.atendimento ? `<span>Atendimento: ${esc(ctx.atendimento)}</span>` : ""}
        <span>Lacre rompido: ${esc(p.lacreRompido ?? "—")}</span><span>Lacre novo: ${esc(p.lacreNovo ?? "—")}</span>
      </div>
      <table><thead><tr><th>Qtd.</th><th>Item</th></tr></thead><tbody>
        ${p.itens.map((i) => `<tr><td class="n">${String(i.quantidade).padStart(2, "0")} ${i.unidade}</td><td>${esc(i.descricao)}${i.opcao ? ` — ${esc(i.opcao)}` : ""}</td></tr>`).join("")}
      </tbody></table>
      ${p.justificativa ? `<div class="bloco"><strong>Justificativa:</strong> ${esc(p.justificativa)}</div>` : ""}
      <div class="bloco status${erro ? " erro" : ""}">${status}</div>
      <div class="bloco" id="acomp" hidden></div>
      <div class="bloco"><button type="button" class="primario" data-acao="copiar">Copiar prescrição</button>
        <button type="button" data-acao="copiar-json">Copiar dados (JSON)</button>
        ${this.modoMedico ? `<button type="button" data-acao="nova">Nova prescrição médica</button>` : ""}</div>`;
    rx.hidden = false;
    rx.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  private async copiar(btn: HTMLButtonElement, json: boolean): Promise<void> {
    if (!this.ultima) return;
    const p = this.ultima;
    const texto = json ? JSON.stringify(p, null, 2) : textoPrescricao(p);
    const rotulo = btn.textContent;
    try {
      await navigator.clipboard.writeText(texto);
      btn.textContent = "Copiado";
    } catch {
      btn.textContent = "Não foi possível copiar";
    }
    setTimeout(() => (btn.textContent = rotulo), 2000);
  }
}

/** Versão em texto simples da prescrição (para colar em evolução ou impressão). */
export function textoPrescricao(p: PrescricaoCarroEmergencia): string {
  const d = new Date(p.dataHora);
  let t = `PRESCRIÇÃO — CARRO DE EMERGÊNCIA\nCarro de parada nº ${p.numeroCarro}\n`;
  t += `Data: ${d.toLocaleDateString("pt-BR")} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}\n`;
  if (p.contexto.paciente) t += `Paciente: ${p.contexto.paciente}\n`;
  if (p.contexto.atendimento) t += `Atendimento: ${p.contexto.atendimento}\n`;
  t += `Lacre rompido: ${p.lacreRompido ?? "—"} | Lacre novo: ${p.lacreNovo ?? "—"}\n\n`;
  for (const i of p.itens) t += `${String(i.quantidade).padStart(2, "0")} ${i.unidade.padEnd(4)} ${i.descricao}${i.opcao ? ` — ${i.opcao}` : ""}\n`;
  if (p.justificativa) t += `\nJustificativa: ${p.justificativa}\n`;
  return t.trimEnd();
}

if (!customElements.get("prescricao-carro-emergencia")) {
  customElements.define("prescricao-carro-emergencia", PrescricaoCarroEmergenciaElement);
}

declare global {
  interface HTMLElementTagNameMap {
    "prescricao-carro-emergencia": PrescricaoCarroEmergenciaElement;
  }
}
