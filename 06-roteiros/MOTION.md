# Animação principal · pessoa acima → boca aberta abaixo

## Mecânica visual
A base é **cena-sem-fluxo.png**, com as duas pessoas, garrafa rotulada e boca aberta. O estado final é **hero-mobile.png**. O estudo revela a fotografia final dentro de uma máscara que acompanha o corredor da bebida; por isso os pontos de saída do gargalo e de chegada à boca permanecem na mesma coordenada. Ao concluir a queda, um crossfade para a foto final inteira integra o splash da boca e da barba.
Este é o gesto solicitado na referência. Não há copo no hero.

## Coordenadas da cena nativa
Canvas 1024 × 1536. Gargalo: aproximadamente (755, 795). Boca recebendo: aproximadamente (790, 1135). O SVG usa o mesmo viewBox em qualquer tamanho. Nunca usar object-fit: cover na cena principal; ele pode remover uma das pessoas. Usar meet/contain e reservar texto na área livre à esquerda.

## Timeline
0–15% · entrada da composição, ambas as pessoas visíveis; título e CTA disponíveis.
15–25% · preparação: aproximação da cena inteira 1.00→1.025, sem mexer em braços ou separar a pessoa da garrafa. Nenhuma rotação artificial de anatomia.
25–60% · o líquido aparece a partir do gargalo, avançando até a boca; máscara vertical com extensão de 490 px sobre o corredor fotográfico. Destacar o percurso com uma linha de brilho discreta, sem deslocar o fluxo.
60–75% · contato: integrar o splash na boca e o estado final via crossfade, 450–650 ms na implementação.
75–90% · leitura da marca e conexão completa mantida por um breve beat; fotografia inteira com brilho de sol.
90–100% · liberar o capítulo de amizade, sem bloquear a ação de contato.

## Estudo interativo
08-estudo/index.html usa rolagem normal para atualizar a progressão, slider manual e leitura de 12 segundos. Play pode ser pausado, não repete automaticamente. Os controles permanecem fora da foto. A composição mobile mantém as duas pessoas e a conexão; não substitui a ação por garrafa e copo.
A demo é animação 2D com fotografia e máscara, não vídeo de pessoas se movimentando e não simulação 3D de cerveja. Para vídeo final, filmar/renderizar atores e líquido com o mesmo enquadramento e preservar o rótulo.

## Camadas opcionais
Pessoa superior, pessoa inferior e fluxo transparente são recortes gerados para variações de montagem. Não são máscaras pixel a pixel da foto-mestre; use a dupla base/final do estudo para preservar alinhamento exato. O fluxo isolado tem extensão diferente e requer alinhamento manual pelos pontos de boca/gargalo.

## Acessibilidade e performance
prefers-reduced-motion: estado final estático, ambas as pessoas presentes, sem sticky prolongado. Slider com label e output; botões com foco, play/pause, suspensão ao ocultar aba. Conteúdo textual fora da imagem. requestAnimationFrame e transform/opacity; evitar scroll-jacking.
Na implementação, derivar WebP/AVIF e limitar hero prioritário. Não carregar todas as campanhas no primeiro frame.
