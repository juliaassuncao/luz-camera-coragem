# Resultados — Tarefa 14

## Ajustes realizados

- Cena 04: integração de `snoopy-premiere-confident-seated.webp` e progressão visual confundido → convicto → ideia.
- Cena 04: a fala “Acho que ainda falta uma cena.” entra junto da pose de ideia e permanece durante o desaparecimento da lâmpada e a exibição do botão.
- Cena 03: no caminho Drama de Oscar, Woodstock foi reposicionado à esquerda do Snoopy, dentro da área de chuva e sem sobreposição; o caminho Filme de Ação foi preservado.
- Cenas 01 a 05: dimensões e espaçamentos do quadro principal foram centralizados em um mixin responsivo compartilhado. A Cena 06 mantém o enquadramento próprio da cartinha.
- Validação automatizada ampliada para conferir a sequência de poses, a persistência da fala, o posicionamento de Woodstock e a igualdade dos quadros entre as cinco primeiras cenas.

## Validação

- Desktop 1440 × 900: aprovado.
- Desktop 1280 × 720: aprovado.
- Tablet 768 × 1024: aprovado.
- Mobile 430 × 932, 390 × 844 e 320 × 740: aprovado. A faixa intermediária 412 × 915 também foi conferida.
- Caminho Drama de Oscar: aprovado, incluindo chuva, guarda-chuva e posição de Woodstock.
- Caminho Filme de Ação: aprovado, sem alteração de comportamento.
- Cena 04: poses confundido, convicto e ideia, fala persistente e CTA aprovados.
- Adiantamento de falas, repetição das cenas e navegação: aprovados.
- `prefers-reduced-motion`: aprovado, sem erros de execução.
- Rolagem horizontal: não detectada nas resoluções testadas.
- `npm run build`: aprovado. O Vite mantém o aviso preexistente de chave `dev` duplicada em `package.json`.

## Arquivos envolvidos

- `public/assets/characters/snoopy/snoopy-premiere-confident-seated.webp`
- `src/config/assets.ts`
- `src/content/script.ts`
- `src/styles/_scene-layout.scss`
- `src/scenes/opening/OpeningScene.scss`
- `src/scenes/backstage/BackstageScene.scss`
- `src/scenes/filming/FilmingScene.tsx`
- `src/scenes/filming/FilmingScene.scss`
- `src/scenes/screening/ScreeningScene.tsx`
- `src/scenes/screening/ScreeningScene.scss`
- `src/scenes/finale/FinaleScene.scss`
- `_local/check-refinement.mjs`
- `docs/AJUSTES-CENAS-03-04.md`
