# PRD Completo do Produto Atual

## 1. Objetivo deste documento

Este documento descreve o produto **exatamente como ele existe hoje neste repositório**, com base na leitura do código-fonte em `src/`, stores, serviços, utilitários, testes e docs locais.

Objetivo prático:

- servir como fonte de verdade para recriar o projeto;
- mapear todas as telas, estados, fluxos, regras e dependências;
- separar comportamento real implementado de expectativas antigas em docs mais conceituais.

Escopo desta leitura:

- rotas e navegação;
- design shell e padrões visuais;
- telas e seus estados;
- modelos de dados locais;
- integrações externas;
- regras de gamificação, progressão e SRS;
- observações de implementação e inconsistências atuais.

## 2. Visão geral do produto

**LangFlow** é um aplicativo local-first de estudo de inglês que transforma leitura real em:

- captura de vocabulário;
- prática guiada;
- escrita;
- revisão espaçada;
- acompanhamento gamificado de progresso.

O produto opera sem backend próprio. Todo o estado principal é salvo localmente no navegador por meio de Zustand com persistência em `localStorage`.

Jornada central do produto:

1. o usuário importa ou cola um texto;
2. clica em palavras no Reader;
3. as palavras entram no banco lexical;
4. o Builder monta exercícios a partir dessas palavras e do banco existente;
5. frases podem ser salvas como flashcards;
6. flashcards entram no ciclo SRS;
7. Dashboard e Evolution mostram progresso, retenção, streak, XP e conquistas.

## 3. Stack e arquitetura

### 3.1 Frontend

- React 19
- Vite
- React Router DOM 7
- Zustand
- Tailwind CSS + tokens CSS + componentes `ui`
- `@dnd-kit` para drag and drop no Builder

### 3.2 Persistência local

Stores persistidas:

- `langflow_config`
- `langflow_words`
- `langflow_cards`
- `langflow_progress`
- `langflow_ui` (somente notificações)

Não existe sincronização em nuvem.

### 3.3 Integrações externas

- OpenAI Chat Completions
- Google Gemini `generateContent`
- YouTube timedtext para transcrição/legenda

### 3.4 Filosofia operacional

- app local-first;
- sem autenticação;
- sem banco remoto;
- IA é opcional;
- existem fallbacks locais quando IA não está configurada.

## 4. Navegação e shell global

## 4.1 Rotas reais

| Rota | Tela | Papel |
| --- | --- | --- |
| `/` | Dashboard | painel operacional do dia |
| `/reader` | Reader | captura de texto e vocabulário |
| `/vocabulary` | Vocabulary | banco lexical |
| `/practice` | Builder | prática guiada + daily prompt |
| `/flashcards` | Flashcards | revisão SRS |
| `/evolution` | Evolution | analytics e histórico |
| `/escrever` | Escrever | tradução PT → EN |
| `/settings` | Settings | preferências, IA, estudo e dados |

Qualquer rota desconhecida redireciona para `/`.

## 4.2 Sidebar

Itens do menu:

- Dashboard
- Ler
- Praticar
- Revisar
- Vocabulário
- Evolução
- Escrever
- card fixo de Configurações no rodapé

Comportamento:

- fixa no desktop;
- vira drawer no mobile;
- exibe badges dinâmicos em Reader, Practice e Flashcards.

Badges reais:

- Reader: quantidade de palavras clicadas hoje no Reader;
- Practice: `PROMPT` se há prompt diário pendente, senão número de palavras elegíveis para sessão;
- Flashcards: quantidade de revisões devidas hoje.

## 4.3 Header global interno

Em páginas internas, o shell exibe:

- título da página;
- subtítulo descritivo;
- busca visual;
- ação primária opcional;
- ícone de notificações.

Ações primárias emitidas via evento global:

- Reader: `reader-primary`
- Practice: `practice-primary`
- Flashcards: `flashcards-primary`
- Settings: `settings-primary`

Observação importante:

- os campos de busca do shell e da dashboard são visuais; não existe lógica funcional de busca conectada a eles.

## 4.4 Notificações e toasts

Existem dois mecanismos globais:

- `toast`: mensagens temporárias;
- `notification`: histórico persistido de alertas/marcos.

Comportamentos:

- toasts somem automaticamente por padrão em 4 segundos;
- notificações persistem no store UI;
- popover de notificações permite marcar todas como lidas e limpar tudo;
- o histórico mantém no máximo 25 notificações.

