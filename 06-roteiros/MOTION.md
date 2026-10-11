# Le rendez-vous → Le tchin → La vraie Cabane

Animation au défilement, originale pour cette marque. Le lien Chez Tonton demandé n’a pas pu être inspecté ; comparaison exacte en attente de capture vidéo.

| Progrès | Scène | Comportement |
| --- | --- | --- |
| 0–18 % | Le rendez-vous | Hero avec amis et bouteilles ; titre et actions lisibles |
| 18–37 % | Passage au gros plan | Le titre s’efface ; fondu de la campagne vers le premier plan transparent |
| 37–64 % | Le tchin | Les bouteilles s’approchent légèrement ; reflet ambré discret au contact |
| 64–76 % | La porte s’ouvre | La photo réelle de la salle apparaît dans une ouverture centrale |
| 76–100 % | La vraie Cabane | Le cadre s’élargit jusqu’au plein écran ; la salle conduit aux sections réelles |

Desktop : scène sticky d’environ une hauteur d’écran, section de 190vh. Le premier plan est un gros plan autonome, pas une extraction pixel-parfaite ; le fond disparaît au fondu. Mobile : 165vh, campagne portrait, déplacement réduit et sans calque indépendant. La salle réelle est révélée dans les deux cas.

`motionAt(p)` dans `08-estudo/portal.js` définit les états ; `timeline.json` les décrit. Les transformations sont un zoom, un fondu et un cadre qui s’ouvre, pas une simulation physique ni un film.

Le réglage système `prefers-reduced-motion` remplace la séquence par le hero statique. Le bouton de désactivation fait de même. Le système de défilement reste natif ; les actions fonctionnent dès l’état initial. Aucun son automatique. La scène n’empêche pas de passer directement au contenu.


## Inspiration complémentaire : Scrolltide

Descriptions publiques consultées : Firnlight (isolation du sujet), Aperture (ouverture du cadre), Cinder (lumière ambrée et typographie). Adaptation au scénario original de la Cabane : amis, bouteilles en gros plan, salle réelle. Voir `00-referencias/SCROLLTIDE.md` à la racine du kit. Aucun code, prompt premium ou asset copié ; il s’agit d’une composition 2D propre au projet.
