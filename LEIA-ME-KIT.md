# La Cabane à Mousse — KIT PARA APLICAR A MUDANÇA V3

Este pacote reúne os assets da nova direção e as instruções para reformar o site existente. Inclui o kit completo de imagens, logo, maquetes, vídeo, guia visual, textos franceses, dados e estudo funcional, mais o roteiro de migração e o prompt de implementação.

A reforma no repositório do site não foi aplicada por este pacote. Ele é a entrega para o agente ou desenvolvedor que tem acesso ao projeto existente.

## Comece por aqui

1. Extraia este ZIP em uma pasta nova e abra `catalogo.html` para ver a direção e a prévia da animação.
2. Abra `08-estudo/index.html` para navegar no estudo funcional ao scroll.
3. Leia `06-roteiros/01-ROTEIRO-DA-MUDANCA.md` para a ordem das alterações.
4. Leia `06-roteiros/02-HERO-E-ANIMACAO.md` para executar o novo hero e os três capítulos.
5. Entregue o kit inteiro ao agente do projeto e cole `06-roteiros/03-PROMPT-PARA-IMPLEMENTAR.md`.
6. Use `07-integracao/MAPA-DE-SUBSTITUICAO.json` para importar os assets e retirar as referências da versão anterior.

## O que muda no projeto

| Parte | Mudança |
| --- | --- |
| Tema | Grafite, madeira, metal, luz âmbar e espuma, baseados no bar real |
| Hero | Amigos brindando com três garrafas que trazem a logo da Cabane |
| Animação | Cena com amigos → garrafas em destaque → abertura para a sala real |
| Bar e cave | Quatro fotografias originais do local, enquadradas na apresentação |
| Mobile | Campanha portrait e percurso reduzido, com navegação acessível |
| Conteúdo | Todo texto público em francês |
| Locação | Três etapas e contato direto; condições a confirmar com a equipe |

O hero anterior, as pessoas vertendo cerveja, o fluxo de líquido e seus callbacks deixam de fazer parte da página ativa. A logo da empresa e os dados confirmados continuam sendo a referência. A maquete de página não deve virar uma imagem única do site: textos, links e controles permanecem HTML.

## Arquivos que orientam a implementação

- `01-ROTEIRO-DA-MUDANCA.md`: sequência de migração no projeto existente.
- `02-HERO-E-ANIMACAO.md`: enquadramento, textos, progressão, mobile e movimento reduzido.
- `03-PROMPT-PARA-IMPLEMENTAR.md`: prompt completo para o agente do repositório.
- `CONTEUDO-FR.md` e `SECTIONS.md`: textos e ordem da página.
- `07-integracao/MAPA-DE-SUBSTITUICAO.json`: assets novos, destinos sugeridos e elementos antigos a retirar.
- `07-integracao/dados.json`, `provenance-photos.json` e `timeline.json`: dados, origem das fotos e sequência de movimento.
- `08-estudo/index.html`, `portal.css` e `portal.js`: estudo de referência funcional.

Os três primeiros roteiros estão em `06-roteiros`. As instruções internas estão em português; o conteúdo do site está em francês.

## Assets e documentação incluídos

Logo PNG transparente; palette; campanha desktop/mobile; primeiro plano com alfa; quatro fontes fotográficas reais; maquetes desktop/mobile; storyboard; prévia MP4 de sete segundos; guia visual PDF de dez páginas; referências; textos; dados; fonte local com licença; inventário e controle de integridade.

As fotos originais são capturas fornecidas pelo cliente, preservadas sem reescrever pixels. O recorte de exibição esconde a interface. A campanha do hero foi gerada e não representa clientes, funcionários ou uma linha de cerveja própria. O logo PNG disponível é uma reconstrução da marca fornecida; preferir o master oficial se recebido.

## Referências e pontos pendentes

Scrolltide inspira princípios de isolamento do sujeito, abertura de enquadramento e luz âmbar, documentados em `00-referencias/SCROLLTIDE.md`. Os assets e o código são próprios. Chez Tonton continua como referência solicitada, mas a comparação exata depende de uma gravação após a recusa de acesso ao link.

Confirmar horários excepcionais, URL social e condições da locação antes de publicar. Revisar em navegador real no projeto de destino. O estudo e os arquivos passaram nas verificações documentadas; não são uma publicação do site.

`INDEX-DU-KIT.md` lista todos os arquivos. `MANIFESTO-SHA256.json` permite verificar sua integridade. As imagens e o guia mantêm a direção V3; esta entrega acrescenta os roteiros para implementar a mudança.
