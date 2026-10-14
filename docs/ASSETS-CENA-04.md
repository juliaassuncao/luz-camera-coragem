# Tela 04 — A pré-estreia | Inventário visual

A sessão acontece **no mesmo quintal da Cena 01**, agora com luz de entardecer. O Snoopy é um diretor absurdamente orgulhoso da produção, Woodstock come pipoca sem se preocupar, e uma reprise revela que a produção inteira não teve o objetivo básico: dizer oi.

## Novos assets

| Arquivo | Uso | Atenção |
| --- | --- | --- |
| `public/assets/characters/snoopy/snoopy-premiere-seated-sunglasses.webp` | Snoopy sentado, assistindo à estreia | Já contém a cadeira azul; não sobrepor outra cadeira |
| `public/assets/characters/woodstock/woodstock-premiere-popcorn.webp` | Woodstock com pipoca, indiferente ao drama | Escala significativamente menor que a de Snoopy |
| `public/assets/props/projection-sheet.webp` | Lençol branco em moldura rústica para o filme | A reprise da Cena 03 deve entrar numa camada própria posicionada sobre o tecido; não substituir a imagem do lençol |
| `public/assets/props/vintage-projector.webp` | Projetor retrô sobre um caixote | Já possui um feixe de luz ilustrado; evitar feixes extras excessivos |
| `public/assets/props/string-lights.webp` | Pequena fileira de luzes quentes | Opcional se a composição ficar carregada, sobretudo no celular |
| `public/assets/backgrounds/sunset-sky-reference.webp` | Referência de cores de céu ao entardecer | NÃO usar como background completo nem cortar/ocultar a casinha. Preferir filtro/overlay de cor sobre `backyard-film-set.webp` mantendo continuidade espacial |
| `public/assets/props/friendship-bracelet-oi.webp` | Close-up discreto de pulseira de miçangas com as letras `OI` | Letras gravadas na imagem; mostrar com tamanho legível em mobile |
| `public/assets/effects/idea-lightbulb.webp` | Pequena lâmpada quando Snoopy percebe a solução | Reação visual curta, depois da pulseira |

## Reaproveitar do projeto

- `public/assets/backgrounds/backyard-film-set.webp` — cenário principal já aprovado.
- `public/assets/characters/snoopy/snoopy-director-seated-attentive.webp` — reação pensativa, se útil.
- `public/assets/characters/snoopy/snoopy-director-serious-sunglasses.webp` — reação séria.
- Imagens e efeitos escolhidos na Tela 03: `snoopy-drama-rain.webp`, `drama-storm-rain.webp` e `snoopy-action-hero.webp`, `action-explosion.webp`.

## Proposta de composição

**Desktop:** quintal ao entardecer; casinha continua reconhecível à direita. Lençol e projeção à esquerda ou ao centro, projetor discretamente na frente, Snoopy e Woodstock assistindo em primeiro plano. Não duplicar os equipamentos incorporados ao cenário anterior se forem visualmente redundantes.

**Mobile:** projeção acima ou ao fundo, menor; personagens abaixo e em frente, sem cobrir o conteúdo importante. Balões legíveis, com espaço próprio para o texto, sem ocultar expressões.

## Roteiro aprovado (não adicionar escolhas)

1. Snoopy e Woodstock assistem à pequena projeção do gênero escolhido na Tela 03.
2. Voz dos bastidores: “Snoopy... acho que esquecemos uma coisa.”
3. Snoopy: “Impossível. Ficou perfeito.”
4. Voz dos bastidores: “Mas ninguém disse oi.”
5. Pausa com olhares. Snoopy: “Detalhes de pós-produção.”
6. Snoopy observa a pulseirinha `OI`; surge uma pequena lâmpada.
7. Snoopy: “Acho que ainda falta uma cena.”
8. Avançar para Tela 05 usando o fluxo já existente, sem implementar a nova cena ainda.

### Regras técnicas

- Usar WebPs para todas as ilustrações; CSS e GSAP apenas para layout, balões, máscaras, iluminação de entardecer e transições. **Nada de desenhos de personagens/objetos feitos em código.**
- Na tela de lençol, projetar a reprise do gênero selecionado na Tela 03. Não inventar novo vídeo nem baixar imagens.
- Usar `src/config/assets.ts` para os caminhos e `src/content/script.ts` para textos.
- A pulseira é uma pista, não uma tela adicional, e a referência à Taylor Swift deve continuar visual e discreta.
- Preservar botão de adiantar falas, `prefers-reduced-motion` e comportamento responsivo para 320–430 px.
- Não criar as Telas 05 ou 06; não fazer commit sem revisão.
- Imagens com Snoopy/Woodstock permanecem em protótipo local enquanto o pedido de autorização estiver pendente.

## Implementação local

