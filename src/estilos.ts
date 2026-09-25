/**
 * Estilos do componente (isolados no Shadow DOM, não interferem no G-HOSP).
 * As cores podem ser trocadas pelo G-HOSP com variáveis CSS, por exemplo:
 *   prescricao-carro-emergencia { --pce-primaria: #264476; }
 */
export const ESTILOS: string = /* css */ `
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
`;
