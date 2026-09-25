import type { EntradaLote, FaltaItem } from "./types.js";

/** Dias entre hoje e a validade (negativo = vencido). */
export function diasParaVencer(validadeIso: string, hoje: Date = new Date()): number {
  const [a, m, d] = validadeIso.split("-").map(Number);
  const val = Date.UTC(a, m - 1, d);
  const h = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.round((val - h) / 86_400_000);
}

export type ProblemaLote = "SEM_LOTE" | "SEM_VALIDADE" | "VENCIDO" | "VALIDADE_CURTA" | null;

/**
 * Regra do check list: "trocar materiais e medicamentos que irão vencer nos próximos 3 meses".
 * Por isso a farmácia não pode repor lote vencido nem com validade menor que o mínimo.
 */
export function problemaDoLote(e: Pick<EntradaLote, "lote" | "validade">, validadeMinimaDias: number, semValidade = false): ProblemaLote {
  if (semValidade) return null;
  if (!e.lote.trim()) return "SEM_LOTE";
  if (!e.validade) return "SEM_VALIDADE";
  const dias = diasParaVencer(e.validade);
  if (dias < 0) return "VENCIDO";
  if (dias < validadeMinimaDias) return "VALIDADE_CURTA";
  return null;
}

export const TEXTO_PROBLEMA: Record<Exclude<ProblemaLote, null>, string> = {
  SEM_LOTE: "Informe o lote",
  SEM_VALIDADE: "Informe a validade",
  VENCIDO: "Lote vencido",
  VALIDADE_CURTA: "Validade curta",
};

export type StatusLinha = "PENDENTE" | "PARCIAL" | "CONFERIDO" | "FALTA" | "ERRO";

/** Situação de uma linha da prescrição na conferência. */
export function statusDaLinha(
  prescrito: number,
  lotes: EntradaLote[],
  falta: FaltaItem | null,
  validadeMinimaDias: number,
  semValidade = false,
): StatusLinha {
  if (lotes.some((l) => problemaDoLote(l, validadeMinimaDias, semValidade))) return "ERRO";
  const reposto = lotes.reduce((s, l) => s + l.quantidade, 0);
  if (reposto >= prescrito) return "CONFERIDO";
  if (falta && reposto + falta.quantidade >= prescrito) return "FALTA";
  return reposto > 0 ? "PARCIAL" : "PENDENTE";
}

/** Soma um lote à lista, juntando com um lote igual (mesmo número e validade). */
export function somarLote(lotes: EntradaLote[], novo: EntradaLote): EntradaLote[] {
  const igual = lotes.find((l) => l.lote === novo.lote && l.validade === novo.validade && novo.lote);
  if (igual) {
    igual.quantidade += novo.quantidade;
    return lotes;
  }
  return [...lotes, novo];
}
