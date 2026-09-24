# Sorteador UniÚnica

Sistema web de sorteio de nomes do Centro Universitário Única. Upload de uma lista em CSV, um clique em **SORTEAR** e o resultado aparece em destaque, com animação e confete.

Todo o processamento acontece **no navegador**: o arquivo CSV nunca é enviado para nenhum servidor, não é salvo em banco de dados nem em `localStorage`. Ao atualizar ou fechar a página, a lista desaparece.

## Tecnologias

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (build tool e dev server)
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [Papa Parse](https://www.papaparse.com/) (parser de CSV robusto: delimitador automático, BOM, aspas, UTF-8)
- [canvas-confetti](https://www.kirilv.com/canvas-confetti/) (efeito de confete)
- [Vitest](https://vitest.dev/) + Testing Library (testes automatizados)

Nenhum backend é utilizado — a aplicação é 100% frontend.

## Como executar localmente

Pré-requisito: [Node.js](https://nodejs.org/) 20 ou superior.

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Como gerar build de produção

```bash
npm run build
npm run preview
```

O build final fica em `dist/` e pode ser hospedado em qualquer serviço de arquivos estáticos (Netlify, Vercel, GitHub Pages, servidor institucional, etc.) — não precisa de servidor Node em produção.

## Testes automatizados

```bash
npm run test
```

Os testes cobrem as funções críticas:

- `src/utils/csvParser.ts` — detecção de coluna de nome, delimitadores (`,` e `;`), BOM, acentos, duplicados, listas grandes, mensagens de erro.
- `src/utils/randomDraw.ts` — sorteio sem viés de módulo via `crypto.getRandomValues`, distribuição uniforme, casos-limite.

## Formato do arquivo CSV

```csv
nome
João da Silva
Maria Oliveira
Carlos Henrique
```

O sistema identifica automaticamente uma coluna chamada `nome`, `Nome`, `NOME` ou `name` (com ou sem acento). Se o CSV tiver outras colunas (e-mail, CPF, cidade etc.), elas são ignoradas — apenas o nome é usado e exibido. Nomes duplicados **não** são removidos: cada linha é um participante distinto. Um arquivo de exemplo está em [`exemplo-participantes.csv`](./exemplo-participantes.csv).

## Estrutura do projeto

```
src/
├── components/
│   ├── Header.tsx           # cabeçalho discreto (UniÚnica / Sorteador)
│   ├── Footer.tsx           # rodapé institucional
│   ├── FileUploader.tsx     # upload por clique ou drag-and-drop
│   ├── ParticipantInfo.tsx  # status do arquivo carregado e mensagens de erro/processamento
│   ├── DrawButton.tsx       # botão SORTEAR / SORTEANDO... / SORTEAR NOVAMENTE
│   └── DrawResult.tsx       # animação do sorteio, resultado final e confete
├── hooks/
│   └── useLottery.ts        # estado da aplicação (upload, sorteio, resultado)
├── utils/
│   ├── csvParser.ts         # parser de CSV e detecção da coluna de nome
│   ├── csvParser.test.ts
│   ├── randomDraw.ts        # sorteio aleatório seguro (crypto.getRandomValues)
│   └── randomDraw.test.ts
├── assets/
│   └── background.svg       # background institucional (roxo + formas geométricas)
├── App.tsx
├── main.tsx
└── index.css                 # Tailwind + paleta de cores + tipografia + animações
```

## Onde está o background

O plano original previa usar uma imagem fornecida (`/mnt/data/2.png`), mas esse arquivo não estava acessível no ambiente de desenvolvimento. Em seu lugar foi criado [`src/assets/background.svg`](./src/assets/background.svg): um gradiente roxo com formas geométricas na mesma paleta institucional, aplicado em `src/App.tsx` como background de tela cheia (`background-size: cover`).

**Para substituir pela imagem oficial:**

1. Coloque o arquivo em `src/assets/` (ex: `src/assets/background.png`).
2. Em `src/App.tsx`, troque o import:
   ```tsx
   import backgroundUrl from './assets/background.png'
   ```

## Como trocar a logo

O header (`src/components/Header.tsx`) já usa a logo oficial branca da UniÚnica, em [`src/assets/logo.png`](./src/assets/logo.png).

Para trocar por outra versão (ex: colorida, SVG oficial):

1. Salve o novo arquivo em `src/assets/` (ex: `src/assets/logo.svg`).
2. Em `src/components/Header.tsx`, atualize o import:
   ```tsx
   import logo from '../assets/logo.svg'
   ```

## Como alterar as cores

As cores da marca ficam centralizadas em `src/index.css`, dentro do bloco `@theme`:

```css
@theme {
  --color-brand-primary: #6c2bd9;
  --color-brand-dark: #24103f;
  --color-brand-deep: #160a2b;
  --color-brand-vibrant: #8b3dff;
  --color-brand-light: #f5f5f7;
}
```

Alterar esses valores atualiza automaticamente todas as classes Tailwind que as usam (`bg-brand-vibrant`, `text-brand-vibrant`, `bg-brand-deep` etc.) em todo o projeto.

## Decisões de implementação

- **Sorteio sem viés**: `secureRandomIndex` usa `crypto.getRandomValues` com *rejection sampling* para eliminar o viés de módulo, em vez de um simples `% length`.
- **Não repetir vencedor**: não implementado por padrão (conforme especificação), mas `drawRandomParticipant(participants, excluded)` já aceita um `Set` de excluídos, facilitando adicionar essa opção no futuro sem alterar a assinatura.
- **Performance**: durante a animação do sorteio, apenas o nome atual é renderizado — nenhuma lista completa de participantes é colocada no DOM, mesmo com milhares de linhas no CSV.
- **Privacidade**: nenhuma chamada de rede é feita com os dados do CSV; nada é salvo em `localStorage`/`sessionStorage`; nomes não são enviados a analytics nem logados no console.