- `ScreeningScene` recebe `genre` do estado existente do `App`. Não escreve nesse estado. Após **Ver a última cena**, navega para `finale`, que continua sendo o placeholder da Tela 05. O reinício existente limpa o gênero.
- A reprise aparece de 0,6 a 3,6 segundos após a entrada. Nuvem/chuva e Snoopy dramático ou explosão e Snoopy herói usam os quatro WebP da Tela 03, recortados na área do tecido. O contraste e a saturação menores, com composição `multiply`, deixam as dobras visíveis. Sem gênero no modo de depuração, o lençol permanece vazio; nenhum gênero é inventado ou gravado.
- O quintal original recebe um filtro suave e um gradiente de lilás, rosa e luz quente. Essas camadas ficam atrás dos personagens. `sunset-sky-reference.webp` está registrado somente como referência cromática; não substitui o fundo.
- Snoopy usa a nova pose sentada com a cadeira já incorporada. A pose atenta existente é usada na pausa e na descoberta, com altura e base alinhadas; os olhares são sugeridos pela orientação da pose e pequenas inclinações. Woodstock mantém a pipoca. As poses ficam visíveis uma por vez.
- O projetor usa o próprio feixe do WebP. Dois recortes complementares do mesmo arquivo separam o equipamento da luz, permitindo apagar somente o feixe. Não há feixe extra desenhado em código. As luzinhas decorativas permanecem discretas.
- A conversa tem três falas, com leitura de 4,2 / 4 / 3,6 segundos. Depois de **Mas ninguém disse oi.**, há uma pausa automática de 2,2 segundos, seguida de **Detalhes de pós-produção.** por 4,4 segundos. A pulseira aparece; 1,5 segundo depois, a lâmpada surge e desaparece até 3,5 segundos. Após 4 segundos de descoberta, vem **Acho que ainda falta uma cena.**, com 4,2 segundos de leitura antes do único botão final.
- **Adiantar fala** preserva a ordem dos diálogos. A reprise, a pausa cômica e a descoberta são curtas e automáticas. Os relógios narrativos não dependem da preferência de movimento e pausam quando a aba fica oculta. `useGSAP` limpa as animações ao trocar de fase ou desmontar.
- Desktop: lençol ao centro, Snoopy em primeiro plano à esquerda, Woodstock próximo e casinha livre à direita. Tablet em retrato: quadro mais alto e distribuição vertical centralizada. Mobile: lençol acima, fala na faixa central e personagens abaixo; o filme não fica atrás das cabeças. A pulseira tem largura mínima de 130 px. Rolagem vertical natural pode ser necessária para o botão em viewports menores.
- Caminhos registrados em `src/config/assets.ts`; somente o bloco `screening` foi ampliado em `src/content/script.ts`. Componentes, estilos e textos das Telas 01, 02 e 03 permanecem intactos. Sem novos assets gerados, áudio ou telas posteriores.

## Verificação e revisão

O roteiro completo e a composição são conferidos por `_local/check-screening.mjs`. As capturas de reprise, reação, pulseira/lâmpada e encerramento ficam em `_local/screening-*.png`. `_local/check-filming.mjs` agora reconhece a pré-estreia real como sucessora da filmagem.

- **Build:** `npm run build` aprovado. Permanece o aviso preexistente de chave `dev` duplicada no `package.json`; esse arquivo não foi alterado.
- **Fluxo completo:** 12 casos aprovados, entrando pela Tela 01 e escolhendo ambos os gêneros, em 1280 × 960, 1242 × 686, 820 × 1180, 320 × 740, 390 × 844 e 430 × 932. Roteiro exato, reprise escolhida, pausa cômica, pulseira antes da lâmpada, apagamento do projetor, botão único e navegação para o placeholder da Tela 05 com gênero preservado. Progressão automática no desktop; adiantamento, teclado e toque nos demais casos.
- **Composição final:** conferida nas seis resoluções depois do ajuste da lâmpada. Filme contido no tecido, personagens inteiros, uma única pose do Snoopy, Woodstock menor, falas sem cobrir o rosto, lâmpada separada do projetor e ausência de rolagem horizontal.
- **Movimento reduzido:** ambos os gêneros em 320 px, incluindo mudança de preferência durante a descoberta. A reprise, a pausa e o tempo de leitura continuam; as ilustrações ficam estáticas. Também foi conferida a mudança de preferência durante a reprise em desenvolvimento.
- **Depuração:** acesso direto sem gênero mantém o lençol vazio e o estado `null`. Desmontagem durante a pausa ou a lâmpada e nova entrada aprovadas em `StrictMode`, sem callbacks afetando a cena seguinte. Nenhum erro de execução no Chrome.
- **Regressão:** abertura em 1242 × 686, bastidores em 390 × 844 e Filme de Ação em 1242 × 686 aprovados. Os arquivos das três cenas anteriores não foram modificados.

### Pontos para revisão visual

A troca para a pose atenta usa ilustrações com cadeiras e proporções ligeiramente diferentes; a base e a altura foram alinhadas para preservar a continuidade. A pulseira continua sendo um detalhe pequeno, sobretudo em 320 px. No mobile, o quintal recebe recorte lateral e o botão pode exigir rolagem vertical natural. Não foram encontrados cortes de personagens, diálogos sobre os rostos ou sobreposição da lâmpada com os equipamentos.

Capturas finais sem o painel de depuração: `_local/screening-desktop-action-replay.png`, `_local/screening-desktop-action-idea.png`, `_local/screening-mobile-action-replay.png` e `_local/screening-mobile-action-idea.png`.
