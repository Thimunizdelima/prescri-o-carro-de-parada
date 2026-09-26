import { CHECKLIST_PADRAO } from "./checklist-padrao.js";
import type {
  ChecagemItem,
  Checklist,
  ItemChecklist,
  ItemPrescricao,
  MotivoNaoAdministrado,
  MotivoPerda,
  PrescricaoCarroEmergencia,
  PrescricaoEnfermagem,
} from "./types.js";

/** Seções que o médico prescreve e seções de materiais que a enfermagem prescreve. */
export const SECOES_MEDICAS = ["Medicamentos", "Especificidades", "Kits", "Soluções"];
export const SECOES_MATERIAIS = ["Materiais", "Materiais CME"];

export const TEXTO_PERDA: Record<MotivoPerda, string> = {
  QUEBRA: "Quebra",
  DILUIDO_NAO_UTILIZADO: "Diluído e não utilizado",
  CONTAMINADO: "Contaminado",
  OUTRO: "Outro",
};

export const TEXTO_NAO_ADMINISTRADO: Record<MotivoNaoAdministrado, string> = {
  SUSPENSO_PELO_MEDICO: "Suspenso pelo médico",
  EVOLUCAO_DO_PACIENTE: "Evolução do paciente",
  OUTRO: "Outro",
};

/** Cuidados pós-PCR sugeridos. MODELO: ajustar ao protocolo institucional do HRO. */
export const CUIDADOS_PADRAO = [
  { descricao: "Monitorização cardíaca contínua", frequencia: "Contínuo" },
  { descricao: "Oximetria de pulso contínua", frequencia: "Contínuo" },
  { descricao: "Sinais vitais", frequencia: "15/15 min na 1ª hora" },
  { descricao: "Glicemia capilar", frequencia: "Conforme protocolo" },
  { descricao: "Controle de temperatura", frequencia: "2/2 h" },
  { descricao: "Cabeceira elevada a 30°", frequencia: "Contínuo" },
  { descricao: "Controle de diurese", frequencia: "1/1 h" },
  { descricao: "Registrar evolução de enfermagem pós-PCR", frequencia: "Ao término" },
];

export const REGRA_BLOQUEIO =
  "A prescrição de enfermagem somente pode ser iniciada após a finalização da prescrição médica.";

/** A regra central desta etapa. */
export function medicaFinalizada(p: PrescricaoCarroEmergencia | null | undefined): boolean {
  return !!p && p.etapa === "MEDICA" && !!p.finalizadaEm;
}

export function itemDoChecklist(descricao: string, checklist: Checklist = CHECKLIST_PADRAO): ItemChecklist | undefined {
  for (const s of checklist) for (const i of s.itens) if (i.descricao === descricao) return i;
  return undefined;
}

/** Monta a checagem inicial: tudo o que o médico prescreveu, considerado administrado. */
export function checagemInicial(medica: PrescricaoCarroEmergencia): ChecagemItem[] {
  return medica.itens.map((i) => ({
    secao: i.secao,
    codigo: i.codigo,
    descricao: i.descricao,
    opcao: i.opcao,
    unidade: i.unidade,
    prescrito: i.quantidade,
    administrado: i.quantidade,
    horario: null,
    naoAdministrado: null,
    perda: null,
  }));
}

/** Quanto do item saiu do carro: o que foi administrado mais as perdas. */
export const consumo = (c: ChecagemItem): number => c.administrado + (c.perda?.quantidade ?? 0);

