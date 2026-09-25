// src/checklist-padrao.ts
var CHECKLIST_PADRAO = [
  {
    titulo: "Materiais",
    itens: [
      { descricao: "Agulha desc", maximo: 5, opcoes: ["40x12", "25x7"] },
      { descricao: "Aparelho de tricotomia", maximo: 1 },
      { descricao: "C\xE2nula de Guedel n\xBA 4", maximo: 1 },
      { descricao: "C\xE2nula traqueostomia", maximo: 1, opcoes: ["n\xBA 7,0", "n\xBA 7,5", "n\xBA 8,0", "n\xBA 8,5"] },
      { descricao: "Capa sanfonada videolaparoscopia 15x250cm", maximo: 1 },
      { descricao: "Cateter venoso central 7 FR (duplo l\xFAmen)", maximo: 1 },
      { descricao: "Cateter intrav. de seguran\xE7a (19mm) (Abocath)", maximo: 2, opcoes: ["n\xBA 16", "n\xBA 18", "n\xBA 20", "n\xBA 22", "n\xBA 24"] },
      { descricao: "Coletor de urina sistema aberto 1200ml", maximo: 1 },
      { descricao: "Conex\xE3o para infus\xE3o 2 vias (Polifix)", maximo: 2 },
      { descricao: "Curativo filme imperme\xE1vel respir\xE1vel 8,5x11,5cm (Tegaderm)", maximo: 1 },
      { descricao: "Eletrodo desc adulto", maximo: 10 },
      { descricao: "Equipo FS bomba de infus\xE3o Bene Fusion", maximo: 1 },
      { descricao: "Equipo bomba de infus\xE3o Bene Fusion", maximo: 4 },
      { descricao: "Equipo macrogotas", maximo: 2 },
      { descricao: "Filtro HEPA", maximo: 1 },
      { descricao: "Filtro HMEF", maximo: 1 },
      { descricao: "Fixador est\xE9ril cateter perif\xE9rico (IV Fix)", maximo: 1 },
      { descricao: "Luva cir\xFArgica est\xE9ril", maximo: 1, opcoes: ["n\xBA 6,5", "n\xBA 7,0", "n\xBA 7,5"] },
      { descricao: "M\xE1scara lar\xEDngea n\xBA 4", maximo: 1 },
      { descricao: "Seringa desc s/ rosca", maximo: 5, opcoes: ["10ml", "20ml"] },
      { descricao: "Sonda para aspira\xE7\xE3o traqueal n\xBA 12", maximo: 3 },
      { descricao: "Sonda nasog\xE1strica longa n\xBA 18", maximo: 1 },
      { descricao: "Torneirinha 3 vias c/ rosca", maximo: 3 },
      { descricao: "Sonda endotraqueal c/ bal\xE3o", maximo: 2, opcoes: ["n\xBA 6,0", "n\xBA 6,5", "n\xBA 7,0", "n\xBA 7,5", "n\xBA 8,0", "n\xBA 8,5"] },
      { descricao: "Tubo extensor para oxig\xEAnio n\xBA 16 (2m)", maximo: 1 },
      { descricao: "Kit material cateter venoso central adulto", maximo: 1, unidade: "kit" },
      { descricao: "Kit material de pun\xE7\xE3o press\xE3o invasiva (PAI)", maximo: 1, unidade: "kit" }
    ]
  },
  {
    titulo: "Materiais CME",
    itens: [
      { descricao: "Ambu", maximo: 1, opcoes: ["Adulto", "Pedi\xE1trico"] },
      { descricao: "Fio guia", maximo: 1, opcoes: ["Adulto", "Pedi\xE1trico"] },
      { descricao: "Cadar\xE7o", maximo: 5 },
      { descricao: "Fio guia bougie", maximo: 1 },
      { descricao: "Garrote", maximo: 1 },
      { descricao: "Gel", maximo: 1, unidade: "fr" },
      { descricao: "Lanterna pequena", maximo: 1, semValidade: true },
      { descricao: "Luva pl\xE1stica desc", maximo: 10 },
      { descricao: "Luva procedimento M", maximo: 1, unidade: "cx" },
      { descricao: "Micropore", maximo: 1, unidade: "rolo" },
      { descricao: "Laringosc\xF3pio com pilha", maximo: 3, semValidade: true },
      { descricao: "L\xE2mina para laringosc\xF3pio", maximo: 2, opcoes: ["Curva n\xBA 3", "Curva n\xBA 4", "Reta n\xBA 3", "Reta n\xBA 4"] }
    ]
  },
  {
    titulo: "Medicamentos",
    itens: [
      { descricao: "Adenosina 3mg/ml amp 2ml", maximo: 3, unidade: "amp" },
      { descricao: "Adrenalina / Epinefrina 1mg/ml amp 1ml", maximo: 15, unidade: "amp" },
      { descricao: "\xC1gua destilada amp 10ml", maximo: 10, unidade: "amp" },
      { descricao: "Amiodarona 50mg/ml amp 3ml", maximo: 3, unidade: "amp" },
      { descricao: "Atropina 0,5mg/ml amp 1ml", maximo: 3, unidade: "amp" },
      { descricao: "Gluconato de c\xE1lcio 10% amp 10ml", maximo: 4, unidade: "amp" },
      { descricao: "Diazepam 10mg/2ml amp 2ml", maximo: 1, unidade: "amp" },
      { descricao: "Etomidato 2mg/ml amp 10ml", maximo: 1, unidade: "amp" },
      { descricao: "Fenito\xEDna 50mg/ml amp 5ml", maximo: 4, unidade: "amp" },
      { descricao: "Fentanila 0,05mg/ml amp 2ml", maximo: 3, unidade: "amp" },
      { descricao: "Flumazenil 0,1mg/ml amp 5ml", maximo: 1, unidade: "amp" },
      { descricao: "Furosemida 10mg/ml amp 2ml", maximo: 2, unidade: "amp" },
      { descricao: "Glicose 50% amp 10ml", maximo: 5, unidade: "amp" },
      { descricao: "Hidrocortisona 500mg", maximo: 1, unidade: "fr" },
      { descricao: "Lidoca\xEDna 2% sem vaso amp 20ml", maximo: 1, unidade: "amp" },
      { descricao: "Midazolam 5mg/ml amp 3ml", maximo: 2, unidade: "amp" },
      { descricao: "Naloxona 0,4mg/ml amp 1ml", maximo: 1, unidade: "amp" },
      { descricao: "Nitroglicerina 5mg/ml amp 10ml", maximo: 1, unidade: "amp" },
      { descricao: "Bicarbonato de s\xF3dio 8,4% fr 250ml", maximo: 2, unidade: "fr" },
      { descricao: "Nitroprussiato de s\xF3dio 50mg", maximo: 1, unidade: "amp" },
      { descricao: "Sulfato de magn\xE9sio 10% amp 10ml", maximo: 2, unidade: "amp" },
      { descricao: "Suxamet\xF4nio 100mg", maximo: 1, unidade: "amp" }
    ]
  },
  {
    titulo: "Especificidades",
    itens: [
      { descricao: "Deslanos\xEDdeo 0,2mg/ml amp 2ml", maximo: 2, unidade: "amp" },
      { descricao: "Escetamina, cloridrato de 50mg/ml amp 2ml", maximo: 1, unidade: "amp" },
      { descricao: "Bicarbonato de s\xF3dio 8,4% amp 10ml", maximo: 15, unidade: "amp" }
    ]
  },
  {
    titulo: "Kits",
    itens: [
      { descricao: "Amiodarona 150mg dose manuten\xE7\xE3o (6 amp)", maximo: 1, unidade: "kit" },
      { descricao: "Fentanila 0,5mg/10ml concentrado (10 amp)", maximo: 1, unidade: "kit" },
      { descricao: "Midazolam 50mg/10ml concentrado (10 amp)", maximo: 1, unidade: "kit" },
      { descricao: "Noradrenalina 8mg/4ml simples (4 amp)", maximo: 1, unidade: "kit" }
    ]
  },
  {
    titulo: "Solu\xE7\xF5es",
    itens: [
      { descricao: "Cloreto de s\xF3dio 0,9% 500ml", maximo: 1, unidade: "fr" },
      { descricao: "Glicose 5% 250ml", maximo: 2, unidade: "fr" },
      { descricao: "Ringer lactato 500ml", maximo: 2, unidade: "fr" }
    ]
  }
];

// src/estilos.ts
var ESTILOS = (
  /* css */
  `
:host{
  --pce-primaria:#264476; --pce-secundaria:#293b6b; --pce-destaque:#87add8;
  --pce-fundo:#f2f5fa; --pce-superficie:#ffffff; --pce-texto:#1b2b4a; --pce-suave:#5b6b86;
  --pce-linha:#d6dfec; --pce-cabecalho:#e6edf7; --pce-selecionado:#eef4fb;
  --pce-alerta:#b3261e; --pce-alerta-fundo:#fbe9e7;
  display:block; color:var(--pce-texto); background:var(--pce-fundo);
  font:15px/1.45 "IBM Plex Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  padding:20px 16px 32px;
}
*{box-sizing:border-box}
[hidden]{display:none!important}
.wrap{max-width:1180px;margin:0 auto;display:flex;flex-direction:column;gap:18px}
h1{margin:0;font-size:24px;line-height:1.2;color:var(--pce-secundaria)}
.topo{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;justify-content:space-between}
input[type=search],input[type=text],textarea{font:inherit;color:var(--pce-texto);background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:6px;padding:8px 10px}
input[type=search]{width:240px;max-width:100%}
button{font:inherit;font-weight:600;cursor:pointer;border-radius:6px;padding:8px 14px;border:1px solid var(--pce-linha);background:var(--pce-superficie);color:var(--pce-texto)}
button.primario{background:var(--pce-primaria);border-color:var(--pce-primaria);color:#fff}
button.perigo{color:var(--pce-alerta);border-color:var(--pce-alerta)}
button.grande{padding:12px 22px;font-size:16px}
button:disabled{opacity:.6;cursor:wait}
:is(button,input,select,textarea):focus-visible{outline:2px solid var(--pce-destaque);outline-offset:2px}
.resumo{display:flex;flex-wrap:wrap;gap:12px;align-items:center;background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px;padding:12px 16px}
.pill{font-weight:600;font-variant-numeric:tabular-nums;background:var(--pce-cabecalho);color:var(--pce-primaria);border-radius:999px;padding:2px 10px}
.esp{flex:1}
.campos{display:flex;flex-wrap:wrap;gap:16px}
.campos label{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--pce-suave);font-weight:600;letter-spacing:.04em;text-transform:uppercase}
.grade{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}
.col{display:flex;flex-direction:column;gap:18px}
@media (max-width:860px){.grade{grid-template-columns:1fr}}
section{background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px;overflow:hidden}
section h2{margin:0;font-size:13px;letter-spacing:.08em;text-transform:uppercase;padding:10px 14px;background:var(--pce-cabecalho);color:var(--pce-secundaria);display:flex;justify-content:space-between}
section h2 small{font-weight:500;color:var(--pce-suave);letter-spacing:0;text-transform:none;font-size:12px}
table{width:100%;border-collapse:collapse}
th{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--pce-suave);text-align:left;padding:6px 14px;border-bottom:1px solid var(--pce-linha)}
td{padding:7px 14px;border-bottom:1px solid var(--pce-linha);vertical-align:middle}
tr:last-child td{border-bottom:0}
tr.on td{background:var(--pce-selecionado)}
th.dir,td.qtd{text-align:right}
label.item{display:flex;gap:10px;align-items:flex-start;cursor:pointer}
label.item input{width:18px;height:18px;margin:1px 0 0;accent-color:var(--pce-primaria);flex:none}
.dica{display:block;font-size:12px;color:var(--pce-suave);margin-top:2px}
.linhas{display:flex;flex-direction:column;gap:6px;align-items:flex-end}
.linha{display:flex;gap:6px;align-items:center;justify-content:flex-end;flex-wrap:wrap}
select{font:600 14px ui-monospace,"IBM Plex Mono",monospace;color:var(--pce-texto);background:var(--pce-superficie);border:1px solid var(--pce-primaria);border-radius:6px;padding:4px 6px;min-width:64px}
select.opc{font-family:inherit;min-width:96px}
select.pend{border-color:var(--pce-alerta);background:var(--pce-alerta-fundo)}
.un{font-size:12px;color:var(--pce-suave)}
.mini{padding:3px 9px;font-size:13px}
.add{color:var(--pce-primaria);border-style:dashed}
.just{display:flex;flex-direction:column;gap:6px;background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px;padding:14px 16px}
.just label{font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--pce-secundaria)}
.just small{color:var(--pce-suave);font-size:13px}
.just textarea{min-height:110px;resize:vertical;width:100%;background:var(--pce-fundo)}
.gerar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:flex-end;border-top:1px solid var(--pce-linha);padding-top:16px}
.msg{flex:1;min-width:220px;font-size:14px;color:var(--pce-suave)}
.msg.erro{color:var(--pce-alerta);font-weight:600}
.rx .meta{display:flex;flex-wrap:wrap;gap:6px 20px;padding:10px 14px;font-size:13px;color:var(--pce-suave);border-bottom:1px solid var(--pce-linha)}
.rx td.n{font-variant-numeric:tabular-nums;font-weight:600;white-space:nowrap;width:90px}
.rx .bloco{padding:10px 14px;border-top:1px solid var(--pce-linha);font-size:14px;white-space:pre-wrap}
.rx .status{background:var(--pce-cabecalho)}
.rx .status.erro{background:var(--pce-alerta-fundo);color:var(--pce-alerta)}
.confirma{display:flex;gap:8px;align-items:center;font-size:14px}
`
);

