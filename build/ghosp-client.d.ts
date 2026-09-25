import type { FuncaoEnvio } from "./types.js";
/** Configuração do envio HTTP para a API de prescrições do G-HOSP. */
export interface ConfigGHosp {
    /** URL do endpoint que recebe a prescrição (POST, JSON). */
    endpoint: string;
    /** Cabeçalhos extras (ex.: Authorization, X-CSRF-Token). */
    headers?: Record<string, string>;
    /** Envia cookies de sessão do G-HOSP junto (padrão: true). */
    usarCookies?: boolean;
    /** Tempo máximo de espera em ms (padrão: 15000). */
    timeoutMs?: number;
}
/**
 * Cria a função de envio padrão via HTTP.
 * Espera que o G-HOSP responda 2xx e, opcionalmente, um JSON { idPrescricao, mensagem }.
 */
export declare function criarEnvioHttp(cfg: ConfigGHosp): FuncaoEnvio;
