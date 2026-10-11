# Prompt para aplicar a reforma no projeto

Cole o texto abaixo no agente que tem acesso ao repositório do site e disponibilize este kit completo.

---

Reforme o projeto existente da La Cabane à Mousse usando o kit de mudança V3 fornecido. Implemente as alterações no repositório atual, mantendo sua arquitetura e seguindo suas instruções. Primeiro identifique a stack, a página inicial, os componentes do hero, estilos, listeners de animação e pasta de assets. Não crie outro projeto em paralelo.

Leia README.md, 06-roteiros/01-ROTEIRO-DA-MUDANCA.md, 02-HERO-E-ANIMACAO.md, CONTEUDO-FR.md, 07-integracao/MAPA-DE-SUBSTITUICAO.json e INTEGRACAO.md. Use as maquetes apenas como referência visual; os textos e botões devem ser elementos HTML reais. O estudo 08-estudo/index.html, portal.css e portal.js é a referência funcional.

Troque completamente o hero antigo e a animação de cerveja despejada entre duas pessoas. Remova seus componentes, callbacks e estilos da página ativa. A nova campanha mostra amigos adultos brindando com três garrafas rotuladas com a logo da empresa. Use brinde-cinematographique.png no desktop e brinde-mobile.png no mobile. Título em francês: LE GOÛT / D’ÊTRE / ENSEMBLE. Apoio: Des bières à découvrir. Des amis à retrouver. CTA Entrer dans la Cabane leva ao bar; Louer une tireuse leva à locação.

Baseie a estética no bar real: grafite #191918, carvão #292824, madeira #8A5F35, cerveja #F3B43F, laranja #E67F22 e espuma #F5EBDD. Mantenha a logo existente. Integre a fonte condensada local com sua licença. Elimine os tokens verdes anteriores do tema ativo. Preserve a legibilidade e o caráter convidativo do bar, com fotos reais e luz âmbar.

Implemente três capítulos ao scroll: campanha e título; isolamento das garrafas em grosso plano; abertura para a foto original da sala. Adapte motionAt() do estudo à stack. O PNG de primeiro plano é um grosso plano independente: faça fade do fundo para evitar duplicação de garrafas. No mobile, esconda esse PNG e mantenha a imagem portrait. Respeite prefers-reduced-motion, botão de desativação, scroll nativo e acesso direto aos CTAs. Não instale outra biblioteca de animação se a atual for suficiente. Limpe listeners e requestAnimationFrame no ciclo de vida do componente.

Use todas as quatro fotos reais do kit: salle-originale.png na revelação, comptoir-original.png em Le bar, facade-terrasse-originale.png em La terrasse e cave-originale.png em La cave. Preserve os masters e cadre os elementos de interface das capturas na apresentação, usando a provenance-photos.json. Não substitua o bar real por ambiente ou estoque gerado.

Organize a página em hero, assinatura, bar/comptoir, terrasse, cave, location de tireuses, actualités, contact e footer. Use os textos franceses do kit. A locação deve mostrar os passos Votre date, Vos envies, On en parle e levar ao telefone. Não invente preços, modelos, disponibilidade ou agenda. Os dados confirmados e destinos estão em dados.json; confira o link social e horários antes da publicação.

Use Scrolltide como inspiração de princípios — Firnlight, Aperture e Cinder — conforme a documentação do kit. Não copie templates, código ou assets. O link Chez Tonton não pôde ser inspecionado; não afirme ter seguido seu movimento exato sem receber a gravação. Não reintroduza a composição antiga por causa dessa pendência.

Todo conteúdo público deve ser francês, inclusive menu, alt, controles, labels e mensagens. Verifique desktop largo, notebook baixo, tablet e mobile de 320, 390 e 430 px, sem corte de títulos nem overflow horizontal. Teste navegação, links, menu, foco, movimento reduzido, recortes e a passagem entre capítulos. Execute os checks exigidos pelo repositório e revise o resultado em navegador real.

Conclua a implementação, apresente preview revisável e informe o que mudou, os checks executados e as limitações. Não publique além da autorização existente para o projeto.

---
