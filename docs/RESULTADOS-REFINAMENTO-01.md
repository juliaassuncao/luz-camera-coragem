# Resultados — Refinamento geral do MVP

Validação concluída em 14 de outubro de 2026, sem commit e sem deploy.

## Alterações por cena

- **Cena 01 — Abertura:** fundo limpo, pré-carregamento das poses, entrada preservada, troca em pé/sentado sem flash, palco e cabeçalho estáveis e balão recalculado a partir da cabeça do Snoopy.
- **Cena 02 — Bastidores:** fundo sem cadeira/claquete duplicadas, troca decodificada das poses, voz fixada à direita, balões ancorados e efeito `CLAC` preservado.
- **Cena 03 — Filmagem:** fundo limpo, poses de Snoopy e Woodstock protegidas durante a decodificação, palco estável ao abrir cartazes/crítica, nova crítica do júri e controle `Adiantar crítica`. A explosão continua atrás do Snoopy.
- **Cena 04 — Pré-estreia:** reprise ampliada para 5,6 s com `Adiantar reprise`, posição-base do Snoopy preservada, CTA revelado sem reiniciar o personagem e pulseirinha removida. A pausa, a reação e a lâmpada de ideia permanecem.
- **Cena 05 — Entrega:** relatório integrado ao palco, plaquinha em HTML, reação de óculos, entrada lateral contínua do Woodstock em 2,1 s, pose de apresentação, escalas normalizadas e envelope independente em primeiro plano antes do CTA.
- **Cena 06 — Carta:** abertura automática refeita com HTML/CSS e GSAP, mensagem atualizada, P.S. separado, pulseirinha `OI` definitiva e replay sem recarregar a página.

## Causas e correções de estabilidade

As piscadas vinham principalmente de animações de opacidade reaplicadas ao personagem a cada mudança de fala e de trocas de `src` antes da decodificação da imagem seguinte. O módulo `animation/images.ts` centraliza pré-carga, decodificação e retenção da pose anterior. As timelines visuais agora afetam o diálogo ou o controle que entra, sem zerar a opacidade do palco inteiro.

Os deslocamentos eram causados pela variação do cabeçalho, rodapés/CTAs participando do fluxo e alinhamento vertical dependente da altura do conteúdo. Cabeçalhos receberam área mínima estável, o palco mantém a mesma âncora entre estados e as regras comuns de diálogo foram reunidas em `styles/_scene-layout.scss`.

Os balões de pensamento são posicionados por `animation/useThoughtAnchor.ts`. O cálculo usa os retângulos reais do palco, da pose visível e do balão, acompanha redimensionamentos e ajusta as bolinhas para a cabeça do personagem. A voz dos bastidores usa largura pelo conteúdo e fica sempre à direita.

## Carta e entrega

O envelope da Cena 06 tem corpo, aba, frente, selo e uma folha mascarada. A aba gira, a folha sobe atrás da frente e, depois de liberada, é medida contra os limites reais do cartão HTML e animada até eles. O cartão substitui a folha no mesmo ponto. A sequência durou 2,13 s no desktop e 2,15 s no mobile; com movimento reduzido, a mensagem aparece diretamente.

Na Cena 05, Woodstock usa uma única pose visível de cada vez. A pose com envelope entra pela direita em deslocamento contínuo, com oscilação vertical discreta, para ao lado de Snoopy e muda para a apresentação. Após a entrega, Woodstock e o envelope carregado saem; Snoopy apresenta o bilhete e o envelope limpo assume sozinho o primeiro plano.

## Assets integrados

- `backgrounds/backyard-film-set-clean.webp` — usado nas seis cenas.
- `characters/woodstock/woodstock-envelope-walking.webp` — Cena 05.
- `characters/woodstock/woodstock-envelope-presenting.webp` — Cena 05.
- `props/envelope-closed-clean.webp` — envelope interativo da Cena 05.
- `props/friendship-bracelet-oi-swift.webp` — exclusivamente na Cena 06.
- `props/envelope-open-reference.webp` — registrado para compatibilidade e referência; não usado na animação, que foi construída em HTML/CSS.

Os WebPs originais foram preservados e nenhum asset foi gerado ou convertido.

## Validação

- Auditoria das seis cenas em 1440 × 900, 1280 × 720, 768 × 1024, 430 × 932, 390 × 844 e 320 × 740: passou sem rolagem horizontal, cortes de personagens ou texto abaixo de 16 px.
- Drama de Oscar em desktop e Filme de Ação em mobile: fluxos completos até a carta passaram. O gênero foi preservado até a carta e limpo no replay.
- Controles de aceitar, adiantar falas/crítica/reprise/cena, claquete, gênero, navegação, bilhetinho e replay: passaram.
- Teclado, foco visível, toque, alvos de 52 px, árvore de acessibilidade sem cópias duplicadas e conteúdo inerte durante a abertura: passaram.
- `prefers-reduced-motion`, alteração da preferência ao vivo, aba oculta, redimensionamento, desmontagem/remontagem em Strict Mode e resposta lenta de imagem: passaram.
- Nenhuma exceção de execução foi registrada nos fluxos automatizados.
- `npm run build`: passou. O build mantém um aviso preexistente sobre a chave `dev` duplicada em `package.json`.

## Materiais para revisão

- `_local/refinement-drama-desktop.mp4` — 1280 × 800, 24 fps, 2 min 05 s.
- `_local/refinement-action-mobile.mp4` — 390 × 844, 24 fps, 1 min 22 s.

A revisão visual foi feita no Chrome headless com capturas por estado e nos vídeos codificados. Uma passagem manual com leitor de tela real e em aparelhos físicos ainda é recomendada antes da publicação; a semântica e a árvore de acessibilidade foram verificadas pelo navegador.
