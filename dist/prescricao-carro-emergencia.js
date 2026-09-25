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
      { descricao: "Lanterna pequena", maximo: 1 },
      { descricao: "Luva pl\xE1stica desc", maximo: 10 },
      { descricao: "Luva procedimento M", maximo: 1, unidade: "cx" },
      { descricao: "Micropore", maximo: 1, unidade: "rolo" },
      { descricao: "Laringosc\xF3pio com pilha", maximo: 3 },
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
  return async (prescricao) => {
    const controle = new AbortController();
    const timer = setTimeout(() => controle.abort(), cfg.timeoutMs ?? 15e3);
    try {
      const resp = await fetch(cfg.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", ...cfg.headers },
        credentials: cfg.usarCookies === false ? "omit" : "include",
        body: JSON.stringify(prescricao),
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
    if (antigo === novo || !this.isConnected) return;
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
    const continuar = this.dispatchEvent(
      new CustomEvent("prescricao-gerada", { detail: p, bubbles: true, composed: true, cancelable: true })
    );
    let status = "";
    let erro = false;
    if (!continuar) {
      status = "Prescri\xE7\xE3o entregue ao G-HOSP.";
    } else {
      const envio = this.enviar ?? (this._cfg?.endpoint ? criarEnvioHttp(this._cfg) : null);
      if (!envio) {
        status = "Envio autom\xE1tico para a aba Prescri\xE7\xF5es do G-HOSP ainda n\xE3o configurado.";
      } else {
        botao.disabled = true;
        botao.textContent = "Enviando\u2026";
        try {
          const r = await envio(p);
          if (r.enviado) {
            status = `Prescri\xE7\xE3o enviada para a aba Prescri\xE7\xF5es do G-HOSP${r.idPrescricao ? ` (n\xBA ${esc(r.idPrescricao)})` : ""}.`;
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
export {
  CHECKLIST_PADRAO,
  ErroValidacao,
  PrescricaoCarroEmergenciaElement,
  criarEnvioHttp,
  limiteDaLinha,
  normalizarLinhas,
  podeAdicionarOpcao,
  textoPrescricao
};
