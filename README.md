# Formulário de Prescrição de Carro de Emergência

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

## Desenvolvimento

```bash
npm install
npm run verificar   # checagem de tipos
npm run build       # gera dist/ e build/
npm run exemplo     # abre um servidor local; acesse /exemplo/
```

Compatibilidade: Chrome, Edge e Firefox atuais (Web Components nativos). Não funciona no Internet Explorer.
