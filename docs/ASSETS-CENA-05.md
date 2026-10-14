# Tela 05 — A última tomada: Inventário de assets

## Premissa
Uma passagem da comédia cinematográfica à sinceridade do bilhete. Reutilizar o quintal e a iluminação ao entardecer da Tela 04. Não gerar um cenário novo.

## Novos assets

| Caminho sob `public/assets/` | Papel na cena | Prioridade |
| --- | --- | --- |
| `characters/snoopy/snoopy-sign-blank.webp` | Snoopy com plaquinha vazia para texto HTML responsivo | **Principal** |
| `characters/snoopy/snoopy-sign-hello.webp` | Alternativa com "EU TERIA APENAS DITO OI." incorporado ao desenho | Alternativo; não mostrar junto com a placa vazia |
| `characters/woodstock/woodstock-envelope-delivery.webp` | Woodstock carrega um envelope maior que ele | Principal |
| `characters/snoopy/snoopy-envelope-receiving.webp` | Snoopy recebe/abraça o envelope | Opcional, para transição suave |
| `characters/snoopy/snoopy-envelope-offering.webp` | Snoopy oferece o envelope à visitante | Principal |
| `props/envelope-closed-heart.webp` | Envelope independente clicável | Principal |

## Assets já existentes a reaproveitar

- Cenário/atmosfera de entardecer, casinha vermelha e iluminação da Tela 04.
- `characters/snoopy/snoopy-director-serious-sunglasses.webp` para o gesto de ignorar a voz dos bastidores.
- `characters/woodstock/woodstock-premiere-popcorn.webp` apenas se necessário durante a transição.
- Os componentes de diálogo, balões, botões e navegação já aprovados.

## Sequência original

1. Snoopy ergue a placa: **"Eu teria apenas dito oi."**
2. Voz dos bastidores: **"SNOOPY, MAS A IDEIA DO FILME FOI SUA!"**
3. Snoopy coloca os óculos e finge não ouvir.
4. Woodstock entra com o envelope quase maior que ele.
5. Snoopy recebe e oferece o envelope à visitante.
6. Snoopy pensa: **"Esta é a cena mais importante."**
7. A visitante pode tocar no envelope/botão para avançar à Tela 06 (carta).

## Observações técnicas

- **Preferir a placa vazia.** O texto da placa deve vir de `src/content/script.ts` e ser posicionado no interior do desenho, dentro de um contêiner relativo e responsivo. Verificar legibilidade e alinhamento de 320px a desktop; não é necessário desenhar novos objetos via CSS/SVG.
- A variante com lettering incorporado foi mantida como referência/reserva, nunca em simultâneo com a placa vazia.
- Os desenhos do Snoopy e Woodstock têm fundos transparentes. Não redesenhar personagens ou equipamentos em HTML/CSS/SVG.
- Os diálogos e controles permanecem em HTML/SCSS, fora das imagens.
- `envelope-closed-heart.webp` deve integrar um `<button>` real, com aria-label, foco visível e suporte a teclado/touch.
- Não duplicar envelopes quando a pose de Snoopy já carrega um deles. Preferir destacar o envelope independente no último momento.
- Arquivos recortados de artes geradas, com ampliação para densidade de pixels; essa ampliação não acrescenta detalhe original. Conferir nitidez em renderizações grandes.
- O uso público dos personagens continua dependendo da autorização já solicitada.
- A Tela 05 **não deve revelar o conteúdo da carta** nem implementar a Tela 06.

## Implementação local

