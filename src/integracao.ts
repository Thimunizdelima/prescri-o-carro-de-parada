import type {
  ConferenciaReposicao,
  Indicadores,
  NomeEvento,
  PrescricaoCarroEmergencia,
  RegistroFluxo,
  RequisicaoCompra,
  ResultadoEnvio,
  StatusFluxo,
} from "./types.js";

export const ROTULO_FLUXO: Record<StatusFluxo, string> = {
  AGUARDANDO_FARMACIA: "Aguardando farmácia",
  EM_CONFERENCIA: "Em conferência",
  CONFORME: "Reposto",
  COM_PENDENCIAS: "Reposto com pendências",
};

/** Cliente do serviço de integração (servidor/). Usado pelos três componentes. */
export class ClienteServico {
  constructor(private base: string, private token: string | null = null) {
    this.base = base.replace(/\/+$/, "");
  }

  private async pedir<T>(metodo: string, caminho: string, corpo?: unknown): Promise<{ ok: boolean; status: number; dados: T }> {
    const r = await fetch(this.base + caminho, {
      method: metodo,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(corpo !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    });
    let dados: T = null as T;
    try {
      dados = await r.json();
    } catch {
      /* sem corpo */
    }
    return { ok: r.ok, status: r.status, dados };
  }

  private async envio(caminho: string, corpo: unknown): Promise<ResultadoEnvio> {
    const r = await this.pedir<{ idPrescricao?: string; mensagem?: string }>("POST", caminho, corpo);
    return { enviado: r.ok, status: r.status, idPrescricao: r.dados?.idPrescricao, mensagem: r.dados?.mensagem };
  }

  enviarPrescricao = (p: PrescricaoCarroEmergencia): Promise<ResultadoEnvio> => this.envio("/api/prescricoes", p);
  enviarConferencia = (c: ConferenciaReposicao): Promise<ResultadoEnvio> => this.envio("/api/conferencias", c);

  async listar(status?: StatusFluxo[], limite = 100): Promise<RegistroFluxo[]> {
    const q = new URLSearchParams({ limite: String(limite), ...(status?.length ? { status: status.join(",") } : {}) });
    const r = await this.pedir<RegistroFluxo[]>("GET", `/api/prescricoes?${q}`);
    return r.ok ? r.dados : [];
  }

  async obter(id: string): Promise<RegistroFluxo | null> {
    const r = await this.pedir<RegistroFluxo>("GET", `/api/prescricoes/${encodeURIComponent(id)}`);
    return r.ok ? r.dados : null;
  }

  async assumir(id: string, farmaceutico: string): Promise<{ ok: boolean; mensagem?: string }> {
    const r = await this.pedir<{ mensagem?: string }>("POST", `/api/prescricoes/${encodeURIComponent(id)}/assumir`, { farmaceutico });
    return { ok: r.ok, mensagem: r.dados?.mensagem };
  }

  async indicadores(): Promise<Indicadores | null> {
    const r = await this.pedir<Indicadores>("GET", "/api/indicadores");
    return r.ok ? r.dados : null;
  }

  async requisicoes(status = "ABERTA"): Promise<RequisicaoCompra[]> {
    const r = await this.pedir<RequisicaoCompra[]>("GET", `/api/requisicoes?status=${status}`);
    return r.ok ? r.dados : [];
  }

  async atenderRequisicao(id: string): Promise<boolean> {
    return (await this.pedir("POST", `/api/requisicoes/${encodeURIComponent(id)}/atender`, {})).ok;
  }

  async checklist(): Promise<import("./types.js").Checklist | null> {
    const r = await this.pedir<import("./types.js").Checklist>("GET", "/api/checklist");
    return r.ok ? r.dados : null;
  }

  async salvarGtin(gtin: string, descricao: string, opcao: string | null): Promise<boolean> {
    return (await this.pedir("POST", "/api/gtins", { gtin, descricao, opcao })).ok;
  }

  /** Assina os eventos em tempo real. Reconecta sozinho. Devolve a função para cancelar. */
  ouvir(fn: (evento: NomeEvento, dados: any) => void, aoConectar?: () => void): () => void {
    if (typeof EventSource === "undefined") return () => {};
    const es = new EventSource(this.base + "/api/eventos", { withCredentials: true });
    // A cada (re)conexão, quem ouve pode reler o estado para não perder eventos do intervalo.
    if (aoConectar) es.onopen = () => aoConectar();
    const nomes: NomeEvento[] = ["prescricao-recebida", "conferencia-iniciada", "conferencia-concluida", "alerta-sla"];
    for (const n of nomes) es.addEventListener(n, (e) => fn(n, JSON.parse((e as MessageEvent).data)));
    return () => es.close();
  }
}
