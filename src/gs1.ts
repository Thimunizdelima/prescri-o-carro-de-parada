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
  gtin: string | null; // sempre com 14 dígitos
  lote: string | null;
  validade: string | null; // AAAA-MM-DD
  serie: string | null;
  bruto: string;
}

const GS = "\u001d";
const FIXOS: Record<string, number> = { "01": 14, "02": 14, "11": 6, "13": 6, "15": 6, "17": 6 };
const VARIAVEIS = new Set(["10", "21", "240", "241"]);

/** Completa o GTIN com zeros à esquerda até 14 dígitos. */
export const normalizarGtin = (g: string): string => g.replace(/\D/g, "").padStart(14, "0");

/** Converte AAMMDD (GS1) em AAAA-MM-DD. Dia "00" significa o último dia do mês. */
export function dataGs1(aammdd: string): string | null {
  if (!/^\d{6}$/.test(aammdd)) return null;
  const ano = 2000 + Number(aammdd.slice(0, 2));
  const mes = Number(aammdd.slice(2, 4));
  let dia = Number(aammdd.slice(4, 6));
  if (mes < 1 || mes > 12 || dia > 31) return null;
  if (dia === 0) dia = new Date(ano, mes, 0).getDate();
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

const dataValida = (s: string) => dataGs1(s) !== null;

export function lerCodigo(entrada: string): LeituraGS1 {
  const bruto = entrada;
  let s = entrada.trim().replace(/^\](d2|C1|Q3|e0)/, "").replace(/<GS>/gi, GS);
  const r: LeituraGS1 = { gtin: null, lote: null, validade: null, serie: null, bruto };

  // Código simples: só dígitos com 8, 12, 13 ou 14 posições.
  if (/^\d{8}$|^\d{12,14}$/.test(s)) {
    r.gtin = normalizarGtin(s);
    return r;
  }

  const campos: Record<string, string> = {};

  if (s.includes("(")) {
    // Forma legível: (01)...(17)...(10)...
    for (const m of s.matchAll(/\((\d{2,4})\)([^()]*)/g)) campos[m[1]] = m[2].trim();
  } else {
    // Forma bruta: percorre os identificadores de aplicação (AI).
    s = s.replace(new RegExp(`^${GS}+`), "");
    let i = 0;
    while (i < s.length) {
      if (s[i] === GS) { i++; continue; }
      const ai3 = s.slice(i, i + 3);
      const ai = VARIAVEIS.has(ai3) ? ai3 : s.slice(i, i + 2);
      i += ai.length;
      if (FIXOS[ai]) {
        campos[ai] = s.slice(i, i + FIXOS[ai]);
        i += FIXOS[ai];
      } else if (VARIAVEIS.has(ai)) {
        let fim = s.indexOf(GS, i);
        if (fim === -1) {
          // Sem separador GS (alguns leitores o suprimem): procura o próximo "17AAMMDD"
          // ou "01"+14 dígitos válidos à frente; senão o campo vai até o fim.
          fim = s.length;
          for (let j = i + 1; j < s.length - 7; j++) {
            if (s.startsWith("17", j) && dataValida(s.slice(j + 2, j + 8))) { fim = j; break; }
          }
        }
        campos[ai] = s.slice(i, Math.min(fim, i + 20));
        i = fim;
      } else {
        break; // AI desconhecido: interrompe para não interpretar errado
      }
    }
  }

  if (campos["01"] && /^\d{14}$/.test(campos["01"])) r.gtin = campos["01"];
  else if (campos["02"] && /^\d{14}$/.test(campos["02"])) r.gtin = campos["02"];
  r.validade = campos["17"] ? dataGs1(campos["17"]) : null;
  r.lote = campos["10"] || null;
  r.serie = campos["21"] || null;
  return r;
}