## 5. Direção visual atual

## 5.1 Identidade visual

O produto atual adota:

- fundo claro com subtom lavanda;
- cards brancos;
- gradientes roxo/fúcsia;
- muitos cantos arredondados;
- linguagem gamificada premium;
- sidebar translúcida clara;
- tipografia baseada em Inter.

## 5.2 Tokens principais

Cores mais marcantes:

- primária: `#7C3AED`
- acento XP/rosa: `#EC4899`
- warning: laranja
- success: verde

Padrões fortes:

- cards grandes com radius alto;
- badges em uppercase;
- indicadores de progresso com barras e pills;
- glassmorphism leve em partes do shell.

## 6. Modelo de dados do produto

## 6.1 Configuração do usuário

Store: `useConfig`

Campos principais:

- `userLevel`: `A1 | A2 | B1 | B2 | C1`
- `provider`: `openai | gemini | ''`
- `openaiKey`
- `openaiModel`
- `geminiKey`
- `geminiModel`
- `srs.dailyLimit`
- `srs.intervals`
- `builder.difficultWordsWeight`
- `builder.phrasesPerWord`
- `builder.sessionWordLimit`
- `builder.preferredMode` (opcional)
- `study.minSessionMinutes`
- `autoAdjustDifficulty`
- `missions`

Defaults reais:

- nível: `B1`
- provedor: nenhum
- OpenAI model: `gpt-5-mini`
- Gemini model: `gemini-2.0-flash`
- limite diário SRS: `20`
- frases por palavra: `3`
- palavras por sessão: `5`
- peso de palavras difíceis: `30`
- sessão mínima para streak: `5` minutos

## 6.2 Palavra / item lexical

Store: `useWordStore`

Campos reais por item:

- `id`
- `word`
- `status`
- `tag`
- `originalSentence`
- `tooltipExplanation`
- `entryType`
- `cefrLevel`
- `source`
- `isSeeded`
- `addedAt`
- `lastSeenAt`
- `correctCount`
- `errorCount`
- `dragCorrectCount`
- `dragWrongCount`
- `builderErrorStreak`
- `easeFactor`
- `reviewCount`
- `recentLapses`
- `masteryAwarded`

Valores relevantes:

- `entryType`: `word` ou `collocation`
- `status`: `desconhecida`, `reconhecida`, `em_treino`, `ativa`, `dominada`
- `source`: `manual`, `ngsl` e fluxos derivados

## 6.3 Sentença de prática

Store: `useCardStore.sentences`

Campos reais:

- `id`
- `wordId`
- `wordText`
- `english`
- `portuguese`
- `type`
- `words`
- `attempts`
- `maxAttempts`
- `savedToFlashcard`
- `userProduction`
- `generatedAt`

## 6.4 Flashcard

Store: `useCardStore.flashcards`

Campos reais:

- `id`
- `sentenceId`
- `wordId`
- `front`
- `back`
- `easeFactor`
- `interval`
- `nextReview`
- `reviewCount`
- `lapseCount`
- `lastReviewResult`
- `createdAt`

## 6.5 Progresso e gamificação

Store: `useProgressStore`

Campos principais:

- `xp`
- `level`
- `masteryXp`
- `currentStreak`
- `longestStreak`
- `lastActiveDay`
- `dailyStats`
- `totals`
- `wordJourney`
- `achievements`
- `dailyPromptHistory`
- `builderRecentResults`
- `autoAdjustMeta`
- `lastXpGain`

Métricas diárias reais:

- `readerWords`
- `builderExercises`
- `transformExercises`
- `clozeExercises`
- `flashcardReviews`
- `productionWrites`
- `dailyPrompts`
- `recycledWords`
- `savedCards`
- `perfectBuilds`
- `xp`
- `streakBonus`
- `studySeconds`
- `firstActionAt`
- `lastActionAt`
- `retentionHits`
- `retentionTotal`
- `activeWordsSnapshot`
- `masteredWordsSnapshot`

## 6.6 UI global

Store: `useUiStore`

Campos:

- `toasts`
- `notifications`

## 7. Regras centrais do produto

## 7.1 Ciclo de status da palavra

Progressão:

- Reader: `desconhecida` vira `reconhecida`;
- Builder: `desconhecida` e `reconhecida` entram em `em_treino`;
- progresso consistente pode levar a `ativa`;
- desempenho forte em prática + revisão pode levar a `dominada`.