- `FinaleScene` entra após `ScreeningScene` e encaminha ao placeholder existente de `letter`. Não recebe nem altera o gênero: ele permanece no `App`, inclusive depois da entrega; somente o reinício existente o limpa.
- O quintal original conserva o mesmo filtro e gradiente de entardecer da Tela 04. O enquadramento aproxima Snoopy; a casinha e os equipamentos incorporados ao fundo continuam presentes. As luzinhas reutilizadas são discretas. Na oferta, a iluminação do fundo fica apenas 7% mais suave, sem alterar as cores do personagem ou acrescentar corações.
- A placa usada é **`snoopy-sign-blank.webp`**. O texto de `SCRIPT.finale.sign` fica em HTML num contêiner proporcional à pose, inclinado em −6°, com fonte de pelo menos 16 px e área livre acima do coração desenhado. A variante `snoopy-sign-hello.webp` foi registrada como reserva e não é renderizada.
- Sequência automática de aproximadamente **19 segundos**: placa 5 s; reclamação original 4,2 s; silêncio 2,2 s; chegada de Woodstock 2,8 s; recebimento 1,2 s; oferta e pensamento 3,6 s. Depois, o envelope espera a ação da visitante sem limite de tempo.
- Na reação, Snoopy fica imóvel por 0,55 s e troca para os óculos já existentes, olhando para o outro lado. Nenhuma nova fala é adicionada. As poses têm alturas diferentes para manter tamanhos de cabeça próximos e a base dos pés alinhada; o recebimento e a oferta são poses sentadas/agachadas, portanto ficam naturalmente mais baixos.
- Woodstock entra por um deslocamento lateral simples, pausa junto ao diretor e entrega a carta. A troca é feita num único estado: a ilustração que carrega o envelope fica oculta antes da pose de Snoopy recebendo. Woodstock volta brevemente à pipoca da pré-estreia, sem envelope, e sai discretamente do foco durante a oferta.
- Na oferta, Snoopy avança apenas 2 px e aumenta 2,5% de escala. O pensamento **Esta é a cena mais importante.** permanece no encerramento. As transições de pose revelam uma única silhueta; não há mistura perceptível de dois envelopes.
- No estado final, um recorte CSS da pose de oferta retira somente a área do envelope incorporado, preservando Snoopy e sua mão. O WebP independente aparece em primeiro plano, próximo à mão no desktop e centralizado abaixo do rosto no mobile. Não há placa, envelope ou personagem desenhado em CSS/SVG, nem edição dos WebP.
- O envelope independente é um botão nativo com o nome acessível **Abrir bilhetinho**. Ele e o botão textual usam o mesmo handler, bloqueado sincronamente após a primeira ativação. Uma aproximação de 0,22 s precede a navegação em 0,3 s; o envelope continua fechado. A abertura e a mensagem pertencem à Tela 06.
- **Adiantar a cena** cancela a progressão restante e mostra o estado final da Tela 05; não navega para a carta. Se o controle estava focado, o foco segue para o envelope. Com movimento reduzido, os mesmos textos, poses e ações aparecem sem deslocamentos, rotações ou zoom animado.
- `useGSAP` limpa as timelines por fase e ao desmontar. Os relógios narrativos são independentes da preferência de movimento e pausam quando a aba fica oculta. Trocar essa preferência não reinicia a história.
- Desktop horizontal; tablet em retrato centralizado verticalmente; mobile com diálogo acima dos personagens e envelope à frente. Rolagem vertical natural pode ser necessária em viewports pequenas. O botão textual tem pelo menos 52 px de altura, e o envelope oferece uma área de toque maior.

## Validação e revisão

As verificações e capturas ficam em `_local/check-finale.mjs` e `_local/finale-*.png`. `_local/check-screening.mjs` agora reconhece a Tela 05 real e confere o gênero também após avançar ao placeholder da Tela 06.

Pontos para revisão visual: a nitidez segue a dos arquivos fornecidos, que já passaram por ampliação; no mobile, o envelope independente ocupa o primeiro plano e cobre parte inferior do corpo, mantendo o rosto livre. O recorte do fundo privilegia a casinha e pode retirar equipamentos da lateral esquerda. Nenhum WebP foi alterado ou gerado.

### Resultados

- `npm run build` aprovado. Permanece somente o aviso preexistente de chave `dev` duplicada no `package.json`, que não foi modificado.
- Sequência completa conferida em **1280 × 960, 1242 × 686, 820 × 1180, 320 × 740, 390 × 844 e 430 × 932**. Os dois desktops entraram normalmente desde a Tela 01, com Drama e Ação; tablet/mobile também foram conferidos em desenvolvimento com `StrictMode`.
- Textos originais, placa vazia com texto HTML de pelo menos 16 px, silêncio com óculos, chegada de Woodstock, recebimento, oferta, pensamento final e envelope independente aprovados. Nenhum erro de execução no Chrome.
- Estado final e adiantamento conferidos novamente nas seis resoluções após ajustar o recorte e a posição do envelope. Sem scroll horizontal, cortes de personagens ou sobreposição de envelope/diálogo com o rosto. A reação e cada entrega exibem uma única pose e um envelope por vez.
- Envelope por **Tab/Enter**, toque direto e botão textual aprovados. Foco após adiantar e bloqueio de cliques repetidos conferidos. A navegação chega somente ao placeholder da Tela 06, sem mensagem pessoal ou abertura de carta.
- `prefers-reduced-motion` em 320 px, alteração da preferência durante oferta/entrega e chegada ao envelope aprovados. Adiantamento no começo e durante a entrega, ausência de avanço automático, gênero ausente, limpeza ao desmontar durante o destaque final e nova entrada conferidos.
- Hashes SHA-256 dos 11 arquivos das Telas 01–04 e dos estilos/componentes compartilhados preservados. Os seis WebP importados têm os mesmos hashes dos originais do ZIP.
- Regressão da pré-estreia em 1242 × 686 com Drama, abertura em 1242 × 686, bastidores em 390 × 844 e Filme de Ação em 1242 × 686 aprovada. A verificação da pré-estreia agora acompanha a entrega até o placeholder da Tela 06 e confirma que o gênero permanece guardado.

Capturas para revisão: `_local/finale-desktop-sign.png`, `_local/finale-desktop-ready.png`, `_local/finale-small-mobile-sign.png`, `_local/finale-mobile-sign.png`, `_local/finale-mobile-offering.png` e `_local/finale-mobile-ready.png`.
