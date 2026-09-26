import { CHECKLIST_PADRAO } from "./checklist-padrao.js";
import { ESTILOS } from "./estilos.js";
import { criarEnvioHttp, type ConfigGHosp } from "./ghosp-client.js";
import { ClienteServico, ROTULO_FLUXO } from "./integracao.js";
import { CANAL_PADRAO, novoId } from "./prescricao-carro-emergencia.js";
import {
  checagemInicial,
  consumo,
  CUIDADOS_PADRAO,
  itemDoChecklist,
  medicaFinalizada,
  montarReposicao,
  REGRA_BLOQUEIO,
  SECOES_MATERIAIS,
  TEXTO_NAO_ADMINISTRADO,
  TEXTO_PERDA,
  validarEnfermagem,
} from "./regras-enfermagem.js";
import { limiteDaLinha, normalizarLinhas, podeAdicionarOpcao } from "./regras.js";
import type {
  ChecagemItem,
  Checklist,
  ItemChecklist,
  ItemPrescricao,
  LinhaUso,
  MotivoNaoAdministrado,
  MotivoPerda,
  PrescricaoCarroEmergencia,
  PrescricaoEnfermagem,
  ResultadoEnvio,
} from "./types.js";

export type FuncaoEnvioEnfermagem = (e: PrescricaoEnfermagem, reposicao: PrescricaoCarroEmergencia) => Promise<ResultadoEnvio>;

const esc = (s: unknown): string =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const dataBr = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const nomeItem = (d: string, o: string | null) => `${d}${o ? " — " + o : ""}`;
const opcoesNum = (de: number, ate: number, sel: number) =>
  Array.from({ length: Math.max(0, ate - de + 1) }, (_, k) => de + k)
    .map((n) => `<option value="${n}"${n === sel ? " selected" : ""}>${n}</option>`)
    .join("");

const EXTRA = /* css */ `
.bloqueio{display:flex;flex-direction:column;gap:10px;align-items:flex-start;background:var(--pce-superficie);border:2px dashed var(--pce-linha);border-radius:10px;padding:22px}
.bloqueio strong{font-size:18px;color:var(--pce-secundaria)}
.bloqueio .regra{border-left:4px solid var(--pce-primaria);background:var(--pce-cabecalho);border-radius:6px;padding:8px 12px;font-size:14px}
.fila{display:flex;flex-direction:column;gap:6px;width:100%}
.fila button{display:flex;flex-wrap:wrap;gap:4px 14px;justify-content:space-between;text-align:left;width:100%}
.card{background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px;padding:14px 16px}
.meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px 18px}
.meta div{display:flex;flex-direction:column;gap:2px}
.meta small,.card>small{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--pce-suave);font-weight:600}
.passo>small{font-size:13px;color:var(--pce-suave)}
.passo{display:flex;flex-direction:column;gap:10px}
.passo h2{margin:0;font-size:15px;color:var(--pce-secundaria);display:flex;gap:10px;align-items:baseline}
.passo h2 span{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:var(--pce-primaria);color:#fff;font-size:13px}
.tabela{overflow-x:auto;background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px}
.tabela table{min-width:760px}
.opc{display:inline-block;background:var(--pce-cabecalho);color:var(--pce-primaria);border-radius:4px;padding:0 6px;font-size:13px;font-weight:600;margin-left:4px}
.sub{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:6px;font-size:13px}
.sub.perda{background:var(--pce-alerta-fundo);border-radius:6px;padding:6px 8px}
.sub.nao{background:#fff3d6;border-radius:6px;padding:6px 8px}
.sub select{font-family:inherit}
.sub input{padding:4px 8px;font-size:13px}
input[type=time]{padding:4px 6px;font:inherit}
.chip{display:inline-block;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:700;white-space:nowrap}
.chip.ok{background:#dff3e6;color:#1e6b3a}.chip.pend{background:var(--pce-alerta);color:#fff}.chip.info{background:var(--pce-cabecalho);color:var(--pce-suave)}
.cuidados{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:8px}
.cuidado{display:flex;gap:8px;align-items:center;background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:6px;padding:8px 10px}
.cuidado input[type=text]{flex:1;min-width:0;padding:4px 8px;font-size:13px}
.cuidado label{flex:1.3;display:flex;gap:8px;align-items:center}
.cuidado input[type=checkbox]{width:18px;height:18px;accent-color:var(--pce-primaria)}
.repo{font-size:14px;margin:0;padding-left:18px}
.grade{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}
@media (max-width:860px){.grade{grid-template-columns:1fr}}
.aviso-modelo{font-size:12px;color:var(--pce-suave)}
td.n{font-weight:600;white-space:nowrap;font-variant-numeric:tabular-nums}
`;

interface LinhaMaterial {
  chave: string;
  secao: string;
  item: ItemChecklist;
}