Promoções por marco:

- `em_treino` → `ativa` quando:
  - `correctCount >= 2`
  - `reviewCount >= 2`
  - `recentLapses <= 1`
  - `easeFactor >= 2`
- `ativa` → `dominada` quando:
  - `correctCount >= 4`
  - `reviewCount >= 5`
  - `recentLapses === 0`
  - `easeFactor >= 2.3`

Rebaixamentos:

- no Builder, após streak de erro suficiente;
- no SRS, `nao_lembro` rebaixa um nível.

## 7.2 XP e níveis

Nível geral:

- `XP_PER_LEVEL = 120`

Cap diário:

- `DAILY_XP_CAP = 150`

Bônus de streak:

- concedido na primeira ação do dia;
- tabela progressiva de 3 dias até 365 dias.

Eventos de XP reais:

- Reader palavra nova: `10`
- Reader revisita: `3`
- Builder acerto de primeira: `15`
- Builder acerto posterior: `5`
- produção no Builder: `12`
- prompt diário completo: `45`
- salvar card: `8`
- flashcard review:
  - `nao_lembro`: `0`
  - `dificil`: `1`
  - `bom`: `2`
  - `facil`: `3`
- Escrever:
  - correta: `12`
  - tentativa/erro: `4`

## 7.3 Mastery XP

Mastery XP move o nível de maestria lexical:

- primeira vez em `ativa`: `50`
- primeira vez em `dominada`: `150`

Faixas:

- `A1`
- `A2`
- `B1`
- `B2`
- `B2+`

Cada faixa tem 3 marcos visuais.

## 7.4 Missões diárias

Missões padrão:

- `readerWords: 5`
- `builderExercises: 6`
- `flashcardReviews: 10`
- `productionWrites: 2`
- `recycledWords: 3`

As missões podem ser alteradas nas Configurações.

## 7.5 Conquistas

Conquistas reais:

- `first_discovery`
- `builder_apprentice`
- `memory_keeper`
- `recycler`
- `perfect_flow`
- `weekly_rhythm`
- `active_lexicon`
- `prompt_starter`

## 7.6 Auto-ajuste de dificuldade

Janela observada:

- 20 exercícios recentes do Builder

Regras:

- `accuracy >= 90%`: tenta subir nível
- `accuracy <= 40%`: tenta reduzir nível
- respeita ordem: `A1 → A2 → B1 → B2 → C1`

Condições:

- precisa estar ativado em Configurações;
- só tenta ajustar quando há janela suficiente;
- não repete ajuste antes de outra janela de 20 exercícios.

## 7.7 SRS

Ratings disponíveis:

- `nao_lembro`
- `dificil`
- `bom`
- `facil`

Regras de intervalo:

- `nao_lembro`: volta para 1 dia, reduz ease factor, aumenta lapses
- `dificil`: aumenta pouco
- `bom`: multiplica por ease factor
- `facil`: multiplica mais e aumenta ease factor

Ordenação dos devidos:

1. mais atrasados primeiro
2. menor ease factor
3. mais antigos

## 7.8 Seleção de palavras para prática

Função base: `selectBuilderWords`

Prioridade:

1. palavras vindas do Reader da sessão atual;
2. banco local não dominado, priorizado por status e tempo sem prática;
3. itens seed NGSL para completar vagas.

Controles:

- `sessionWordLimit`
- `difficultWordsWeight`

## 7.9 Seed NGSL

Níveis disponíveis:

- A1
- A2
- B1
- B2
- C1

Cada nível contém 12 itens no arquivo atual `ngslSeed.js`.

O seed:

- evita duplicatas por normalização;
- marca itens como `isSeeded`;
- define `source: ngsl`;
- infere `entryType` como palavra ou collocation.

## 7.10 Persistência e backup

Backup/export:

- exporta stores locais em JSON

Import:

- grava JSON nas chaves de storage esperadas
- recarrega a página após importar

Reset parcial disponível:

- reset apenas da gamificação/progresso
- não apaga palavras nem flashcards

## 8. Tela por tela

## 8.1 Dashboard (`/`)

### Papel

É o centro operacional do dia. Decide o próximo passo, exibe progresso e concentra elementos gamificados.

### Entradas de dados

- `useConfig`
- `useWordStore`
- `useCardStore`
- `useProgressStore`
- helpers de `dashboardMetrics.js`
- geração de frase de prompt via `generateTranslationSentences`

