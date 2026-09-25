# Carro de Emergência: Prescrição e Conferência da Farmácia

Fluxo automatizado de ponta a ponta:

1. `<prescricao-carro-emergencia>` — a enfermagem registra o que foi usado e gera a prescrição.
2. `<conferencia-farmacia-carro>` — a farmácia recebe a prescrição na hora, confere com leitor de código de barras e registra a reposição.
3. `<painel-carro-emergencia>` — acompanhamento em tempo real: fila, prazos, tempo de reposição e faltas.
4. **Serviço de integração** (`servidor/`) — liga tudo: recebe, valida, distribui em tempo real, dá baixa no estoque, abre requisições e avisa o G-HOSP.

```
Enfermagem ──POST /api/prescricoes──▶ Serviço ──tempo real (SSE)──▶ Farmácia (fila, bipe, lotes)
    ▲                                   │  valida · reserva · SLA            │
    └──── "Em conferência" / "Reposto" ─┤◀──────POST /api/conferencias───────┘
                                        ├─▶ baixa de estoque por lote
                                        ├─▶ requisição de compra (faltas)
                                        ├─▶ Painel (indicadores ao vivo)
                                        └─▶ webhook G-HOSP (quando existir)
```


Componente web para integração ao **G-HOSP** (HRO / ALVF). Escrito em **TypeScript**, compilado para JavaScript puro, e entregue como um **Web Component** (`<prescricao-carro-emergencia>`): uma tag HTML nova que funciona em qualquer página do G-HOSP, sem framework e sem conflito de estilos (Shadow DOM).

## O que o formulário faz

- Lista os itens do check list do carro de emergência em caixas de seleção, sem mostrar quantidades.
- Ao marcar um item, abre a escolha da quantidade. **A soma nunca passa do quantitativo previsto no check list.**
- Itens com mais de uma opção (tamanhos, calibres, adulto/pediátrico) pedem a opção utilizada, e permitem registrar mais de uma opção no mesmo item, sempre dentro do limite total.
- Campos: número do carro de parada (obrigatório), lacre rompido, lacre novo e justificativa (quebra ou medicamento diluído e não utilizado).
- O botão **Gerar Prescrição** valida o formulário, monta a prescrição e envia para a aba Prescrições do G-HOSP.

## Estrutura

```
src/
  types.ts                         contrato de dados (o que o G-HOSP recebe)
  checklist-padrao.ts              itens e quantitativos do check list
  regras.ts                        regra de limite de quantidade (funções puras)
  ghosp-client.ts                  envio HTTP para a API do G-HOSP
  estilos.ts                       CSS isolado (cores ALVF, ajustáveis)
  prescricao-carro-emergencia.ts   o componente
  index.ts                         exportações
dist/
  prescricao-carro-emergencia.js       módulo ES (navegadores modernos)
  prescricao-carro-emergencia.min.js   script clássico minificado (qualquer página)
build/                             definições de tipo (.d.ts)
exemplo/index.html                 página de teste simulando o G-HOSP
exemplo/fluxo-completo.html        enfermagem + farmácia na mesma página (dados fictícios)
src/conferencia-farmacia.ts        componente da conferência da farmácia
src/conferencia-regras.ts          regras de validade, lote e situação (funções puras)
src/gs1.ts                         leitura de DataMatrix GS1 / EAN (GTIN, lote, validade, série)
```

## Como incluir no G-HOSP

**1. Copie o arquivo** `dist/prescricao-carro-emergencia.min.js` para os arquivos estáticos do G-HOSP.

**2. Inclua na página** da aba Prescrições:

```html
<script src="/static/js/prescricao-carro-emergencia.min.js"></script>
```

(Se as páginas do G-HOSP já usam módulos: `<script type="module" src=".../prescricao-carro-emergencia.js"></script>`.)

**3. Coloque a tag** onde o formulário deve aparecer, preenchendo os atributos com os dados que o G-HOSP já tem na tela:

```html
<prescricao-carro-emergencia
    atendimento="{{ numero_atendimento }}"
    paciente="{{ nome_paciente }}"
    prescritor="{{ usuario_logado }}"
    setor="{{ setor }}"
    endpoint="/ghosp/api/prescricoes/carro-emergencia">
</prescricao-carro-emergencia>
```

Sem `endpoint`, a prescrição é gerada e exibida na tela, mas não é enviada.

## Três formas de gravar a prescrição (escolha uma)

**A. POST automático** (mais simples). Com o atributo `endpoint`, ou configurando por script:

```js
const form = document.querySelector("prescricao-carro-emergencia");
form.configurar({
  endpoint: "/ghosp/api/prescricoes/carro-emergencia",
  headers: { "X-CSRF-Token": tokenDoGHosp },   // se o G-HOSP exigir
  usarCookies: true,                            // envia a sessão do usuário (padrão)
  timeoutMs: 15000
});
```

**B. Função própria do G-HOSP**, quando já existe uma rotina JavaScript de gravação:

```js
form.enviar = async (prescricao) => {
  const id = await GHosp.Prescricoes.salvar(prescricao);   // rotina existente
  return { enviado: true, idPrescricao: id };
};
```

**C. Pelo evento**, quando o G-HOSP quer controlar tudo:

```js
form.addEventListener("prescricao-gerada", (e) => {
  e.preventDefault();          // impede o envio interno
  gravarNoGHosp(e.detail);     // e.detail é a prescrição completa
});
```

## Contrato da API (o que o G-HOSP recebe)

`POST {endpoint}` com `Content-Type: application/json`:

```json
{
  "tipo": "PRESCRICAO_CARRO_EMERGENCIA",
  "versao": 1,
  "dataHora": "2026-09-24T21:40:00.000Z",
  "numeroCarro": "49",
  "lacreRompido": "123456",
  "lacreNovo": "123457",
  "contexto": {
    "atendimento": "2026-0001234",
    "paciente": "Nome do paciente",
    "prescritor": "Profissional logado",
    "setor": "UTI Adulto"
  },
  "itens": [
    { "secao": "Materiais", "codigo": null, "descricao": "Cateter intrav. de segurança (19mm) (Abocath)",
      "opcao": "nº 18", "quantidade": 1, "unidade": "und", "quantitativoPrevisto": 2 },
    { "secao": "Medicamentos", "codigo": null, "descricao": "Adrenalina / Epinefrina 1mg/ml amp 1ml",
      "opcao": null, "quantidade": 4, "unidade": "amp", "quantitativoPrevisto": 15 }
  ],
  "justificativa": "1 ampola quebrada."
}
```

Resposta esperada: qualquer status **2xx** indica sucesso. Opcionalmente, JSON com `{ "idPrescricao": "...", "mensagem": "..." }`; o número aparece para o usuário. Em erro (4xx/5xx), a `mensagem` devolvida é exibida na tela.

**Validação no servidor (recomendado):** o formulário já impede quantidades acima do previsto, mas o G-HOSP deve conferir de novo `quantidade <= quantitativoPrevisto` (somando as linhas do mesmo item), pois dados vindos do navegador podem ser alterados.

## Códigos dos itens no G-HOSP

Cada item tem o campo opcional `codigo`. Para a prescrição cair ligada ao cadastro de materiais e medicamentos do G-HOSP, preencha os códigos em `src/checklist-padrao.ts`:

```ts
{ codigo: "MED-000123", descricao: "Adrenalina / Epinefrina 1mg/ml amp 1ml", maximo: 15, unidade: "amp" },
```

## Outros carros com composição diferente

O check list padrão é o do carro nº 49. Para outro carro, forneça um JSON no mesmo formato:

```html
<prescricao-carro-emergencia checklist-url="/ghosp/api/carros/12/checklist"></prescricao-carro-emergencia>
```

ou por script: `form.checklist = [{ titulo: "Materiais", itens: [...] }, ...]`.

## Cores

Padrão: azul ALVF. Para ajustar ao tema do G-HOSP, use variáveis CSS na página:

```css
prescricao-carro-emergencia {
  --pce-primaria: #264476;
  --pce-secundaria: #293b6b;
  --pce-destaque: #87add8;
}
```

## Referência rápida

| Atributo | Uso |
|---|---|
| `endpoint` | URL da API de prescrições (POST JSON) |
| `atendimento`, `paciente`, `prescritor`, `setor` | Contexto que vai no JSON |
| `numero-carro` | Pré-preenche o número do carro |
| `checklist-url` | Carrega outro check list |

| Método / propriedade | Uso |
|---|---|
| `configurar(cfg)` | Endpoint, cabeçalhos, cookies, timeout |
| `enviar` | Função de envio própria |
| `checklist` | Define o check list |
| `obterPrescricao()` | Valida e devolve o JSON (lança `ErroValidacao` com a lista de pendências) |
| `gerar()` | Mesmo efeito do botão |
| `limpar()` | Zera o formulário |

| Evento | `detail` |
|---|---|
| `prescricao-gerada` (cancelável) | a prescrição |
| `prescricao-enviada` | `{ prescricao, resultado }` |
| `prescricao-erro` | `{ prescricao?, erro }` |

## Conferência da farmácia (`<conferencia-farmacia-carro>`)

