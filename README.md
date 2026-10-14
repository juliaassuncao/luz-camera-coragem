# Luz, câmera... coragem! 🎬

Microcurta interativo em seis cenas no qual Snoopy dirige uma produção cinematográfica de orçamento duvidoso. A experiência termina em uma carta e em uma cena pós-créditos secreta acionada pela pulseirinha “OI”.

## Tecnologias

- React 19 e TypeScript
- Vite
- SCSS
- GSAP e `@gsap/react`

## Requisitos

- Node.js 22, conforme `.nvmrc`
- npm

## Desenvolvimento

```bash
npm install
npm run dev
```

O Vite informa a URL local, normalmente `http://localhost:5173`. Em desenvolvimento, `?debug=1` habilita o seletor interno de cenas.

## Validação e build

```bash
npm run typecheck
npm run build
npm run preview
```

O build é gerado em `dist/`. A experiência respeita `prefers-reduced-motion` e não inicia áudio automaticamente.

## Estrutura

```text
src/app/           fluxo entre as seis cenas
src/animation/     carregamento de imagens e posicionamento dos balões
src/components/    componentes compartilhados
src/config/        referências centralizadas de assets
src/content/       roteiro e textos da interface
src/scenes/        implementação e estilos de cada cena
src/styles/        estilos globais e layout compartilhado
public/assets/     imagens, efeitos, objetos e áudio
docs/              direitos, inventários, decisões e deploy
```

## Áudio

O player secreto usa `public/assets/audio/better-when-im-dancin.mp3`. A reprodução depende de ação explícita da visitante.

## Deploy na Vercel

Configure:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- `VITE_SITE_URL`: domínio HTTPS definitivo, sem barra final

Os metadados também aceitam `VERCEL_PROJECT_PRODUCTION_URL` como fallback. As instruções completas estão em [`docs/DEPLOY-VERCEL.md`](docs/DEPLOY-VERCEL.md).

## Assets e direitos

O inventário atual está em [`docs/ASSETS.md`](docs/ASSETS.md). Os registros de procedência, uso e autorização ficam em [`docs/REFERENCIAS-E-DIREITOS.md`](docs/REFERENCIAS-E-DIREITOS.md). Revise essas informações antes de qualquer publicação pública.
