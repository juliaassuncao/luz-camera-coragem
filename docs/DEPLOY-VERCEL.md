# Deploy na Vercel

## Configuração

- Framework preset: Vite.
- Comando de build: `npm run build`.
- Diretório de saída: `dist`.
- Diretório raiz: a raiz deste projeto.
- Variável recomendada: `VITE_SITE_URL`, com a URL HTTPS canônica e sem barra final.

O build resolve a origem dos metadados nesta ordem:

1. `VITE_SITE_URL`.
2. `VERCEL_PROJECT_PRODUCTION_URL`, disponibilizada pela Vercel.
3. `http://localhost:5173` no servidor de desenvolvimento ou `http://localhost:4173` em builds locais de inspeção.

Em ambiente Vercel, o build falha se as duas variáveis de produção estiverem ausentes. Isso impede que uma publicação carregue URLs sociais de localhost.

## Após o primeiro deploy

1. Defina o domínio definitivo no projeto da Vercel.
2. Configure `VITE_SITE_URL` com esse domínio em Production.
3. Faça um novo deploy.
4. Abra o HTML publicado e confirme `canonical`, `og:url`, `og:image` e `twitter:image`.
5. Confirme que `/og-cover.png`, `/favicon.ico`, `/favicon.png`, `/apple-touch-icon.png` e `/assets/audio/better-when-im-dancin.mp3` respondem publicamente.
6. Valide a prévia nas ferramentas oficiais das plataformas desejadas após a publicação.

O aplicativo não usa rotas do React Router; por isso, não precisa de regra de fallback em `vercel.json`.