### Fluxo
1. A prescrição chega sozinha: pelo G-HOSP (propriedade `prescricao` ou atributo `prescricao-url`), ou na hora, pelo canal do navegador quando a enfermagem gera a prescrição na mesma máquina. Prescrições que chegam durante uma conferência entram numa **fila**.
2. O cabeçalho mostra carro, paciente, atendimento, lacres e a **justificativa** da enfermagem (ex.: ampola quebrada).
3. O farmacêutico **bipa cada unidade separada**. Cada leitura:
   - identifica o item pelo GTIN e soma 1 unidade na linha certa (inclusive a opção: Abocath nº 18, seringa 10 ml...);
   - preenche **lote e validade** automaticamente a partir do DataMatrix;
   - **recusa na hora** lote vencido ou com validade abaixo do mínimo (padrão 90 dias, a regra do check list de trocar o que vence em 3 meses), com bipe de erro;
   - avisa se o item não está na prescrição ou se a quantidade já foi atingida;
   - para código ainda não cadastrado, pede uma vez a qual item ele pertence e passa a reconhecer sozinho (evento `gtin-associado` para o G-HOSP gravar no cadastro).
4. Sem leitor, "+ lote manual" (ou "Separar restante manualmente") abre os campos de lote, validade e quantidade.
5. O que não puder ser reposto é marcado **Em falta** com motivo; a quantidade em falta é calculada.
6. **Concluir conferência** só libera com todos os itens conferidos ou com falta justificada, lacre aplicado e farmacêutico. Gera o JSON, envia ao G-HOSP e mostra o **termo de reposição**.

### Incluir no G-HOSP
```html
<conferencia-farmacia-carro
    farmaceutico="{{ usuario_logado }}"
    validade-minima-dias="90"
    endpoint="/ghosp/api/farmacia/conferencias-carro"
    checklist-url="/ghosp/api/carros/49/checklist">
</conferencia-farmacia-carro>
<script>
  const conf = document.querySelector("conferencia-farmacia-carro");
  conf.prescricao = prescricaoVindaDoGHosp;       // ou prescricao-url="..."
  conf.addEventListener("gtin-associado", e => salvarGtinNoCadastro(e.detail));
</script>
```

### Códigos de barras
Cadastre os GTINs no check list para a leitura ser automática desde o primeiro dia:
```ts
{ descricao: "Adrenalina / Epinefrina 1mg/ml amp 1ml", maximo: 15, unidade: "amp", gtin: ["07890000000011"] },
{ descricao: "Seringa desc s/ rosca", maximo: 5, opcoes: ["10ml","20ml"], gtinPorOpcao: { "10ml": ["0789..."], "20ml": ["0789..."] } },
{ descricao: "Lanterna pequena", maximo: 1, semValidade: true },
```
Leitores aceitos: qualquer leitor USB/Bluetooth em modo teclado. Formatos: DataMatrix GS1 (01/21/17/10, com ou sem o separador GS), forma legível com parênteses, EAN-13 e GTIN-14.

### Contrato JSON da conferência (POST)
```json
{
  "tipo": "CONFERENCIA_REPOSICAO_CARRO",
  "versao": 1,
  "id": "uuid",
  "prescricaoId": "uuid da prescrição",
  "numeroCarro": "49",
  "dataHoraPrescricao": "2026-09-25T12:40:00.000Z",
  "dataHoraConferencia": "2026-09-25T13:05:00.000Z",
  "duracaoSegundos": 312,
  "farmaceutico": "Farm. responsável",
  "lacreAplicado": "0045121",
  "situacao": "COM_PENDENCIAS",
  "validadeMinimaDias": 90,
  "itens": [
    { "secao": "Medicamentos", "codigo": null, "descricao": "Adrenalina / Epinefrina 1mg/ml amp 1ml", "opcao": null,
      "unidade": "amp", "prescrito": 4, "reposto": 3,
      "lotes": [{ "lote": "ADR2291", "validade": "2027-11-19", "quantidade": 3, "gtin": "07890000000011", "origem": "leitura" }],
      "falta": { "quantidade": 1, "motivo": "SEM_ESTOQUE", "observacao": null } }
  ],
  "observacoes": null
}
```
`situacao` é `CONFORME` quando tudo foi reposto. Motivos de falta: `SEM_ESTOQUE`, `AGUARDANDO_COMPRA`, `ITEM_SUSPENSO`, `OUTRO`.

### Sugestões para o G-HOSP
- Dar **baixa no estoque** por lote a partir de `itens[].lotes` e abrir **requisição de compra** para `itens[].falta`.
- Validar no servidor: `reposto <= prescrito` e validade dos lotes.
- Indicadores prontos no JSON: tempo de conferência (`duracaoSegundos`), faltas por motivo, itens mais usados por carro.

