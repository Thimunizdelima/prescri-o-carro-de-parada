import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import type { ConferenciaReposicao, MovimentoEstoque, RegistroFluxo, RequisicaoCompra } from "../../src/types.js";

/** Tudo que o serviço guarda. */
export interface Banco {
  prescricoes: Record<string, RegistroFluxo>;
  conferencias: Record<string, ConferenciaReposicao>;
  movimentos: MovimentoEstoque[];
  requisicoes: RequisicaoCompra[];
  /** Códigos de barras aprendidos na farmácia: GTIN → item/opção. */
  gtins: Record<string, { descricao: string; opcao: string | null }>;
}

/**
 * Armazenamento. A implementação padrão grava um arquivo JSON (suficiente para piloto).
 * Para produção, o TI pode trocar por banco do G-HOSP implementando esta mesma interface.
 */
export interface Armazenamento {
  ler(): Banco;
  /** Aplica uma alteração e grava de forma atômica. */
  alterar<T>(fn: (b: Banco) => T): T;
}

const vazio = (): Banco => ({ prescricoes: {}, conferencias: {}, movimentos: [], requisicoes: [], gtins: {} });

export class ArmazenamentoJson implements Armazenamento {
  private banco: Banco;

  constructor(private caminho: string) {
    mkdirSync(dirname(caminho), { recursive: true });
    this.banco = existsSync(caminho) ? { ...vazio(), ...JSON.parse(readFileSync(caminho, "utf8")) } : vazio();
  }

  ler(): Banco {
    return this.banco;
  }

  alterar<T>(fn: (b: Banco) => T): T {
    const r = fn(this.banco);
    const tmp = `${this.caminho}.tmp`;
    writeFileSync(tmp, JSON.stringify(this.banco, null, 2));
    renameSync(tmp, this.caminho); // troca atômica: o arquivo nunca fica pela metade
    return r;
  }
}

/** Armazenamento só em memória (testes). */
export class ArmazenamentoMemoria implements Armazenamento {
  private banco = vazio();
  ler(): Banco {
    return this.banco;
  }
  alterar<T>(fn: (b: Banco) => T): T {
    return fn(this.banco);
  }
}
