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
  /** Códigos de barras (GTIN/EAN) do item, para leitura na farmácia. Item sem opções. */
  gtin?: string[];
  /** Códigos de barras por opção, ex.: { "nº 18": ["07891234567895"] }. */
  gtinPorOpcao?: Record<string, string[]>;
  /** true para itens sem validade (ex.: lanterna, laringoscópio): a farmácia não precisa informar lote/validade. */
  semValidade?: boolean;
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
  /** Enfermeiro que conferiu e liberou (preenchido na etapa da enfermagem). */
  enfermeiro?: string | null;
}

/** Corpo enviado para a aba Prescrições do G-HOSP. */
export interface PrescricaoCarroEmergencia {
  tipo: "PRESCRICAO_CARRO_EMERGENCIA";
  versao: 1;
  /** Identificador único da prescrição (liga a prescrição à conferência da farmácia). */
  id: string;
  dataHora: string; // ISO 8601
  numeroCarro: string;
  lacreRompido: string | null;
  lacreNovo: string | null;
  contexto: ContextoAtendimento;
  itens: ItemPrescricao[];
  justificativa: string | null;
  /**
   * Etapa do documento:
   *  - "MEDICA": prescrição médica (medicamentos usados na parada). Só libera a enfermagem depois de finalizada.
   *  - "REPOSICAO": consolidado liberado pela enfermagem (medicamentos consumidos + materiais) que a farmácia confere.
   * Ausente = formato antigo (formulário único), tratado como REPOSICAO.
   */
  etapa?: "MEDICA" | "REPOSICAO";
  /** Data/hora em que o médico finalizou a prescrição (obrigatório para a enfermagem iniciar). */
  finalizadaEm?: string | null;
  /** Médico que finalizou (CRM opcional). */
  medico?: string | null;
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

// ============================ Conferência da farmácia ============================

/** Um lote separado pela farmácia para repor um item. */
export interface EntradaLote {
  lote: string;
  /** Data de validade ISO (AAAA-MM-DD). */
  validade: string;
  quantidade: number;
  gtin: string | null;
  /** "leitura" quando veio do leitor de código de barras, "manual" quando digitado. */
  origem: "leitura" | "manual";
}

export type MotivoFalta = "SEM_ESTOQUE" | "AGUARDANDO_COMPRA" | "ITEM_SUSPENSO" | "OUTRO";

export interface FaltaItem {
  quantidade: number;
  motivo: MotivoFalta;
  observacao: string | null;
}

export interface ItemConferido {
  secao: string;
  codigo: string | null;
  descricao: string;
  opcao: string | null;
  unidade: Unidade;
  prescrito: number;
  reposto: number;
  lotes: EntradaLote[];
  falta: FaltaItem | null;
}

/** Corpo enviado ao G-HOSP ao concluir a conferência. */
export interface ConferenciaReposicao {
  tipo: "CONFERENCIA_REPOSICAO_CARRO";
  versao: 1;
  id: string;
  prescricaoId: string;
  numeroCarro: string;
  dataHoraPrescricao: string;
  dataHoraConferencia: string;
  duracaoSegundos: number;
  farmaceutico: string | null;
  lacreAplicado: string | null;
  situacao: "CONFORME" | "COM_PENDENCIAS";
  itens: ItemConferido[];
  observacoes: string | null;
  /** Validade mínima (em dias) exigida para os lotes repostos. */
  validadeMinimaDias: number;
}

export type FuncaoEnvioConferencia = (c: ConferenciaReposicao) => Promise<ResultadoEnvio>;

// ============================ Serviço de integração ============================

export type StatusFluxo =
  | "AGUARDANDO_ENFERMAGEM"
  | "EM_ENFERMAGEM"
  | "AGUARDANDO_FARMACIA"
  | "EM_CONFERENCIA"
  | "CONFORME"
  | "COM_PENDENCIAS";

export interface EventoHistorico {
  em: string;
  evento: string;
  por: string | null;
}

/** Registro de uma prescrição no serviço de integração (o "prontuário" do fluxo). */
export interface RegistroFluxo {
  /** Documento que a farmácia confere (após a liberação da enfermagem, é o consolidado de reposição). */
  prescricao: PrescricaoCarroEmergencia;
  /** Prescrição médica original, finalizada. */
  prescricaoMedica?: PrescricaoCarroEmergencia;
  /** Prescrição/conferência/liberação da enfermagem. */
  enfermagem?: PrescricaoEnfermagem | null;
  enfermeiro?: string | null;
  inicioEnfermagemEm?: string | null;
  liberadaEm?: string | null;
  status: StatusFluxo;
  recebidaEm: string;
  inicioConferenciaEm: string | null;
  farmaceutico: string | null;
  conferenciaId: string | null;
  concluidaEm: string | null;
  atrasada: boolean;
  historico: EventoHistorico[];
}

export interface MovimentoEstoque {
  id: string;
  tipo: "SAIDA_REPOSICAO_CARRO";
  em: string;
  numeroCarro: string;
  conferenciaId: string;
  prescricaoId: string;
  descricao: string;
  opcao: string | null;
  codigo: string | null;
  lote: string;
  validade: string;
  quantidade: number;
  unidade: Unidade;
}

export interface RequisicaoCompra {
  id: string;
  em: string;
  status: "ABERTA" | "ATENDIDA";
  numeroCarro: string;
  conferenciaId: string;
  descricao: string;
  opcao: string | null;
  codigo: string | null;
  quantidade: number;
  unidade: Unidade;
  motivo: MotivoFalta;
  observacao: string | null;
}

export interface Indicadores {
  aguardandoEnfermagem: number;
  emEnfermagem: number;
  aguardando: number;
  emConferencia: number;
  concluidasHoje: number;
  comPendenciasHoje: number;
  atrasadas: number;
  tempoMedioMinutos: number | null;
  requisicoesAbertas: number;
  slaMinutos: number;
}

/** Eventos em tempo real (Server-Sent Events) emitidos pelo serviço. */
export type NomeEvento =
  | "prescricao-medica-finalizada"
  | "enfermagem-iniciada"
  | "enfermagem-liberada"
  | "prescricao-recebida" // para a farmácia: só acontece depois da liberação da enfermagem
  | "conferencia-iniciada"
  | "conferencia-concluida"
  | "alerta-sla";

// ============================ Enfermagem (pós-parada) ============================

export type MotivoPerda = "QUEBRA" | "DILUIDO_NAO_UTILIZADO" | "CONTAMINADO" | "OUTRO";
export type MotivoNaoAdministrado = "SUSPENSO_PELO_MEDICO" | "EVOLUCAO_DO_PACIENTE" | "OUTRO";

/** Checagem, pela enfermagem, de um item da prescrição médica. */
export interface ChecagemItem {
  secao: string;
  codigo: string | null;
  descricao: string;
  opcao: string | null;
  unidade: Unidade;
  prescrito: number;
  administrado: number;
  horario: string | null; // HH:MM
  naoAdministrado: { motivo: MotivoNaoAdministrado; observacao: string | null } | null;
  /** Perdas que também saíram do carro (quebra, diluído e não utilizado...). */
  perda: { quantidade: number; motivo: MotivoPerda; observacao: string | null } | null;
}

export interface CuidadoEnfermagem {
  descricao: string;
  frequencia: string | null;
}

/** Prescrição / conferência / liberação da enfermagem após a parada. */
export interface PrescricaoEnfermagem {
  tipo: "PRESCRICAO_ENFERMAGEM_CARRO";
  versao: 1;
  id: string;
  prescricaoMedicaId: string;
  dataHora: string;
  enfermeiro: string;
  coren: string | null;
  numeroCarro: string;
  lacreRompido: string;
  lacreNovo: string | null;
  checagem: ChecagemItem[];
  /** Materiais usados (prescrição de enfermagem), limitados ao check list. */
  materiais: ItemPrescricao[];
  cuidados: CuidadoEnfermagem[];
  justificativa: string | null;
}