### Estrutura real da tela

1. Header superior
- título `Dashboard`
- data formatada por dia da semana e mês
- busca visual
- pill de streak atual
- botão de notificações

2. Hero principal
- escolhe automaticamente o próximo passo via `resolveNextStudyStep`
- prioridades:
  - salvar streak
  - revisar cards urgentes
  - revisar cards normais
  - praticar palavras recentes
  - voltar ao Reader
- exibe CTA de navegação

3. Widget de nível
- rank atual (`config.userLevel`)
- nível de maestria lexical
- palavras ativas e dominadas
- XP do dia
- barra de Mastery XP dentro do nível atual
- 3 marcos/awards do nível CEFR atual
- XP acumulado na semana e no mês
- badge de bônus de streak do dia, se houver

4. Widget de Daily Prompt
- pode ficar em 3 estados:
  - sem alvos;
  - pronto;
  - concluído;
- quando há prompt pendente, gera 1 frase em português com IA e pede tradução para inglês;
- avalia localmente com `evaluateTranslation`;
- registra conclusão em `dailyPromptHistory`;
- se não houver IA ou a geração falhar, usa fallback local.

5. Gráfico de ritmo de aprendizado
- janela alternável de `7d`, `30d`, `90d`
- soma atividade diária:
  - Reader
  - Builder
  - Transform
  - Cloze
  - Flashcards
  - productionWrites

6. Capturas recentes
- mostra até 4 palavras capturadas hoje
- exibe status e frase original resumida

7. Próxima conquista
- usa `buildAchievementSpotlight`
- mostra título, descrição e progresso percentual para a próxima badge

8. Missões de hoje
- até 4 cards visíveis na grade
- progresso por missão
- XP da missão

9. KPIs finais
- meta diária
- revisões pendentes
- memória/retenção
- ofensiva/streak

### Regras importantes

- `syncWordStatusTotals` roda no `App.jsx` e abastece snapshots usados na tela;
- o prompt do widget da Dashboard não é o mesmo componente do prompt do Builder;
- a busca visual não executa pesquisa real;
- o CTA do hero pode apontar para Reader, Practice ou Flashcards.

### Estados especiais

- com zero atividade, vários blocos mostram empty states;
- com revisão urgente, hero muda para estado prioritário em laranja/vermelho;
- se há prompt pendente, o widget vira mini exercício.

## 8.2 Reader (`/reader`)

### Papel

É a porta de entrada do ciclo de estudo. Captura texto real, palavras clicáveis e explicações contextuais.

### Fase 1: entrada

A tela inicial possui duas áreas:

1. Importação via YouTube
- campo de URL;
- botão `Importar`;
- status visual de loading, sucesso ou erro;
- se der certo, a legenda preenche o textarea;
- idiomas tentados:
  - `en`
  - `en-US`
  - `en-GB`
  - `en asr`
  - `pt-BR`
  - `pt`
  - `pt-BR asr`
  - `pt asr`

2. Texto manual
- textarea grande para colar texto;
- contador visual de palavras;
- botão `Iniciar leitura`;
- aviso de fallback local quando não há IA configurada.

### Fase 2: workspace de leitura

Após iniciar:

- o texto é tokenizado por `parseText`;
- palavras ficam clicáveis;
- espaços e sinais permanecem no fluxo;
- o topo mostra:
  - número de palavras capturadas
  - tempo estimado de leitura
  - botão `Praticar Capturas`
  - botão de reset

### Clique em palavra

Ao clicar:

1. localiza frase de contexto via `getSentenceForToken`;
2. verifica se a palavra já existe no banco;
3. se não existir:
  - cria item com:
    - `tag: contexto`
    - `initialStatus: reconhecida`
    - frase original salva
4. se existir:
  - marca como vista no Reader
5. adiciona a palavra à sessão atual, sem duplicar;
6. registra métricas e XP;
7. abre tooltip;
8. busca explicação contextual via IA ou fallback local.

### Tooltip

Exibe:

- palavra original;
- badge `Já no banco` ou `Novo item`;
- badge `IA` ou `Contexto`;
- explicação contextual;
- frase original;
- botão de fechar;
- botão `Salvar palavra` apenas se o item ainda não existia.

Observação:

- na prática, clicar numa palavra nova já a adiciona ao banco, então o botão `Salvar palavra` é redundante para esse caso.

