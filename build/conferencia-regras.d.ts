import type { EntradaLote, FaltaItem } from "./types.js";
/** Dias entre hoje e a validade (negativo = vencido). */
export declare function diasParaVencer(validadeIso: string, hoje?: Date): number;
export type ProblemaLote = "SEM_LOTE" | "SEM_VALIDADE" | "VENCIDO" | "VALIDADE_CURTA" | null;
/**
 * Regra do check list: "trocar materiais e medicamentos que irão vencer nos próximos 3 meses".
 * Por isso a farmácia não pode repor lote vencido nem com validade menor que o mínimo.
 */
export declare function problemaDoLote(e: Pick<EntradaLote, "lote" | "validade">, validadeMinimaDias: number, semValidade?: boolean): ProblemaLote;
export declare const TEXTO_PROBLEMA: Record<Exclude<ProblemaLote, null>, string>;
export type StatusLinha = "PENDENTE" | "PARCIAL" | "CONFERIDO" | "FALTA" | "ERRO";
/** Situação de uma linha da prescrição na conferência. */
export declare function statusDaLinha(prescrito: number, lotes: EntradaLote[], falta: FaltaItem | null, validadeMinimaDias: number, semValidade?: boolean): StatusLinha;
/** Soma um lote à lista, juntando com um lote igual (mesmo número e validade). */
export declare function somarLote(lotes: EntradaLote[], novo: EntradaLote): EntradaLote[];
