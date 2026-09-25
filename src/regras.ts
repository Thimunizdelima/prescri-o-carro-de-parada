import type { ItemChecklist, LinhaUso } from "./types.js";

/**
 * Regra central do formulário: a soma das quantidades de um item nunca
 * ultrapassa o quantitativo do check list, cada linha tem no mínimo 1,
 * e uma mesma opção não se repete no mesmo item.
 */
export function normalizarLinhas(item: ItemChecklist, linhas: LinhaUso[]): LinhaUso[] {
  let restante = item.maximo;
  const usadas = new Set<string>();
  const saida: LinhaUso[] = [];
  for (const l of linhas) {
    if (restante <= 0) break;
    const qtd = Math.min(Math.max(1, Math.trunc(Number(l.quantidade)) || 1), restante);
    let opcao: string | null = null;
    if (item.opcoes) {
      opcao = l.opcao && item.opcoes.includes(l.opcao) && !usadas.has(l.opcao) ? l.opcao : "";
      if (opcao) usadas.add(opcao);
    }
    saida.push({ opcao, quantidade: qtd });
    restante -= qtd;
  }
  return saida.length ? saida : [{ opcao: item.opcoes ? "" : null, quantidade: 1 }];
}

/** Quantidade máxima que a linha `indice` pode receber, dadas as outras linhas. */
export function limiteDaLinha(item: ItemChecklist, linhas: LinhaUso[], indice: number): number {
  const outras = linhas.reduce((s, l, i) => (i === indice ? s : s + l.quantidade), 0);
  return Math.max(1, item.maximo - outras);
}

/** Indica se ainda cabe outra linha (outra opção) para o item. */
export function podeAdicionarOpcao(item: ItemChecklist, linhas: LinhaUso[]): boolean {
  if (!item.opcoes) return false;
  const total = linhas.reduce((s, l) => s + l.quantidade, 0);
  return total < item.maximo && linhas.length < item.opcoes.length;
}
