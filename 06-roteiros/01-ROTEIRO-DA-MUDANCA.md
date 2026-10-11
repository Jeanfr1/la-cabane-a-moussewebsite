# Roteiro para reformar o projeto existente

Este roteiro aplica a direção V3 ao site La Cabane à Mousse já existente. O kit contém os arquivos de referência e os assets; as mudanças no repositório do site ainda precisam ser implementadas.

## 1. Localizar e preparar a implementação

Identificar o framework, a página inicial, os componentes do hero, o sistema de estilos, a animação atual e a pasta pública de imagens. Seguir as instruções do repositório. Criar uma branch de reforma e registrar o estado atual. Manter os links de contato e dados confirmados. Se já houver uma biblioteca de animação, reutilizá-la; o estudo do kit usa JavaScript nativo e não exige instalar outra.

## 2. Importar a identidade e os assets

Copiar os masters indicados em `07-integracao/MAPA-DE-SUBSTITUICAO.json` para a pasta pública apropriada. Adaptar os caminhos ao framework. Os caminhos sugeridos usam `public/cabane-v3/`; não são uma imposição de estrutura.

Manter a logo da empresa. Aplicar os tokens: grafite `#191918`, carvão `#292824`, madeira `#8A5F35`, cerveja `#F3B43F`, laranja `#E67F22`, espuma `#F5EBDD`. Usar a fonte condensada local e manter sua licença. Retirar a paleta verde anterior das superfícies, botões, títulos e fundos do site.

## 3. Substituir o hero por completo

Remover da página a composição de pessoa despejando cerveja e pessoa recebendo o líquido. Desativar também seu SVG de fluxo, máscaras, coordenadas, estilos e callbacks de animação.

Inserir a campanha de amigos brindando com garrafas rotuladas. Desktop usa `brinde-cinematographique.png`; mobile usa `brinde-mobile.png`. O título e os botões são HTML vivo, conforme `02-HERO-E-ANIMACAO.md`. As imagens `hero-desktop.jpg` e `hero-mobile.jpg` são maquetes com textos: não usá-las como substituto do hero funcional.

## 4. Implementar a nova animação

Aplicar os três capítulos do roteiro e a progressão de `motionAt()` do estudo. Desktop: campanha → primeiro plano → sala real. Mobile: campanha portrait → sala real, sem o primeiro plano independente. Manter scroll nativo, movimento reduzido e acesso direto às seções.

Revisar o registro dos listeners. Em React ou outro framework com ciclo de vida, remover listeners e cancelar o requestAnimationFrame pendente ao desmontar o componente. Não conservar o loop da animação anterior junto ao novo.

## 5. Refazer as seções com as fotos do bar

Ordem: hero; assinatura; bar/comptoir; fachada/terrasse; cave; locação; atualidades; contato; footer.

| Área | Arquivo real | Conteúdo |
| --- | --- | --- |
| Revelação do hero | `salle-originale.png` | Sala real ao final do movimento |
| Le bar | `comptoir-original.png` | Madeira, luminárias, balcão e encontro |
| La terrasse | `facade-terrasse-originale.png` | Fachada e área externa reais |
| La cave | `cave-originale.png` | Apresentação real da seleção |

As quatro fotos estão em `04-photos-originales`. Preservar os masters e realizar o recorte na apresentação. `provenance-photos.json` documenta as áreas úteis. A campanha do hero não deve substituir as fotos reais das seções.

Locação: três passos — Votre date, Vos envies, On en parle — e botão de telefone. Não inventar preços, equipamentos ou disponibilidade. Atualidades: link social documentado, sem anúncio antigo como futuro. Contato: telefone, endereço, horários e mapa de `dados.json`.

## 6. Revisar conteúdo e finalizar

Aplicar `CONTEUDO-FR.md`. Todo texto público deve ser francês, incluindo menu mobile, botões de animação, alt, legendas, erros e mensagens de formulário que já existirem. As instruções internas deste kit podem permanecer em português.

Validar desktop largo, notebook de altura curta, tablet e mobile de 320, 390 e 430 px. Conferir título sem corte, rótulos visíveis, fotos sem interface da captura, links, menu, foco, movimento reduzido e o salto direto para as seções. Executar os checks exigidos pelo repositório e revisar o resultado em navegador real.

Pesquisar referências aos assets e callbacks antigos antes de remover arquivos não utilizados. A comparação visual com Chez Tonton está pendente de uma gravação, pois o acesso ao link foi recusado. Isso não exige reintroduzir a composição antiga. A adaptação das descrições públicas do Scrolltide está em `00-referencias/SCROLLTIDE.md`.

Entregar a alteração com resumo do que mudou, validações executadas e preview revisável. Publicar somente dentro do fluxo autorizado do projeto.