/**
 * <prescricao-enfermagem-carro>
 *
 * Prescrição / conferência / liberação da enfermagem após a parada.
 * REGRA: só pode ser iniciada depois que a prescrição médica foi finalizada.
 *
 * Atributos: enfermeiro, coren, servidor, token, canal, endpoint, numero-carro.
 * Propriedades: prescricaoMedica, checklist, enviar, configurar(cfg).
 * Eventos: enfermagem-liberada (cancelável; detail { enfermagem, reposicao }), enfermagem-enviada, enfermagem-erro, enfermagem-bloqueada.
 */
export class PrescricaoEnfermagemElement extends HTMLElement {
  enviar: FuncaoEnvioEnfermagem | null = null;

  private root: ShadowRoot;
  private _medica: PrescricaoCarroEmergencia | null = null;
  private _checklist: Checklist = CHECKLIST_PADRAO;
  private _cfg: ConfigGHosp | null = null;
  private fila: PrescricaoCarroEmergencia[] = [];
  private checagem: ChecagemItem[] = [];
  private materiais = new Map<string, LinhaUso[]>();
  private linhasMat: LinhaMaterial[] = [];
  private cuidados: { descricao: string; frequencia: string; marcado: boolean }[] = [];
  private liberada = false;
  private bloqueioMsg = "";
  private canal: BroadcastChannel | null = null;
  private parar: (() => void) | null = null;
  private pararAcomp: (() => void) | null = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.root.addEventListener("click", (e) => this.aoClicar(e));
    this.root.addEventListener("change", (e) => this.aoMudar(e));
    this.root.addEventListener("input", (e) => this.aoDigitar(e));
  }

  // ---------------------------------------------------------------- ciclo de vida
  connectedCallback(): void {
    const ep = this.getAttribute("endpoint");
    if (ep && !this._cfg) this._cfg = { endpoint: ep };
    this.renderizar();
    const nome = this.getAttribute("canal") ?? CANAL_PADRAO;
    if (nome !== "off" && typeof BroadcastChannel !== "undefined") {
      this.canal = new BroadcastChannel(nome);
      this.canal.onmessage = (ev) => {
        const p = ev.data?.prescricao as PrescricaoCarroEmergencia | undefined;
        if (ev.data?.tipo === "prescricao" && p?.etapa === "MEDICA") this.receber(p);
      };
    }
    const cli = this.cliente;
    if (cli) {
      void cli.listar(["AGUARDANDO_ENFERMAGEM", "EM_ENFERMAGEM"]).then((regs) =>
        regs
          .sort((a, b) => a.recebidaEm.localeCompare(b.recebidaEm))
          .filter((r) => r.status === "AGUARDANDO_ENFERMAGEM" || r.enfermeiro === this.nomeEnfermeiro)
          .forEach((r) => this.receber(r.prescricaoMedica ?? r.prescricao)),
      );
      this.parar = cli.ouvir((evento, dados) => {
        const id = dados?.prescricaoMedica?.id ?? dados?.prescricao?.id;
        if (evento === "prescricao-medica-finalizada") this.receber(dados.prescricaoMedica ?? dados.prescricao);
        else if ((evento === "enfermagem-iniciada" && dados.enfermeiro !== this.nomeEnfermeiro) || evento === "enfermagem-liberada") {
          if (this.fila.some((f) => f.id === id)) {
            this.fila = this.fila.filter((f) => f.id !== id);
            if (!this._medica) this.renderizar();
          }
        }
      });
    }
  }

  disconnectedCallback(): void {
    this.canal?.close();
    this.parar?.();
    this.pararAcomp?.();
  }

  // ---------------------------------------------------------------- API pública
  get prescricaoMedica(): PrescricaoCarroEmergencia | null {
    return this._medica;
  }

  /** Carrega a prescrição médica. Se ela não estiver finalizada, a tela continua bloqueada. */
  set prescricaoMedica(p: PrescricaoCarroEmergencia | null) {
    if (p && !medicaFinalizada(p)) {
      this._medica = null;
      this.bloqueioMsg = "A prescrição médica recebida ainda não foi finalizada.";
      this.emitir("enfermagem-bloqueada", { prescricao: p, motivo: REGRA_BLOQUEIO });
      this.renderizar();
      return;
    }
    this._medica = p;
    this.bloqueioMsg = "";
    this.fila = this.fila.filter((f) => f.id !== p?.id);
    this.checagem = p ? checagemInicial(p) : [];
    this.materiais.clear();
    this.cuidados = CUIDADOS_PADRAO.map((c) => ({ ...c, marcado: true }));
    this.liberada = false;
    this.pararAcomp?.();
    this.renderizar();
  }

  get checklist(): Checklist {
    return this._checklist;
  }
  set checklist(c: Checklist) {
    this._checklist = c;
    if (this.isConnected) this.renderizar();
  }

  configurar(cfg: ConfigGHosp): void {
    this._cfg = cfg;
  }

  /** Recebe uma prescrição médica finalizada (fila) — carrega na hora se não houver outra aberta. */
  receber(p: PrescricaoCarroEmergencia): void {
    if (!medicaFinalizada(p)) return;
    if (this._medica?.id === p.id || this.fila.some((f) => f.id === p.id)) return;
    this.fila.push(p);
    if (!this._medica || this.liberada) this.renderizar();
    else this.avisar(`Nova prescrição médica finalizada na fila (${p.contexto?.paciente ?? "paciente"}).`, "");
  }

  /** Abre uma prescrição da fila; com o serviço, reserva para este enfermeiro. */
  async abrir(p: PrescricaoCarroEmergencia): Promise<boolean> {
    const cli = this.cliente;
    const nome = this.nomeEnfermeiro;
    if (cli && nome) {
      try {
        const r = await cli.iniciarEnfermagem(p.id, nome);
        if (!r.ok) {
          this.fila = this.fila.filter((f) => f.id !== p.id);
          this.bloqueioMsg = r.mensagem ?? "Não foi possível iniciar a prescrição de enfermagem.";
          this.renderizar();
          return false;
        }
      } catch {
        /* serviço fora do ar: segue localmente; o servidor valida de novo na liberação */
      }
    }
    this.prescricaoMedica = p;
    return true;
  }

  obterPrescricaoEnfermagem(): PrescricaoEnfermagem {
    const m = this._medica;
    if (!m) throw new Error(REGRA_BLOQUEIO);
    const materiais: ItemPrescricao[] = [];
    for (const l of this.linhasMat)
      for (const u of this.materiais.get(l.chave) ?? [])
        materiais.push({
          secao: l.secao, codigo: l.item.codigo ?? null, descricao: l.item.descricao, opcao: u.opcao || null,
          quantidade: u.quantidade, unidade: l.item.unidade ?? "und", quantitativoPrevisto: l.item.maximo,
        });
    const v = (id: string) => (this.root.getElementById(id) as HTMLInputElement | null)?.value.trim() ?? "";
    return {
      tipo: "PRESCRICAO_ENFERMAGEM_CARRO",
      versao: 1,
      id: novoId(),
      prescricaoMedicaId: m.id,
      dataHora: new Date().toISOString(),
      enfermeiro: this.nomeEnfermeiro,
      coren: this.getAttribute("coren") ?? (v("coren") || null),
      numeroCarro: v("numeroCarro"),
      lacreRompido: v("lacreRompido"),
      lacreNovo: v("lacreNovo") || null,
      checagem: this.checagem.map((c) => ({ ...c })),
      materiais,
      cuidados: this.cuidados.filter((c) => c.marcado && c.descricao.trim()).map((c) => ({ descricao: c.descricao.trim(), frequencia: c.frequencia.trim() || null })),
      justificativa: v("justificativa") || null,
    };
  }

  async liberar(): Promise<void> {
    const msg = this.$("#msgFim");
    msg.className = "msg";
    const m = this._medica;
    if (!m) return;
    const e = this.obterPrescricaoEnfermagem();
    const erros = validarEnfermagem(e, m, this._checklist);
    if (erros.length) {
      msg.textContent = erros.join(" ");
      msg.classList.add("erro");
      return;
    }
    const reposicao = montarReposicao(m, e);
    const continuar = this.dispatchEvent(
      new CustomEvent("enfermagem-liberada", { detail: { enfermagem: e, reposicao }, bubbles: true, composed: true, cancelable: true }),
    );
    let status = "Liberação entregue ao G-HOSP.";
    if (continuar) {
      const envio: FuncaoEnvioEnfermagem | null =
        this.enviar ??
        (this._cfg?.endpoint ? (x) => criarEnvioHttp<PrescricaoEnfermagem>(this._cfg!)(x) : null) ??
        (this.cliente ? (x) => this.cliente!.liberarEnfermagem(x) : null);
      if (!envio) status = "Envio ao G-HOSP não configurado. A farmácia deste computador foi avisada.";
      else {
        const b = this.$<HTMLButtonElement>("#liberar");
        b.disabled = true;
        b.textContent = "Liberando…";
        try {
          const r = await envio(e, reposicao);
          if (!r.enviado) {
            msg.textContent = `Não foi possível liberar${r.status ? ` (código ${r.status})` : ""}. ${r.mensagem ?? "Tente de novo."}`;
            msg.classList.add("erro");
            this.emitir("enfermagem-erro", { enfermagem: e, erro: r });
            b.disabled = false;
            b.textContent = "Liberar para a farmácia";
            return;
          }
          status = r.mensagem ?? "Liberado para a farmácia.";
          this.emitir("enfermagem-enviada", { enfermagem: e, reposicao, resultado: r });
        } catch (err) {
          msg.textContent = "Não foi possível conectar ao serviço. Verifique a rede e tente de novo.";
          msg.classList.add("erro");
          this.emitir("enfermagem-erro", { enfermagem: e, erro: err });
          b.disabled = false;
          b.textContent = "Liberar para a farmácia";
          return;
        }
      }
    }
    // Sem serviço, avisa a farmácia aberta neste navegador.
    if (!this.cliente) {
      try {
        this.canal?.postMessage({ tipo: "prescricao", prescricao: reposicao });
      } catch {
        /* sem canal */
      }
    }
    this.liberada = true;
    this.mostrarResultado(e, reposicao, status);
  }

  // ---------------------------------------------------------------- internos
  private get cliente(): ClienteServico | null {
    const s = this.getAttribute("servidor");
    return s !== null ? new ClienteServico(s, this.getAttribute("token")) : null;
  }

  private get nomeEnfermeiro(): string {
    return (this.getAttribute("enfermeiro") ?? (this.root.getElementById("enfermeiro") as HTMLInputElement | null)?.value ?? "").trim();
  }

  private $<T extends Element = HTMLElement>(sel: string): T {
    return this.root.querySelector(sel) as T;
  }

  private emitir(nome: string, detail: unknown): void {
    this.dispatchEvent(new CustomEvent(nome, { detail, bubbles: true, composed: true }));
  }

  private avisar(t: string, tipo: "" | "erro"): void {
    const el = this.$("#msgFim") ?? this.$("#msgBloq");
    if (el) {
      el.textContent = t;
      el.className = `msg${tipo ? " " + tipo : ""}`;
    }
  }

  // ---------------------------------------------------------------- renderização
  private renderizar(): void {
    const m = this._medica;
    const corpo = m ? this.htmlAberto(m) : this.htmlBloqueado();
    this.root.innerHTML = `<style>${ESTILOS}${EXTRA}</style>
      <div class="wrap">
        <div class="topo"><h1>Prescrição de Enfermagem · Pós-parada</h1></div>
        ${corpo}
      </div>`;
    if (m) {
      this.checagem.forEach((_, i) => this.renderizarChecagem(i));
      this.linhasMat.forEach((l) => this.renderizarMaterial(l));
      this.atualizarResumo();
    }
  }

  private htmlBloqueado(): string {
    const fila = this.fila
      .map(
        (p) => `<button type="button" data-acao="abrir" data-id="${esc(p.id)}">
          <strong>${esc(p.contexto?.paciente ?? "Paciente")}</strong>
          <span>${p.itens.length} ${p.itens.length === 1 ? "medicamento" : "medicamentos"} · Dr(a). ${esc(p.medico ?? p.contexto?.prescritor ?? "—")} · finalizada ${dataBr(p.finalizadaEm)}</span></button>`,
      )
      .join("");
    return `<div class="bloqueio" role="status">
      <strong>🔒 Aguardando a finalização da prescrição médica</strong>
      <div class="regra">${REGRA_BLOQUEIO}</div>
      ${this.bloqueioMsg ? `<span class="msg erro">${esc(this.bloqueioMsg)}</span>` : ""}
      ${fila ? `<small>Prescrições médicas finalizadas, prontas para a enfermagem:</small><div class="fila">${fila}</div>`
        : `<span class="msg" id="msgBloq">Nenhuma prescrição médica finalizada no momento. Ela aparece aqui assim que o médico finalizar.</span>`}
    </div>`;
  }

  private htmlAberto(m: PrescricaoCarroEmergencia): string {
    const c = m.contexto ?? { atendimento: null, paciente: null, prescritor: null, setor: null };
    const meta = [
      ["Paciente", c.paciente], ["Atendimento", c.atendimento], ["Setor", c.setor],
      ["Médico", m.medico ?? c.prescritor], ["Prescrição médica finalizada", dataBr(m.finalizadaEm)],
    ].filter(([, v]) => v).map(([k, v]) => `<div><small>${k}</small><strong>${esc(v)}</strong></div>`).join("");

    // materiais (prescrição de enfermagem)
    this.linhasMat = [];
    const secoes = this._checklist
      .map((sec, si) => {
        if (!SECOES_MATERIAIS.includes(sec.titulo)) return "";
        const trs = sec.itens.map((item, ii) => {
          const chave = `${si}_${ii}`;
          this.linhasMat.push({ chave, secao: sec.titulo, item });
          const dica = item.opcoes ? `<span class="dica">${item.opcoes.map(esc).join(" · ")}</span>` : "";
          return `<tr data-mat="${chave}"><td><label class="item"><input type="checkbox" data-acao="marcar-mat"${this.materiais.has(chave) ? " checked" : ""}><span>${esc(item.descricao)}${dica}</span></label></td>
            <td class="qtd"><div class="linhas" hidden></div></td></tr>`;
        }).join("");
        return `<section><h2>${esc(sec.titulo)}<small>${sec.itens.length} itens</small></h2>
          <table><thead><tr><th>Material</th><th class="dir">Utilizado</th></tr></thead><tbody>${trs}</tbody></table></section>`;
      })
      .filter(Boolean);

    const cuidados = this.cuidados
      .map((cu, k) => `<div class="cuidado"><label><input type="checkbox" data-cui="${k}" data-f="marcado"${cu.marcado ? " checked" : ""}>
          <input type="text" data-cui="${k}" data-f="descricao" value="${esc(cu.descricao)}" aria-label="Cuidado"></label>
          <input type="text" data-cui="${k}" data-f="frequencia" value="${esc(cu.frequencia)}" placeholder="Frequência" aria-label="Frequência"></div>`)
      .join("");

    const enf = this.getAttribute("enfermeiro");
    const coren = this.getAttribute("coren");
    return `
      <div class="card meta">${meta}</div>
      ${m.justificativa ? `<div class="card"><small>Observações médicas</small><div>${esc(m.justificativa)}</div></div>` : ""}

      <div class="passo">
        <h2><span>1</span>Checagem da prescrição médica</h2>
        <small>Confirme o que foi administrado. Registre perdas (quebra, diluído e não utilizado) e o motivo do que não foi administrado.</small>
        <div class="tabela"><table>
          <thead><tr><th>Medicamento</th><th>Prescrito</th><th>Administrado</th><th>Horário</th><th>Ocorrências</th><th>Situação</th></tr></thead>
          <tbody>${this.checagem.map((_, i) => `<tr id="c${i}"></tr>`).join("")}</tbody>
        </table></div>
      </div>

      <div class="passo">
        <h2><span>2</span>Materiais utilizados</h2>
        <small>Prescrição de enfermagem dos materiais usados na parada. A quantidade não passa do check list.</small>
        <div class="grade">${secoes.join("")}</div>
      </div>

      <div class="passo">
        <h2><span>3</span>Cuidados de enfermagem pós-PCR</h2>
        <span class="aviso-modelo">Lista modelo: ajuste ao protocolo institucional. Desmarque o que não se aplica.</span>
        <div class="cuidados">${cuidados}</div>
        <div><button type="button" class="mini add" data-acao="add-cuidado">+ cuidado</button></div>
      </div>

      <div class="passo">
        <h2><span>4</span>Liberação para a farmácia</h2>
        <div class="campos">
          <label for="numeroCarro">Número do carro de parada<input id="numeroCarro" type="text" inputmode="numeric" value="${esc(this.getAttribute("numero-carro") ?? m.numeroCarro ?? "")}"></label>
          <label for="lacreRompido">Lacre rompido<input id="lacreRompido" type="text" inputmode="numeric"></label>
          <label for="lacreNovo">Lacre novo<input id="lacreNovo" type="text" inputmode="numeric"></label>
          ${enf ? `<label>Enfermeiro<input type="text" value="${esc(enf)}" disabled></label>` : `<label for="enfermeiro">Enfermeiro<input id="enfermeiro" type="text"></label>`}
          ${coren ? `<label>COREN<input type="text" value="${esc(coren)}" disabled></label>` : `<label for="coren">COREN<input id="coren" type="text"></label>`}
        </div>
        <div class="just"><label for="justificativa">Justificativa / observações da enfermagem</label>
          <small>As perdas e os itens não administrados informados na checagem entram automaticamente.</small>
          <textarea id="justificativa" placeholder="Opcional"></textarea></div>
        <div class="card"><small>Vai para a farmácia repor</small><ul class="repo" id="repo"></ul></div>
        <div class="gerar">
          <span class="msg" id="msgFim" aria-live="polite">Revise a checagem e libere para a farmácia.</span>
          <button class="primario grande" id="liberar" type="button" data-acao="liberar">Liberar para a farmácia</button>
        </div>
        <section class="rx" id="resultado" hidden></section>
      </div>`;
  }

  private renderizarChecagem(i: number): void {
    const c = this.checagem[i];
    const tr = this.$(`#c${i}`);
    if (!tr) return;
    const max = itemDoChecklist(c.descricao, this._checklist)?.maximo ?? c.prescrito;
    const outros = this.checagem.reduce((s, x, j) => (j !== i && x.descricao === c.descricao ? s + consumo(x) : s), 0);
    const maxPerda = Math.max(1, max - outros - c.administrado);
    const falta = c.prescrito - c.administrado;
    const ok = (falta === 0 || !!c.naoAdministrado?.motivo) && (!c.perda || !!c.perda.motivo);
    const nao = falta > 0
      ? `<div class="sub nao">Não administrado: ${falta} ${c.unidade} ·
          <select data-i="${i}" data-f="nao-motivo" aria-label="Motivo de não administrar"><option value="">Motivo…</option>${Object.entries(TEXTO_NAO_ADMINISTRADO)
            .map(([k, v]) => `<option value="${k}"${c.naoAdministrado?.motivo === k ? " selected" : ""}>${v}</option>`).join("")}</select>
          <input data-i="${i}" data-f="nao-obs" value="${esc(c.naoAdministrado?.observacao ?? "")}" placeholder="Observação" aria-label="Observação"></div>`
      : "";
    const perda = c.perda
      ? `<div class="sub perda">Perda:
          <select data-i="${i}" data-f="perda-qtd" aria-label="Quantidade perdida">${opcoesNum(1, maxPerda, c.perda.quantidade)}</select> ${c.unidade} ·
          <select data-i="${i}" data-f="perda-motivo" aria-label="Motivo da perda"><option value="">Motivo…</option>${Object.entries(TEXTO_PERDA)
            .map(([k, v]) => `<option value="${k}"${c.perda!.motivo === k ? " selected" : ""}>${v}</option>`).join("")}</select>
          <input data-i="${i}" data-f="perda-obs" value="${esc(c.perda.observacao ?? "")}" placeholder="Observação" aria-label="Observação da perda">
          <button type="button" class="mini" data-acao="rem-perda" data-i="${i}" aria-label="Remover perda">✕</button></div>`
      : "";
    tr.innerHTML = `<td>${esc(c.descricao)}${c.opcao ? `<span class="opc">${esc(c.opcao)}</span>` : ""}</td>
      <td class="n">${String(c.prescrito).padStart(2, "0")} ${c.unidade}</td>
      <td><select data-i="${i}" data-f="adm" aria-label="Quantidade administrada">${opcoesNum(0, c.prescrito, c.administrado)}</select></td>
      <td><input type="time" data-i="${i}" data-f="horario" value="${esc(c.horario ?? "")}" aria-label="Horário"></td>
      <td>${nao}${perda}${c.perda ? "" : `<button type="button" class="mini perigo" data-acao="add-perda" data-i="${i}">+ perda</button>`}</td>
      <td><span class="chip ${ok ? "ok" : "pend"}">${ok ? "Checado" : "Pendente"}</span></td>`;
  }

  private renderizarMaterial(l: LinhaMaterial): void {
    const tr = this.$(`tr[data-mat="${l.chave}"]`);
    if (!tr) return;
    const caixa = tr.querySelector(".linhas") as HTMLElement;
    const linhas = this.materiais.get(l.chave);
    tr.classList.toggle("on", !!linhas);
    caixa.hidden = !linhas;
    if (!linhas) return void (caixa.innerHTML = "");
    const un = l.item.unidade ?? "und";
    caixa.innerHTML =
      linhas.map((u, k) => {
        const ocupadas = new Set(linhas.filter((_, j) => j !== k).map((x) => x.opcao).filter(Boolean));
        const opc = l.item.opcoes
          ? `<select class="opc${u.opcao ? "" : " pend"}" data-mat-f="o" data-k="${k}" aria-label="Opção"><option value="" disabled${u.opcao ? "" : " selected"}>Qual?</option>
              ${l.item.opcoes.filter((o) => !ocupadas.has(o) || o === u.opcao).map((o) => `<option${o === u.opcao ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`
          : "";
        const del = linhas.length > 1 ? `<button type="button" class="mini" data-acao="del-mat" data-k="${k}" aria-label="Remover">✕</button>` : "";
        return `<div class="linha">${opc}<span class="un">${un}</span><select data-mat-f="q" data-k="${k}" aria-label="Quantidade">${opcoesNum(1, limiteDaLinha(l.item, linhas, k), u.quantidade)}</select>${del}</div>`;
      }).join("") +
      (podeAdicionarOpcao(l.item, linhas) ? `<button type="button" class="mini add" data-acao="add-mat">+ outra opção</button>` : "");
  }

  private atualizarResumo(): void {
    const ul = this.$("#repo");
    const m = this._medica;
    if (!ul || !m) return;
    const msg = this.$("#msgFim");
    if (msg?.classList.contains("erro") && !this.liberada) {
      msg.className = "msg";
      msg.textContent = "Revise a checagem e libere para a farmácia.";
    }
    const e = this.obterPrescricaoEnfermagem();
    const r = montarReposicao(m, e);
    ul.innerHTML = r.itens.length
      ? r.itens.map((i) => `<li>${String(i.quantidade).padStart(2, "0")} ${i.unidade} · ${esc(nomeItem(i.descricao, i.opcao))}</li>`).join("")
      : "<li>Nada a repor.</li>";
  }

  private mostrarResultado(e: PrescricaoEnfermagem, r: PrescricaoCarroEmergencia, status: string): void {
    this.root.querySelectorAll<HTMLInputElement>(".passo input, .passo select, .passo textarea, .passo button[data-acao]").forEach((el) => (el.disabled = true));
    const el = this.$<HTMLElement>("#resultado");
    el.hidden = false;
    el.innerHTML = `<h2>Liberado para a farmácia</h2>
      <div class="bloco">Carro nº ${esc(e.numeroCarro)} · lacre rompido ${esc(e.lacreRompido)}${e.lacreNovo ? ` · lacre novo ${esc(e.lacreNovo)}` : ""} · ${esc(e.enfermeiro)}${e.coren ? ` (COREN ${esc(e.coren)})` : ""}</div>
      <div class="bloco">${r.itens.length} ${r.itens.length === 1 ? "item" : "itens"} para repor · ${e.cuidados.length} cuidados prescritos</div>
      <div class="bloco status">${esc(status)}</div>
      <div class="bloco" id="acomp" hidden></div>
      <div class="bloco"><button type="button" class="primario" data-acao="copiar-termo">Copiar prescrição de enfermagem</button>
        <button type="button" data-acao="copiar-json">Copiar dados (JSON)</button>
        <button type="button" data-acao="proxima">${this.fila.length ? "Próxima prescrição médica" : "Voltar à fila"}</button></div>`;
    (el as HTMLElement & { _d?: unknown })._d = { e, r };
    el.querySelectorAll("button").forEach((b) => (b.disabled = false));
    el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    this.acompanhar(r.id);
  }

  private acompanhar(id: string): void {
    const cli = this.cliente;
    const el = this.$<HTMLElement>("#acomp");
    if (!cli || !el) return;
    const mostrar = (t: string) => ((el.hidden = false), (el.innerHTML = `<strong>Farmácia:</strong> ${t}`));
    mostrar(ROTULO_FLUXO.AGUARDANDO_FARMACIA);
    this.pararAcomp?.();
    const reler = async () => {
      const reg = await cli.obter(id);
      if (!reg) return;
      mostrar(`${ROTULO_FLUXO[reg.status]}${reg.status === "EM_CONFERENCIA" && reg.farmaceutico ? ` por ${esc(reg.farmaceutico)}` : ""}`);
    };
    this.pararAcomp = cli.ouvir((ev, d) => {
      const reg = ev === "conferencia-concluida" ? d.registro : d;
      if (reg?.prescricao?.id !== id) return;
      if (ev === "conferencia-iniciada") mostrar(`${ROTULO_FLUXO.EM_CONFERENCIA} por ${esc(reg.farmaceutico)}`);
      if (ev === "conferencia-concluida") mostrar(`${ROTULO_FLUXO[reg.status as keyof typeof ROTULO_FLUXO]} · lacre ${esc(d.conferencia?.lacreAplicado ?? "—")}`);
    }, () => void reler());
  }

  // ---------------------------------------------------------------- eventos
  private aoClicar(ev: Event): void {
    const b = (ev.target as Element).closest("button[data-acao]") as HTMLButtonElement | null;
    if (!b) return;
    const i = Number(b.dataset.i);
    const tr = b.closest("tr[data-mat]") as HTMLElement | null;
    const lm = tr ? this.linhasMat.find((l) => l.chave === tr.dataset.mat) : undefined;
    switch (b.dataset.acao) {
      case "abrir": {
        const p = this.fila.find((f) => f.id === b.dataset.id);
        if (p) void this.abrir(p);
        return;
      }
      case "proxima":
        this._medica = null;
        this.liberada = false;
        this.pararAcomp?.();
        this.renderizar();
        return;
      case "add-perda":
        this.checagem[i].perda = { quantidade: 1, motivo: "" as MotivoPerda, observacao: null };
        break;
      case "rem-perda":
        this.checagem[i].perda = null;
        break;
      case "add-mat":
        if (lm) this.materiais.set(lm.chave, normalizarLinhas(lm.item, [...this.materiais.get(lm.chave)!, { opcao: "", quantidade: 1 }]));
        if (lm) this.renderizarMaterial(lm);
        return void this.atualizarResumo();
      case "del-mat":
        if (lm) {
          const ls = this.materiais.get(lm.chave)!;
          ls.splice(Number(b.dataset.k), 1);
          this.materiais.set(lm.chave, normalizarLinhas(lm.item, ls));
          this.renderizarMaterial(lm);
        }
        return void this.atualizarResumo();
      case "add-cuidado":
        this.cuidados.push({ descricao: "", frequencia: "", marcado: true });
        this.renderizar();
        [...this.root.querySelectorAll<HTMLInputElement>('input[data-f="descricao"]')].pop()?.focus();
        return;
      case "liberar":
        return void this.liberar();
      case "copiar-termo":
      case "copiar-json": {
        const d = (this.$("#resultado") as HTMLElement & { _d?: { e: PrescricaoEnfermagem; r: PrescricaoCarroEmergencia } })._d;
        if (!d) return;
        const txt = b.dataset.acao === "copiar-json" ? JSON.stringify(d, null, 2) : textoPrescricaoEnfermagem(d.e, d.r);
        const rot = b.textContent;
        navigator.clipboard.writeText(txt).then(() => (b.textContent = "Copiado"), () => (b.textContent = "Não foi possível copiar"));
        setTimeout(() => (b.textContent = rot), 2000);
        return;
      }
      default:
        return;
    }
    this.renderizarChecagem(i);
    this.atualizarResumo();
  }

  private aoMudar(ev: Event): void {
    const t = ev.target as HTMLInputElement | HTMLSelectElement;
    // materiais
    const tr = t.closest("tr[data-mat]") as HTMLElement | null;
    if (tr) {
      const l = this.linhasMat.find((x) => x.chave === tr.dataset.mat)!;
      if (t.dataset.acao === "marcar-mat") {
        if ((t as HTMLInputElement).checked) this.materiais.set(l.chave, [{ opcao: l.item.opcoes ? "" : null, quantidade: 1 }]);
        else this.materiais.delete(l.chave);
      } else if (t.dataset.matF) {
        const ls = this.materiais.get(l.chave)!;
        const k = Number(t.dataset.k);
        if (t.dataset.matF === "q") ls[k].quantidade = Number(t.value);
        else ls[k].opcao = t.value;
        this.materiais.set(l.chave, normalizarLinhas(l.item, ls));
      } else return;
      this.renderizarMaterial(l);
      return this.atualizarResumo();
    }
    // cuidados
    if (t.dataset.cui !== undefined && t.dataset.f === "marcado") {
      this.cuidados[Number(t.dataset.cui)].marcado = (t as HTMLInputElement).checked;
      return;
    }
    // checagem
    const i = Number(t.dataset.i);
    const c = this.checagem[i];
    if (!c) return;
    switch (t.dataset.f) {
      case "adm":
        c.administrado = Number(t.value);
        if (c.administrado === c.prescrito) c.naoAdministrado = null;
        else c.naoAdministrado ??= { motivo: "" as MotivoNaoAdministrado, observacao: null };
        break;
      case "horario":
        c.horario = t.value || null;
        return;
      case "nao-motivo":
        c.naoAdministrado = { motivo: t.value as MotivoNaoAdministrado, observacao: c.naoAdministrado?.observacao ?? null };
        break;
      case "perda-qtd":
        if (c.perda) c.perda.quantidade = Number(t.value);
        break;
      case "perda-motivo":
        if (c.perda) c.perda.motivo = t.value as MotivoPerda;
        break;
      default:
        return;
    }
    this.renderizarChecagem(i);
    this.atualizarResumo();
  }

  private aoDigitar(ev: Event): void {
    const t = ev.target as HTMLInputElement;
    if (t.dataset.cui !== undefined && (t.dataset.f === "descricao" || t.dataset.f === "frequencia")) {
      this.cuidados[Number(t.dataset.cui)][t.dataset.f as "descricao" | "frequencia"] = t.value;
      return;
    }
    const c = this.checagem[Number(t.dataset.i)];
    if (!c) return;
    if (t.dataset.f === "nao-obs" && c.naoAdministrado) c.naoAdministrado.observacao = t.value || null;
    if (t.dataset.f === "perda-obs" && c.perda) c.perda.observacao = t.value || null;
    if (t.dataset.f === "nao-obs" || t.dataset.f === "perda-obs") this.atualizarResumo();
  }
}

/** Texto da prescrição de enfermagem (para colar no prontuário). */
export function textoPrescricaoEnfermagem(e: PrescricaoEnfermagem, r: PrescricaoCarroEmergencia): string {
  let t = `PRESCRIÇÃO DE ENFERMAGEM — PÓS-PARADA\nCarro de parada nº ${e.numeroCarro} · ${dataBr(e.dataHora)}\n`;
  t += `Enfermeiro: ${e.enfermeiro}${e.coren ? ` (COREN ${e.coren})` : ""} · Lacre rompido: ${e.lacreRompido} · Lacre novo: ${e.lacreNovo ?? "—"}\n`;
  if (r.contexto?.paciente) t += `Paciente: ${r.contexto.paciente}${r.contexto.atendimento ? ` · Atendimento ${r.contexto.atendimento}` : ""}\n`;
  t += `\nCHECAGEM DA PRESCRIÇÃO MÉDICA (${r.medico ?? "médico"}, finalizada ${dataBr(r.finalizadaEm)})\n`;
  for (const c of e.checagem) {
    t += `  ${nomeItem(c.descricao, c.opcao)}: administrado ${c.administrado}/${c.prescrito} ${c.unidade}${c.horario ? ` às ${c.horario}` : ""}`;
    if (c.naoAdministrado) t += ` · não administrado: ${TEXTO_NAO_ADMINISTRADO[c.naoAdministrado.motivo] ?? "—"}`;
    if (c.perda) t += ` · perda ${c.perda.quantidade}: ${TEXTO_PERDA[c.perda.motivo] ?? "—"}`;
    t += "\n";
  }
  if (e.materiais.length) {
    t += `\nMATERIAIS\n`;
    for (const m of e.materiais) t += `  ${String(m.quantidade).padStart(2, "0")} ${m.unidade.padEnd(4)} ${nomeItem(m.descricao, m.opcao)}\n`;
  }
  if (e.cuidados.length) {
    t += `\nCUIDADOS DE ENFERMAGEM\n`;
    for (const c of e.cuidados) t += `  [ ] ${c.descricao}${c.frequencia ? ` — ${c.frequencia}` : ""}\n`;
  }
  t += `\nREPOSIÇÃO SOLICITADA À FARMÁCIA\n`;
  for (const i of r.itens) t += `  ${String(i.quantidade).padStart(2, "0")} ${i.unidade.padEnd(4)} ${nomeItem(i.descricao, i.opcao)}\n`;
  if (r.justificativa) t += `\nObservações: ${r.justificativa}\n`;
  return t.trimEnd();
}

if (!customElements.get("prescricao-enfermagem-carro")) customElements.define("prescricao-enfermagem-carro", PrescricaoEnfermagemElement);

declare global {
  interface HTMLElementTagNameMap {
    "prescricao-enfermagem-carro": PrescricaoEnfermagemElement;
  }
}
