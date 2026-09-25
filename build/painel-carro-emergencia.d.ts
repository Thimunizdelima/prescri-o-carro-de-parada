/**
 * <painel-carro-emergencia servidor="...">
 * Acompanhamento em tempo real do fluxo prescrição → farmácia: fila, prazos (SLA),
 * tempo médio de reposição e requisições de compra abertas pelas faltas.
 */
export declare class PainelCarroEmergenciaElement extends HTMLElement {
    private root;
    private parar;
    private timer;
    private regs;
    private ind;
    private reqs;
    private conectado;
    constructor();
    private get cliente();
    connectedCallback(): void;
    disconnectedCallback(): void;
    atualizar(): Promise<void>;
    private renderizar;
}
declare global {
    interface HTMLElementTagNameMap {
        "painel-carro-emergencia": PainelCarroEmergenciaElement;
    }
}
