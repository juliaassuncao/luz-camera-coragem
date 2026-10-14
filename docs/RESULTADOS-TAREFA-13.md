# Resultados — Tarefa 13

Validação concluída em 14 de outubro de 2026, sem commit e sem deploy.

## Assets integrados

- `characters/snoopy/snoopy-premiere-confused-seated.webp`
- `characters/snoopy/snoopy-premiere-idea-seated.webp`

Os dois arquivos foram importados do pacote fornecido, preservados em WebP e registrados em `src/config/assets.ts`. A documentação do pacote foi mantida em `docs/ASSETS-CENA-04-EXPRESSOES.md`.

## Cena 04

O estado “Mas ninguém disse oi.” passa para a pose confusa, que continua durante a pausa e a resposta “Detalhes de pós-produção.”. No começo do momento de ideia, a pose confusa permanece durante a breve preparação; quando a lâmpada aparece, Snoopy muda para a nova pose de ideia. A mesma pose acompanha “Acho que ainda falta uma cena.” e a entrada do botão.

As três imagens da pré-estreia usam o mesmo contêiner e a mesma linha-base da cadeira. O contêiner foi normalizado para a proporção dos novos arquivos, mantendo a altura aparente do asset anterior. As duas novas poses possuem as mesmas dimensões e ocupam exatamente a mesma âncora. A troca só acontece após a decodificação e recebe uma transição curta de 0,16 s, partindo de 74% de opacidade, sem quadro vazio nem sobreposição perceptível. Com movimento reduzido, a pose muda diretamente.

## Balões

Somente os pensamentos de Snoopy foram elevados: 12 px no desktop e 9 px no mobile. O cálculo continua baseado na pose visível, respeita a borda do palco, aguarda as métricas finais da fonte e recalcula em redimensionamentos. As caixas da voz dos bastidores não foram alteradas.

## Relatório Final

O tempo da fase inicial da Cena 05 passou de 7,2 para 9 segundos, acréscimo de 1,8 s. Em medição no Chrome headless, descontando a troca de cena do controle de desenvolvimento, a transição ocorreu no intervalo esperado. O texto permaneceu completo, e o controle “Adiantar a cena” continuou levando diretamente ao envelope sem reiniciar o personagem.

## Roteiro definitivo

`src/content/script.ts` recebeu apenas as diferenças especificadas:

- Cena 02: nova formulação sobre encontrar alguém nos rolês.
- Cena 03: “É assim que começam as grandes histórias.”, novo comentário do júri e nova assinatura da crítica.
- Cena 06: quinto parágrafo, assinatura e P.S. institucional definitivos.
- Cena 04: descrições acessíveis das duas novas expressões.

As demais falas, identificações, escolhas, botões, créditos e efeitos permaneceram como estavam. O P.S. continua uma única vez após a assinatura e em texto HTML.

## Validação

- Fluxo das seis cenas em 1440 × 900, 1280 × 720, 768 × 1024, 430 × 932, 412 × 915, 390 × 844 e 320 × 740: passou.
- Pose confusa durante a fala e a resposta, pose de ideia sincronizada com a lâmpada e cadeira estável: passaram.
- Balões sem interseção com as poses, dentro do palco, sem rolagem horizontal: passaram.
- Voz dos bastidores à direita, gênero preservado, reprise, crítica, entrega, carta e replay: passaram.
- Movimento reduzido, teclado, foco visível, toque, Strict Mode, aba oculta, redimensionamento e resposta lenta de imagem: passaram.
- Nenhuma exceção de execução foi registrada.
- `npm run build`: passou. Permanece o aviso preexistente da chave `dev` duplicada em `package.json`.

Ainda é recomendada a revisão visual nos aparelhos físicos da usuária, especialmente para confirmar a preferência subjetiva de escala das novas ilustrações na pré-estreia e a fonte de fallback no Android.
