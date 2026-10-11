# Roteiro de implementação do hero e da animação

## Hero inicial

**Identidade:** a logo existente da Cabane; grafite, madeira, luz âmbar e espuma. O hero é uma cena de amigos adultos brindando com três garrafas que trazem a logo.

**Imagem desktop:** `03-hero/brinde-cinematographique.png`.

**Imagem mobile:** `03-hero/brinde-mobile.png`.

**Título em HTML, com três linhas:**

```text
LE GOÛT
D’ÊTRE
ENSEMBLE.
```

**Eyebrow:** HERBIGNAC · CAVE & BAR À BIÈRES EN BRIÈRE

**Apoio:** Des bières à découvrir. Des amis à retrouver.

**CTA principal:** Entrer dans la Cabane → seção Le bar.

**CTA secundário:** Louer une tireuse → seção de locação.

Desktop: texto à esquerda e brinde à direita. Mobile: o brinde aparece acima, com texto e ações na região inferior escura. Carregar o asset portrait até 850 px, como no `<picture>` do estudo. A fonte está em `08-estudo/fonts`. Adaptar dimensões ao layout real para evitar cortes em telas pequenas e de altura curta.

## Progressão ao rolar

| Progresso | Capítulo | Implementação |
| --- | --- | --- |
| 0–18% | Le rendez-vous | Campanha, título e CTAs visíveis; zoom discreto começa |
| 18–37% | Passagem para Le tchin | Texto perde opacidade; campanha faz fade; primeiro plano entra no desktop |
| 37–64% | Le tchin | Três garrafas em primeiro plano, aproximação leve e brilho âmbar breve |
| 64–76% | Abertura | Foto real da sala aparece em uma abertura central |
| 76–100% | La vraie Cabane | A abertura chega à tela inteira e conduz às seções reais |

Fonte funcional: `08-estudo/portal.js`, função `motionAt(p)`. Fonte de estilo: variáveis CSS e classes de `08-estudo/portal.css`. A timeline descritiva está em `07-integracao/timeline.json`.

O progresso usa a posição da seção e a distância útil de scroll: `p = clamp(-rect.top / max(sectionHeight - viewportHeight, 1), 0, 1)`. A cena sticky ocupa aproximadamente uma tela. A seção tem referência de 190vh no desktop e 165vh no mobile; conferir as alturas mínimas e ajustar ao site existente.

## Uso correto dos assets

`05-camadas/brinde-premier-plan.png` é um grosso plano independente com alfa. Não tem alinhamento pixel a pixel com o fundo. O fade deve apagar a campanha antes de manter o primeiro plano em destaque; não deixar dois grupos de garrafas permanentemente sobrepostos.

No mobile, esconder esse primeiro plano e manter a campanha portrait durante a aproximação. A revelação da sala real continua ativa.

`04-photos-originales/salle-originale.png` deve aparecer ao final. Usar o enquadramento documentado para esconder os controles da captura. Não gerar outra sala para esse trecho.

## Controles e acessibilidade

- Scroll nativo e CTA utilizável desde o início.
- Botão “Désactiver l’animation”, com estado acessível.
- Quando desativada, hero estático completo.
- Com `prefers-reduced-motion`, hero estático e nenhum movimento forçado. No estudo, o botão mostra “Mouvement réduit”.
- Menu mobile com `aria-expanded`, fechamento por Échap e retorno do foco.
- Sem som automático, sem scroll hijacking e sem animação infinita em segundo plano.

## Inspirações e limites

Scrolltide: Firnlight inspira o isolamento do sujeito; Aperture, a abertura do enquadramento; Cinder, a luz âmbar e a força tipográfica. São adaptações de princípios descritos publicamente, com assets e código próprios. O efeito deste kit é uma composição 2D, não um filme de pessoas se movimentando nem uma rotação 3D das garrafas.

Chez Tonton: referência solicitada, comparação exata pendente de gravação após recusa de acesso ao link. Não afirmar reprodução ou análise visual daquela animação.

`apercu-animation.mp4` é uma prévia de composição para entender a sequência. A implementação ao scroll deve seguir o estudo HTML, não usar o vídeo de apresentação como hero pronto.
