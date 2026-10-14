# Próximas entregas sugeridas ao Codex (ainda NÃO implementar neste MVP)

Siga a ordem e faça um commit por etapa:

1. **Refinar a Tela 01:** substituir desenhos provisórios por artes autorizadas, separar poses de entrada/sentado/óculos e ajustar composição desktop/mobile. Não alterar texto aprovado.
2. **Tela 02:** criar `src/scenes/backstage/BackstageScene.tsx` com balões sequenciais e pequenas reações do Snoopy e Woodstock. Usar GSAP e respeitar movimento reduzido. Avançar por claquete.
3. **Tela 03:** `FilmingScene`: seleção `drama|action`, animações diferentes e preservação de estado no App. Evitar novos formulários.
4. **Tela 04:** `ScreeningScene`: replay curto da escolha, quintal ao entardecer, projetor, piada `Detalhes de pós-produção.` e destaque pulseirinha `OI`.
5. **Tela 05:** `FinaleScene`: placa, protesto fora de cena, Woodstock entrega envelope, interação para abrir.
6. **Tela 06:** `LetterScene`: papel manuscrito responsivo, texto de `SCRIPT.letter`, botão reiniciar.

## Regras de arquitetura
- Manter textos em `src/content/script.ts`; caminhos de imagens em `src/config/assets.ts`.
- Não espalhar strings fixas nos componentes de UI.
- Evitar dependência de imagens com texto embutido.
- Não acrescentar etapas, telas, personagens ou diálogos sem aprovação.
- Acessibilidade: botões HTML semânticos; alt significativo só quando necessário; `prefers-reduced-motion`; nenhum áudio automático.
- React StrictMode: preferir `useGSAP` com `scope`; limpar efeitos no desmontar.
- As artes externas pendentes de licença não devem ser publicadas antes da autorização.
