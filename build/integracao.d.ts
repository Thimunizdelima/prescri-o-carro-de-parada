import type { ConferenciaReposicao, Indicadores, NomeEvento, PrescricaoCarroEmergencia, RegistroFluxo, RequisicaoCompra, ResultadoEnvio, StatusFluxo } from "./types.js";
export declare const ROTULO_FLUXO: Record<StatusFluxo, string>;
/** Cliente do serviço de integração (servidor/). Usado pelos três componentes. */
export declare class ClienteServico {
    private base;
    private token;
    constructor(base: string, token?: string | null);
    private pedir;
    private envio;
    enviarPrescricao: (p: PrescricaoCarroEmergencia) => Promise<ResultadoEnvio>;
    enviarConferencia: (c: ConferenciaReposicao) => Promise<ResultadoEnvio>;
    listar(status?: StatusFluxo[], limite?: number): Promise<RegistroFluxo[]>;
    obter(id: string): Promise<RegistroFluxo | null>;
    assumir(id: string, farmaceutico: string): Promise<{
        ok: boolean;
        mensagem?: string;
    }>;
    indicadores(): Promise<Indicadores | null>;
    requisicoes(status?: string): Promise<RequisicaoCompra[]>;
    atenderRequisicao(id: string): Promise<boolean>;
    checklist(): Promise<import("./types.js").Checklist | null>;
    salvarGtin(gtin: string, descricao: string, opcao: string | null): Promise<boolean>;
    /** Assina os eventos em tempo real. Reconecta sozinho. Devolve a função para cancelar. */
    ouvir(fn: (evento: NomeEvento, dados: any) => void, aoConectar?: () => void): () => void;
}
