/**
 * Leitura de códigos de barras GS1 usados em medicamentos e materiais no Brasil:
 *  - DataMatrix GS1 (padrão ANVISA/SNCM): (01) GTIN, (21) série, (17) validade, (10) lote
 *  - EAN-13 / GTIN-14 simples (só o produto, sem lote e validade)
 *
 * Aceita o texto como o leitor envia (com o caractere GS \x1d entre campos),
 * a forma legível com parênteses "(01)0789...(17)271231(10)ABC", e prefixos
 * de simbologia ("]d2", "]C1", "]Q3").
 */
export interface LeituraGS1 {
    gtin: string | null;
    lote: string | null;
    validade: string | null;
    serie: string | null;
    bruto: string;
}
/** Completa o GTIN com zeros à esquerda até 14 dígitos. */
export declare const normalizarGtin: (g: string) => string;
/** Converte AAMMDD (GS1) em AAAA-MM-DD. Dia "00" significa o último dia do mês. */
export declare function dataGs1(aammdd: string): string | null;
export declare function lerCodigo(entrada: string): LeituraGS1;
