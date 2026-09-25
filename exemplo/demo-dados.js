// Dados de EXEMPLO para demonstração (códigos de barras e lotes fictícios).
// Na integração real, os GTINs vêm do cadastro de produtos do G-HOSP.
(function () {
  const { CHECKLIST_PADRAO } = window.PrescricaoCarro;
  const GTIN = {
    "Adrenalina / Epinefrina 1mg/ml amp 1ml": ["07890000000011"],
    "Glicose 50% amp 10ml": ["07890000000028"],
  };
  const GTIN_OPCAO = {
    "Cateter intrav. de segurança (19mm) (Abocath)": { "nº 18": ["07890000000035"], "nº 20": ["07890000000042"] },
    "Seringa desc s/ rosca": { "10ml": ["07890000000059"], "20ml": ["07890000000066"] },
  };
  const checklist = CHECKLIST_PADRAO.map((sec) => ({
    ...sec,
    itens: sec.itens.map((it) => ({ ...it, gtin: GTIN[it.descricao], gtinPorOpcao: GTIN_OPCAO[it.descricao] })),
  }));

  const dia = (n) => {
    const d = new Date(Date.now() + n * 86400000);
    return String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
  };
  const GS = "\u001d";
  const dm = (gtin, dias, lote) => `01${gtin}21${Math.random().toString(36).slice(2, 8).toUpperCase()}${GS}17${dia(dias)}10${lote}`;

  const leituras = [
    { rotulo: "Adrenalina · lote OK", codigo: () => dm("07890000000011", 420, "ADR2291") },
    { rotulo: "Abocath nº 18 · lote OK", codigo: () => dm("07890000000035", 700, "ABC18X") },
    { rotulo: "Seringa 10ml · lote OK", codigo: () => dm("07890000000059", 900, "SR10-55") },
    { rotulo: "Glicose 50% · validade curta", codigo: () => dm("07890000000028", 40, "GLI050") },
    { rotulo: "Glicose 50% · lote OK", codigo: () => dm("07890000000028", 365, "GLI777") },
    { rotulo: "Adrenalina · VENCIDO", codigo: () => dm("07890000000011", -12, "ADR0001") },
    { rotulo: "Código não cadastrado", codigo: () => dm("07899999999994", 500, "NOVO1") },
  ];

  const prescricaoExemplo = {
    tipo: "PRESCRICAO_CARRO_EMERGENCIA",
    versao: 1,
    id: "exemplo-0001",
    dataHora: new Date(Date.now() - 25 * 60000).toISOString(),
    numeroCarro: "49",
    lacreRompido: "0045120",
    lacreNovo: "0045121",
    contexto: { atendimento: "EXEMPLO-000123", paciente: "Paciente de exemplo", prescritor: "Enf. exemplo", setor: "UTI Adulto" },
    itens: [
      { secao: "Materiais", codigo: null, descricao: "Cateter intrav. de segurança (19mm) (Abocath)", opcao: "nº 18", quantidade: 1, unidade: "und", quantitativoPrevisto: 2 },
      { secao: "Materiais", codigo: null, descricao: "Seringa desc s/ rosca", opcao: "10ml", quantidade: 2, unidade: "und", quantitativoPrevisto: 5 },
      { secao: "Materiais CME", codigo: null, descricao: "Laringoscópio com pilha", opcao: null, quantidade: 1, unidade: "und", quantitativoPrevisto: 3 },
      { secao: "Medicamentos", codigo: null, descricao: "Adrenalina / Epinefrina 1mg/ml amp 1ml", opcao: null, quantidade: 4, unidade: "amp", quantitativoPrevisto: 15 },
      { secao: "Medicamentos", codigo: null, descricao: "Glicose 50% amp 10ml", opcao: null, quantidade: 1, unidade: "amp", quantitativoPrevisto: 5 },
    ],
    justificativa: "1 ampola de adrenalina quebrada durante o preparo.",
  };

  window.DEMO = { checklist, leituras, prescricaoExemplo };
})();
