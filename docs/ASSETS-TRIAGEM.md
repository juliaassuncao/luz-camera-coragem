# Triagem do pacote `assets.zip` — Luz, câmera... coragem!

**Resultado:** 18 arquivos recebidos, 9 selecionados e renomeados, 9 descartados (incluindo 1 duplicata exata).

## Como instalar

1. Extraia `luz-camera-coragem-assets-organizados.zip` na **raiz** do projeto `luz-camera-coragem/`, mesclando as pastas `public/`, `_local/` e `docs/`.
2. Nenhum arquivo existente deve ser substituído: os nomes selecionados são novos.
3. As duas imagens em `public/assets/stills/filming/` são **quadros completos** para visualização local dos gêneros; não são sprites transparentes e não precisam ser usados agora na Tela 01.
4. Tudo em `_local/references/` é **material de referência**, ignorado pelo Git no projeto inicial e não publicado pelo Vite.
5. **Não altere** por enquanto `src/config/assets.ts` para apontar para essas imagens: o Codex está refinando a abertura com figuras separadas e as imagens selecionadas não são figuras isoladas prontas para animação.

## 9 imagens selecionadas e local de destino

| ID | Novo caminho (relativo à raiz) | Uso planejado | Observação |
|---|---|---|---|
| 03 | `public/assets/stills/filming/drama-chuva.jpg` | Cartaz/trecho de chuva na escolha de gênero; imagem inteira, com personagem e cenário juntos | Uso local no site; não permite separar a personagem |
| 04 | `public/assets/stills/filming/acao-aviador.jpg` | Cartaz/trecho de ação e aventura na escolha de gênero | Uso local no site; não é uma pose animável |
| 06 | `_local/references/backgrounds/pre-estreia-noite.jpg` | Referência de atmosfera para a sessão ao ar livre no quintal | Referência apenas; noite mais escura que o entardecer planejado |
| 10 | `_local/references/characters/snoopy/snoopy-joe-cool.avif` | Referência para Snoopy com óculos escuros e atitude confiante | Fundo branco opaco; não usar como sprite sem tratamento |
| 11 | `_local/references/characters/snoopy/snoopy-diretor-cadeira.jpg` | Principal referência para Snoopy sentado com megafone na cadeira de diretor | 330×340 px, fundo branco; inadequado para personagem grande/animado |
| 12 | `_local/references/finale/snoopy-envelope.jpg` | Referência para Snoopy com envelope na tela final | Imagem pequena e com fundo escuro; não é sprite |
| 15 | `_local/references/backgrounds/quintal-ilustrado-colorido.jpg` | Referência de cores, gramado, vegetação e casinha vermelha | Tem personagem e itens de outra atividade (pintura); não usar como fundo final |
| 16 | `_local/references/backgrounds/quintal-casinha-azul.jpg` | Referência para céu azul, grama e casinha vermelha em estilo clássico | Snoopy e Woodstock já fazem parte da imagem; fundo não separado |
| 18 | `_local/references/characters/woodstock/woodstock-pose-base.avif` | Referência base para proporções e cor do Woodstock | Fundo branco opaco; não usar como sprite sem tratamento |

## 9 imagens descartadas

| ID | Motivo |
|---|---|
| 01 | Cena em preto e branco com casinha; destoa da proposta colorida e não resolve pose necessária |
| 02 | Snoopy com figurino de detetive; não combina com o diretor de cinema e é substituída pela referência 15/16 |
| 05 | Duplicata binariamente idêntica ao arquivo 01 (mesmo hash) |
| 07 | Cena de cinema com renderização 3D e texto promocional; destoa dos quadrinhos clássicos |
| 08 | Avião e paraquedistas: composição muito carregada para o nosso filme de ação, redundante à 04 |
| 09 | Snoopy aviador em visual 3D; destoa da estética 2D escolhida |
| 13 | Contém o texto "JOE THINKER" desenhado na imagem; não é útil para os balões editáveis e repete a ideia da 10 |
| 14 | Cena coletiva de filmagem com outros personagens; visual complexo e não corresponde ao quintal improvisado |
| 17 | Casinha com Snoopy escrevendo; função visual redundante à referência 16, com pose pouco útil |

## Assets que ainda faltam

As imagens recebidas não incluem figuras **isoladas com transparência** de Snoopy entrando, Snoopy sentado, Snoopy com a plaquinha, Snoopy entregando envelope, Woodstock com claquete ou Woodstock carregando o bilhete. Além disso, nenhuma foto ou quadro dos arquivos é um cenário de quintal sem personagens embutidos.

Por isso, continue usando os SVGs provisórios já existentes na abertura. Quando tiver artes adequadas e autorização, substitua-os por figuras em camadas e reserve os quadros completos para cartazes ou inspiração visual.

## Direitos e publicação

Os arquivos foram fornecidos pela usuária sem metadados confiáveis de licença, fonte e autorização. A seleção e renomeação **não autorizam uso público**, nem confirmam direito de adaptação. O fato de ser uma experiência temporária e sem fins comerciais não elimina essa necessidade.

**Atenção:** arquivos sob `public/assets/` são copiados para o build da Vite, mesmo que não sejam usados na cena. Não publique o projeto com estas imagens em `public/` antes de verificar permissões; retire/substitua esses arquivos antes de qualquer deploy se a autorização não tiver sido obtida.

Para identificar os arquivos originais, consulte `docs/MAPEAMENTO-COMPLETO.csv` e `docs/PAINEL-ORIGINAL.jpg`.
