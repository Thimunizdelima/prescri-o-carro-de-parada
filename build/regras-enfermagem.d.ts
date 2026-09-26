import type { ChecagemItem, Checklist, ItemChecklist, MotivoNaoAdministrado, MotivoPerda, PrescricaoCarroEmergencia, PrescricaoEnfermagem } from "./types.js";
/** Seções que o médico prescreve e seções de materiais que a enfermagem prescreve. */
export declare const SECOES_MEDICAS: string[];
export declare const SECOES_MATERIAIS: string[];
export declare const TEXTO_PERDA: Record<MotivoPerda, string>;
export declare const TEXTO_NAO_ADMINISTRADO: Record<MotivoNaoAdministrado, string>;
/** Cuidados pós-PCR sugeridos. MODELO: ajustar ao protocolo institucional do HRO. */
export declare const CUIDADOS_PADRAO: {
    descricao: string;
    frequencia: string;
}[];
export declare const REGRA_BLOQUEIO = "A prescri\u00E7\u00E3o de enfermagem somente pode ser iniciada ap\u00F3s a finaliza\u00E7\u00E3o da prescri\u00E7\u00E3o m\u00E9dica.";
/** A regra central desta etapa. */
export declare function medicaFinalizada(p: PrescricaoCarroEmergencia | null | undefined): boolean;
export declare function itemDoChecklist(descricao: string, checklist?: Checklist): ItemChecklist | undefined;
/** Monta a checagem inicial: tudo o que o médico prescreveu, considerado administrado. */
export declare function checagemInicial(medica: PrescricaoCarroEmergencia): ChecagemItem[];
/** Quanto do item saiu do carro: o que foi administrado mais as perdas. */
export declare const consumo: (c: ChecagemItem) => number;
/** Valida a prescrição da enfermagem. Usado na tela e, de novo, no servidor. */
export declare function validarEnfermagem(e: PrescricaoEnfermagem, medica: PrescricaoCarroEmergencia, checklist?: Checklist): string[];
/**
 * Consolida o que a farmácia deve repor: medicamentos consumidos (administrado + perdas)
 * e materiais da prescrição de enfermagem. Mantém o id da prescrição médica.
 */
export declare function montarReposicao(medica: PrescricaoCarroEmergencia, e: PrescricaoEnfermagem): PrescricaoCarroEmergencia;
