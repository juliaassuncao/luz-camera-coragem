# Resultados — Tarefa 12

Validação concluída em 14 de outubro de 2026, sem commit e sem deploy.

## Balões de pensamento

A sobreposição foi introduzida pelo cálculo global de `useThoughtAnchor`: ele posicionava a base do balão em uma fração da altura do arquivo da pose (`14%` no mobile e `30%` no desktop). Como os WebPs têm proporções e margens transparentes diferentes, essa fração podia cair dentro da cabeça ou da boina.

O posicionamento horizontal aprovado foi preservado. O novo cálculo coloca o corpo do balão acima do retângulo completo da pose e reserva uma folga visual responsiva. A folga também considera a borda de 3 px do palco e o zoom temporário da Cena 02. Somente as bolinhas de pensamento ocupam a ligação entre balão e personagem. Um `ResizeObserver` continua atualizando as medidas e o cálculo é repetido depois de `document.fonts.ready`, evitando posição obsoleta quando as métricas tipográficas mudam.

Em composições desktop nas quais o balão fica acima e à direita, foi validada a ausência de interseção real entre o corpo do balão e a pose. No mobile, o balão mantém ainda uma separação vertical mínima mensurada.

## “UM GRANDE FILME.”

O intervalo entre a pergunta “...um filme?” e o anúncio recebeu 500 ms adicionais. No anúncio, a pose séria entra sem flash, o texto HTML usa uma escala tipográfica maior e centralizada, e a camada interna do balão anima de `0.9` para `1`, partindo de uma inclinação de `−2.5°`.

Os elementos ilustrados do palco recebem zoom de 3%, sem transformar a camada de diálogo. A iluminação aumenta suavemente, Woodstock usa a pose de surpresa com um pequeno susto e o enquadramento retorna ao normal depois de aproximadamente dois segundos. Ao adiantar a fala, o contexto GSAP remove transformações e efeitos temporários. Com movimento reduzido, o fluxo e os tempos de leitura continuam funcionando sem a animação visual.

## Tipografia no Android

A família aprovada era declarada como `Comic Sans MS`, mas não existia arquivo de fonte no projeto. O desktop Windows encontra a fonte instalada no sistema. Android e Samsung Internet normalmente não possuem essa família; a antiga lista chegava à família genérica `cursive`, cuja escolha varia por fabricante e explica a letra mais fina e cursiva observada no Galaxy S24 Ultra.

A configuração agora mantém `Comic Sans MS` como primeira opção e remove o fallback genérico imprevisível. A lista efetiva é:

`"Comic Sans MS", "Comic Sans", "Trebuchet MS", Arial, sans-serif`

Não foi copiado `comic.ttf` do Windows, pois Comic Sans MS é uma fonte proprietária e o projeto não contém licença de redistribuição. Também não foi introduzida outra webfont sob o nome da fonte original. Por isso, o Android agora recebe um fallback legível e estável, mas a igualdade absoluta com o desenho do Windows depende do fornecimento de um arquivo web licenciado de Comic Sans MS ou da aprovação explícita de uma alternativa licenciada.

## Validação

- 1440 × 900, 1280 × 720, 768 × 1024, 430 × 932, 412 × 915, 390 × 844 e 320 × 740: passaram.
- Balões comuns e anúncio ampliado: sem interseção com as poses, dentro da moldura e sem rolagem horizontal.
- Zoom, iluminação, reação do Woodstock e limpeza ao adiantar: passaram.
- Voz dos bastidores permaneceu à direita.
- Movimento reduzido, teclado, foco, toque, Strict Mode e carregamento lento de poses: passaram.
- Acentos e cedilha permaneceram no conteúdo HTML e no build UTF-8.
- `npm run build`: passou; permanece o aviso preexistente da chave `dev` duplicada em `package.json`.

A validação física em Chrome para Android e Samsung Internet no Galaxy S24 Ultra permanece pendente. O projeto não tem acesso remoto ao aparelho, e essa verificação não foi simulada como se fosse um teste real.