### Indicação visual dos tokens

- já no banco: fundo neutro;
- capturada na sessão atual: fundo violeta;
- item ativo: outline de destaque.

### Rodapé da sessão

Se houver capturas:

- lista em badges com as palavras capturadas.

Se não houver:

- empty state incentivando clique nas palavras.

### Ação primária global

Evento `reader-primary`:

- se ainda não iniciou leitura e existe texto: inicia leitura;
- se a leitura já começou e há capturas: chama `onPractice(sessionWords)`;
- se não há capturas: mostra toast orientando capturar palavras.

### Erros e restrições

- URL inválida de YouTube gera erro;
- legenda indisponível gera erro;
- texto vazio não inicia leitura;
- IA ausente usa fallback de dicionário estático.

## 8.3 Vocabulary (`/vocabulary`)

### Papel

É o banco lexical central do app.

### Blocos da tela

1. KPIs no topo
- itens no banco
- seed NGSL
- collocations
- palavras ativas

2. Entrada manual
- campo para palavra ou expressão;
- seletor `word` / `collocation`;
- botão adicionar.

3. Upload em lote
- textarea para itens separados por vírgula ou quebra de linha;
- botão `Importar`;
- botão `Limpar`;
- feedback de quantos foram adicionados ou ignorados.

4. Painel de seed NGSL
- importar apenas o nível atual;
- importar até o nível atual;
- limpar seed sem progresso.

5. Painel de exploração
- busca textual simples;
- filtro por status;
- listagem de itens.

### Card de item lexical

Cada item exibe:

- termo principal;
- badge de tipo (`Word` ou `Collocation`);
- badge de status;
- badge CEFR, se existir;
- frase de contexto truncada;
- origem e indicador seeded;
- contadores de acertos e erros;
- ação de remover.

### Regras importantes

- busca usa `includes` simples no texto já normalizado;
- filtro por status usa igualdade exata;
- duplicatas são evitadas por normalização;
- `removeUnstudiedSeedWords` só remove itens seed sem progresso significativo.

### Estados especiais

- se nenhum item passar pelos filtros, mostra empty state.

## 8.4 Builder / Practice (`/practice`)

### Papel

É o ambiente principal de prática guiada e produção.

### Modos de alto nível

Tabs superiores:

- `Praticar`
- `Prompt`

Observação:

- o estado inicial vindo da rota pode ser `prompt`;
- qualquer outro valor cai em `practice`.

### Preparação da sessão

Na abertura:

1. seleciona palavras com `selectBuilderWords`;
2. busca sentenças recentes por palavra;
3. monta exercícios mistos com `buildMixedExercises`;
4. monta alvos do prompt com `selectDailyPromptTargets`;
5. reseta estatísticas da sessão.

Se há IA configurada:

- o Builder faz warmup silencioso gerando frases para palavras sem frases suficientes;
- cada warmup tem timeout de 5 segundos;
- falhas são ignoradas sem quebrar a sessão.

### Critérios de seleção de palavras

Ordem real:

1. palavras iniciais vindas do Reader;
2. banco local não dominado;
3. seed NGSL para completar vagas.

O banco local é ordenado por:

- status
- tempo desde última prática

### Modos de exercício internos

`preferredMode` pode ser:

- `mixed`
- `assembly`
- `transform`
- `cloze`

No modo misto:

- tenta aproximadamente:
  - 40% assembly
  - 40% transform
  - 20% cloze
- mas depende da disponibilidade de exercícios por palavra.

### Header da sessão

Mostra:

- tipo da sessão atual;
- contexto do exercício atual;
- concluídos;
- restantes;
- quantidade de cards salvos;
- foco atual;
- itens na sessão;
- modo ativo.

### Barra de progresso

Só aparece no modo `practice`.

### Estado vazio

Se não houver exercícios nem alvos de prompt:

- mostra empty state;
- permite atualizar sessão;
- opcionalmente permite ir para flashcards.

### Resumo final

Quando os exercícios terminam:

- total de exercícios;
- acertos;
- erros;
- XP ganho na sessão;
- palavra com maior dificuldade;
- lista de frases salvas no flashcard;
- ação para refazer prática.

### 8.4.1 Assembly

Objetivo:

- montar a frase correta em inglês a partir da frase em português.

Interação:

- drag and drop com `@dnd-kit`;
- clique em chip também move entre banco e resposta;
- o usuário monta a resposta no lane superior.

