import { type ConfigGHosp } from "./ghosp-client.js";
import type { Checklist, FuncaoEnvio, PrescricaoCarroEmergencia } from "./types.js";
/** Erro de validação com a lista de pendências para mostrar ao usuário. */
export declare class ErroValidacao extends Error {
    pendencias: string[];
    constructor(pendencias: string[]);
}
/**
 * <prescricao-carro-emergencia>
 *
 * Atributos:
 *   endpoint       URL da API de prescrições do G-HOSP (POST JSON). Sem ele, a prescrição é só exibida.
 *   atendimento    Nº do atendimento/prontuário (vem do G-HOSP).
 *   paciente       Nome ou ID do paciente (vem do G-HOSP).
 *   prescritor     Profissional logado (vem do G-HOSP).
 *   setor          Setor onde o carro foi usado.
 *   numero-carro   Pré-preenche o número do carro de parada.
 *   checklist-url  URL de um JSON com outro check list (mesmo formato de CHECKLIST_PADRAO).
 *
 * Propriedades / métodos:
 *   checklist               Define o check list via JavaScript.
 *   enviar                  Função própria de envio (substitui o POST padrão).
 *   configurar(cfg)         Configura endpoint, cabeçalhos e timeout do POST padrão.
 *   obterPrescricao()       Valida e devolve o objeto da prescrição (lança ErroValidacao).
 *   gerar()                 Mesmo que clicar em "Gerar Prescrição".
 *   limpar()                Zera o formulário.
 *
 * Eventos (bubbles + composed):
 *   prescricao-gerada   detail: PrescricaoCarroEmergencia. Cancelável: preventDefault() impede o envio
 *                       automático (use quando o próprio G-HOSP quiser gravar a prescrição).
 *   prescricao-enviada  detail: { prescricao, resultado }
 *   prescricao-erro     detail: { prescricao?, erro }
 */
export declare class PrescricaoCarroEmergenciaElement extends HTMLElement {
    static get observedAttributes(): string[];
    /** Função de envio personalizada. Tem prioridade sobre o atributo `endpoint`. */
    enviar: FuncaoEnvio | null;
    private _checklist;
    private _cfg;
    private uso;
    private linhas;
    private root;
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(nome: string, antigo: string | null, novo: string | null): void;
    get checklist(): Checklist;
    set checklist(valor: Checklist);
    configurar(cfg: ConfigGHosp): void;
    limpar(): void;
    obterPrescricao(): PrescricaoCarroEmergencia;
    gerar(): Promise<void>;
    private carregarChecklist;
    private emitir;
    private $;
    private campo;
    private renderizar;
    private linhaDe;
    private aoMudar;
    private aoClicar;
    private aoBuscar;
    private renderizarQtd;
    private atualizarResumo;
    private pedirConfirmacao;
    private ultima;
    private mostrarPrescricao;
    private copiar;
}
/** Versão em texto simples da prescrição (para colar em evolução ou impressão). */
export declare function textoPrescricao(p: PrescricaoCarroEmergencia): string;
declare global {
    interface HTMLElementTagNameMap {
        "prescricao-carro-emergencia": PrescricaoCarroEmergenciaElement;
    }
}
