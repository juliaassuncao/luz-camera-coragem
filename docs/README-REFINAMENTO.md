# Refinamento visual — Luz, câmera... coragem!

Este pacote adiciona **6 assets** gerados para o polimento das Cenas 01 a 06. Extraia no diretório raiz e **mescle as pastas**, sem remover os arquivos antigos.

## Uso recomendado

- `backgrounds/backyard-film-set-clean.webp`: substituto **seletivo** do fundo nas cenas em que a cadeira de diretor e a claquete seriam duplicadas. Preserva câmera vintage, caixote/megafone, casinha vermelha, arbustos e céu. Foi gerado novamente a partir da direção de arte; os pixels **não são idênticos** ao fundo original. Ajuste enquadramento e `object-position` antes de aprovar.
- `characters/woodstock/woodstock-envelope-walking.webp`: entrada lateral lenta e contínua de Woodstock, com GSAP.
- `characters/woodstock/woodstock-envelope-presenting.webp`: pose para pausa na entrega, sem invadir o espaço do Snoopy.
- `props/envelope-closed-clean.webp`: opcional para mostrar envelope independente, sem encaixá-lo na mão do Snoopy.
- `props/envelope-open-reference.webp`: somente referência/alternativa estática; a animação da abertura na Cena 06 deve ser feita com **HTML/CSS e GSAP**, evitando trocar várias imagens de envelopes.
- `props/friendship-bracelet-oi-swift.webp`: pulseira com letras **OI** e referência discreta à tradição das friendship bracelets de Taylor Swift, sem citações textuais adicionais. Exibir **somente na Cena 06**, próxima à carta.

## Observações técnicas

- Os PNGs transparentes foram convertidos para WebP **preservando alpha**; áreas vazias ao redor foram recortadas com margem.
- O fundo é uma imagem WebP opaca 1536×1024.
- Não utilizar um segundo envelope independente sobre o envelope já desenhado na mão do personagem. Se houver conflito, preservar uma camada só.
- Não incluir ilustrações novas de personagens feitas com CSS ou SVG. Para o envelope funcional da Cena 06, **HTML/CSS como estrutura animável** está permitido.
- Consulte `MANIFEST.csv` para dimensões e caminhos.
- Artes geradas para prototipagem; validar permissões dos personagens antes do deploy.
