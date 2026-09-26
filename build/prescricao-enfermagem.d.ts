import { type ConfigGHosp } from "./ghosp-client.js";
import type { Checklist, PrescricaoCarroEmergencia, PrescricaoEnfermagem, ResultadoEnvio } from "./types.js";
export type FuncaoEnvioEnfermagem = (e: PrescricaoEnfermagem, reposicao: PrescricaoCarroEmergencia) => Promise<ResultadoEnvio>;
/**
 * <prescricao-enfermagem-carro>
 *
 * Prescrição / conferência / liberação da enfermagem após a parada.
 * REGRA: só pode ser iniciada depois que a prescrição médica foi finalizada.
 *
 * Atributos: enfermeiro, coren, servidor, token, canal, endpoint, numero-carro.
 * Propriedades: prescricaoMedica, checklist, enviar, configurar(cfg).
 * Eventos: enfermagem-liberada (cancelável; detail { enfermagem, reposicao }), enfermagem-enviada, enfermagem-erro, enfermagem-bloqueada.
 */
export declare class PrescricaoEnfermagemElement extends HTMLElement {
    enviar: FuncaoEnvioEnfermagem | null;
    private root;
    private _medica;
    private _checklist;
    private _cfg;
    private fila;
    private checagem;
    private materiais;
    private linhasMat;
    private cuidados;
    private liberada;
    private bloqueioMsg;
    private canal;
    private parar;
    private pararAcomp;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    get prescricaoMedica(): PrescricaoCarroEmergencia | null;
    /** Carrega a prescrição médica. Se ela não estiver finalizada, a tela continua bloqueada. */
    set prescricaoMedica(p: PrescricaoCarroEmergencia | null);
    get checklist(): Checklist;
    set checklist(c: Checklist);
    configurar(cfg: ConfigGHosp): void;
    /** Recebe uma prescrição médica finalizada (fila) — carrega na hora se não houver outra aberta. */
    receber(p: PrescricaoCarroEmergencia): void;
    /** Abre uma prescrição da fila; com o serviço, reserva para este enfermeiro. */
    abrir(p: PrescricaoCarroEmergencia): Promise<boolean>;
    obterPrescricaoEnfermagem(): PrescricaoEnfermagem;
    liberar(): Promise<void>;
    private get cliente();
    private get nomeEnfermeiro();
    private $;
    private emitir;
    private avisar;
    private renderizar;
    private htmlBloqueado;
    private htmlAberto;
    private renderizarChecagem;
    private renderizarMaterial;
    private atualizarResumo;
    private mostrarResultado;
    private acompanhar;
    private aoClicar;
    private aoMudar;
    private aoDigitar;
}
/** Texto da prescrição de enfermagem (para colar no prontuário). */
export declare function textoPrescricaoEnfermagem(e: PrescricaoEnfermagem, r: PrescricaoCarroEmergencia): string;
declare global {
    interface HTMLElementTagNameMap {
        "prescricao-enfermagem-carro": PrescricaoEnfermagemElement;
    }
}
