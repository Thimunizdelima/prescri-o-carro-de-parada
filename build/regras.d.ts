import type { ItemChecklist, LinhaUso } from "./types.js";
/**
 * Regra central do formulário: a soma das quantidades de um item nunca
 * ultrapassa o quantitativo do check list, cada linha tem no mínimo 1,
 * e uma mesma opção não se repete no mesmo item.
 */
export declare function normalizarLinhas(item: ItemChecklist, linhas: LinhaUso[]): LinhaUso[];
/** Quantidade máxima que a linha `indice` pode receber, dadas as outras linhas. */
export declare function limiteDaLinha(item: ItemChecklist, linhas: LinhaUso[], indice: number): number;
/** Indica se ainda cabe outra linha (outra opção) para o item. */
export declare function podeAdicionarOpcao(item: ItemChecklist, linhas: LinhaUso[]): boolean;
