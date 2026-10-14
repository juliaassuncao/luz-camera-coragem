# Tela 06 — A cartinha

Implementada para revisão visual local em 14/10/2026. Não houve commit nem publicação. A aprovação estética do encerramento continua com a usuária.

## Comportamento

O botão existente **Abrir bilhetinho** da Tela 05 continua responsável pela navegação. A Tela 06 abre automaticamente, sem pedir outro clique.

A sequência GSAP dura **2,14 segundos**: envelope fechado → aberto vazio → aberto com carta → uma folha deslizando sobre o envelope vazio → carta HTML. Fades sequenciais evitam duas silhuetas de envelope ou duas folhas visíveis simultaneamente. Durante a extração, uma máscara revela a folha acima da boca do envelope. Os tamanhos e a base das imagens compensam as margens transparentes dos arquivos.

A carta final utiliza HTML/SCSS, largura máxima de 600 px, papel creme, borda e sombra discretas. Os parágrafos ficam disponíveis juntos, sem digitação ou animação individual. A folha ilustrada aparece apenas na abertura. O quintal original permanece como fundo desfocado ao entardecer; personagens pequenos acompanham a assinatura. O coração avulso foi registrado, mas não acrescentado à composição.

Com movimento reduzido, a carta aparece diretamente. Ativar essa preferência durante a abertura ou ocultar a aba também revela a mensagem imediatamente. A animação não bloqueia a rolagem. A região de leitura fica fora da árvore de acessibilidade apenas durante a breve introdução; ao terminar, há uma única cópia semântica dos textos e um único botão de replay. O foco no cumprimento usa `preventScroll`, sem prender a navegação.

**Assistir novamente** chama o `restart` já existente em `App`: limpa o gênero e volta à abertura sem recarregar a página. A desmontagem do componente reverte o contexto GSAP, removendo animações e listeners. Uma nova sessão permite outra escolha e outra abertura da carta.

## Arquivos

Criados:

- `src/scenes/letter/LetterScene.tsx`
- `src/scenes/letter/LetterScene.scss`
- `docs/IMPLEMENTACAO-CENA-06.md`
- `_local/check-letter.mjs`
- `_local/letter-regression-before.json` e capturas `_local/letter-*.png` para validação local.

Modificados:

- `src/app/App.tsx`: renderiza a cartinha em lugar do placeholder e conecta o replay ao reinício existente.
- `src/config/assets.ts`: registra os cinco WebP fornecidos.
- `src/content/script.ts`: somente o bloco da carta; separa cumprimento, parágrafos, assinatura, créditos e replay conforme a Tarefa 10.
- `_local/check-finale.mjs` e `_local/check-screening.mjs`: atualiza a expectativa de destino para a carta real, em lugar do placeholder.

Importados do pacote fornecido:

- `docs/ASSETS-CENA-06.md`
- `docs/MANIFEST-CENA-06.csv`
- `docs/PREVIA-CENA-06.jpg`
- Cinco WebP listados abaixo.

O manifesto da Tela 06 foi nomeado separadamente para preservar `docs/MANIFEST.csv`, que já descrevia os assets da Tela 05. As orientações do pacote serviram como referência; os requisitos explícitos da Tarefa 10 determinaram o texto e a abertura automática.

## Assets

| Caminho sob `public/assets/` | Uso |
| --- | --- |
| `props/envelope-closed-heart.webp` | Reutilizado da Tela 05; início da abertura |
| `props/envelope-open-empty.webp` | Abertura e envelope durante a extração |
| `props/envelope-open-with-letter.webp` | Carta aparecendo antes da extração |
| `props/letter-paper-illustration.webp` | Uma única folha durante a transição |
| `characters/snoopy/snoopy-woodstock-letter-cameo.webp` | Vinheta pequena junto à assinatura |
| `effects/heart-doodle.webp` | Importado e registrado, uso opcional omitido |
| `backgrounds/backyard-film-set.webp` | Quintal original com tratamento discreto de entardecer |

Os cinco WebP novos correspondem aos arquivos do ZIP, verificados por SHA-256. Nenhuma imagem foi criada, editada ou baixada.