## Automação integrada (serviço `servidor/`)

### O que acontece sozinho
| Momento | Automação |
|---|---|
| Enfermagem clica em **Gerar Prescrição** | O serviço valida (quantitativos do check list, opções, nº do carro) e grava. Reenvio não duplica. |
| Prescrição gravada | Aparece **na hora** em todas as telas da farmácia abertas e no contador do menu. |
| Farmácia abre a prescrição | A conferência fica **reservada** ao farmacêutico (15 min); outro colega vê "Em conferência por …". |
| Durante a conferência | A enfermagem vê, na própria tela, "Em conferência por …". |
| Leitura de código novo | O código aprendido vale para **todas as estações** da farmácia a partir daí. |
| Prescrição parada além do prazo | Após `SLA_MINUTOS` (padrão 60), vira **atrasada**: alerta no painel e na farmácia. |
| Farmácia conclui | O serviço confere de novo (reposto ≤ prescrito, lotes válidos, validade ≥ 90 dias), grava, **baixa o estoque por lote**, **abre requisição de compra** para faltas e avisa a enfermagem: "Reposto · lacre …". |
| Qualquer evento | Repassado ao G-HOSP por webhook (`GHOSP_WEBHOOK_URL`), com novas tentativas se falhar. |

### Rodar
```bash
npm install
npm run build
npm run servidor          # http://localhost:3080  (Enfermagem · Farmácia · Painel)
```
Ou com Docker: `docker build -t carro-emergencia . && docker run -p 3080:3080 -v carro-dados:/dados carro-emergencia`.

Configuração em `servidor/.env.exemplo` (porta, arquivo de dados, SLA, token, CORS, webhook).

### Ligar os componentes ao serviço
Basta o atributo `servidor` (vazio = mesmo endereço):
```html
<prescricao-carro-emergencia servidor="https://carro.hro.local" prescritor="{{ usuario }}"></prescricao-carro-emergencia>
<conferencia-farmacia-carro  servidor="https://carro.hro.local" farmaceutico="{{ usuario }}"></conferencia-farmacia-carro>
<painel-carro-emergencia     servidor="https://carro.hro.local"></painel-carro-emergencia>
```

### API do serviço
| Método | Rota | Uso |
|---|---|---|
| POST | `/api/prescricoes` | Recebe a prescrição (201 nova, 200 repetida, 422 inválida) |
| GET | `/api/prescricoes?status=AGUARDANDO_FARMACIA,EM_CONFERENCIA` | Fila |
| GET | `/api/prescricoes/:id` | Registro completo com histórico |
| POST | `/api/prescricoes/:id/assumir` | Reserva a conferência `{ farmaceutico }` (409 se outro estiver conferindo) |
| POST | `/api/conferencias` | Conclui a conferência (validada contra a prescrição) |
| GET | `/api/conferencias/:id` | Conferência gravada |
| GET | `/api/eventos` | Tempo real (SSE): `prescricao-recebida`, `conferencia-iniciada`, `conferencia-concluida`, `alerta-sla` |
| GET | `/api/indicadores` | Fila, atrasadas, repostas hoje, tempo médio, requisições abertas |
| GET | `/api/movimentos` | Baixas de estoque por lote |
| GET / POST | `/api/requisicoes`, `/api/requisicoes/:id/atender` | Requisições de compra das faltas |
| GET / POST | `/api/checklist`, `/api/gtins` | Check list com códigos de barras aprendidos |
| GET | `/api/saude` | Verificação de funcionamento |

Situações da prescrição: `AGUARDANDO_FARMACIA` → `EM_CONFERENCIA` → `CONFORME` ou `COM_PENDENCIAS`.

### Para produção (TI do HRO)
- **Dados:** o piloto grava em arquivo JSON. Para produção, implemente a interface `Armazenamento` (`servidor/src/armazenamento.ts`) com o banco do G-HOSP.
- **Segurança:** defina `TOKEN_API` ou coloque o serviço atrás do login do G-HOSP; libere só as origens necessárias em `ORIGENS`.
- **G-HOSP:** as regras estão em `servidor/src/fluxo.ts`, separadas do HTTP. O TI pode chamar esse módulo direto ou só consumir o webhook.

## Desenvolvimento

```bash
npm install
npm run verificar   # checagem de tipos
npm run build       # gera dist/ e build/
npm run exemplo     # abre um servidor local; acesse /exemplo/ e /exemplo/fluxo-completo.html
```

Compatibilidade: Chrome, Edge e Firefox atuais (Web Components nativos). Não funciona no Internet Explorer.
