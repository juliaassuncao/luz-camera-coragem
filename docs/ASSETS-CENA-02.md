# Assets — Cena 02 (Bastidores)

## Novos arquivos

### Snoopy
- `public/assets/characters/snoopy/snoopy-director-seated-attentive.webp`
  - Snoopy sentado na cadeira, olhando para cima com expressão atenta.
  - Uso sugerido: começo da cena, ouvindo a proposta / aguardando a decisão.

- `public/assets/characters/snoopy/snoopy-director-idea.webp`
  - Snoopy em pé, sorrindo e apontando para cima, em pose de “tive uma ideia”.
  - Uso sugerido: momento em que apresenta a situação dos bastidores e pede ajuda.

- `public/assets/characters/snoopy/snoopy-director-serious-sunglasses.webp`
  - Snoopy em pé, de boina e óculos escuros, em pose dramática e séria.
  - Uso sugerido: reação exagerada / modo “diretor importante”.

### Woodstock
- `public/assets/characters/woodstock/woodstock-assistant-clapper-surprised.webp`
  - Woodstock segurando a claquete com expressão surpresa.
  - Uso sugerido: reação cômica durante a tomada / confirmação da escolha.

## Assets já existentes que podem ser reaproveitados

### Cenário
- `public/assets/backgrounds/backyard-film-set.webp`
  - Reaproveitar como cenário principal da cena 02.

### Snoopy
- `public/assets/characters/snoopy/snoopy-director-standing.webp`
- `public/assets/characters/snoopy/snoopy-director-seated.webp`
- `public/assets/characters/snoopy/snoopy-director-sunglasses.webp`

### Woodstock
- `public/assets/characters/woodstock/woodstock-assistant-clapper.webp`

## Observações
- Os novos arquivos foram pensados para complementar a cena 02; não é obrigatório usar todos simultaneamente.
- A cena deve reaproveitar ao máximo o cenário e os personagens já integrados com sucesso na cena 01.
- Os balões, botões e textos continuam em HTML/SCSS, não nas imagens.

## Implementação da Tela 02 — O grande problema

- `BackstageScene` continua no fluxo `OpeningScene → BackstageScene → placeholder da Tela 03`. Nenhuma implementação da filmagem foi adicionada.
- Roteiro em cinco momentos: confissão da voz dos bastidores; **Entendi. Precisamos de um filme.**; incredulidade; **UM GRANDE FILME.**; convite à diretora.
- Apenas uma fala aparece por vez. A voz da criadora usa uma legenda creme de quadrinhos, identificada por **VOZ DOS BASTIDORES**, sem personagem humano. Snoopy usa `ComicBubble` de pensamento, com as bolinhas apontando para ele.
- Snoopy usa a pose atenta na confissão, a pose de ideia na solução/incredulidade e a pose séria de óculos no anúncio/convite. A pose atenta é espelhada por CSS como antes. Woodstock se assusta no anúncio e volta à claquete pronta para o convite.
- No anúncio, dois focos de luz suaves usam gradientes CSS sobre o próprio cenário; nenhum equipamento ou personagem foi redesenhado. O pensamento ganha peso e tamanho. Nenhuma imagem foi criada ou alterada.
- A sequência GSAP tem pausas de aproximadamente 7,5 / 3,2 / 2 / 2,8 segundos. Aos 15,5 segundos chega ao convite, que permanece até a claquete. **Adiantar fala** passa apenas ao próximo momento, sem saltar falas intermediárias. A leitura pausa quando a aba fica oculta.
- O relógio narrativo é independente de `matchMedia`: movimento reduzido remove os deslocamentos e fades, mantendo o mesmo roteiro e controle de avanço. Animações e callbacks usam `useGSAP` com escopo e limpeza ao desmontar.
- Somente a claquete é obrigatória. Clique no Woodstock ou em **Bater a claquete** confirma a tomada, mostra **CLAC!** e avança automaticamente após 0,85 segundo. Um bloqueio síncrono impede acionamentos repetidos, e uma segunda proteção garante apenas uma chamada de navegação. Trocar a preferência de movimento durante o CLAC não reinicia esse relógio.
- As antigas escolhas de três tons, seus textos, reações e estados foram removidos. O gênero ficará exclusivamente para a futura Tela 03.
- Os diálogos são anunciados com `aria-live`. Ao adiantar a última fala pelo teclado, o foco passa ao botão da claquete. Antes do convite, a claquete fica desabilitada.
- No mobile, legenda e pensamento ocupam a área superior, com fonte de pelo menos 16 px, preservando rostos e claquete. O cenário mantém suas dimensões entre falas. Em tablets altos, o espaçamento superior passa a considerar a altura da viewport, sem uma margem fixa exagerada.

## Validação local

O script `_local/check-backstage.mjs` verifica o roteiro automático e o avanço manual de cada fala, as duas formas de diálogo, poses, anúncio e iluminação, ausência das escolhas antigas, claquete por mouse/teclado/toque, navegação automática, cliques repetidos, movimento reduzido e reinício da narrativa. As capturas ficam em `_local/`, fora da build.

Build aprovado. Chrome em 1280 × 960, 1242 × 686, 820 × 1180, 320 × 740, 390 × 844 e 430 × 932: cinco falas exatas, uma por vez, poses e iluminação, cenário estável, personagens inteiros, sem sobreposição aos rostos ou rolagem horizontal, botão final dentro da viewport e navegação para o placeholder da Tela 03 aprovados. Verificados avanço automático, Enter para adiantar, Espaço para a claquete, toque, repetição de cliques, troca de movimento reduzido durante a narrativa e durante o CLAC, e reinício. Nenhum erro de execução registrado.

Permanece o aviso de chave `dev` duplicada no `package.json`, que não foi alterado nesta revisão.
