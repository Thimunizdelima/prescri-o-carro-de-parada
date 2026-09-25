import { type ConfigGHosp } from "./ghosp-client.js";
import type { Checklist, ConferenciaReposicao, FuncaoEnvioConferencia, PrescricaoCarroEmergencia } from "./types.js";
/**
 * <conferencia-farmacia-carro>
 *
 * Conferência da reposição do carro de emergência na farmácia, a partir da prescrição.
 *
 * Atributos:
 *   endpoint               URL da API do G-HOSP que recebe a conferência (POST JSON).
 *   farmaceutico           Farmacêutico logado (vem do G-HOSP). Sem ele, aparece um campo.
 *   validade-minima-dias   Validade mínima aceita para repor (padrão 90 = regra dos 3 meses).
 *   prescricao-url         URL que devolve a prescrição (JSON) a conferir.
 *   checklist-url          Check list com os códigos de barras (gtin / gtinPorOpcao).
 *   servidor               URL do serviço de integração: fila, reserva, envio e tempo real.
 *   token                  Token do serviço, se exigido.
 *   canal                  BroadcastChannel para receber prescrições na hora (padrão "carro-emergencia"; "off" desliga).
 *   som                    "off" desliga os bipes de confirmação/erro.
 *
 * Propriedades / métodos:
 *   prescricao             Define a prescrição a conferir.
 *   receber(p)             Coloca uma prescrição na fila (carrega na hora se não houver outra aberta).
 *   checklist              Check list com GTINs para a leitura automática.
 *   enviar                 Função própria de envio.
 *   configurar(cfg)        Endpoint, cabeçalhos, timeout.
 *   ler(codigo)            Processa uma leitura (mesmo que bipar).
 *   obterConferencia()     Valida e devolve o JSON (lança Error com as pendências).
 *   concluir()             Mesmo que o botão "Concluir conferência".
 *
 * Eventos: conferencia-concluida (cancelável), conferencia-enviada, conferencia-erro,
 *          gtin-desconhecido, gtin-associado (para o G-HOSP gravar o novo código no cadastro).
 */
export declare class ConferenciaFarmaciaElement extends HTMLElement {
    enviar: FuncaoEnvioConferencia | null;
    private _p;
    private _checklist;
    private _cfg;
    private linhas;
    private fila;
    private gtins;
    private associados;
    private pendenteAssoc;
    private inicio;
    private concluida;
    private canal;
    private audio;
    private root;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    get prescricao(): PrescricaoCarroEmergencia | null;
    set prescricao(p: PrescricaoCarroEmergencia | null);
    get checklist(): Checklist;
    set checklist(c: Checklist);
    configurar(cfg: ConfigGHosp): void;
    receber(p: PrescricaoCarroEmergencia): void;
    /**
     * Abre uma prescrição para conferir. Com o serviço de integração, reserva a conferência
     * para este farmacêutico; se outra pessoa já estiver conferindo, não abre.
     */
    abrir(p: PrescricaoCarroEmergencia): Promise<boolean>;
    private abrindo;
    private abrirReservando;
    ler(codigo: string): void;
    obterConferencia(): ConferenciaReposicao;
    concluir(): Promise<void>;
    private pararEscuta;
    private get cliente();
    private get nomeFarmaceutico();
    private get validadeMinima();
    private $;
    private emitir;
    private buscarJson;
    private indexarGtins;
    private itemSemValidade;
    private reposto;
    private status;
    private avisar;
    private bipar;
    private renderizar;
    private renderizarFila;
    private renderizarAssoc;
    private renderizarLinha;
    private atualizarProgresso;
    private mostrarResultado;
    private aoTeclar;
    private aoDigitar;
    private aoMudar;
    private atualizarStatusLinha;
    private aoClicar;
}
/** Termo de reposição em texto (para colar no G-HOSP, imprimir ou arquivar). */
export declare function termoReposicao(c: ConferenciaReposicao): string;
declare global {
    interface HTMLElementTagNameMap {
        "conferencia-farmacia-carro": ConferenciaFarmaciaElement;
    }
}