Regras:

- até 3 tentativas;
- `Verificar` compara resposta normalizada;
- `Limpar` reinicia tokens;
- `Revelar resposta` só aparece após pelo menos 1 tentativa.

Feedback:

- `correct`
- `try_again`
- `incorrect`

Após acerto ou encerramento:

- abre textarea opcional para frase própria do usuário;
- botão `Salvar no Flashcard`;
- botão `Próxima`.

Se falhar nas 3 tentativas e houver IA:

- busca explicação de erro gramatical.

Ao salvar card:

- cria flashcard se ainda não existir para aquela sentença;
- registra `recordCardSaved`;
- publica milestone;
- se o usuário escreveu produção própria, registra `recordProductionWrite`.

### 8.4.2 Transform

Objetivo:

- transformar uma frase base em outra estrutura.

Pares reais gerados:

- positive → negative
- positive → past
- negative → positive

Interface:

- mostra instrução;
- frase-base em inglês;
- tradução-base em português;
- textarea para resposta.

Regras:

- até 3 tentativas;
- verificação por normalização textual;
- em falha final, pode pedir explicação de IA.

### 8.4.3 Cloze

Objetivo:

- preencher a lacuna com a palavra ou expressão correta.

Interface:

- frase em português;
- frase em inglês mascarada com `_____`;
- input centralizado para resposta.

Regras:

- compara `normalizeLexiconText(answer)` com `expectedText`;
- até 3 tentativas;
- pode pedir explicação de IA ao encerrar por erro.

### 8.4.4 Prompt diário do Builder

Objetivo:

- escrever 3 frases usando os termos do dia.

Seleção de alvos:

1. palavras `ativa`
2. `reconhecida` e `em_treino` não-seed
3. seeds até o nível do usuário
4. fallback para palavras desconhecidas não-seed

Regras:

- precisa preencher as 3 frases;
- cada frase precisa conter o termo-alvo correspondente;
- só pode ser concluído uma vez por dia;
- grava em `dailyPromptHistory`;
- concede XP e progresso.

Estados:

- sem termos disponíveis;
- formulário ativo;
- prompt já concluído;
- warnings de validação.

### Ação primária global

Evento `practice-primary`:

- apenas faz scroll suave para o workspace da sessão.

### Regras de progresso do Builder

Cada exercício:

- chama `markBuilderResult`;
- chama `recordBuilderExercise`;
- pode disparar auto-ajuste;
- incrementa `sessionStats`.

### Navegação de entrada

O Reader navega para `/practice` com `state.words`.

A Dashboard pode navegar com `state.mode = 'prompt'`.

## 8.5 Flashcards (`/flashcards`)

### Papel

Central de revisão espaçada.

### Estado inicial

Antes da sessão, exibe:

- pendentes hoje;
- total de cards;
- retenção 7d.

Subestados:

1. nenhum flashcard no banco
- CTA para prática
- CTA para Reader

2. existem flashcards, mas nenhum devido
- CTA para Reader
- CTA para prática

3. existem devidos
- card hero com total de cards e tempo estimado;
- botão `Iniciar revisão`;
- preview dos próximos 5 cards.

### Sessão de revisão

Para cada card:

- frente em português;
- verso em inglês após flip;
- botão/ação para revelar;
- 4 ratings:
  - Não lembro
  - Difícil
  - Bom
  - Fácil

Cada botão mostra preview do próximo intervalo.

Metadados visíveis:

- intervalo atual
- ease factor
- número de revisões

### Efeitos da revisão

Ao avaliar:

- recalcula SRS;
- atualiza card;
- promove/rebaixa palavra ligada;
- registra progresso e retenção.

### Encerrar cedo

Existe botão `Encerrar sessão antecipadamente`.

Ele força a tela final com os resultados acumulados até aquele momento.

### Tela final da sessão

Mostra:

- quantidade revisada;
- contagem por rating;
- CTAs para:
  - voltar ao painel da revisão
  - ir para Reader
  - ir para Practice

### Ação primária global

Evento `flashcards-primary`:

- se a sessão ainda não começou, chama `startSession()`.

## 8.6 Evolution (`/evolution`)

### Papel

Tela analítica do crescimento do usuário.

### Estrutura real

1. KPIs no topo
- Palavras
- Experiência
- Retenção
- Nível CEFR

