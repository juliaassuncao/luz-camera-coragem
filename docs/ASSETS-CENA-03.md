# Assets — Tela 03: A filmagem

Pacote de **6 novos assets WebP**, com transparência preservada, para o MVP de *Luz, câmera... coragem!*.

## Arquivos incluídos

| Gênero | Arquivo | Finalidade |
|---|---|---|
| Drama de Oscar | `public/assets/characters/snoopy/snoopy-drama-rain.webp` | Snoopy em pose teatral, com gotas de chuva |
| Drama de Oscar | `public/assets/characters/woodstock/woodstock-drama-umbrella.webp` | Woodstock preocupado e segurando guarda-chuva preto |
| Drama de Oscar | `public/assets/effects/drama-storm-rain.webp` | Nuvens escuras e chuva para sobrepor ao cenário |
| Filme de Ação | `public/assets/characters/snoopy/snoopy-action-hero.webp` | Snoopy apontando em pose heroica |
| Filme de Ação | `public/assets/characters/woodstock/woodstock-action-ruffled.webp` | Woodstock assustado, com penas arrepiadas |
| Filme de Ação | `public/assets/effects/action-explosion.webp` | Explosão cartunesca em nuvem de fumaça |

## Arquivos a reutilizar (NÃO incluídos)

- `public/assets/backgrounds/backyard-film-set.webp` — quintal já aprovado.
- Snoopy com boina e óculos da Tela 02, caso seja útil na transição.
- Woodstock com claquete e pose inicial das cenas anteriores.

## Diretrizes de uso

1. Importe este pacote na **raiz do projeto**: mescle `public/` e `docs/` sem apagar arquivos existentes.
2. Adicione os caminhos novos a `src/config/assets.ts`, preservando as chaves já utilizadas nas Telas 01 e 02.
3. Não redesenhe Snoopy, Woodstock, nuvens ou explosão em CSS/SVG: utilize as imagens fornecidas.
4. Use o fundo da primeira cena e componha os efeitos e personagens em camadas; na chuva, a nuvem é overlay; na ação, a explosão fica atrás dos personagens e não esconde textos.
5. Os títulos dos cartazes, diálogos, avaliações, botões e balões devem continuar em HTML/SCSS, com strings em `src/content/script.ts`.
6. A edição dos personagens está sendo usada somente para prototipagem local, enquanto se verifica autorização antes do deploy.

## Observações

- As gotas da ilustração do Snoopy dramático fazem parte da própria pose. Evite excesso de chuva adicionando efeitos pesados por cima.
- A explosão é apenas efeito cartunesco; não precisa de assets adicionais nem de áudio.
- O projeto mantém **2 gêneros** apenas: Drama de Oscar e Filme de Ação.
- Não há necessidade de criar imagens separadas para os cartazes. Use miniaturas dos assets existentes e títulos em HTML.

## Implementação da Tela 03