// src/ghosp-client.ts
function criarEnvioHttp(cfg) {
  return async (corpoEnvio) => {
    const controle = new AbortController();
    const timer = setTimeout(() => controle.abort(), cfg.timeoutMs ?? 15e3);
    try {
      const resp = await fetch(cfg.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", ...cfg.headers },
        credentials: cfg.usarCookies === false ? "omit" : "include",
        body: JSON.stringify(corpoEnvio),
        signal: controle.signal
      });
      let corpo = {};
      try {
        corpo = await resp.json();
      } catch {
      }
      return { enviado: resp.ok, status: resp.status, idPrescricao: corpo.idPrescricao, mensagem: corpo.mensagem };
    } finally {
      clearTimeout(timer);
    }
  };
}

// src/integracao.ts
var ROTULO_FLUXO = {
  AGUARDANDO_FARMACIA: "Aguardando farm\xE1cia",
  EM_CONFERENCIA: "Em confer\xEAncia",
  CONFORME: "Reposto",
  COM_PENDENCIAS: "Reposto com pend\xEAncias"
};
var ClienteServico = class {
  constructor(base, token = null) {
    this.base = base;
    this.token = token;
    this.enviarPrescricao = (p) => this.envio("/api/prescricoes", p);
    this.enviarConferencia = (c) => this.envio("/api/conferencias", c);
    this.base = base.replace(/\/+$/, "");
  }
  async pedir(metodo, caminho, corpo) {
    const r = await fetch(this.base + caminho, {
      method: metodo,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...corpo !== void 0 ? { "Content-Type": "application/json" } : {},
        ...this.token ? { Authorization: `Bearer ${this.token}` } : {}
      },
      body: corpo !== void 0 ? JSON.stringify(corpo) : void 0
    });
    let dados = null;
    try {
      dados = await r.json();
    } catch {
    }
    return { ok: r.ok, status: r.status, dados };
  }
  async envio(caminho, corpo) {
    const r = await this.pedir("POST", caminho, corpo);
    return { enviado: r.ok, status: r.status, idPrescricao: r.dados?.idPrescricao, mensagem: r.dados?.mensagem };
  }
  async listar(status, limite = 100) {
    const q = new URLSearchParams({ limite: String(limite), ...status?.length ? { status: status.join(",") } : {} });
    const r = await this.pedir("GET", `/api/prescricoes?${q}`);
    return r.ok ? r.dados : [];
  }
  async obter(id) {
    const r = await this.pedir("GET", `/api/prescricoes/${encodeURIComponent(id)}`);
    return r.ok ? r.dados : null;
  }
  async assumir(id, farmaceutico) {
    const r = await this.pedir("POST", `/api/prescricoes/${encodeURIComponent(id)}/assumir`, { farmaceutico });
    return { ok: r.ok, mensagem: r.dados?.mensagem };
  }
  async indicadores() {
    const r = await this.pedir("GET", "/api/indicadores");
    return r.ok ? r.dados : null;
  }
  async requisicoes(status = "ABERTA") {
    const r = await this.pedir("GET", `/api/requisicoes?status=${status}`);
    return r.ok ? r.dados : [];
  }
  async atenderRequisicao(id) {
    return (await this.pedir("POST", `/api/requisicoes/${encodeURIComponent(id)}/atender`, {})).ok;
  }
  async checklist() {
    const r = await this.pedir("GET", "/api/checklist");
    return r.ok ? r.dados : null;
  }
  async salvarGtin(gtin, descricao, opcao) {
    return (await this.pedir("POST", "/api/gtins", { gtin, descricao, opcao })).ok;
  }
  /** Assina os eventos em tempo real. Reconecta sozinho. Devolve a função para cancelar. */
  ouvir(fn, aoConectar) {
    if (typeof EventSource === "undefined") return () => {
    };
    const es = new EventSource(this.base + "/api/eventos", { withCredentials: true });
    if (aoConectar) es.onopen = () => aoConectar();
    const nomes = ["prescricao-recebida", "conferencia-iniciada", "conferencia-concluida", "alerta-sla"];
    for (const n of nomes) es.addEventListener(n, (e) => fn(n, JSON.parse(e.data)));
    return () => es.close();
  }
};

// src/regras.ts
function normalizarLinhas(item, linhas) {
  let restante = item.maximo;
  const usadas = /* @__PURE__ */ new Set();
  const saida = [];
  for (const l of linhas) {
    if (restante <= 0) break;
    const qtd = Math.min(Math.max(1, Math.trunc(Number(l.quantidade)) || 1), restante);
    let opcao = null;
    if (item.opcoes) {
      opcao = l.opcao && item.opcoes.includes(l.opcao) && !usadas.has(l.opcao) ? l.opcao : "";
      if (opcao) usadas.add(opcao);
    }
    saida.push({ opcao, quantidade: qtd });
    restante -= qtd;
  }
  return saida.length ? saida : [{ opcao: item.opcoes ? "" : null, quantidade: 1 }];
}
function limiteDaLinha(item, linhas, indice) {
  const outras = linhas.reduce((s, l, i) => i === indice ? s : s + l.quantidade, 0);
  return Math.max(1, item.maximo - outras);
}
function podeAdicionarOpcao(item, linhas) {
  if (!item.opcoes) return false;
  const total = linhas.reduce((s, l) => s + l.quantidade, 0);
  return total < item.maximo && linhas.length < item.opcoes.length;
}