2. Histórico de engajamento
- gráfico de 30 dias;
- soma Reader, Builder, Flashcards e Escrita.

3. Equilíbrio de habilidades
- radar com:
  - Vocabulário
  - Retenção
  - Precisão
  - Escrita
  - Consistência

4. Funil de vocabulário
- Aprendido
- Construção
- Revisão
- Dominadas

5. Marcos históricos
- Primeiras palavras
- Ofensiva iniciada
- Conquista liberada

6. Insights rápidos
- vocabulário ativo;
- dominadas;
- retenção semanal;
- dominadas em 14 dias.

### Regras de cálculo

Alguns blocos usam:

- `calculateRetentionRate`
- `calculateStreakStats`
- snapshots de `dailyStats`
- somatórios de `totals`

## 8.7 Escrever (`/escrever`)

### Papel

Sessão de tradução PT → EN baseada em palavras difíceis ou seed do nível.

### Pré-requisito

- exige IA configurada para gerar sessão;
- sem IA, mostra erro e link para Settings.

### Seleção de palavras

Função `selectTranslationWords`:

1. prioriza palavras fracas não-seed com status:
  - `em_treino`
  - `reconhecida`
2. ordena por fraqueza:
  - diferença entre erros e acertos
  - streak de erro do Builder
3. completa com seed do nível do usuário

Quantidade por sessão:

- 5 palavras

### Fluxo

1. usuário clica `Gerar sessão`;
2. IA gera frases do cotidiano em português com tradução esperada;
3. usuário responde uma por vez;
4. sistema verifica;
5. mostra feedback;
6. avança para a próxima;
7. exibe resumo final.

### Interface

Estados:

- `idle`
- `loading`
- `session`
- `verifying`
- `done`

Cada exercício mostra:

- índice da frase;
- barra de progresso;
- frase em português;
- palavra-alvo;
- textarea de resposta;
- feedback com esperado e alternativas aceitas.

### Regras de avaliação

Avaliação base:

- `evaluateTranslation` compara string normalizada contra esperado + alternativas.

Fluxo pretendido:

- se não for match exato e houver IA, tenta avaliação semântica com `evaluateSemanticTranslation`.

### Observação crítica de implementação

No estado atual do código:

- `evaluateSemanticTranslation` é usado em `Escrever.jsx`, mas não está importado no arquivo;
- isso tende a quebrar o fluxo quando a resposta não bate exatamente e a IA está configurada.

### Recompensa

- correta: `+12 XP`
- tentativa incorreta: `+4 XP`

### Tela final

Mostra:

- total de acertos;
- XP ganho;
- bolinhas de acerto/erro;
- CTA para nova sessão;
- CTA para vocabulário.

## 8.8 Settings (`/settings`)

### Papel

Central de configuração do motor do produto e dos dados locais.

### Tabs reais

- `Essencial`
- `IA`
- `Estudo & SRS`
- `Dados & progresso`

### Tab Essencial

Blocos:

1. Nível atual
- pills de `A1` a `C1`
- mostra sessão mínima e cards por dia

2. Controles frequentes
- cards por dia
- palavras por sessão

### Tab IA

Blocos:

1. Provedor
- OpenAI
- Gemini
- Sem IA

2. Campos condicionais
- key
- modelo

3. Ações
- salvar
- testar conexão

4. Feedback
- status `testing`, `ok` ou `error`

Modelos expostos:

- OpenAI:
  - `gpt-5-mini`
  - `gpt-5-nano`
  - `gpt-5.2`
  - `gpt-4.1`
  - `gpt-4.1-mini`
  - `gpt-4.1-nano`
  - `gpt-4o-mini`
  - `gpt-4o`
- Gemini:
  - `gemini-2.0-flash`
  - `gemini-1.5-flash`
  - `gemini-1.5-pro`

### Tab Estudo & SRS

Blocos:

1. Prática e SRS
- variações por palavra;
- peso de palavras difíceis;
- modo preferido do Builder:
  - misto
  - montagem
  - transformação
  - lacunas

2. Missões e ritmo
- sliders por missão;
- mostra progresso do dia.

3. Streak e auto-ajuste
- sessão mínima para contar streak;
- toggle do auto-ajuste;
- resumo do último ajuste.

### Tab Dados & progresso

Blocos:

1. Uso local
- uso em KB;
- barra de ocupação aproximada sobre 5 MB.

