# Luz, câmera... coragem! 🎬

MVP inicial do **mini cinema interativo** criado como um gesto leve de aproximação. Snoopy dirige uma produção desnecessariamente grande só para ajudar alguém a dizer oi. Ambiente: quintal colorido, casinha vermelha e Woodstock como assistente.

## Começar

Requisitos: Node **22** e npm. No VS Code, abra a pasta do projeto e execute:

```bash
npm install
npm run dev
```

O Vite informa a URL local (normalmente http://localhost:5173). Para acessar o seletor de cenas em **desenvolvimento**, acrescente `?debug=1` à URL.

Outros comandos:

```bash
npm run typecheck
npm run build
npm run preview
```

## O que o ZIP entrega HOJE

✅ Vite + React + TypeScript + SCSS + GSAP (`@gsap/react`), scripts e configurações.

✅ Estrutura de **seis cenas** mapeadas por IDs; gerenciamento de cena e estado reservado para `drama`/`action`.

✅ **Tela 01 / Abertura** ilustrada como rascunho, responsiva, com título, cenário em camadas, balão, animação de entrada e botão funcionando.

✅ Balão reutilizável `ComicBubble`, variáveis de estilo, ilustrações SVG provisórias, textos centralizados.

✅ Inventário de assets, direitos de uso e documento de decisões criativas para futuros prompts do Codex.

🚧 **Telas 02–06**: componentes-placeholder **de propósito**. O botão inicial leva para uma tela temporária `Cena em preparação`, até continuarmos com o Codex. Não há ainda filmagem, envelope interativo ou carta montada.

## Estrutura resumida

```text
src/
  app/           App, estado e lista das seis cenas
  components/    ComicBubble e placeholder de cena
  config/        caminhos de assets
  content/       falas, botões, carta
  scenes/opening/ abertura funcional
  styles/        tokens, regras globais
public/assets/
  backgrounds/   quintal
  characters/    desenhos provisórios (NÃO oficiais)
  props/         casinha, cadeira, câmera
_local/references/  referência do projeto anterior, só local (gitignored)
docs/           inventário, fontes/direitos, decisões, plano para Codex
```

## Imagens e licença

**Importante:** a abertura funciona com **desenhos SVG provisórios originais** — um beagle diretor e um passarinho amarelo; **não são ilustrações oficiais** do Snoopy/Woodstock. A pasta `_local/references/` guarda uma imagem do protótipo anterior para comparação, **não aparece no site e não vai para o build**. Os links das imagens encontradas estão em `docs/REFERENCIAS-E-DIREITOS.md`: não foi possível baixá-las automaticamente neste ambiente.

Antes de subir artes oficiais ou suas adaptações para um site público, aguarde a autorização de reutilização. O contato listado no FAQ da Peanuts é `info@peanuts.com`.

## Personalização

- Editar textos: `src/content/script.ts`
- Trocar os desenhos: `src/config/assets.ts` e `public/assets/characters/`
- Ajustar paleta: `src/styles/global.scss`
- Ajustar cena inicial: `src/scenes/opening/OpeningScene.tsx` e `OpeningScene.scss`
- Conferir o inventário: `docs/ASSETS-ABERTURA.md`
- Planejar a continuação: `docs/CODEX-PROXIMOS-PASSOS.md`

## Escopo

A experiência não pede login, não envia dados e não contém integração de backend. Texto e fluxo serão refinados por etapas. Não há áudio automático.