// src/prescricao-carro-emergencia.ts
var ErroValidacao = class extends Error {
  constructor(pendencias) {
    super(pendencias.join(" "));
    this.pendencias = pendencias;
    this.name = "ErroValidacao";
  }
};
var esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
var novoId = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  return (c === "x" ? r : r & 3 | 8).toString(16);
});
var CANAL_PADRAO = "carro-emergencia";
var semAcento = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
var PrescricaoCarroEmergenciaElement = class extends HTMLElement {
  constructor() {
    super();
    /** Função de envio personalizada. Tem prioridade sobre o atributo `endpoint`. */
    this.enviar = null;
    this._checklist = CHECKLIST_PADRAO;
    this._cfg = null;
    this.uso = /* @__PURE__ */ new Map();
    this.linhas = [];
    this.aoMudar = (e) => {
      const alvo = e.target;
      const l = this.linhaDe(alvo);
      if (!l) return;
      const campo = alvo.dataset.campo;
      if (alvo.dataset.acao === "marcar") {
        if (alvo.checked) this.uso.set(l.chave, [{ opcao: l.item.opcoes ? "" : null, quantidade: 1 }]);
        else this.uso.delete(l.chave);
      } else if (campo === "q" || campo === "o") {
        const linhas = this.uso.get(l.chave);
        const k = Number(alvo.dataset.k);
        if (campo === "q") linhas[k].quantidade = Number(alvo.value);
        else linhas[k].opcao = alvo.value;
        this.uso.set(l.chave, normalizarLinhas(l.item, linhas));
      } else return;
      this.renderizarQtd(l);
      this.atualizarResumo();
    };
    this.aoClicar = (e) => {
      const btn = e.target.closest("button[data-acao]");
      if (!btn) return;
      const acao = btn.dataset.acao;
      if (acao === "gerar") return void this.gerar();
      if (acao === "limpar") return this.pedirConfirmacao();
      if (acao === "copiar" || acao === "copiar-json") return void this.copiar(btn, acao === "copiar-json");
      const l = this.linhaDe(btn);
      if (!l) return;
      const linhas = this.uso.get(l.chave);
      if (acao === "add") linhas.push({ opcao: "", quantidade: 1 });
      if (acao === "del") linhas.splice(Number(btn.dataset.k), 1);
      this.uso.set(l.chave, normalizarLinhas(l.item, linhas));
      this.renderizarQtd(l);
      this.atualizarResumo();
    };
    this.aoBuscar = (e) => {
      const q = semAcento(e.target.value.trim());
      for (const l of this.linhas) {
        const tr = this.$(`tr[data-chave="${l.chave}"]`);
        tr.hidden = !!q && !l.busca.includes(q);
      }
    };
    this.ultima = null;
    this.pararEscuta = null;
    this.root = this.attachShadow({ mode: "open" });
    this.root.addEventListener("change", (e) => this.aoMudar(e));
    this.root.addEventListener("click", (e) => this.aoClicar(e));
  }
  static get observedAttributes() {
    return ["endpoint", "checklist-url", "numero-carro"];
  }
  // ---------------------------------------------------------------- ciclo de vida
  connectedCallback() {
    this.renderizar();
    const url = this.getAttribute("checklist-url");
    if (url) void this.carregarChecklist(url);
  }
  attributeChangedCallback(nome, antigo, novo) {
    if (antigo === novo || !this.isConnected || !this.root.firstChild) return;
    if (nome === "checklist-url" && novo) void this.carregarChecklist(novo);
    if (nome === "numero-carro") this.campo("numeroCarro").value = novo ?? "";
    if (nome === "endpoint") this._cfg = novo ? { ...this._cfg ?? {}, endpoint: novo } : null;
  }
  // ---------------------------------------------------------------- API pública
  get checklist() {
    return this._checklist;
  }
  set checklist(valor) {
    this._checklist = valor;
    this.uso.clear();
    if (this.isConnected) this.renderizar();
  }
  configurar(cfg) {
    this._cfg = cfg;
  }
  limpar() {
    this.uso.clear();
    this.renderizar();
  }
  obterPrescricao() {
    const pend = [];
    const numeroCarro = this.campo("numeroCarro").value.trim();
    if (!numeroCarro) pend.push("Preencha o n\xFAmero do carro de parada.");
    if (!this.uso.size) pend.push("Marque pelo menos um item utilizado.");
    const semOpcao = this.linhas.filter((l) => l.item.opcoes && this.uso.get(l.chave)?.some((u) => !u.opcao)).map((l) => l.item.descricao);
    if (semOpcao.length) pend.push(`Escolha a op\xE7\xE3o utilizada em: ${semOpcao.join(", ")}.`);
    if (pend.length) throw new ErroValidacao(pend);
    const itens = [];
    for (const l of this.linhas) {
      for (const u of this.uso.get(l.chave) ?? []) {
        itens.push({
          secao: l.secao,
          codigo: l.item.codigo ?? null,
          descricao: l.item.descricao,
          opcao: u.opcao || null,
          quantidade: u.quantidade,
          unidade: l.item.unidade ?? "und",
          quantitativoPrevisto: l.item.maximo
        });
      }
    }
    const contexto = {
      atendimento: this.getAttribute("atendimento"),
      paciente: this.getAttribute("paciente"),
      prescritor: this.getAttribute("prescritor"),
      setor: this.getAttribute("setor")
    };
    return {
      tipo: "PRESCRICAO_CARRO_EMERGENCIA",
      versao: 1,
      id: novoId(),
      dataHora: (/* @__PURE__ */ new Date()).toISOString(),
      numeroCarro,
      lacreRompido: this.campo("lacreRompido").value.trim() || null,
      lacreNovo: this.campo("lacreNovo").value.trim() || null,
      contexto,
      itens,
      justificativa: this.campo("justificativa").value.trim() || null
    };
  }
  async gerar() {
    const msg = this.$(".msg");
    const rx = this.$(".rx");
    const botao = this.$("#gerar");
    msg.classList.remove("erro");
    let p;
    try {
      p = this.obterPrescricao();
    } catch (e) {
      msg.textContent = e instanceof ErroValidacao ? e.pendencias.join(" ") : String(e);
      msg.classList.add("erro");
      rx.hidden = true;
      return;
    }
    const canal = this.getAttribute("canal") ?? CANAL_PADRAO;
    if (canal !== "off" && typeof BroadcastChannel !== "undefined") {
      try {
        const bc = new BroadcastChannel(canal);
        bc.postMessage({ tipo: "prescricao", prescricao: p });
        bc.close();
      } catch {
      }
    }
    const continuar = this.dispatchEvent(
      new CustomEvent("prescricao-gerada", { detail: p, bubbles: true, composed: true, cancelable: true })
    );
    let status = "";
    let erro = false;
    if (!continuar) {
      status = "Prescri\xE7\xE3o entregue ao G-HOSP.";
    } else {
      const envio = this.enviar ?? (this._cfg?.endpoint ? criarEnvioHttp(this._cfg) : this.cliente?.enviarPrescricao ?? null);
      if (!envio) {
        status = "Envio autom\xE1tico para a aba Prescri\xE7\xF5es do G-HOSP ainda n\xE3o configurado.";
      } else {
        botao.disabled = true;
        botao.textContent = "Enviando\u2026";
        try {
          const r = await envio(p);
          if (r.enviado) {
            status = this.cliente && !this.enviar && !this._cfg?.endpoint ? esc(r.mensagem ?? "Prescri\xE7\xE3o encaminhada \xE0 farm\xE1cia.") : `Prescri\xE7\xE3o enviada para a aba Prescri\xE7\xF5es do G-HOSP${r.idPrescricao ? ` (n\xBA ${esc(r.idPrescricao)})` : ""}.`;
            this.emitir("prescricao-enviada", { prescricao: p, resultado: r });
          } else {
            erro = true;
            status = `O G-HOSP n\xE3o aceitou a prescri\xE7\xE3o${r.status ? ` (c\xF3digo ${r.status})` : ""}. ${esc(r.mensagem ?? "Confira os dados e tente de novo.")}`;
            this.emitir("prescricao-erro", { prescricao: p, erro: r });
          }
        } catch (e) {
          erro = true;
          status = "N\xE3o foi poss\xEDvel conectar ao G-HOSP. Verifique a rede e tente de novo.";
          this.emitir("prescricao-erro", { prescricao: p, erro: e });
        } finally {
          botao.disabled = false;
          botao.textContent = "Gerar Prescri\xE7\xE3o";
        }
      }
    }
    this.mostrarPrescricao(p, status, erro);
    if (!erro && this.cliente) this.acompanhar(p.id);
    msg.textContent = `Prescri\xE7\xE3o gerada com ${p.itens.length} ${p.itens.length === 1 ? "linha" : "linhas"}.`;
  }
  // ---------------------------------------------------------------- internos
  async carregarChecklist(url) {
    try {
      const resp = await fetch(url, { credentials: "include" });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      this.checklist = await resp.json();
    } catch (e) {
      this.emitir("prescricao-erro", { erro: `N\xE3o foi poss\xEDvel carregar o check list (${String(e)}).` });
    }
  }
  emitir(nome, detail) {
    this.dispatchEvent(new CustomEvent(nome, { detail, bubbles: true, composed: true }));
  }
  $(sel) {
    return this.root.querySelector(sel);
  }
  campo(id) {
    return this.root.getElementById(id);
  }
  renderizar() {
    this.linhas = [];
    const secoes = this._checklist.map((sec, si) => {
      const trs = sec.itens.map((item, ii) => {
        const chave = `${si}_${ii}`;
        this.linhas.push({
          chave,
          secao: sec.titulo,
          item,
          busca: semAcento(`${item.descricao} ${(item.opcoes ?? []).join(" ")}`)
        });
        const dica = item.opcoes ? `<span class="dica">${item.opcoes.map(esc).join(" \xB7 ")}</span>` : "";
        return `<tr data-chave="${chave}">
            <td><label class="item"><input type="checkbox" data-acao="marcar"><span>${esc(item.descricao)}${dica}</span></label></td>
            <td class="qtd"><div class="linhas" hidden></div></td></tr>`;
      }).join("");
      return `<section><h2>${esc(sec.titulo)}<small>${sec.itens.length} itens</small></h2>
        <table><thead><tr><th>Item</th><th class="dir">Utilizado</th></tr></thead><tbody>${trs}</tbody></table></section>`;
    });
    const total = this._checklist.reduce((s, sec) => s + sec.itens.length, 0);
    let meio = 0;
    for (let acc = 0, melhor = Infinity, i = 0; i <= this._checklist.length; i++) {
      const dif = Math.abs(total - 2 * acc);
      if (dif < melhor) [melhor, meio] = [dif, i];
      acc += this._checklist[i]?.itens.length ?? 0;
    }
    const numero = esc(this.getAttribute("numero-carro") ?? "");
    this.root.innerHTML = `<style>${ESTILOS}</style>
      <div class="wrap">
        <div class="topo">
          <h1>Formul\xE1rio de Prescri\xE7\xE3o de Carro de Emerg\xEAncia</h1>
          <input type="search" id="busca" placeholder="Buscar item\u2026" aria-label="Buscar item">
        </div>
        <div class="resumo" aria-live="polite">
          <span><span class="pill" id="cnt">0</span> itens utilizados</span>
          <span><span class="pill" id="tot">0</span> unidades no total</span>
          <span class="esp"></span>
          <span id="caixaLimpar"><button class="perigo" type="button" data-acao="limpar">Limpar tudo</button></span>
        </div>
        <div class="campos">
          <label for="numeroCarro">N\xFAmero do carro de parada<input id="numeroCarro" type="text" inputmode="numeric" value="${numero}" required></label>
          <label for="lacreRompido">Lacre rompido<input id="lacreRompido" type="text" inputmode="numeric"></label>
          <label for="lacreNovo">Lacre novo<input id="lacreNovo" type="text" inputmode="numeric"></label>
        </div>
        <div class="grade"><div class="col">${secoes.slice(0, meio).join("")}</div><div class="col">${secoes.slice(meio).join("")}</div></div>
        <div class="just">
          <label for="justificativa">Justificativa</label>
          <small>Use em caso de quebra de medicamento ou de medicamento dilu\xEDdo e n\xE3o utilizado.</small>
          <textarea id="justificativa" placeholder="Descreva o ocorrido (opcional)"></textarea>
        </div>
        <div class="gerar">
          <span class="msg" aria-live="polite">Ao terminar de marcar os itens utilizados, gere a prescri\xE7\xE3o.</span>
          <button class="primario grande" id="gerar" type="button" data-acao="gerar">Gerar Prescri\xE7\xE3o</button>
        </div>
        <section class="rx" hidden></section>
      </div>`;
    this.$("#busca").addEventListener("input", this.aoBuscar);
    this.atualizarResumo();
  }
  linhaDe(el) {
    const tr = el.closest("tr[data-chave]");
    return tr ? this.linhas.find((l) => l.chave === tr.dataset.chave) : void 0;
  }
  renderizarQtd(l) {
    const tr = this.$(`tr[data-chave="${l.chave}"]`);
    const caixa = tr.querySelector(".linhas");
    const linhas = this.uso.get(l.chave);
    tr.classList.toggle("on", !!linhas);
    caixa.hidden = !linhas;
    if (!linhas) {
      caixa.innerHTML = "";
      return;
    }
    const un = l.item.unidade ?? "und";
    caixa.innerHTML = linhas.map((u, k) => {
      const limite = limiteDaLinha(l.item, linhas, k);
      const ocupadas = new Set(linhas.filter((_, j) => j !== k).map((x) => x.opcao).filter(Boolean));
      const opc = l.item.opcoes ? `<select class="opc${u.opcao ? "" : " pend"}" data-campo="o" data-k="${k}" aria-label="Op\xE7\xE3o utilizada de ${esc(l.item.descricao)}">
                <option value="" disabled${u.opcao ? "" : " selected"}>Qual?</option>
                ${l.item.opcoes.filter((o) => !ocupadas.has(o) || o === u.opcao).map((o) => `<option${o === u.opcao ? " selected" : ""}>${esc(o)}</option>`).join("")}
              </select>` : "";
      const qtd = Array.from({ length: limite }, (_, i) => `<option value="${i + 1}"${i + 1 === u.quantidade ? " selected" : ""}>${i + 1}</option>`).join("");
      const del = linhas.length > 1 ? `<button type="button" class="mini" data-acao="del" data-k="${k}" aria-label="Remover linha">\u2715</button>` : "";
      return `<div class="linha">${opc}<span class="un">${un}</span>
            <select data-campo="q" data-k="${k}" aria-label="Quantidade utilizada de ${esc(l.item.descricao)}">${qtd}</select>${del}</div>`;
    }).join("") + (podeAdicionarOpcao(l.item, linhas) ? `<button type="button" class="mini add" data-acao="add">+ outra op\xE7\xE3o</button>` : "");
  }
  atualizarResumo() {
    let unidades = 0;
    this.uso.forEach((ls) => ls.forEach((u) => unidades += u.quantidade));
    this.$("#cnt").textContent = String(this.uso.size);
    this.$("#tot").textContent = String(unidades);
  }
  pedirConfirmacao() {
    const caixa = this.$("#caixaLimpar");
    caixa.innerHTML = `<span class="confirma">Desmarcar todos os itens?
      <button class="perigo" type="button" id="sim">Sim, limpar</button>
      <button type="button" id="nao">Cancelar</button></span>`;
    const voltar = () => caixa.innerHTML = `<button class="perigo" type="button" data-acao="limpar">Limpar tudo</button>`;
    caixa.querySelector("#sim").addEventListener("click", (e) => {
      e.stopPropagation();
      this.limpar();
    });
    caixa.querySelector("#nao").addEventListener("click", (e) => {
      e.stopPropagation();
      voltar();
    });
  }
  /** Cliente do serviço de integração, quando o atributo `servidor` está definido. */
  get cliente() {
    const s = this.getAttribute("servidor");
    return s !== null ? new ClienteServico(s, this.getAttribute("token")) : null;
  }
  /** Mostra, em tempo real, o andamento da prescrição na farmácia. */
  acompanhar(id) {
    const el = this.$("#acomp");
    if (!el) return;
    const mostrar = (txt) => {
      el.hidden = false;
      el.innerHTML = `<strong>Situa\xE7\xE3o na farm\xE1cia:</strong> ${txt}`;
    };
    mostrar(ROTULO_FLUXO.AGUARDANDO_FARMACIA);
    this.pararEscuta?.();
    const cli = this.cliente;
    const reler = async () => {
      const reg = await cli.obter(id);
      if (!reg) return;
      if (reg.status === "EM_CONFERENCIA") mostrar(`${ROTULO_FLUXO.EM_CONFERENCIA} por ${esc(reg.farmaceutico)}${reg.atrasada ? " \xB7 passou do prazo" : ""}`);
      else if (reg.status !== "AGUARDANDO_FARMACIA") mostrar(ROTULO_FLUXO[reg.status]);
    };
    this.pararEscuta = cli.ouvir((evento, dados) => {
      const reg = evento === "conferencia-concluida" ? dados.registro : dados;
      if (reg?.prescricao?.id !== id) return;
      if (evento === "conferencia-iniciada") mostrar(`${ROTULO_FLUXO.EM_CONFERENCIA} por ${esc(reg.farmaceutico)}`);
      if (evento === "alerta-sla") mostrar(`${ROTULO_FLUXO[reg.status]} \xB7 passou do prazo`);
      if (evento === "conferencia-concluida") {
        const falt = (dados.conferencia?.itens ?? []).filter((i) => i.falta).length;
        mostrar(`${ROTULO_FLUXO[reg.status]}${falt ? ` (${falt} ${falt === 1 ? "item em falta" : "itens em falta"})` : ""} \xB7 lacre ${esc(dados.conferencia?.lacreAplicado ?? "\u2014")}`);
        this.pararEscuta?.();
        this.pararEscuta = null;
      }
    }, () => void reler());
  }
  disconnectedCallback() {
    this.pararEscuta?.();
  }
  mostrarPrescricao(p, status, erro) {
    this.ultima = p;
    const d = new Date(p.dataHora);
    const quando = `${d.toLocaleDateString("pt-BR")} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    const ctx = p.contexto;
    const rx = this.$(".rx");
    rx.innerHTML = `<h2>Prescri\xE7\xE3o gerada</h2>
      <div class="meta">
        <span>Carro de parada n\xBA ${esc(p.numeroCarro)}</span><span>${quando}</span>
        ${ctx.paciente ? `<span>Paciente: ${esc(ctx.paciente)}</span>` : ""}
        ${ctx.atendimento ? `<span>Atendimento: ${esc(ctx.atendimento)}</span>` : ""}
        <span>Lacre rompido: ${esc(p.lacreRompido ?? "\u2014")}</span><span>Lacre novo: ${esc(p.lacreNovo ?? "\u2014")}</span>
      </div>
      <table><thead><tr><th>Qtd.</th><th>Item</th></tr></thead><tbody>
        ${p.itens.map((i) => `<tr><td class="n">${String(i.quantidade).padStart(2, "0")} ${i.unidade}</td><td>${esc(i.descricao)}${i.opcao ? ` \u2014 ${esc(i.opcao)}` : ""}</td></tr>`).join("")}
      </tbody></table>
      ${p.justificativa ? `<div class="bloco"><strong>Justificativa:</strong> ${esc(p.justificativa)}</div>` : ""}
      <div class="bloco status${erro ? " erro" : ""}">${status}</div>
      <div class="bloco" id="acomp" hidden></div>
      <div class="bloco"><button type="button" class="primario" data-acao="copiar">Copiar prescri\xE7\xE3o</button>
        <button type="button" data-acao="copiar-json">Copiar dados (JSON)</button></div>`;
    rx.hidden = false;
    rx.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
  async copiar(btn, json) {
    if (!this.ultima) return;
    const p = this.ultima;
    const texto = json ? JSON.stringify(p, null, 2) : textoPrescricao(p);
    const rotulo = btn.textContent;
    try {
      await navigator.clipboard.writeText(texto);
      btn.textContent = "Copiado";
    } catch {
      btn.textContent = "N\xE3o foi poss\xEDvel copiar";
    }
    setTimeout(() => btn.textContent = rotulo, 2e3);
  }
};
function textoPrescricao(p) {
  const d = new Date(p.dataHora);
  let t = `PRESCRI\xC7\xC3O \u2014 CARRO DE EMERG\xCANCIA
Carro de parada n\xBA ${p.numeroCarro}
`;
  t += `Data: ${d.toLocaleDateString("pt-BR")} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
`;
  if (p.contexto.paciente) t += `Paciente: ${p.contexto.paciente}
`;
  if (p.contexto.atendimento) t += `Atendimento: ${p.contexto.atendimento}
`;
  t += `Lacre rompido: ${p.lacreRompido ?? "\u2014"} | Lacre novo: ${p.lacreNovo ?? "\u2014"}

`;
  for (const i of p.itens) t += `${String(i.quantidade).padStart(2, "0")} ${i.unidade.padEnd(4)} ${i.descricao}${i.opcao ? ` \u2014 ${i.opcao}` : ""}
`;
  if (p.justificativa) t += `
Justificativa: ${p.justificativa}
`;
  return t.trimEnd();
}
if (!customElements.get("prescricao-carro-emergencia")) {
  customElements.define("prescricao-carro-emergencia", PrescricaoCarroEmergenciaElement);
}

// src/conferencia-regras.ts
function diasParaVencer(validadeIso, hoje = /* @__PURE__ */ new Date()) {
  const [a, m, d] = validadeIso.split("-").map(Number);
  const val = Date.UTC(a, m - 1, d);
  const h = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.round((val - h) / 864e5);
}
function problemaDoLote(e, validadeMinimaDias, semValidade = false) {
  if (semValidade) return null;
  if (!e.lote.trim()) return "SEM_LOTE";
  if (!e.validade) return "SEM_VALIDADE";
  const dias = diasParaVencer(e.validade);
  if (dias < 0) return "VENCIDO";
  if (dias < validadeMinimaDias) return "VALIDADE_CURTA";
  return null;
}
var TEXTO_PROBLEMA = {
  SEM_LOTE: "Informe o lote",
  SEM_VALIDADE: "Informe a validade",
  VENCIDO: "Lote vencido",
  VALIDADE_CURTA: "Validade curta"
};
function statusDaLinha(prescrito, lotes, falta, validadeMinimaDias, semValidade = false) {
  if (lotes.some((l) => problemaDoLote(l, validadeMinimaDias, semValidade))) return "ERRO";
  const reposto = lotes.reduce((s, l) => s + l.quantidade, 0);
  if (reposto >= prescrito) return "CONFERIDO";
  if (falta && reposto + falta.quantidade >= prescrito) return "FALTA";
  return reposto > 0 ? "PARCIAL" : "PENDENTE";
}
function somarLote(lotes, novo) {
  const igual = lotes.find((l) => l.lote === novo.lote && l.validade === novo.validade && novo.lote);
  if (igual) {
    igual.quantidade += novo.quantidade;
    return lotes;
  }
  return [...lotes, novo];
}

// src/gs1.ts
var GS = "";
var FIXOS = { "01": 14, "02": 14, "11": 6, "13": 6, "15": 6, "17": 6 };
var VARIAVEIS = /* @__PURE__ */ new Set(["10", "21", "240", "241"]);
var normalizarGtin = (g) => g.replace(/\D/g, "").padStart(14, "0");
function dataGs1(aammdd) {
  if (!/^\d{6}$/.test(aammdd)) return null;
  const ano = 2e3 + Number(aammdd.slice(0, 2));
  const mes = Number(aammdd.slice(2, 4));
  let dia = Number(aammdd.slice(4, 6));
  if (mes < 1 || mes > 12 || dia > 31) return null;
  if (dia === 0) dia = new Date(ano, mes, 0).getDate();
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}
var dataValida = (s) => dataGs1(s) !== null;
function lerCodigo(entrada) {
  const bruto = entrada;
  let s = entrada.trim().replace(/^\](d2|C1|Q3|e0)/, "").replace(/<GS>/gi, GS);
  const r = { gtin: null, lote: null, validade: null, serie: null, bruto };
  if (/^\d{8}$|^\d{12,14}$/.test(s)) {
    r.gtin = normalizarGtin(s);
    return r;
  }
  const campos = {};
  if (s.includes("(")) {
    for (const m of s.matchAll(/\((\d{2,4})\)([^()]*)/g)) campos[m[1]] = m[2].trim();
  } else {
    s = s.replace(new RegExp(`^${GS}+`), "");
    let i = 0;
    while (i < s.length) {
      if (s[i] === GS) {
        i++;
        continue;
      }
      const ai3 = s.slice(i, i + 3);
      const ai = VARIAVEIS.has(ai3) ? ai3 : s.slice(i, i + 2);
      i += ai.length;
      if (FIXOS[ai]) {
        campos[ai] = s.slice(i, i + FIXOS[ai]);
        i += FIXOS[ai];
      } else if (VARIAVEIS.has(ai)) {
        let fim = s.indexOf(GS, i);
        if (fim === -1) {
          fim = s.length;
          for (let j = i + 1; j < s.length - 7; j++) {
            if (s.startsWith("17", j) && dataValida(s.slice(j + 2, j + 8))) {
              fim = j;
              break;
            }
          }
        }
        campos[ai] = s.slice(i, Math.min(fim, i + 20));
        i = fim;
      } else {
        break;
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

// src/conferencia-farmacia.ts
var MOTIVOS = {
  SEM_ESTOQUE: "Sem estoque",
  AGUARDANDO_COMPRA: "Aguardando compra",
  ITEM_SUSPENSO: "Item suspenso/substitu\xEDdo",
  OUTRO: "Outro"
};
var ROTULO_STATUS = {
  PENDENTE: "Pendente",
  PARCIAL: "Parcial",
  CONFERIDO: "Conferido",
  FALTA: "Em falta",
  ERRO: "Corrigir"
};
var CHAVE_GTIN = "pce-gtin-associados";
var esc2 = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
var dataBr = (iso) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR")} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
};
var validadeBr = (iso) => iso ? iso.split("-").reverse().join("/") : "\u2014";
var EXTRA = (
  /* css */
  `
.card{background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px;padding:14px 16px}
.meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px 18px}
.meta div{display:flex;flex-direction:column;gap:2px}
.meta small{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--pce-suave);font-weight:600}
.meta strong{font-weight:600}
.alerta{border-left:4px solid var(--pce-alerta);background:var(--pce-alerta-fundo);border-radius:6px;padding:10px 14px;font-size:14px}
.leitor{display:flex;flex-direction:column;gap:8px;background:var(--pce-superficie);border:2px solid var(--pce-primaria);border-radius:10px;padding:14px 16px}
.leitor label{font-weight:600;color:var(--pce-secundaria)}
.leitor input{font:600 18px ui-monospace,"IBM Plex Mono",monospace;padding:12px 14px;border:1px solid var(--pce-linha);border-radius:8px;width:100%}
.leitor .fb{font-size:14px;min-height:1.4em}
.fb.ok{color:#1e6b3a;font-weight:600}.fb.erro{color:var(--pce-alerta);font-weight:600}.fb.aviso{color:#8a5a00;font-weight:600}
.assoc{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:14px}
.progresso{position:sticky;top:0;z-index:2;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px;padding:10px 14px}
.barra{flex:1;min-width:160px;height:8px;border-radius:99px;background:var(--pce-cabecalho);overflow:hidden}
.barra i{display:block;height:100%;background:var(--pce-primaria);transition:width .2s}
.tabela{overflow-x:auto;background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px}
.tabela table{min-width:760px}
td.n{font-variant-numeric:tabular-nums;font-weight:600;white-space:nowrap}
.opc{display:inline-block;background:var(--pce-cabecalho);color:var(--pce-primaria);border-radius:4px;padding:0 6px;font-size:13px;font-weight:600;margin-left:4px}
.sec{display:block;font-size:12px;color:var(--pce-suave)}
.lotes{display:flex;flex-direction:column;gap:6px}
.lote{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.lote input{padding:5px 8px;font-size:14px}
.lote input.l{width:120px}.lote input.v{width:150px}
.lote .erro{color:var(--pce-alerta);font-size:12px;font-weight:600}
.lote .tag{font-size:11px;color:var(--pce-suave)}
.acoes{display:flex;gap:6px;flex-wrap:wrap}
.falta{display:flex;flex-wrap:wrap;gap:6px;align-items:center;background:var(--pce-alerta-fundo);border-radius:6px;padding:6px 8px;font-size:13px}
.falta select{font-family:inherit;border-color:var(--pce-alerta)}
.chip{display:inline-block;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:700;white-space:nowrap}
.chip.PENDENTE{background:var(--pce-cabecalho);color:var(--pce-suave)}
.chip.PARCIAL{background:#fff3d6;color:#8a5a00}
.chip.CONFERIDO{background:#dff3e6;color:#1e6b3a}
.chip.FALTA{background:var(--pce-alerta-fundo);color:var(--pce-alerta)}
.chip.ERRO{background:var(--pce-alerta);color:#fff}
tr.flash td{animation:flash .9s ease-out}
@keyframes flash{from{background:#dff3e6}to{background:transparent}}
@media (prefers-reduced-motion:reduce){tr.flash td{animation:none}.barra i{transition:none}}
.fila{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:13px}
.vazio{display:flex;flex-direction:column;gap:10px}
.vazio textarea{min-height:120px;font:13px ui-monospace,monospace}
.resultado .bloco{padding:10px 14px;border-top:1px solid var(--pce-linha);font-size:14px}
.resultado.ok h2{background:#dff3e6;color:#1e6b3a}
.resultado.pend h2{background:#fff3d6;color:#8a5a00}
`
);
var ConferenciaFarmaciaElement = class extends HTMLElement {
  constructor() {
    super();
    this.enviar = null;
    this._p = null;
    this._checklist = CHECKLIST_PADRAO;
    this._cfg = null;
    this.linhas = [];
    this.fila = [];
    this.gtins = /* @__PURE__ */ new Map();
    this.associados = {};
    this.pendenteAssoc = null;
    this.inicio = 0;
    this.concluida = false;
    this.canal = null;
    this.audio = null;
    this.abrindo = /* @__PURE__ */ new Set();
    // ------------------------------------------------------------------ internos
    this.pararEscuta = null;
    this.root = this.attachShadow({ mode: "open" });
    this.root.addEventListener("click", (e) => this.aoClicar(e));
    this.root.addEventListener("change", (e) => this.aoMudar(e));
    this.root.addEventListener("input", (e) => this.aoDigitar(e));
    this.root.addEventListener("keydown", (e) => this.aoTeclar(e));
    try {
      this.associados = JSON.parse(localStorage.getItem(CHAVE_GTIN) || "{}");
    } catch {
      this.associados = {};
    }
  }
  // ------------------------------------------------------------------ ciclo de vida
  connectedCallback() {
    const ep = this.getAttribute("endpoint");
    if (ep && !this._cfg) this._cfg = { endpoint: ep };
    this.indexarGtins();
    this.renderizar();
    const canal = this.getAttribute("canal") ?? CANAL_PADRAO;
    if (canal !== "off" && typeof BroadcastChannel !== "undefined") {
      this.canal = new BroadcastChannel(canal);
      this.canal.onmessage = (ev) => {
        if (ev.data?.tipo === "prescricao" && ev.data.prescricao) this.receber(ev.data.prescricao);
      };
    }
    const cl = this.getAttribute("checklist-url");
    if (cl) void this.buscarJson(cl).then((c) => c && (this.checklist = c));
    const cli = this.cliente;
    if (cli) {
      void cli.checklist().then((c) => c && (this.checklist = c));
      void cli.listar(["AGUARDANDO_FARMACIA", "EM_CONFERENCIA"]).then((regs) => {
        regs.sort((a, b) => a.recebidaEm.localeCompare(b.recebidaEm)).filter((r) => r.status === "AGUARDANDO_FARMACIA" || r.farmaceutico === this.nomeFarmaceutico).forEach((r) => this.receber(r.prescricao));
      });
      this.pararEscuta = cli.ouvir((evento, dados) => {
        const reg = evento === "conferencia-concluida" ? dados.registro : dados;
        const id = reg?.prescricao?.id;
        if (evento === "prescricao-recebida") this.receber(reg.prescricao);
        else if (evento === "conferencia-iniciada" && reg.farmaceutico !== this.nomeFarmaceutico || evento === "conferencia-concluida") {
          if (this.fila.some((f) => f.id === id)) {
            this.fila = this.fila.filter((f) => f.id !== id);
            this.renderizarFila();
          }
        } else if (evento === "alerta-sla" && this.fila.some((f) => f.id === id)) {
          this.avisar(`Carro n\xBA ${reg.prescricao.numeroCarro} passou do prazo de confer\xEAncia.`, "aviso");
        }
      });
    }
    const pu = this.getAttribute("prescricao-url");
    if (pu) void this.buscarJson(pu).then((p) => p && (this.prescricao = p));
  }
  disconnectedCallback() {
    this.pararEscuta?.();
    this.canal?.close();
    this.canal = null;
  }
  // ------------------------------------------------------------------ API pública
  get prescricao() {
    return this._p;
  }
  set prescricao(p) {
    this._p = p;
    this.fila = this.fila.filter((f) => f.id !== p?.id);
    this.linhas = (p?.itens ?? []).map((item) => ({
      item,
      semValidade: this.itemSemValidade(item.descricao),
      lotes: [],
      falta: null
    }));
    this.inicio = Date.now();
    this.concluida = false;
    this.pendenteAssoc = null;
    if (this.isConnected) {
      this.renderizar();
      this.$("#leitor")?.focus();
    }
  }
  get checklist() {
    return this._checklist;
  }
  set checklist(c) {
    this._checklist = c;
    this.indexarGtins();
    if (this._p) this.linhas.forEach((l) => l.semValidade = this.itemSemValidade(l.item.descricao));
  }
  configurar(cfg) {
    this._cfg = cfg;
  }
  receber(p) {
    if (p?.tipo !== "PRESCRICAO_CARRO_EMERGENCIA") return;
    if (this._p?.id === p.id || this.abrindo.has(p.id) || this.fila.some((f) => f.id === p.id)) return;
    if (!this._p || this.concluida) {
      void this.abrir(p).then((ok) => ok && this.avisar(`Prescri\xE7\xE3o do carro n\xBA ${p.numeroCarro} carregada.`, "ok"));
    } else {
      this.fila.push(p);
      this.renderizarFila();
      this.avisar(`Nova prescri\xE7\xE3o na fila: carro n\xBA ${p.numeroCarro}.`, "aviso");
    }
  }
  /**
   * Abre uma prescrição para conferir. Com o serviço de integração, reserva a conferência
   * para este farmacêutico; se outra pessoa já estiver conferindo, não abre.
   */
  async abrir(p) {
    if (this.abrindo.has(p.id)) return false;
    this.abrindo.add(p.id);
    try {
      return await this.abrirReservando(p);
    } finally {
      this.abrindo.delete(p.id);
    }
  }
  async abrirReservando(p) {
    const farm = this.nomeFarmaceutico;
    if (this.cliente && farm) {
      try {
        const r = await this.cliente.assumir(p.id, farm);
        if (!r.ok) {
          this.fila = this.fila.filter((f) => f.id !== p.id);
          this.renderizarFila();
          this.avisar(`Carro n\xBA ${p.numeroCarro}: ${r.mensagem ?? "n\xE3o foi poss\xEDvel assumir a confer\xEAncia."}`, "erro");
          return false;
        }
      } catch {
        this.avisar("Servi\xE7o de integra\xE7\xE3o indispon\xEDvel. A confer\xEAncia segue, mas confira a conex\xE3o antes de concluir.", "aviso");
      }
    }
    this.prescricao = p;
    return true;
  }
  ler(codigo) {
    const fb = (t, tipo) => {
      this.avisar(t, tipo);
      this.bipar(tipo === "ok");
    };
    if (!this._p) return fb("Carregue uma prescri\xE7\xE3o antes de ler os itens.", "erro");
    if (this.concluida) return fb("Esta confer\xEAncia j\xE1 foi conclu\xEDda.", "erro");
    const r = lerCodigo(codigo);
    if (!r.gtin) return fb(`C\xF3digo n\xE3o reconhecido: ${codigo}`, "erro");
    const alvo = this.gtins.get(r.gtin);
    if (!alvo) {
      this.pendenteAssoc = r;
      this.renderizarAssoc();
      this.emitir("gtin-desconhecido", { gtin: r.gtin, lote: r.lote, validade: r.validade });
      return fb(`C\xF3digo ${r.gtin} ainda n\xE3o cadastrado. Escolha a qual item ele pertence.`, "aviso");
    }
    const candidatas = this.linhas.map((l2, i2) => ({ l: l2, i: i2 })).filter(({ l: l2 }) => l2.item.descricao === alvo.descricao && (alvo.opcao === null || l2.item.opcao === alvo.opcao));
    if (!candidatas.length) return fb(`${alvo.descricao}${alvo.opcao ? " \u2014 " + alvo.opcao : ""} n\xE3o est\xE1 nesta prescri\xE7\xE3o.`, "erro");
    const livre = candidatas.find(({ l: l2 }) => this.reposto(l2) < l2.item.quantidade);
    if (!livre) return fb(`${alvo.descricao}: quantidade prescrita j\xE1 conferida.`, "erro");
    const { l, i } = livre;
    if (!l.semValidade && r.validade) {
      const dias = diasParaVencer(r.validade);
      if (dias < 0) return fb(`LOTE VENCIDO (${validadeBr(r.validade)}). N\xE3o repor. Separe outro lote.`, "erro");
      if (dias < this.validadeMinima)
        return fb(`Validade curta: ${dias} dias (${validadeBr(r.validade)}). M\xEDnimo ${this.validadeMinima}. Separe outro lote.`, "erro");
    }
    l.lotes = somarLote(l.lotes, {
      lote: l.semValidade ? "" : r.lote ?? "",
      validade: l.semValidade ? "" : r.validade ?? "",
      quantidade: 1,
      gtin: r.gtin,
      origem: "leitura"
    });
    if (this.reposto(l) >= l.item.quantidade) l.falta = null;
    this.renderizarLinha(i, true);
    this.atualizarProgresso();
    const falta = !l.semValidade && (!r.lote || !r.validade);
    fb(
      `${l.item.descricao}${l.item.opcao ? " \u2014 " + l.item.opcao : ""}: ${this.reposto(l)} de ${l.item.quantidade}` + (falta ? ". C\xF3digo sem lote/validade: complete na linha." : "."),
      falta ? "aviso" : "ok"
    );
  }
  obterConferencia() {
    const p = this._p;
    if (!p) throw new Error("Nenhuma prescri\xE7\xE3o carregada.");
    const pend = [];
    this.linhas.forEach((l) => {
      const st = this.status(l);
      const nome = `${l.item.descricao}${l.item.opcao ? " \u2014 " + l.item.opcao : ""}`;
      if (st === "ERRO") pend.push(`Corrija lote/validade de ${nome}.`);
      else if (st === "PENDENTE" || st === "PARCIAL") pend.push(`Confira ou marque falta em ${nome}.`);
      else if (st === "FALTA" && !l.falta?.motivo) pend.push(`Informe o motivo da falta de ${nome}.`);
    });
    const lacre = this.$("#lacreAplicado").value.trim();
    if (!lacre) pend.push("Informe o lacre aplicado ap\xF3s a reposi\xE7\xE3o.");
    const farm = this.getAttribute("farmaceutico") ?? this.$("#farmaceutico")?.value.trim() ?? "";
    if (!farm) pend.push("Informe o farmac\xEAutico respons\xE1vel.");
    if (pend.length) throw new Error(pend.join(" "));
    const itens = this.linhas.map((l) => {
      const reposto = this.reposto(l);
      return {
        secao: l.item.secao,
        codigo: l.item.codigo,
        descricao: l.item.descricao,
        opcao: l.item.opcao,
        unidade: l.item.unidade,
        prescrito: l.item.quantidade,
        reposto,
        lotes: l.lotes.map((x) => ({ ...x })),
        falta: reposto < l.item.quantidade && l.falta?.motivo ? { quantidade: l.item.quantidade - reposto, motivo: l.falta.motivo, observacao: l.falta.observacao.trim() || null } : null
      };
    });
    return {
      tipo: "CONFERENCIA_REPOSICAO_CARRO",
      versao: 1,
      id: novoId(),
      prescricaoId: p.id,
      numeroCarro: p.numeroCarro,
      dataHoraPrescricao: p.dataHora,
      dataHoraConferencia: (/* @__PURE__ */ new Date()).toISOString(),
      duracaoSegundos: Math.round((Date.now() - this.inicio) / 1e3),
      farmaceutico: farm,
      lacreAplicado: lacre,
      situacao: itens.some((i) => i.falta) ? "COM_PENDENCIAS" : "CONFORME",
      itens,
      observacoes: this.$("#obs").value.trim() || null,
      validadeMinimaDias: this.validadeMinima
    };
  }
  async concluir() {
    const msg = this.$("#msgFim");
    msg.className = "msg";
    let c;
    try {
      c = this.obterConferencia();
    } catch (e) {
      msg.textContent = e.message;
      msg.classList.add("erro");
      this.bipar(false);
      return;
    }
    const continuar = this.dispatchEvent(
      new CustomEvent("conferencia-concluida", { detail: c, bubbles: true, composed: true, cancelable: true })
    );
    let status = "Confer\xEAncia entregue ao G-HOSP.";
    let erro = false;
    if (continuar) {
      const envio = this.enviar ?? (this._cfg?.endpoint ? criarEnvioHttp(this._cfg) : this.cliente?.enviarConferencia ?? null);
      if (!envio) status = "Envio autom\xE1tico ao G-HOSP ainda n\xE3o configurado.";
      else {
        const btn = this.$("#concluir");
        btn.disabled = true;
        btn.textContent = "Enviando\u2026";
        try {
          const r = await envio(c);
          if (r.enviado) {
            status = this.cliente && !this.enviar && !this._cfg?.endpoint ? `${esc2(r.mensagem ?? "Confer\xEAncia registrada.")} Estoque baixado por lote${c.situacao === "COM_PENDENCIAS" ? " e requisi\xE7\xE3o de compra aberta para as faltas" : ""}.` : `Confer\xEAncia registrada no G-HOSP${r.idPrescricao ? ` (n\xBA ${esc2(r.idPrescricao)})` : ""}.`;
            this.emitir("conferencia-enviada", { conferencia: c, resultado: r });
          } else {
            erro = true;
            status = `O G-HOSP n\xE3o aceitou a confer\xEAncia${r.status ? ` (c\xF3digo ${r.status})` : ""}. ${esc2(r.mensagem ?? "Tente de novo.")}`;
            this.emitir("conferencia-erro", { conferencia: c, erro: r });
          }
        } catch (e) {
          erro = true;
          status = "N\xE3o foi poss\xEDvel conectar ao G-HOSP. Verifique a rede e tente de novo.";
          this.emitir("conferencia-erro", { conferencia: c, erro: e });
        } finally {
          btn.disabled = false;
          btn.textContent = "Concluir confer\xEAncia";
        }
      }
    }
    if (erro) {
      msg.innerHTML = status;
      msg.classList.add("erro");
      return;
    }
    this.concluida = true;
    try {
      this.canal?.postMessage({ tipo: "conferencia", conferencia: c });
    } catch {
    }
    this.mostrarResultado(c, status);
    this.bipar(true);
  }
  get cliente() {
    const s = this.getAttribute("servidor");
    return s !== null ? new ClienteServico(s, this.getAttribute("token")) : null;
  }
  get nomeFarmaceutico() {
    return (this.getAttribute("farmaceutico") ?? this.$("#farmaceutico")?.value ?? "").trim();
  }
  get validadeMinima() {
    const v = Number(this.getAttribute("validade-minima-dias"));
    return Number.isFinite(v) && v >= 0 && this.hasAttribute("validade-minima-dias") ? v : 90;
  }
  $(sel) {
    return this.root.querySelector(sel);
  }
  emitir(nome, detail) {
    this.dispatchEvent(new CustomEvent(nome, { detail, bubbles: true, composed: true }));
  }
  async buscarJson(url) {
    try {
      const r = await fetch(url, { credentials: "include" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      this.emitir("conferencia-erro", { erro: `Falha ao carregar ${url}: ${String(e)}` });
      return null;
    }
  }
  indexarGtins() {
    this.gtins.clear();
    for (const sec of this._checklist)
      for (const it of sec.itens) {
        for (const g of it.gtin ?? []) this.gtins.set(normalizarGtin(g), { descricao: it.descricao, opcao: null });
        for (const [op, gs] of Object.entries(it.gtinPorOpcao ?? {}))
          for (const g of gs) this.gtins.set(normalizarGtin(g), { descricao: it.descricao, opcao: op });
      }
    for (const [g, alvo] of Object.entries(this.associados)) if (!this.gtins.has(g)) this.gtins.set(g, alvo);
  }
  itemSemValidade(descricao) {
    for (const sec of this._checklist) for (const it of sec.itens) if (it.descricao === descricao) return !!it.semValidade;
    return false;
  }
  reposto(l) {
    return l.lotes.reduce((s, x) => s + x.quantidade, 0);
  }
  status(l) {
    const faltaQtd = l.item.quantidade - this.reposto(l);
    return statusDaLinha(
      l.item.quantidade,
      l.lotes,
      l.falta ? { quantidade: faltaQtd, motivo: l.falta.motivo || "OUTRO", observacao: null } : null,
      this.validadeMinima,
      l.semValidade
    );
  }
  avisar(texto, tipo) {
    const fb = this.$("#fb");
    if (!fb) return;
    fb.className = `fb ${tipo}`;
    fb.textContent = texto;
  }
  bipar(ok) {
    if (this.getAttribute("som") === "off") return;
    try {
      const Ctx = window.AudioContext ?? window.webkitAudioContext;
      this.audio ?? (this.audio = new Ctx());
      const o = this.audio.createOscillator();
      const g = this.audio.createGain();
      o.frequency.value = ok ? 1320 : 220;
      g.gain.value = 0.06;
      o.connect(g).connect(this.audio.destination);
      o.start();
      o.stop(this.audio.currentTime + (ok ? 0.08 : 0.3));
    } catch {
    }
  }
  // ------------------------------------------------------------------ renderização
  renderizar() {
    const p = this._p;
    const farm = this.getAttribute("farmaceutico");
    let corpo;
    if (!p) {
      corpo = `<div class="card vazio">
        <strong>Aguardando prescri\xE7\xE3o.</strong>
        <div class="fb" id="fb" aria-live="polite"></div>
        <span class="msg">As prescri\xE7\xF5es geradas no formul\xE1rio do carro chegam aqui automaticamente. Voc\xEA tamb\xE9m pode colar o JSON da prescri\xE7\xE3o abaixo.</span>
        <textarea id="json" aria-label="JSON da prescri\xE7\xE3o" placeholder='{"tipo":"PRESCRICAO_CARRO_EMERGENCIA", ...}'></textarea>
        <div><button class="primario" type="button" data-acao="colar">Carregar prescri\xE7\xE3o</button></div>
      </div>`;
    } else {
      const c = p.contexto ?? { atendimento: null, paciente: null, prescritor: null, setor: null };
      const meta = [
        ["Carro de parada", `n\xBA ${p.numeroCarro}`],
        ["Prescri\xE7\xE3o", dataBr(p.dataHora)],
        ["Paciente", c.paciente],
        ["Atendimento", c.atendimento],
        ["Prescritor", c.prescritor],
        ["Setor", c.setor],
        ["Lacre rompido", p.lacreRompido],
        ["Lacre novo (enfermagem)", p.lacreNovo]
      ].filter(([, v]) => v).map(([k, v]) => `<div><small>${k}</small><strong>${esc2(v)}</strong></div>`).join("");
      corpo = `
        <div class="card meta">${meta}</div>
        ${p.justificativa ? `<div class="alerta"><strong>Justificativa da enfermagem:</strong> ${esc2(p.justificativa)}</div>` : ""}
        <div class="leitor">
          <label for="leitor">Bipe o c\xF3digo de barras (DataMatrix ou EAN) de cada unidade separada</label>
          <input id="leitor" autocomplete="off" spellcheck="false" placeholder="Aguardando leitura\u2026">
          <div class="fb" id="fb" aria-live="polite">Cada leitura conta 1 unidade e preenche lote e validade automaticamente.</div>
          <div class="assoc" id="assoc" hidden></div>
        </div>
        <div class="progresso" aria-live="polite">
          <strong id="prog">0 de 0</strong>
          <div class="barra"><i id="barra" style="width:0"></i></div>
          <span id="alertas"></span>
          <button type="button" class="mini" data-acao="conferir-tudo" title="Marca como separado o restante de todos os itens, para informar lote e validade \xE0 m\xE3o">Separar restante manualmente</button>
        </div>
        <div class="tabela"><table>
          <thead><tr><th>Item</th><th>Prescrito</th><th>Lotes separados (lote \xB7 validade \xB7 qtd)</th><th>Situa\xE7\xE3o</th></tr></thead>
          <tbody>${this.linhas.map((_, i) => `<tr id="l${i}"></tr>`).join("")}</tbody>
        </table></div>
        <div class="campos">
          <label for="lacreAplicado">Lacre aplicado ap\xF3s a reposi\xE7\xE3o<input id="lacreAplicado" type="text" inputmode="numeric" value="${esc2(p.lacreNovo ?? "")}"></label>
          ${farm ? `<label>Farmac\xEAutico<input type="text" value="${esc2(farm)}" disabled></label>` : `<label for="farmaceutico">Farmac\xEAutico<input id="farmaceutico" type="text"></label>`}
        </div>
        <div class="just"><label for="obs">Observa\xE7\xF5es da farm\xE1cia</label><textarea id="obs" placeholder="Opcional"></textarea></div>
        <div class="gerar">
          <span class="msg" id="msgFim" aria-live="polite">Conclua quando todos os itens estiverem conferidos ou com falta justificada.</span>
          <button class="primario grande" id="concluir" type="button" data-acao="concluir">Concluir confer\xEAncia</button>
        </div>
        <section class="resultado" id="resultado" hidden></section>`;
    }
    this.root.innerHTML = `<style>${ESTILOS}${EXTRA}</style>
      <div class="wrap">
        <div class="topo"><h1>Confer\xEAncia de Reposi\xE7\xE3o \xB7 Farm\xE1cia</h1><div class="fila" id="fila"></div></div>
        ${corpo}
      </div>`;
    this.linhas.forEach((_, i) => this.renderizarLinha(i));
    this.renderizarFila();
    this.atualizarProgresso();
  }
  renderizarFila() {
    const el = this.$("#fila");
    if (!el) return;
    el.innerHTML = this.fila.length ? `<span>Na fila:</span>${this.fila.map((f) => `<button type="button" class="mini" data-acao="abrir" data-id="${esc2(f.id)}">Carro n\xBA ${esc2(f.numeroCarro)} \xB7 ${dataBr(f.dataHora)}</button>`).join("")}` : "";
  }
  renderizarAssoc() {
    const el = this.$("#assoc");
    const r = this.pendenteAssoc;
    if (!el) return;
    if (!r) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    const abertas = this.linhas.map((l, i) => ({ l, i })).filter(({ l }) => this.reposto(l) < l.item.quantidade);
    el.hidden = false;
    el.innerHTML = `<span>C\xF3digo <strong>${esc2(r.gtin)}</strong> pertence a:</span>
      <select id="assocSel" class="opc">${abertas.map(({ l, i }) => `<option value="${i}">${esc2(l.item.descricao)}${l.item.opcao ? " \u2014 " + esc2(l.item.opcao) : ""}</option>`).join("")}</select>
      <button type="button" class="primario mini" data-acao="associar">Associar e contar</button>
      <button type="button" class="mini" data-acao="cancelar-assoc">Cancelar</button>`;
  }
  renderizarLinha(i, destacar = false) {
    const l = this.linhas[i];
    const tr = this.$(`#l${i}`);
    if (!tr) return;
    const st = this.status(l);
    const reposto = this.reposto(l);
    const restante = l.item.quantidade - reposto;
    const lotes = l.lotes.map((x, k) => {
      const outros = reposto - x.quantidade;
      const max = l.item.quantidade - outros;
      const prob = problemaDoLote(x, this.validadeMinima, l.semValidade);
      const campos = l.semValidade ? `<span class="tag">sem validade</span>` : `<input class="l" data-i="${i}" data-k="${k}" data-f="lote" value="${esc2(x.lote)}" placeholder="Lote" aria-label="Lote">
             <input class="v" type="date" data-i="${i}" data-k="${k}" data-f="validade" value="${esc2(x.validade)}" aria-label="Validade">`;
      return `<div class="lote">${campos}
          <select data-i="${i}" data-k="${k}" data-f="qtd" aria-label="Quantidade">${Array.from({ length: Math.max(1, max) }, (_, n) => `<option${n + 1 === x.quantidade ? " selected" : ""}>${n + 1}</option>`).join("")}</select>
          <button type="button" class="mini" data-acao="rem-lote" data-i="${i}" data-k="${k}" aria-label="Remover lote">\u2715</button>
          <span class="tag">${x.origem === "leitura" ? "lido" : "manual"}</span>
          ${prob ? `<span class="erro">${TEXTO_PROBLEMA[prob]}${prob === "VALIDADE_CURTA" ? ` (m\xEDn. ${this.validadeMinima} dias)` : ""}</span>` : ""}
        </div>`;
    }).join("");
    const falta = l.falta && restante > 0 ? `<div class="falta">Falta ${restante} ${l.item.unidade} \xB7
            <select data-i="${i}" data-f="motivo" aria-label="Motivo da falta"><option value="">Motivo\u2026</option>${Object.entries(MOTIVOS).map(([k, v]) => `<option value="${k}"${l.falta.motivo === k ? " selected" : ""}>${v}</option>`).join("")}</select>
            <input data-i="${i}" data-f="obs-falta" value="${esc2(l.falta.observacao)}" placeholder="Observa\xE7\xE3o" aria-label="Observa\xE7\xE3o da falta">
            <button type="button" class="mini" data-acao="rem-falta" data-i="${i}" aria-label="Desfazer falta">\u2715</button></div>` : "";
    const acoes = restante > 0 ? `<div class="acoes"><button type="button" class="mini add" data-acao="add-lote" data-i="${i}">+ lote manual</button>
           ${l.falta ? "" : `<button type="button" class="mini perigo" data-acao="falta" data-i="${i}">Em falta</button>`}</div>` : "";
    tr.innerHTML = `<td>${esc2(l.item.descricao)}${l.item.opcao ? `<span class="opc">${esc2(l.item.opcao)}</span>` : ""}<span class="sec">${esc2(l.item.secao)}</span></td>
      <td class="n">${String(reposto).padStart(2, "0")} / ${String(l.item.quantidade).padStart(2, "0")} ${l.item.unidade}</td>
      <td><div class="lotes">${lotes}${falta}${acoes}</div></td>
      <td><span class="chip ${st}">${ROTULO_STATUS[st]}</span></td>`;
    if (destacar) {
      tr.classList.remove("flash");
      void tr.offsetWidth;
      tr.classList.add("flash");
    }
  }
  atualizarProgresso() {
    const prog = this.$("#prog");
    if (!prog) return;
    const sts = this.linhas.map((l) => this.status(l));
    const ok = sts.filter((s) => s === "CONFERIDO" || s === "FALTA").length;
    prog.textContent = `${ok} de ${this.linhas.length} itens`;
    this.$("#barra").style.width = `${this.linhas.length ? ok / this.linhas.length * 100 : 0}%`;
    const erros = sts.filter((s) => s === "ERRO").length;
    const faltas = sts.filter((s) => s === "FALTA").length;
    this.$("#alertas").innerHTML = (erros ? `<span class="chip ERRO">${erros} a corrigir</span> ` : "") + (faltas ? `<span class="chip FALTA">${faltas} em falta</span>` : "");
  }
  mostrarResultado(c, status) {
    const el = this.$("#resultado");
    const ok = c.situacao === "CONFORME";
    el.className = `resultado ${ok ? "ok" : "pend"}`;
    el.innerHTML = `<h2>${ok ? "Reposi\xE7\xE3o conforme" : "Reposi\xE7\xE3o com pend\xEAncias"}</h2>
      <div class="bloco">Carro n\xBA ${esc2(c.numeroCarro)} \xB7 lacre ${esc2(c.lacreAplicado)} \xB7 ${esc2(c.farmaceutico)} \xB7 ${dataBr(c.dataHoraConferencia)} \xB7 ${Math.max(1, Math.round(c.duracaoSegundos / 60))} min</div>
      ${c.itens.filter((i) => i.falta).map((i) => `<div class="bloco"><strong>Falta:</strong> ${i.falta.quantidade} ${i.unidade} de ${esc2(i.descricao)}${i.opcao ? " \u2014 " + esc2(i.opcao) : ""} (${MOTIVOS[i.falta.motivo]})</div>`).join("")}
      <div class="bloco">${status}</div>
      <div class="bloco"><button type="button" class="primario" data-acao="copiar-termo">Copiar termo de reposi\xE7\xE3o</button>
        <button type="button" data-acao="copiar-json">Copiar dados (JSON)</button>
        ${this.fila.length ? `<button type="button" data-acao="proxima">Pr\xF3xima prescri\xE7\xE3o da fila</button>` : ""}</div>`;
    el.hidden = false;
    el._c = c;
    el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
  // ------------------------------------------------------------------ eventos
  aoTeclar(e) {
    const alvo = e.target;
    if (alvo.id === "leitor" && e.key === "Enter") {
      e.preventDefault();
      const inp = alvo;
      const v = inp.value;
      inp.value = "";
      if (v.trim()) this.ler(v);
    }
  }
  aoDigitar(e) {
    const t = e.target;
    const i = Number(t.dataset.i);
    if (Number.isNaN(i) || !this.linhas[i]) return;
    const l = this.linhas[i];
    if (t.dataset.f === "lote") l.lotes[Number(t.dataset.k)].lote = t.value;
    else if (t.dataset.f === "obs-falta" && l.falta) l.falta.observacao = t.value;
    else return;
    this.atualizarStatusLinha(i);
  }
  aoMudar(e) {
    const t = e.target;
    const i = Number(t.dataset.i);
    if (Number.isNaN(i) || !this.linhas[i]) return;
    const l = this.linhas[i];
    const k = Number(t.dataset.k);
    switch (t.dataset.f) {
      case "validade":
        l.lotes[k].validade = t.value;
        this.renderizarLinha(i);
        break;
      case "qtd":
        l.lotes[k].quantidade = Number(t.value);
        if (this.reposto(l) >= l.item.quantidade) l.falta = null;
        this.renderizarLinha(i);
        break;
      case "motivo":
        if (l.falta) l.falta.motivo = t.value;
        break;
      default:
        return;
    }
    this.atualizarProgresso();
  }
  atualizarStatusLinha(i) {
    const tr = this.$(`#l${i}`);
    const chip = tr?.querySelector(".chip");
    if (!chip) return;
    const st = this.status(this.linhas[i]);
    chip.className = `chip ${st}`;
    chip.textContent = ROTULO_STATUS[st];
    this.atualizarProgresso();
  }
  aoClicar(e) {
    const btn = e.target.closest("button[data-acao]");
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const l = this.linhas[i];
    switch (btn.dataset.acao) {
      case "colar": {
        try {
          const p = JSON.parse(this.$("#json").value);
          if (p?.tipo !== "PRESCRICAO_CARRO_EMERGENCIA") throw new Error();
          this.prescricao = p;
        } catch {
          alertaVazio(this.root, "O texto colado n\xE3o \xE9 uma prescri\xE7\xE3o de carro de emerg\xEAncia v\xE1lida.");
        }
        return;
      }
      case "abrir":
      case "proxima": {
        const p = btn.dataset.id ? this.fila.find((f) => f.id === btn.dataset.id) : this.fila[0];
        if (p) void this.abrir(p);
        return;
      }
      case "associar": {
        const r = this.pendenteAssoc;
        const idx = Number(this.$("#assocSel").value);
        const linha = this.linhas[idx];
        if (!r?.gtin || !linha) return;
        const alvo = { descricao: linha.item.descricao, opcao: linha.item.opcao };
        this.gtins.set(r.gtin, alvo);
        this.associados[r.gtin] = alvo;
        try {
          localStorage.setItem(CHAVE_GTIN, JSON.stringify(this.associados));
        } catch {
        }
        this.emitir("gtin-associado", { gtin: r.gtin, ...alvo });
        void this.cliente?.salvarGtin(r.gtin, alvo.descricao, alvo.opcao);
        this.pendenteAssoc = null;
        this.renderizarAssoc();
        this.ler(r.bruto);
        this.$("#leitor").focus();
        return;
      }
      case "cancelar-assoc":
        this.pendenteAssoc = null;
        this.renderizarAssoc();
        this.$("#leitor").focus();
        return;
      case "conferir-tudo":
        this.linhas.forEach((ln, j) => {
          const rest = ln.item.quantidade - this.reposto(ln);
          if (rest > 0 && !ln.falta) {
            ln.lotes.push({ lote: "", validade: "", quantidade: rest, gtin: null, origem: "manual" });
            this.renderizarLinha(j);
          }
        });
        this.atualizarProgresso();
        return;
      case "add-lote":
        l.lotes.push({ lote: "", validade: "", quantidade: l.item.quantidade - this.reposto(l), gtin: null, origem: "manual" });
        l.falta = null;
        this.renderizarLinha(i);
        this.atualizarProgresso();
        [...this.root.querySelectorAll(`#l${i} input.l`)].pop()?.focus();
        return;
      case "rem-lote":
        l.lotes.splice(Number(btn.dataset.k), 1);
        this.renderizarLinha(i);
        this.atualizarProgresso();
        return;
      case "falta":
        l.falta = { motivo: "", observacao: "" };
        this.renderizarLinha(i);
        this.atualizarProgresso();
        this.$(`#l${i} select[data-f="motivo"]`)?.focus();
        return;
      case "rem-falta":
        l.falta = null;
        this.renderizarLinha(i);
        this.atualizarProgresso();
        return;
      case "concluir":
        void this.concluir();
        return;
      case "copiar-termo":
      case "copiar-json": {
        const c = this.$("#resultado")._c;
        if (!c) return;
        const txt = btn.dataset.acao === "copiar-json" ? JSON.stringify(c, null, 2) : termoReposicao(c);
        const rot = btn.textContent;
        navigator.clipboard.writeText(txt).then(
          () => btn.textContent = "Copiado",
          () => btn.textContent = "N\xE3o foi poss\xEDvel copiar"
        );
        setTimeout(() => btn.textContent = rot, 2e3);
        return;
      }
    }
  }
};
function alertaVazio(root, texto) {
  const m = root.querySelector(".vazio .msg");
  if (m) {
    m.textContent = texto;
    m.classList.add("erro");
  }
}
function termoReposicao(c) {
  let t = `TERMO DE REPOSI\xC7\xC3O \u2014 CARRO DE EMERG\xCANCIA
Carro de parada n\xBA ${c.numeroCarro}
`;
  t += `Prescri\xE7\xE3o: ${dataBr(c.dataHoraPrescricao)} \xB7 Confer\xEAncia: ${dataBr(c.dataHoraConferencia)}
`;
  t += `Farmac\xEAutico: ${c.farmaceutico ?? "\u2014"} \xB7 Lacre aplicado: ${c.lacreAplicado ?? "\u2014"}
`;
  t += `Situa\xE7\xE3o: ${c.situacao === "CONFORME" ? "Conforme" : "Com pend\xEAncias"}

`;
  for (const i of c.itens) {
    t += `${String(i.reposto).padStart(2, "0")}/${String(i.prescrito).padStart(2, "0")} ${i.unidade.padEnd(4)} ${i.descricao}${i.opcao ? " \u2014 " + i.opcao : ""}
`;
    for (const l of i.lotes) if (l.lote || l.validade) t += `        lote ${l.lote || "\u2014"} \xB7 val. ${validadeBr(l.validade)} \xB7 ${l.quantidade}
`;
    if (i.falta) t += `        FALTA ${i.falta.quantidade}: ${MOTIVOS[i.falta.motivo]}${i.falta.observacao ? " \u2014 " + i.falta.observacao : ""}
`;
  }
  if (c.observacoes) t += `
Observa\xE7\xF5es: ${c.observacoes}
`;
  return t.trimEnd();
}
if (!customElements.get("conferencia-farmacia-carro")) {
  customElements.define("conferencia-farmacia-carro", ConferenciaFarmaciaElement);
}

// src/painel-carro-emergencia.ts
var esc3 = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
var hora = (iso) => iso ? new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "\u2014";
var decorrido = (desde, ate) => {
  const min = Math.max(0, Math.round(((ate ? Date.parse(ate) : Date.now()) - Date.parse(desde)) / 6e4));
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`;
};
var COR = {
  AGUARDANDO_FARMACIA: "PENDENTE",
  EM_CONFERENCIA: "PARCIAL",
  CONFORME: "CONFERIDO",
  COM_PENDENCIAS: "FALTA"
};
var EXTRA2 = (
  /* css */
  `
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.kpi{background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px;padding:12px 14px;display:flex;flex-direction:column;gap:2px}
.kpi small{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--pce-suave);font-weight:600}
.kpi strong{font-size:26px;font-variant-numeric:tabular-nums;color:var(--pce-secundaria)}
.kpi.alerta{border-color:var(--pce-alerta);background:var(--pce-alerta-fundo)}
.kpi.alerta strong{color:var(--pce-alerta)}
.tabela{overflow-x:auto;background:var(--pce-superficie);border:1px solid var(--pce-linha);border-radius:8px}
.tabela table{min-width:720px}
td.n{font-variant-numeric:tabular-nums;white-space:nowrap}
.chip{display:inline-block;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:700;white-space:nowrap}
.chip.PENDENTE{background:var(--pce-cabecalho);color:var(--pce-suave)}
.chip.PARCIAL{background:#fff3d6;color:#8a5a00}
.chip.CONFERIDO{background:#dff3e6;color:#1e6b3a}
.chip.FALTA{background:var(--pce-alerta-fundo);color:var(--pce-alerta)}
.atraso{color:var(--pce-alerta);font-weight:700}
tr.atrasada td:first-child{box-shadow:inset 4px 0 0 var(--pce-alerta)}
.ao-vivo{font-size:13px;color:var(--pce-suave)}
.ao-vivo::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:#1e8a4c;margin-right:6px}
.ao-vivo.off::before{background:var(--pce-alerta)}
.sec{display:block;font-size:12px;color:var(--pce-suave)}
h2.sub{margin:0;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--pce-secundaria)}
`
);
var PainelCarroEmergenciaElement = class extends HTMLElement {
  constructor() {
    super();
    this.parar = null;
    this.timer = null;
    this.regs = [];
    this.ind = null;
    this.reqs = [];
    this.conectado = false;
    this.root = this.attachShadow({ mode: "open" });
    this.root.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-req]");
      if (b && this.cliente) void this.cliente.atenderRequisicao(b.dataset.req).then(() => this.atualizar());
    });
  }
  get cliente() {
    const s = this.getAttribute("servidor");
    return s !== null ? new ClienteServico(s, this.getAttribute("token")) : null;
  }
  connectedCallback() {
    this.renderizar();
    void this.atualizar();
    this.parar = this.cliente?.ouvir(() => void this.atualizar()) ?? null;
    this.timer = setInterval(() => void this.atualizar(), 3e4);
  }
  disconnectedCallback() {
    this.parar?.();
    if (this.timer) clearInterval(this.timer);
  }
  async atualizar() {
    const c = this.cliente;
    if (!c) return;
    try {
      [this.regs, this.ind, this.reqs] = await Promise.all([c.listar(void 0, 50), c.indicadores(), c.requisicoes("ABERTA")]);
      this.conectado = this.ind !== null;
    } catch {
      this.conectado = false;
    }
    this.renderizar();
  }
  renderizar() {
    const i = this.ind;
    const kpi = (rot, v, alerta = false) => `<div class="kpi${alerta ? " alerta" : ""}"><small>${rot}</small><strong>${v}</strong></div>`;
    const linhas = this.regs.map((r) => {
      const p = r.prescricao;
      const aberta = r.status === "AGUARDANDO_FARMACIA" || r.status === "EM_CONFERENCIA";
      return `<tr class="${r.atrasada && aberta ? "atrasada" : ""}">
          <td><span class="chip ${COR[r.status]}">${ROTULO_FLUXO[r.status]}</span></td>
          <td class="n">n\xBA ${esc3(p.numeroCarro)}</td>
          <td>${esc3(p.contexto?.paciente ?? "\u2014")}<span class="sec">${esc3(p.contexto?.setor ?? "")}</span></td>
          <td class="n">${p.itens.length} ${p.itens.length === 1 ? "item" : "itens"}</td>
          <td class="n">${hora(r.recebidaEm)}</td>
          <td class="n ${r.atrasada && aberta ? "atraso" : ""}">${decorrido(r.recebidaEm, r.concluidaEm)}${r.atrasada && aberta ? " \xB7 atrasada" : ""}</td>
          <td>${esc3(r.farmaceutico ?? "\u2014")}</td></tr>`;
    }).join("");
    const reqs = this.reqs.map(
      (q) => `<tr><td>${esc3(q.descricao)}${q.opcao ? " \u2014 " + esc3(q.opcao) : ""}</td><td class="n">${q.quantidade} ${q.unidade}</td>
          <td class="n">n\xBA ${esc3(q.numeroCarro)}</td><td>${esc3(q.motivo.replace(/_/g, " ").toLowerCase())}</td><td class="n">${hora(q.em)}</td>
          <td><button type="button" class="mini" data-req="${esc3(q.id)}">Marcar atendida</button></td></tr>`
    ).join("");
    this.root.innerHTML = `<style>${ESTILOS}${EXTRA2}</style>
      <div class="wrap">
        <div class="topo"><h1>Painel do Carro de Emerg\xEAncia</h1>
          <span class="ao-vivo${this.conectado ? "" : " off"}">${this.conectado ? "Ao vivo" : "Sem conex\xE3o com o servi\xE7o"}</span></div>
        <div class="kpis">
          ${kpi("Aguardando farm\xE1cia", i?.aguardando ?? "\u2014")}
          ${kpi("Em confer\xEAncia", i?.emConferencia ?? "\u2014")}
          ${kpi(`Atrasadas (> ${i?.slaMinutos ?? "\u2014"} min)`, i?.atrasadas ?? "\u2014", !!i?.atrasadas)}
          ${kpi("Repostas hoje", i?.concluidasHoje ?? "\u2014")}
          ${kpi("Tempo m\xE9dio at\xE9 repor", i?.tempoMedioMinutos != null ? `${i.tempoMedioMinutos} min` : "\u2014")}
          ${kpi("Requisi\xE7\xF5es abertas", i?.requisicoesAbertas ?? "\u2014", !!i?.requisicoesAbertas)}
        </div>
        <h2 class="sub">Prescri\xE7\xF5es recentes</h2>
        <div class="tabela"><table>
          <thead><tr><th>Situa\xE7\xE3o</th><th>Carro</th><th>Paciente</th><th>Itens</th><th>Recebida</th><th>Tempo</th><th>Farmac\xEAutico</th></tr></thead>
          <tbody>${linhas || `<tr><td colspan="7">Nenhuma prescri\xE7\xE3o ainda.</td></tr>`}</tbody></table></div>
        <h2 class="sub">Requisi\xE7\xF5es de compra abertas (faltas)</h2>
        <div class="tabela"><table>
          <thead><tr><th>Item</th><th>Qtd.</th><th>Carro</th><th>Motivo</th><th>Aberta em</th><th></th></tr></thead>
          <tbody>${reqs || `<tr><td colspan="6">Nenhuma requisi\xE7\xE3o aberta.</td></tr>`}</tbody></table></div>
      </div>`;
  }
};
if (!customElements.get("painel-carro-emergencia")) customElements.define("painel-carro-emergencia", PainelCarroEmergenciaElement);
export {
  CANAL_PADRAO,
  CHECKLIST_PADRAO,
  ClienteServico,
  ConferenciaFarmaciaElement,
  ErroValidacao,
  PainelCarroEmergenciaElement,
  PrescricaoCarroEmergenciaElement,
  ROTULO_FLUXO,
  criarEnvioHttp,
  dataGs1,
  diasParaVencer,
  lerCodigo,
  limiteDaLinha,
  normalizarGtin,
  normalizarLinhas,
  novoId,
  podeAdicionarOpcao,
  problemaDoLote,
  somarLote,
  statusDaLinha,
  termoReposicao,
  textoPrescricao
};