2. KPIs
- nível
- XP
- streak
- cards
- conquistas

3. Coleções
- palavras lidas
- exercícios builder
- cards salvos
- revisões

4. Backup e reset
- exportar backup
- importar backup
- resetar gamificação

### Ação primária global

Evento `settings-primary`:

- chama `save()`.

## 9. Serviços e integrações

## 9.1 OpenAI

Arquivo: `src/services/openai.js`

Uso:

- explicação contextual;
- geração de frases do Builder;
- geração de frases do Escrever;
- avaliação estruturada;
- teste de conexão.

Características:

- usa `chat/completions`;
- usa `response_format: json_schema` quando precisa payload estruturado;
- adapta `max_tokens` / `max_completion_tokens` conforme modelo.

## 9.2 Gemini

Arquivo: `src/services/gemini.js`

Uso:

- mesmos cenários gerais da OpenAI, sem structured output nativo no código;
- parse de JSON é feito manualmente quando necessário.

## 9.3 Serviço unificado de IA

Arquivo: `src/services/ai.js`

Expõe:

- `explainWord`
- `generateSentences`
- `explainGrammarError`
- `generateTranslationSentences`
- `evaluateTranslation`
- `evaluateSemanticTranslation`
- `buildLocalSentenceSet`

Fallbacks locais reais:

- mini dicionário estático para explicação de palavras;
- 3 frases locais por palavra para o Builder.

## 9.4 YouTube

Arquivo: `src/services/youtube.js`

Suporta:

- `youtube.com/watch`
- `youtu.be`
- `youtube.com/shorts`
- `youtube.com/embed`
- `youtube.com/live`
- input direto de video id

Converte payload `json3` em texto contínuo normalizado.

## 10. Migrações e compatibilidade

O projeto já possui migrações de persistência:

- config antiga com `wordBankWeight` é movida para `builder.difficultWordsWeight`;
- progresso legado ganha campos de streak/estudo;
- contadores antigos de palavras são normalizados;
- `masteryXp` pode ser reconstruído a partir do estado salvo.

Isso é importante para uma recriação fiel se houver import de backups antigos.

## 11. Lista de comportamentos globais obrigatórios para recriação

- estado salvo localmente e persistido entre reloads;
- app totalmente funcional sem backend próprio;
- IA opcional com fallback local;
- Reader com texto clicável e tooltip contextual;
- Builder com assembly, transform, cloze e prompt;
- flashcards com SRS e promoção/rebaixamento lexical;
- dashboard com hero adaptativo e gamificação;
- evolução com gráficos e radar;
- settings com backup/import;
- notificações persistidas e toasts temporários;
- seed NGSL por nível;
- gamificação com XP, streak, missions e achievements;
- auto-ajuste de nível por desempenho no Builder.

## 12. Inconsistências e observações do estado atual

Estas observações são úteis para recriar o projeto "como está", inclusive com suas lacunas reais:

1. Há divergência entre docs antigos e implementação atual.
- Exemplo: o prompt da Dashboard é um mini exercício de tradução de 1 frase, enquanto o prompt do Builder é um desafio de 3 frases.

2. Os campos de busca visuais não possuem lógica conectada.
- Isso vale para a busca do shell e da Dashboard.

3. O botão `Salvar palavra` do tooltip do Reader é redundante para palavra nova.
- O clique na palavra já adiciona o item ao banco.

4. A tela `Escrever` tem uma falha de implementação.
- `evaluateSemanticTranslation` é usado sem import explícito em `Escrever.jsx`.

5. O modo inicial vindo da rota `/practice` não seleciona diretamente `assembly`, `transform` ou `cloze`.
- A rota só alterna entre `practice` e `prompt`;
- o modo interno dos exercícios depende de `config.builder.preferredMode`.

6. O backup/export trabalha sobre chaves persistidas específicas do Zustand.
- Uma recriação fiel deve manter esse formato ou mapear corretamente.

## 13. Conclusão

O produto atual não é apenas um app de vocabulário. Ele é um sistema local-first com 8 módulos visíveis:

- dashboard operacional;
- reader;
- vocabulary;
- builder/practice;
- flashcards;
- evolution;
- settings;
- além do módulo extra de escrita/tradução.

Sua recriação fiel precisa preservar três pilares:

- ciclo pedagógico: captura → prática → revisão → progresso;
- persistência local e autonomia sem backend;
- camada forte de gamificação e visual premium clara.
