/**
 * Tipos do Formulário de Prescrição de Carro de Emergência.
 * Estes tipos definem o contrato de dados entre o formulário e o G-HOSP.
 */

/** Unidades de apresentação usadas no check list. */
export type Unidade = "und" | "amp" | "fr" | "kit" | "cx" | "rolo";

/** Um item do check list do carro de emergência. */
export interface ItemChecklist {
  /** Código do item no G-HOSP (opcional; preencher quando o TI mapear os códigos). */
  codigo?: string;
  /** Descrição exibida no formulário. */
  descricao: string;
  /** Quantitativo previsto no check list. A soma utilizada nunca passa deste valor. */
  maximo: number;
  /** Unidade de apresentação. Padrão: "und". */
  unidade?: Unidade;
  /** Opções (tamanhos, calibres, versões). Quando existe, o usuário precisa escolher qual usou. */
  opcoes?: string[];
}

/** Uma seção do check list (Materiais, Medicamentos, Kits...). */
export interface SecaoChecklist {
  titulo: string;
  itens: ItemChecklist[];
}

/** Check list completo. */
export type Checklist = SecaoChecklist[];

/** Uma linha de uso de um item: qual opção e quantas unidades. */
export interface LinhaUso {
  opcao: string | null;
  quantidade: number;
}

/** Item que vai na prescrição. */
export interface ItemPrescricao {
  secao: string;
  codigo: string | null;
  descricao: string;
  opcao: string | null;
  quantidade: number;
  unidade: Unidade;
  quantitativoPrevisto: number;
}

/** Contexto que o G-HOSP passa ao formulário (paciente, atendimento, profissional). */
export interface ContextoAtendimento {
  atendimento: string | null;
  paciente: string | null;
  prescritor: string | null;
  setor: string | null;
}

/** Corpo enviado para a aba Prescrições do G-HOSP. */
export interface PrescricaoCarroEmergencia {
  tipo: "PRESCRICAO_CARRO_EMERGENCIA";
  versao: 1;
  dataHora: string; // ISO 8601
  numeroCarro: string;
  lacreRompido: string | null;
  lacreNovo: string | null;
  contexto: ContextoAtendimento;
  itens: ItemPrescricao[];
  justificativa: string | null;
}

/** Resultado do envio ao G-HOSP. */
export interface ResultadoEnvio {
  enviado: boolean;
  /** true quando nenhum endpoint/função de envio foi configurado. */
  pendente?: boolean;
  status?: number;
  /** Identificador da prescrição devolvido pelo G-HOSP, se houver. */
  idPrescricao?: string;
  mensagem?: string;
}

/** Função de envio personalizada que o TI pode fornecer. */
export type FuncaoEnvio = (p: PrescricaoCarroEmergencia) => Promise<ResultadoEnvio>;
