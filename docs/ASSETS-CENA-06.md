# Tela 06 — A cartinha | Inventário de assets

## Direção criativa preservada
Abertura delicada de um bilhetinho após o Snoopy entregar o envelope; final sincero e **sem pressionar a visitante a responder**. Manter o mesmo quintal ao entardecer, mas desfocado/discreto, sem montar cenário novo. O texto da carta será **HTML verdadeiro**, centralizado em `src/content/script.ts`; não colocar conteúdo da carta dentro de ilustrações.

## Novos assets (5 arquivos)

| Arquivo sob `public/assets/` | Papel no roteiro | Obrigatório? |
|---|---|---|
| `props/envelope-open-empty.webp` | Após clicar no envelope fechado da Cena 05, mostrar envelope aberto e animar a carta saindo | **Sim** |
| `props/envelope-open-with-letter.webp` | Quadro intermediário da abertura, se a troca não causar duplicidade de folhas | Opcional |
| `props/letter-paper-illustration.webp` | Pequena folha durante a animação de extração; não é um fundo adequado para parágrafos longos | Opcional |
| `characters/snoopy/snoopy-woodstock-letter-cameo.webp` | Vinheta pequena no rodapé da carta, nunca competindo com o texto | **Sim** (decorativo) |
| `effects/heart-doodle.webp` | Coração desenhado discreto, no máximo uma ocorrência | Opcional |

> Todos os WebP possuem transparência. Foram recortados e ampliados a partir de ilustrações geradas; o aumento de pixels não adiciona detalhes que não existiam na fonte. Use o tamanho de exibição com moderação.

## Reutilizar (já presentes no projeto)
- `public/assets/props/envelope-closed-heart.webp` da Cena 05 — início da transição.
- Quintal do entardecer e casinha vermelha da Cena 04 — fundo sutil.
- Componentes de balões, tipografia, botões e animações GSAP já aprovados.
- Não é preciso criar novos personagens para a carta nem gerar outra pose inteira do Snoopy.

## Composição recomendada
1. Iniciar com envelope fechado da Tela 05 (ou continuar visualmente dele ao trocar de tela).
2. Cruzar para `envelope-open-empty.webp` e fazer uma folha subir, usando máscara/overflow e GSAP. Se usar a variante com papel visível, **não duplicar** outra folha no mesmo momento.
3. Transicionar para um cartão real de HTML/SCSS em papel creme, com largura máxima confortável, linhas de texto reais e rolagem natural; **não esticar a pequena ilustração da folha para servir de fundo de todo o texto.**
4. Usar a vinheta Snoopy+Woodstock pequena no rodapé e, no máximo, um coração desenhado.
5. Após a assinatura, exibir só "Assistir novamente". Sem formulário, sem botão de resposta e sem avaliações.

## Conteúdo provisório da carta, a confirmar antes da implementação

> Oi! ♡

Sou eu, a responsável por essa produção cinematográfica absolutamente desnecessária. KKKKK

A verdade é que achei que seria engraçado criar tudo isso pra quebrar o gelo. A gente sempre acaba nos mesmos rolês, mas quase nunca conversa.

Queria mudar isso e te conhecer um pouquinho melhor, se você também tiver vontade.

E, se não, tudo bem! Pelo menos espero que esse pequeno filme tenha rendido uma risadinha. :)

Com carinho,
a pessoa que poderia simplesmente ter dito oi. ❤️

Pode alterar essa versão antes do prompt final. **Não utilizar linguagem técnica**, não transformar em declaração romântica e não criar piadas posteriores à assinatura.

## Acessibilidade e animação
- `prefers-reduced-motion`: abrir e revelar imediatamente a carta, sem depender do GSAP.
- Permitir leitura sem texto digitando letra por letra.
- Boa largura, contraste e tipografia a partir de 320px, com scroll natural.
- Envelope e "Assistir novamente" são os únicos controles; receber foco por teclado.
- Não substituir o texto HTML por imagem, mesmo que haja papel ilustrado.
- Não adicionar fontes externas novas sem necessidade.

## Direitos
As imagens são protótipos inspirados em personagens protegidos; não substituem autorização para uso público. A decisão sobre deploy permanece condicionada à licença em análise.
