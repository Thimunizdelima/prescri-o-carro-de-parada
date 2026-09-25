import type { PrescricaoCarroEmergencia, ResultadoEnvio } from "./types.js";

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
 * Cria a função de envio padrão via HTTP (serve para a prescrição e para a conferência).
 * Espera que o G-HOSP responda 2xx e, opcionalmente, um JSON { idPrescricao, mensagem }.
 */
export function criarEnvioHttp<T = PrescricaoCarroEmergencia>(cfg: ConfigGHosp): (corpoEnvio: T) => Promise<ResultadoEnvio> {
  return async (corpoEnvio: T): Promise<ResultadoEnvio> => {
    const controle = new AbortController();
    const timer = setTimeout(() => controle.abort(), cfg.timeoutMs ?? 15000);
    try {
      const resp = await fetch(cfg.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", ...cfg.headers },
        credentials: cfg.usarCookies === false ? "omit" : "include",
        body: JSON.stringify(corpoEnvio),
        signal: controle.signal,
      });
      let corpo: { idPrescricao?: string; mensagem?: string } = {};
      try {
        corpo = await resp.json();
      } catch {
        /* resposta sem JSON: tudo bem */
      }
      return { enviado: resp.ok, status: resp.status, idPrescricao: corpo.idPrescricao, mensagem: corpo.mensagem };
    } finally {
      clearTimeout(timer);
    }
  };
}