/** Valida a prescrição da enfermagem. Usado na tela e, de novo, no servidor. */
export function validarEnfermagem(
  e: PrescricaoEnfermagem,
  medica: PrescricaoCarroEmergencia,
  checklist: Checklist = CHECKLIST_PADRAO,
): string[] {
  const erros: string[] = [];
  if (!medicaFinalizada(medica)) return [REGRA_BLOQUEIO];
  if (e?.tipo !== "PRESCRICAO_ENFERMAGEM_CARRO") return ["Corpo não é uma prescrição de enfermagem."];
  if (e.prescricaoMedicaId !== medica.id) erros.push("A prescrição de enfermagem não corresponde a esta prescrição médica.");
  if (!e.enfermeiro?.trim()) erros.push("Informe o enfermeiro responsável.");
  if (!e.numeroCarro?.trim()) erros.push("Informe o número do carro de parada.");
  if (!e.lacreRompido?.trim()) erros.push("Informe o lacre rompido.");

  const chave = (d: string, o: string | null) => `${d}|${o ?? ""}`;
  const porChave = new Map(e.checagem.map((c) => [chave(c.descricao, c.opcao), c]));
  const somaCarro = new Map<string, number>();
  for (const it of medica.itens) {
    const nome = `${it.descricao}${it.opcao ? " — " + it.opcao : ""}`;
    const c = porChave.get(chave(it.descricao, it.opcao));
    if (!c) {
      erros.push(`Faltou checar ${nome}.`);
      continue;
    }
    if (c.prescrito !== it.quantidade) erros.push(`${nome}: quantidade prescrita divergente.`);
    if (!Number.isInteger(c.administrado) || c.administrado < 0 || c.administrado > it.quantidade)
      erros.push(`${nome}: administrado deve ficar entre 0 e ${it.quantidade}.`);
    if (c.administrado < it.quantidade && !c.naoAdministrado?.motivo)
      erros.push(`${nome}: informe o motivo de não ter administrado ${it.quantidade - c.administrado}.`);
    if (c.perda && (!Number.isInteger(c.perda.quantidade) || c.perda.quantidade < 1 || !c.perda.motivo))
      erros.push(`${nome}: informe quantidade e motivo da perda.`);
    somaCarro.set(it.descricao, (somaCarro.get(it.descricao) ?? 0) + consumo(c));
  }
  if (e.checagem.length !== medica.itens.length) erros.push("A checagem tem itens que não estão na prescrição médica.");

  for (const m of e.materiais ?? []) {
    const ref = itemDoChecklist(m.descricao, checklist);
    if (!ref || !SECOES_MATERIAIS.includes(m.secao)) {
      erros.push(`Material fora do check list: ${m.descricao}.`);
      continue;
    }
    if (!Number.isInteger(m.quantidade) || m.quantidade < 1) erros.push(`Quantidade inválida em ${m.descricao}.`);
    if (ref.opcoes && (!m.opcao || !ref.opcoes.includes(m.opcao))) erros.push(`Escolha a opção utilizada em ${m.descricao}.`);
    somaCarro.set(m.descricao, (somaCarro.get(m.descricao) ?? 0) + m.quantidade);
  }
  for (const [d, soma] of somaCarro) {
    const max = itemDoChecklist(d, checklist)?.maximo;
    if (max !== undefined && soma > max) erros.push(`${d}: saída do carro (${soma}) ultrapassa o quantitativo do check list (${max}).`);
  }
  return erros;
}

/**
 * Consolida o que a farmácia deve repor: medicamentos consumidos (administrado + perdas)
 * e materiais da prescrição de enfermagem. Mantém o id da prescrição médica.
 */
export function montarReposicao(medica: PrescricaoCarroEmergencia, e: PrescricaoEnfermagem): PrescricaoCarroEmergencia {
  const itens: ItemPrescricao[] = [];
  const notas: string[] = [];
  for (const c of e.checagem) {
    const nome = `${c.descricao}${c.opcao ? " — " + c.opcao : ""}`;
    if (c.perda) notas.push(`Perda: ${c.perda.quantidade} ${c.unidade} de ${nome} (${TEXTO_PERDA[c.perda.motivo]}${c.perda.observacao ? ": " + c.perda.observacao : ""}).`);
    if (c.administrado < c.prescrito && c.naoAdministrado)
      notas.push(`Não administrado: ${c.prescrito - c.administrado} ${c.unidade} de ${nome} (${TEXTO_NAO_ADMINISTRADO[c.naoAdministrado.motivo]}) — retorna ao carro.`);
    const q = consumo(c);
    if (q > 0) {
      const ref = itemDoChecklist(c.descricao);
      itens.push({ secao: c.secao, codigo: c.codigo, descricao: c.descricao, opcao: c.opcao, quantidade: q, unidade: c.unidade, quantitativoPrevisto: ref?.maximo ?? q });
    }
  }
  itens.push(...e.materiais);
  const justificativa = [e.justificativa?.trim(), ...notas].filter(Boolean).join("\n") || null;
  return {
    tipo: "PRESCRICAO_CARRO_EMERGENCIA",
    versao: 1,
    etapa: "REPOSICAO",
    id: medica.id,
    dataHora: e.dataHora,
    numeroCarro: e.numeroCarro,
    lacreRompido: e.lacreRompido,
    lacreNovo: e.lacreNovo,
    contexto: { ...medica.contexto, enfermeiro: e.enfermeiro },
    itens,
    justificativa,
    finalizadaEm: medica.finalizadaEm,
    medico: medica.medico ?? medica.contexto?.prescritor ?? null,
  };
}
