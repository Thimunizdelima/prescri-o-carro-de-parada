import { CHECKLIST_PADRAO } from "../../src/checklist-padrao.js";
import { problemaDoLote, TEXTO_PROBLEMA } from "../../src/conferencia-regras.js";
import type { Checklist, ConferenciaReposicao, ItemChecklist, PrescricaoCarroEmergencia } from "../../src/types.js";

const MOTIVOS = new Set(["SEM_ESTOQUE", "AGUARDANDO_COMPRA", "ITEM_SUSPENSO", "OUTRO"]);

export function itemDoChecklist(descricao: string, checklist: Checklist = CHECKLIST_PADRAO): ItemChecklist | undefined {
  for (const s of checklist) for (const i of s.itens) if (i.descricao === descricao) return i;
  return undefined;
}

/**
 * Validação da prescrição no servidor (o navegador pode ser adulterado).
 * Confere tipo, campos obrigatórios e que a soma de cada item não passa do quantitativo do check list.
 */
export function validarPrescricao(p: PrescricaoCarroEmergencia, checklist: Checklist = CHECKLIST_PADRAO): string[] {
  const erros: string[] = [];
  if (p?.tipo !== "PRESCRICAO_CARRO_EMERGENCIA") return ["Corpo não é uma prescrição de carro de emergência."];
  if (!p.id) erros.push("Prescrição sem id.");
  if (!p.numeroCarro?.trim()) erros.push("Número do carro de parada ausente.");
  if (!Array.isArray(p.itens) || !p.itens.length) erros.push("Prescrição sem itens.");
  const somas = new Map<string, number>();
  for (const it of p.itens ?? []) {
    const ref = itemDoChecklist(it.descricao, checklist);
    if (!ref) {
      erros.push(`Item fora do check list: ${it.descricao}.`);
      continue;
    }
    if (!Number.isInteger(it.quantidade) || it.quantidade < 1) erros.push(`Quantidade inválida em ${it.descricao}.`);
    if (ref.opcoes && (!it.opcao || !ref.opcoes.includes(it.opcao))) erros.push(`Opção inválida em ${it.descricao}.`);
    somas.set(it.descricao, (somas.get(it.descricao) ?? 0) + it.quantidade);
  }
  for (const [d, soma] of somas) {
    const max = itemDoChecklist(d, checklist)!.maximo;
    if (soma > max) erros.push(`${d}: ${soma} ultrapassa o quantitativo do check list (${max}).`);
  }
  return erros;
}

/** Validação da conferência contra a prescrição original. */
export function validarConferencia(
  c: ConferenciaReposicao,
  p: PrescricaoCarroEmergencia,
  checklist: Checklist = CHECKLIST_PADRAO,
): string[] {
  const erros: string[] = [];
  if (c?.tipo !== "CONFERENCIA_REPOSICAO_CARRO") return ["Corpo não é uma conferência de reposição."];
  if (c.prescricaoId !== p.id) erros.push("A conferência não corresponde a esta prescrição.");
  if (!c.lacreAplicado?.trim()) erros.push("Lacre aplicado ausente.");
  if (!c.farmaceutico?.trim()) erros.push("Farmacêutico ausente.");
  const minimo = Number.isFinite(c.validadeMinimaDias) ? Math.max(c.validadeMinimaDias, 0) : 90;

  const chave = (d: string, o: string | null) => `${d}|${o ?? ""}`;
  const conferidos = new Map(c.itens.map((i) => [chave(i.descricao, i.opcao), i]));
  for (const it of p.itens) {
    const nome = `${it.descricao}${it.opcao ? " — " + it.opcao : ""}`;
    const ci = conferidos.get(chave(it.descricao, it.opcao));
    if (!ci) {
      erros.push(`${nome} não foi conferido.`);
      continue;
    }
    const somaLotes = ci.lotes.reduce((s, l) => s + l.quantidade, 0);
    if (somaLotes !== ci.reposto) erros.push(`${nome}: soma dos lotes difere do reposto.`);
    if (ci.reposto > it.quantidade) erros.push(`${nome}: reposto (${ci.reposto}) maior que o prescrito (${it.quantidade}).`);
    const falta = ci.falta?.quantidade ?? 0;
    if (ci.reposto + falta !== it.quantidade) erros.push(`${nome}: reposto + falta deve ser igual ao prescrito.`);
    if (ci.falta && !MOTIVOS.has(ci.falta.motivo)) erros.push(`${nome}: motivo de falta inválido.`);
    const semValidade = !!itemDoChecklist(it.descricao, checklist)?.semValidade;
    for (const l of ci.lotes) {
      const prob = problemaDoLote(l, minimo, semValidade);
      if (prob) erros.push(`${nome}: ${TEXTO_PROBLEMA[prob].toLowerCase()} (lote ${l.lote || "—"}).`);
    }
  }
  if (c.itens.length !== p.itens.length) erros.push("A conferência tem itens que não estão na prescrição.");
  return erros;
}
