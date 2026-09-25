import { ESTILOS } from "./estilos.js";
import { ClienteServico, ROTULO_FLUXO } from "./integracao.js";
import type { Indicadores, RegistroFluxo, RequisicaoCompra, StatusFluxo } from "./types.js";

const esc = (s: unknown): string =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const hora = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";

const decorrido = (desde: string, ate: string | null) => {
  const min = Math.max(0, Math.round(((ate ? Date.parse(ate) : Date.now()) - Date.parse(desde)) / 60_000));
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`;
};

const COR: Record<StatusFluxo, string> = {
  AGUARDANDO_FARMACIA: "PENDENTE",
  EM_CONFERENCIA: "PARCIAL",
  CONFORME: "CONFERIDO",
  COM_PENDENCIAS: "FALTA",
};

const EXTRA = /* css */ `
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.kpi{background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px;padding:12px 14px;display:flex;flex-direction:column;gap:2px}
.kpi small{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--pce-suave);font-weight:600}
.kpi strong{font-size:26px;font-variant-numeric:tabular-nums;color:var(--pce-secundaria)}
.kpi.alerta{border-color:var(--pce-alerta);background:var(--pce-alerta-fundo)}
.kpi.alerta strong{color:var(--pce-alerta)}
.tabela{overflow-x:auto;background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px}
.tabela table{min-width:720px}
td.n{font-variant-numeric:tabular-nums;white-space:nowrap}
.chip{display:inline-block;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:700;white-space:nowrap}
.chip.PENDENTE{background:var(--pce-cabecalho);color:var(--pce-suave)}
.chip.PARCIAL{background:#fff3d6;color:#8a5a00}
.chip.CONFERIDO{background:#dff3e6;color:#1e6b3a}
.chip.FALTA{background:var(--pce-alerta-fundo);color:var(--pce-alerta)}
.atraso{color:var(--pce-alerta);font-weight:700}
tr.atrasada td:first-child{box-shadow:inset 4px 0 0 var(--pce-alerta)}
.ao-vivo{font-size:13px;color:var(--pce-suave)}
.ao-vivo::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:#1e8a4c;margin-right:6px}
.ao-vivo.off::before{background:var(--pce-alerta)}
.sec{display:block;font-size:12px;color:var(--pce-suave)}
h2.sub{margin:0;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--pce-secundaria)}
`;

/**
 * <painel-carro-emergencia servidor="...">
 * Acompanhamento em tempo real do fluxo prescrição → farmácia: fila, prazos (SLA),
 * tempo médio de reposição e requisições de compra abertas pelas faltas.
 */
export class PainelCarroEmergenciaElement extends HTMLElement {
  private root: ShadowRoot;
  private parar: (() => void) | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private regs: RegistroFluxo[] = [];
  private ind: Indicadores | null = null;
  private reqs: RequisicaoCompra[] = [];
  private conectado = false;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.root.addEventListener("click", (e) => {
      const b = (e.target as Element).closest("button[data-req]") as HTMLButtonElement | null;
      if (b && this.cliente) void this.cliente.atenderRequisicao(b.dataset.req!).then(() => this.atualizar());
    });
  }

  private get cliente(): ClienteServico | null {
    const s = this.getAttribute("servidor");
    return s !== null ? new ClienteServico(s, this.getAttribute("token")) : null;
  }

  connectedCallback(): void {
    this.renderizar();
    void this.atualizar();
    this.parar = this.cliente?.ouvir(() => void this.atualizar()) ?? null;
    this.timer = setInterval(() => void this.atualizar(), 30_000);
  }

  disconnectedCallback(): void {
    this.parar?.();
    if (this.timer) clearInterval(this.timer);
  }

  async atualizar(): Promise<void> {
    const c = this.cliente;
    if (!c) return;
    try {
      [this.regs, this.ind, this.reqs] = await Promise.all([c.listar(undefined, 50), c.indicadores(), c.requisicoes("ABERTA")]);
      this.conectado = this.ind !== null;
    } catch {
      this.conectado = false;
    }
    this.renderizar();
  }

  private renderizar(): void {
    const i = this.ind;
    const kpi = (rot: string, v: string | number, alerta = false) =>
      `<div class="kpi${alerta ? " alerta" : ""}"><small>${rot}</small><strong>${v}</strong></div>`;
    const linhas = this.regs
      .map((r) => {
        const p = r.prescricao;
        const aberta = r.status === "AGUARDANDO_FARMACIA" || r.status === "EM_CONFERENCIA";
        return `<tr class="${r.atrasada && aberta ? "atrasada" : ""}">
          <td><span class="chip ${COR[r.status]}">${ROTULO_FLUXO[r.status]}</span></td>
          <td class="n">nº ${esc(p.numeroCarro)}</td>
          <td>${esc(p.contexto?.paciente ?? "—")}<span class="sec">${esc(p.contexto?.setor ?? "")}</span></td>
          <td class="n">${p.itens.length} ${p.itens.length === 1 ? "item" : "itens"}</td>
          <td class="n">${hora(r.recebidaEm)}</td>
          <td class="n ${r.atrasada && aberta ? "atraso" : ""}">${decorrido(r.recebidaEm, r.concluidaEm)}${r.atrasada && aberta ? " · atrasada" : ""}</td>
          <td>${esc(r.farmaceutico ?? "—")}</td></tr>`;
      })
      .join("");
    const reqs = this.reqs
      .map(
        (q) => `<tr><td>${esc(q.descricao)}${q.opcao ? " — " + esc(q.opcao) : ""}</td><td class="n">${q.quantidade} ${q.unidade}</td>
          <td class="n">nº ${esc(q.numeroCarro)}</td><td>${esc(q.motivo.replace(/_/g, " ").toLowerCase())}</td><td class="n">${hora(q.em)}</td>
          <td><button type="button" class="mini" data-req="${esc(q.id)}">Marcar atendida</button></td></tr>`,
      )
      .join("");
    this.root.innerHTML = `<style>${ESTILOS}${EXTRA}</style>
      <div class="wrap">
        <div class="topo"><h1>Painel do Carro de Emergência</h1>
          <span class="ao-vivo${this.conectado ? "" : " off"}">${this.conectado ? "Ao vivo" : "Sem conexão com o serviço"}</span></div>
        <div class="kpis">
          ${kpi("Aguardando farmácia", i?.aguardando ?? "—")}
          ${kpi("Em conferência", i?.emConferencia ?? "—")}
          ${kpi(`Atrasadas (> ${i?.slaMinutos ?? "—"} min)`, i?.atrasadas ?? "—", !!i?.atrasadas)}
          ${kpi("Repostas hoje", i?.concluidasHoje ?? "—")}
          ${kpi("Tempo médio até repor", i?.tempoMedioMinutos != null ? `${i.tempoMedioMinutos} min` : "—")}
          ${kpi("Requisições abertas", i?.requisicoesAbertas ?? "—", !!i?.requisicoesAbertas)}
        </div>
        <h2 class="sub">Prescrições recentes</h2>
        <div class="tabela"><table>
          <thead><tr><th>Situação</th><th>Carro</th><th>Paciente</th><th>Itens</th><th>Recebida</th><th>Tempo</th><th>Farmacêutico</th></tr></thead>
          <tbody>${linhas || `<tr><td colspan="7">Nenhuma prescrição ainda.</td></tr>`}</tbody></table></div>
        <h2 class="sub">Requisições de compra abertas (faltas)</h2>
        <div class="tabela"><table>
          <thead><tr><th>Item</th><th>Qtd.</th><th>Carro</th><th>Motivo</th><th>Aberta em</th><th></th></tr></thead>
          <tbody>${reqs || `<tr><td colspan="6">Nenhuma requisição aberta.</td></tr>`}</tbody></table></div>
      </div>`;
  }
}

if (!customElements.get("painel-carro-emergencia")) customElements.define("painel-carro-emergencia", PainelCarroEmergenciaElement);

declare global {
  interface HTMLElementTagNameMap {
    "painel-carro-emergencia": PainelCarroEmergenciaElement;
  }
}
