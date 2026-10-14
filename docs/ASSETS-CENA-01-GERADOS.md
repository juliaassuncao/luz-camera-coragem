# Assets gerados — Cena 01 (abertura)

Pacote para mesclar na **raiz** do projeto `luz-camera-coragem/`.

## Imagens

| Caminho no projeto | Uso |
|---|---|
| `public/assets/characters/snoopy/snoopy-director-standing.webp` | Snoopy de boina para a entrada triunfal |
| `public/assets/characters/snoopy/snoopy-director-seated.webp` | Snoopy sentado na cadeira azul (cadeira ja incluida na arte) |
| `public/assets/characters/snoopy/snoopy-director-sunglasses.webp` | Snoopy Joe Cool de oculos para poses pontuais; usa roupa vermelha |
| `public/assets/characters/woodstock/woodstock-assistant-clapper.webp` | Woodstock segurando uma claquete; personagem com transparencia |
| `public/assets/props/doghouse.webp` | Casinha vermelha isolada, para futuros cenarios de camadas |
| `public/assets/props/director-chair.webp` | Cadeira vazia isolada, reserva para composicoes |
| `public/assets/props/film-camera.webp` | Camera classica isolada |
| `public/assets/props/studio-spotlight.webp` | Refletor de cinema isolado |
| `public/assets/backgrounds/backyard-film-set.webp` | Cenario do quintal com casinha e equipamentos ja ilustrados |

## Importante: evitar duplicacao visual

O arquivo **`backyard-film-set.webp` ja contem uma casinha vermelha, camera, cadeira vazia e claquete** desenhadas no cenario.
Ao usa-lo como fundo na Cena 01, NAO desenhar novamente `doghouse.webp`, `film-camera.webp` e `director-chair.webp` sobre os mesmos elementos, pois ficarao duplicados.
Os arquivos isolados sao fornecidos para reutilizacao, cenas posteriores ou para eventual substituicao do cenario por uma versao sem objetos.

O asset **`snoopy-director-seated.webp` JA CONTEM uma cadeira azul**. Nao empilhar a cadeira separada na mesma posicao.

Os dois assets com boina vermelha (`standing` e `seated`) sao a versao visualmente coerente para a animacao de entrada.
O de oculos usa camiseta vermelha em vez de boina e e opcional para uma pose com troca de figurino intencional; evite alternar repentinamente no mesmo movimento.

## Regras para o Codex

- Tratar os personagens em WebP transparentes como camadas independentes.
- Reaproveitar o cenario horizontal (1672 x 941 original) adaptando enquadramento no mobile.
- Manter titulo, falas, botoes e baloes em HTML/CSS, nunca incorporados em imagens.
- Preservar `src/content/script.ts`, `src/config/assets.ts` e `OpeningScene`.
- Manter transicao por GSAP, acessibilidade, movimento reduzido e botao de pular.
- Nao alterar a Tela 02 nem os placeholders de outras cenas.

## Direitos e publicacao

Ilustracoes de prototipo geradas para o projeto, nao sao assets oficiais da Peanuts. A autorizacao de uso dos personagens/elementos protegidos e a revisao dos termos seguem pendentes para o deploy. O uso deve permanecer local enquanto isso.
