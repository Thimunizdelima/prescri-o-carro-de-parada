import { randomUUID } from "node:crypto";
import type {
  ConferenciaReposicao,
  Indicadores,
  NomeEvento,
  PrescricaoCarroEmergencia,
  RegistroFluxo,
  StatusFluxo,
} from "../../src/types.js";
import type { Armazenamento } from "./armazenamento.js";
import { validarConferencia, validarPrescricao } from "./validacao.js";

export class ErroFluxo extends Error {
  constructor(public status: number, public erros: string[]) {
    super(erros.join(" "));
  }
}

export interface OpcoesFluxo {
  /** Minutos para uma prescrição ser considerada atrasada na farmácia. */
  slaMinutos: number;
  /** Minutos que uma conferência fica reservada para o farmacêutico que a assumiu. */
  reservaMinutos: number;
}

type Ouvinte = (evento: NomeEvento, dados: unknown) => void;

const agora = () => new Date().toISOString();
const hoje = () => new Date().toISOString().slice(0, 10);

/**
 * Regras do fluxo prescrição → farmácia. Não depende de HTTP: pode ser chamado
 * pela API, por testes ou por uma integração direta com o G-HOSP.
 */
export class Fluxo {
  private ouvintes = new Set<Ouvinte>();

  constructor(private db: Armazenamento, private op: OpcoesFluxo) {}

  aoEvento(fn: Ouvinte): () => void {
    this.ouvintes.add(fn);
    return () => this.ouvintes.delete(fn);
  }

  private emitir(evento: NomeEvento, dados: unknown): void {
    for (const fn of this.ouvintes) {
      try {
        fn(evento, dados);
      } catch {
        /* um ouvinte com erro não derruba os outros */
      }
    }
  }

  // ---------------------------------------------------------------- prescrição
  receberPrescricao(p: PrescricaoCarroEmergencia): { registro: RegistroFluxo; nova: boolean } {
    const erros = validarPrescricao(p);
    if (erros.length) throw new ErroFluxo(422, erros);
    const existente = this.db.ler().prescricoes[p.id];
    if (existente) return { registro: existente, nova: false }; // idempotente: reenvio não duplica
    const registro: RegistroFluxo = {
      prescricao: p,
      status: "AGUARDANDO_FARMACIA",
      recebidaEm: agora(),
      inicioConferenciaEm: null,
      farmaceutico: null,
      conferenciaId: null,
      concluidaEm: null,
      atrasada: false,
      historico: [{ em: agora(), evento: "Prescrição recebida", por: p.contexto?.prescritor ?? null }],
    };
    this.db.alterar((b) => (b.prescricoes[p.id] = registro));
    this.emitir("prescricao-recebida", registro);
    return { registro, nova: true };
  }

  listar(filtro: { status?: StatusFluxo[]; limite?: number } = {}): RegistroFluxo[] {
    let lista = Object.values(this.db.ler().prescricoes);
    if (filtro.status?.length) lista = lista.filter((r) => filtro.status!.includes(r.status));
    lista.sort((a, b) => b.recebidaEm.localeCompare(a.recebidaEm));
    return lista.slice(0, filtro.limite ?? 200);
  }

  obter(id: string): RegistroFluxo {
    const r = this.db.ler().prescricoes[id];
    if (!r) throw new ErroFluxo(404, ["Prescrição não encontrada."]);
    return r;
  }

  // ---------------------------------------------------------------- farmácia
  /** O farmacêutico assume a conferência. Evita duas pessoas conferindo o mesmo carro. */
  assumir(id: string, farmaceutico: string): RegistroFluxo {
    const r = this.obter(id);
    if (!farmaceutico?.trim()) throw new ErroFluxo(400, ["Informe o farmacêutico."]);
    if (r.status === "CONFORME" || r.status === "COM_PENDENCIAS") throw new ErroFluxo(409, ["Esta prescrição já foi conferida."]);
    if (r.status === "EM_CONFERENCIA" && r.farmaceutico !== farmaceutico) {
      const desde = Date.parse(r.inicioConferenciaEm ?? "");
      if (Date.now() - desde < this.op.reservaMinutos * 60_000)
        throw new ErroFluxo(409, [`Em conferência por ${r.farmaceutico}.`]);
    }
    this.db.alterar(() => {
      if (r.status !== "EM_CONFERENCIA" || r.farmaceutico !== farmaceutico) {
        r.status = "EM_CONFERENCIA";
        r.farmaceutico = farmaceutico;
        r.inicioConferenciaEm = agora();
        r.historico.push({ em: agora(), evento: "Conferência iniciada", por: farmaceutico });
      }
    });
    this.emitir("conferencia-iniciada", r);
    return r;
  }

