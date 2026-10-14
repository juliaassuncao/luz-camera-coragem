# Inventário de assets — Tela 01 (convite)

A abertura utiliza exclusivamente os WebP fornecidos no pacote `luz-camera-coragem-assets-cena-01.zip`. Os caminhos estão centralizados em `src/config/assets.ts`.

| Arquivo em `public/assets/` | Uso na abertura |
|---|---|
| `backgrounds/backyard-film-set.webp` | Cenário principal, incluindo casinha, câmera, cadeira vazia e equipamentos |
| `characters/snoopy/snoopy-director-standing.webp` | Entrada lateral, com boina vermelha |
| `characters/snoopy/snoopy-director-seated.webp` | Pose final sentada; a própria imagem inclui a cadeira azul |
| `characters/woodstock/woodstock-assistant-clapper.webp` | Assistente menor, carregando claquete |
| `characters/snoopy/snoopy-director-sunglasses.webp` | Disponível, sem renderização; figurino diferente das duas poses de boina |
| `props/doghouse.webp` | Disponível, sem renderização |
| `props/director-chair.webp` | Disponível, sem renderização |
| `props/film-camera.webp` | Disponível, sem renderização |
| `props/studio-spotlight.webp` | Disponível, sem renderização |

Os SVGs antigos permanecem arquivados, sem referências na abertura. Não são usados como fallback. Não foram criadas novas imagens nem desenhos de personagens ou objetos por código.

## Sequência e acessibilidade

- GSAP com `useGSAP`, escopo local e limpeza por `matchMedia`.
- Aproximadamente 5,05 segundos: título, entrada curta em pé com revelação antecipada, pausa confiante de meio segundo, transição para a pose sentada, assistente, pequena pose orgulhosa, pensamento e convite. As duas poses não ficam visíveis simultaneamente durante a troca.
- Duas imagens completas de Snoopy, alinhadas pela base e dimensionadas para manter o tamanho da cabeça próximo na troca. Não há ciclo de caminhada nem reconstrução de partes do corpo.
- **Adiantar abertura** conclui a sequência e deixa apenas a pose sentada visível. O foco por teclado passa para **Aceitar o convite**.
- Movimento reduzido mostra diretamente o quadro final, com convite disponível. Alterações dessa preferência são respeitadas durante a introdução.
- Falas, título e botões permanecem em HTML; o balão de pensamento usa `ComicBubble` e SCSS.

## Composição

No desktop, o cenário ocupa um quadro horizontal. No mobile, o mesmo WebP ganha um recorte vertical pela direita, preservando a casinha e a árvore sem esticar a ilustração. Os equipamentos à esquerda ficam fora desse enquadramento; personagens ganham proporções próprias e o pensamento ocupa a área superior.

A largura do quadro no desktop considera também a altura disponível para manter o convite visível em 1242 × 686. A abertura se centraliza verticalmente quando há espaço, inclusive em tablets altos. Nos celulares de 320–430 px, o pensamento usa largura maior, padding menor e fonte de pelo menos 16 px; as bolinhas terminam próximas à direção da cabeça de Snoopy, sem cobrir o rosto.

Não são sobrepostos os arquivos avulsos de objetos: a cadeira na pose sentada faz parte do asset do personagem, e a cadeira vazia à esquerda faz parte do cenário fornecido. A cadeira embutida no cenário não pode ser removida como uma camada independente. Confira essa composição na revisão visual.

## Origem e revisão

As artes fornecidas são ilustrações geradas para o protótipo, não assets oficiais dos Peanuts. O registro original do pacote está em `docs/ASSETS-CENA-01-GERADOS.md`; o controle de fontes e autorização continua em `docs/REFERENCIAS-E-DIREITOS.md`.

As telas 02–06 e seus textos não foram alterados.

## Validação local

`npm run build` aprovado. Verificação em Chrome em 1280 × 960, 1242 × 686, 820 × 1180, 320 × 740, 390 × 844 e 430 × 932: apenas quatro imagens WebP na cena, poses completas, sem rolagem horizontal, entrada visível e pausa, ausência de silhuetas simultâneas durante a troca, balão e convite dentro da viewport, adiantamento com foco por teclado, `onAccept`, retorno à abertura e mudança de movimento reduzido durante a sequência. Nenhum erro de execução registrado. Capturas e script de verificação ficam em `_local/`, fora da build.
