# Assets em produção

As referências usadas pela aplicação ficam centralizadas em `src/config/assets.ts`. Os arquivos públicos são servidos a partir de `/assets`; favicon e capa social ficam na raiz de `public`.

## Cenário e personagens

- `backgrounds/backyard-film-set-clean.webp` é o cenário compartilhado pelas seis cenas.
- `characters/snoopy/` contém as poses efetivamente usadas na abertura, bastidores, filmagem, pré-estreia, entrega e carta.
- `characters/woodstock/` contém as poses de assistente, reações, chuva, pré-estreia e entrega do envelope.

## Objetos e efeitos

- A pré-estreia usa o lençol, projetor e cordão de luzes de `props/`.
- A entrega e a carta usam o envelope limpo, cameo e pulseirinha de `props/` e `characters/`.
- Chuva, explosão, lâmpada e coração ficam em `effects/`.

## Áudio

- `audio/better-when-im-dancin.mp3` alimenta o player secreto da Cena 06.
- A reprodução nunca começa automaticamente.

## Identidade de compartilhamento

- `og-cover.png`: 1200 × 630.
- `favicon.ico`: favicon principal.
- `favicon.png`: alternativa PNG.
- `apple-touch-icon.png`: ícone para dispositivos Apple.

Antes de adicionar ou substituir um arquivo, atualize `src/config/assets.ts` e confira `docs/REFERENCIAS-E-DIREITOS.md`.
