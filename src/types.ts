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

export type StatusFluxo = "AGUARDANDO_FARMACIA" | "EM_CONFERENCIA" | "CONFORME" | "COM_PENDENCIAS";

export interface EventoHistorico {
  em: string;
  evento: string;
  por: string | null;
}

/** Registro de uma prescrição no serviço de integração (o "prontuário" do fluxo). */
export interface RegistroFluxo {
  prescricao: PrescricaoCarroEmergencia;
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
export type NomeEvento = "prescricao-recebida" | "conferencia-iniciada" | "conferencia-concluida" | "alerta-sla";