## Validação

Chrome headless local em Windows, via CDP. Os testes de acessibilidade verificam a árvore do navegador e o HTML; não representam uma sessão manual com NVDA ou VoiceOver.

| Viewport | Resultado |
| --- | --- |
| Desktop 1280 × 960 | Carta de 600 px, texto de 17 px, abertura e replay aprovados nos testes |
| Desktop 1242 × 686 | Carta de 600 px, leitura e botão alcançáveis por rolagem natural |
| Tablet 820 × 1180 | Carta de 600 px, margem e vinheta preservadas |
| Mobile 320 × 740 | Carta de 288 px, texto de 16 px; abertura normal e movimento reduzido verificados |
| Mobile 390 × 844 | Texto de 16 px, teclado e foco visível no replay |
| Mobile 430 × 932 | Texto de 16 px, replay por toque |

Verificações concluídas:

- Todos os estados do envelope presentes, sem imagens duplicadas e sem cortes pela viewport durante a abertura.
- Mensagem, pontuação, assinatura e créditos exatamente iguais aos solicitados.
- Sem rolagem horizontal, texto fora da folha ou ilustrações sobre os parágrafos.
- Carta sem altura fixa; assinatura legível e botão com altura mínima de 52 px.
- Rolagem livre durante a animação e acesso ao rodapé depois da leitura.
- Ordem semântica de leitura, parágrafos acessíveis uma única vez e replay com nome correto.
- Dois percursos completos das seis telas: Drama de Oscar → replay → Filme de Ação, com nova abertura ao final da segunda sessão.
- Gênero preservado até a carta e limpo ao reiniciar; página permanece carregada.
- Mudança de movimento reduzido durante a abertura, interrupção por visibilidade, limpeza ao desmontar e reentrada sem callbacks antigos.
- Controles de imagem, botão, teclado e toque da Tela 05 continuam levando à carta.
- Nenhuma exceção de execução nos testes do navegador.
- SHA-256 inalterado para os dez arquivos das Telas 01–05, estilos globais, ComicBubble e `package.json` (14 arquivos).
- `npm run build`: passou com TypeScript e Vite. Permanece o aviso preexistente de chave `dev` duplicada em `package.json`.

Roteiros locais: `node _local/check-letter.mjs`, `node _local/check-letter.mjs review` e `node _local/check-finale.mjs layout`. Usam os servidores locais de produção (5174), desenvolvimento (5175) e Chrome com CDP na porta 9223; não acrescentam dependências ao projeto.

## Prévias para revisão

As capturas de viewport mostram o fundo fixo durante a leitura real. As capturas de página inteira também registram o conteúdo completo, mas podem mostrar uma faixa de fundo creme além da viewport por causa do mecanismo de captura do Chrome.

| Viewport | Início | Rodapé |
| --- | --- | --- |
| Desktop alto | [Prévia](../_local/letter-desktop-viewport.png) | [Rodapé](../_local/letter-desktop-footer-viewport.png) |
| Desktop baixo | [Prévia](../_local/letter-desktop-low-viewport.png) | [Rodapé](../_local/letter-desktop-low-footer-viewport.png) |
| Tablet | [Prévia](../_local/letter-tablet-viewport.png) | [Rodapé](../_local/letter-tablet-footer-viewport.png) |
| Mobile 320 px | [Prévia](../_local/letter-small-mobile-viewport.png) | [Rodapé](../_local/letter-small-mobile-footer-viewport.png) |
| Mobile 390 px | [Prévia](../_local/letter-mobile-viewport.png) | [Rodapé](../_local/letter-mobile-footer-viewport.png) |
| Mobile 430 px | [Prévia](../_local/letter-mobile-430-viewport.png) | [Rodapé](../_local/letter-mobile-430-footer-viewport.png) |

Não foram encontrados problemas de corte de layout ou legibilidade nas viewports verificadas. Um detalhe para a revisão artística: a ponta da aba em `envelope-open-empty.webp` já é levemente achatada na imagem original; a implementação conserva esse contorno. A carta longa exige rolagem em mobile e desktop baixo, conforme previsto na tarefa.