  concluirConferencia(c: ConferenciaReposicao): RegistroFluxo {
    const r = this.obter(c?.prescricaoId);
    const banco = this.db.ler();
    if (banco.conferencias[c.id]) return r; // idempotente
    if (r.status === "CONFORME" || r.status === "COM_PENDENCIAS") throw new ErroFluxo(409, ["Esta prescrição já foi conferida."]);
    const erros = validarConferencia(c, r.prescricao);
    if (erros.length) throw new ErroFluxo(422, erros);

    this.db.alterar((b) => {
      b.conferencias[c.id] = c;
      r.status = c.situacao === "CONFORME" ? "CONFORME" : "COM_PENDENCIAS";
      r.conferenciaId = c.id;
      r.farmaceutico = c.farmaceutico;
      r.concluidaEm = c.dataHoraConferencia;
      r.historico.push({ em: agora(), evento: r.status === "CONFORME" ? "Reposição conforme" : "Reposição com pendências", por: c.farmaceutico });
      // Automação 1: baixa de estoque por lote.
      for (const i of c.itens)
        for (const l of i.lotes)
          b.movimentos.push({
            id: randomUUID(), tipo: "SAIDA_REPOSICAO_CARRO", em: c.dataHoraConferencia, numeroCarro: c.numeroCarro,
            conferenciaId: c.id, prescricaoId: c.prescricaoId, descricao: i.descricao, opcao: i.opcao, codigo: i.codigo,
            lote: l.lote, validade: l.validade, quantidade: l.quantidade, unidade: i.unidade,
          });
      // Automação 2: requisição de compra para o que faltou.
      for (const i of c.itens)
        if (i.falta)
          b.requisicoes.push({
            id: randomUUID(), em: c.dataHoraConferencia, status: "ABERTA", numeroCarro: c.numeroCarro, conferenciaId: c.id,
            descricao: i.descricao, opcao: i.opcao, codigo: i.codigo, quantidade: i.falta.quantidade, unidade: i.unidade,
            motivo: i.falta.motivo, observacao: i.falta.observacao,
          });
    });
    this.emitir("conferencia-concluida", { registro: r, conferencia: c });
    return r;
  }

  // ---------------------------------------------------------------- SLA e indicadores
  /** Marca prescrições paradas há mais tempo que o SLA e avisa em tempo real. Rodar a cada minuto. */
  verificarSla(): RegistroFluxo[] {
    const limite = this.op.slaMinutos * 60_000;
    const novas: RegistroFluxo[] = [];
    this.db.alterar((b) => {
      for (const r of Object.values(b.prescricoes)) {
        const aberta = r.status === "AGUARDANDO_FARMACIA" || r.status === "EM_CONFERENCIA";
        if (aberta && !r.atrasada && Date.now() - Date.parse(r.recebidaEm) > limite) {
          r.atrasada = true;
          r.historico.push({ em: agora(), evento: `Passou do prazo de ${this.op.slaMinutos} min`, por: null });
          novas.push(r);
        }
      }
    });
    for (const r of novas) this.emitir("alerta-sla", r);
    return novas;
  }

  indicadores(): Indicadores {
    const b = this.db.ler();
    const lista = Object.values(b.prescricoes);
    const hojeStr = hoje();
    const concl = lista.filter((r) => r.concluidaEm?.startsWith(hojeStr));
    const tempos = concl.map((r) => (Date.parse(r.concluidaEm!) - Date.parse(r.recebidaEm)) / 60_000);
    return {
      aguardando: lista.filter((r) => r.status === "AGUARDANDO_FARMACIA").length,
      emConferencia: lista.filter((r) => r.status === "EM_CONFERENCIA").length,
      concluidasHoje: concl.length,
      comPendenciasHoje: concl.filter((r) => r.status === "COM_PENDENCIAS").length,
      atrasadas: lista.filter((r) => r.atrasada && (r.status === "AGUARDANDO_FARMACIA" || r.status === "EM_CONFERENCIA")).length,
      tempoMedioMinutos: tempos.length ? Math.round(tempos.reduce((s, t) => s + t, 0) / tempos.length) : null,
      requisicoesAbertas: b.requisicoes.filter((q) => q.status === "ABERTA").length,
      slaMinutos: this.op.slaMinutos,
    };
  }
}