- `FilmingScene` segue a claquete da Tela 02 e termina no placeholder existente da pré-estreia. As Telas 01 e 02 e seus caminhos de assets permanecem intactos.
- Introdução em três falas, com pausas de 4,2 / 4,5 / 4 segundos. Snoopy usa `ComicBubble` de pensamento; a voz da criadora usa a legenda de quadrinhos já estabelecida nos bastidores. **Adiantar fala** é opcional e preserva a ordem do roteiro.
- Dois cartazes em HTML/SCSS usam somente os WebP fornecidos. Um clique registra a escolha e mostra uma confirmação de 0,28 segundo antes de iniciar automaticamente a filmagem. O bloqueio síncrono evita que cliques repetidos ou em cartazes diferentes iniciem duas tomadas.
- `App` guarda a escolha no estado `Genre` existente (`drama | action | null`), que permanece ao avançar para `screening` e é limpo somente por `restart`. A tomada local usa uma escolha fixa durante a execução; não há biblioteca ou estado global adicional.
- Na filmagem, a voz fica por 5,2 segundos e a justificativa do diretor por 3,2 segundos. Drama usa o overlay de nuvem/chuva, Snoopy melodramático e Woodstock com guarda-chuva. A camada inteira de chuva tem movimento curto e lento, pois nuvens e gotas estão no mesmo WebP; as gotas do próprio Snoopy não são duplicadas por código.
- Ação usa Snoopy herói, explosão atrás dele e Woodstock arrepiado. O efeito cresce sem tremores, sustenta a imagem até 1,6 segundo e desaparece suavemente até 2,4 segundos. Com movimento reduzido, fica estático e sai no mesmo tempo. A duração da tomada permanece em 8,4 segundos; adiantar a fala também encerra o efeito.
- Em **BILHETERIA.**, a pose existente `snoopy-director-serious-sunglasses.webp` entra em 0,18 segundo, com escala e base dos pés alinhadas ao herói. A pose anterior fica oculta antes da entrada, evitando silhuetas sobrepostas. Com movimento reduzido, a troca é imediata. Woodstock mantém sua reação arrepiada.
- Os efeitos voltam gradualmente ao normal antes da crítica. A avaliação de cinco estrelas aparece abaixo do quadro por 6,4 segundos, com Snoopy orgulhoso, sem modal ou interação de avaliação.
- O encerramento mostra a fala da voz por 4,6 segundos, **Isso se chama CINEMA.** e, após mais 2,8 segundos, a próxima sessão e o botão de pré-estreia. Não antecipa a descoberta de que ninguém disse oi.
- Relógios narrativos são independentes de `matchMedia`; mudar a preferência não reinicia a história ou a explosão. `useGSAP` faz a limpeza por fase e ao desmontar. Falas e avaliação usam `aria-live`; os cartazes são botões nativos acessíveis por teclado e toque.
- Desktop: cartazes lado a lado na área livre do quadro. Tablet em retrato: quadro mais alto e Snoopy proporcionalmente maior. Mobile: cartazes empilhados abaixo do cenário, personagens inteiros e diálogo acima dos rostos. Ao escolher, a página volta à filmagem; a crítica é trazida à área visível se necessário.
- Até 430 px, a arte dos cartazes passa de 220 para 180 px, com padding e intervalos internos menores. Cada cartaz economiza aproximadamente 52 px de altura. As fontes e o encaixe proporcional das imagens são preservados; o layout desktop não muda.
- Durante a escolha no desktop, Woodstock fica à esquerda junto aos equipamentos, para que os cartazes não o escondam. No tablet em retrato e no mobile, o recorte do quintal privilegia a casinha; os equipamentos mais à esquerda ficam fora desse enquadramento.

## Validação local

O script `_local/check-filming.mjs` cobre os dois gêneros desde a abertura, roteiro e escolha única, efeitos, crítica, encerramento, persistência no `App` após avançar e limpeza da escolha no reinício. As verificações das Telas 01 e 02 foram atualizadas para reconhecer a filmagem real; as capturas ficam em `_local/`.

`npm run build` aprovado. Chrome em 1280 × 960, 1242 × 686, 820 × 1180, 320 × 740, 390 × 844 e 430 × 932: ambos os gêneros aprovados, incluindo progressão automática, adiantamento por fala, cartazes por teclado e toque, cliques em ambos os cartazes na mesma sequência, chuva/explosão atrás dos personagens, cinco estrelas, encerramento, pré-estreia como placeholder, persistência no `App` e reinício. Personagens inteiros, diálogos sem cobrir rostos e nenhuma rolagem horizontal. Movimento reduzido foi verificado desde o início e ao alterar a preferência durante a filmagem. Nenhum erro de execução registrado.

O aviso existente de chave `dev` duplicada no `package.json` permanece; esse arquivo não foi alterado nesta tarefa.

Regressão adicional aprovada: abertura em 1242 × 686 e bastidores em 390 × 844, agora reconhecendo a Tela 03 implementada. Nenhum componente, estilo ou diálogo dessas duas cenas foi alterado.

Polimento final (Tarefa 07): os 12 casos da matriz acima passaram novamente nos dois gêneros. A explosão permanece perceptível após o antigo limite de 1,6 segundo e sai antes da justificativa; a reação de óculos mantém uma única pose visível, sem cortes ou sobreposição. Os cartazes medem entre 266 e 287 px de altura em 320, 390 e 430 px, com descrições de 16 px e imagens proporcionais. Foram conferidos progressão automática, adiantamento, teclado, toque, movimento reduzido, cinco estrelas, encerramento e navegação com o gênero preservado. `npm run build` aprovado, com o mesmo aviso de `dev` duplicado; nenhum erro de execução no Chrome.
