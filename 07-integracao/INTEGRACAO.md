# Intégration V3

L’étude est autonome : `08-estudo/index.html`, `portal.css` et `portal.js`. Aucun build, service externe, formulaire, compte ou abonnement n’est requis. Les images sont relatives au kit complet. Les textes sont en français et les liens de contact sont actifs.

## Sources photo et cadrages

Chaque photographie originale est incluse sans modification. Les éléments UI des captures sont masqués avec le conteneur `.source-frame` : largeur de source, décalages horizontal/vertical et rapport de cadre. `provenance-photos.json` fournit les rectangles utiles. Vérifier le résultat aux tailles finales. Ne pas utiliser les images de campagne pour représenter le stock réel ou les employés du lieu.

## Hero

Le `<picture>` charge la campagne portrait jusqu’à 850 px et le paysage au-dessus. Le titre est du texte HTML. Sur desktop, le fondu fait apparaître le premier plan autonome ; sur mobile il reste masqué. La révélation utilise la photo réelle de la salle. Les variables CSS sont pilotées par `motionAt()` au défilement avec un seul requestAnimationFrame en attente. Les callbacks de scroll sont passifs.

## Navigation

Ancres : accueil, bar, cave, tireuses, contact. Menu mobile avec aria-expanded et fermeture par Échap ; le focus revient au bouton. La désactivation du mouvement conserve le contenu et les actions. Le réglage système de mouvement réduit est prioritaire.

## Production

Optimiser les copies web du hero et des photos en conservant les masters. Vérifier contraste, focus, tactiles, recadrages, menu, ancrages, écran étroit, hauteur courte, mouvement réduit et liens externes. Confirmer les horaires exceptionnels, le lien Instagram et les modalités de location. Les coordonnées viennent des sources documentées.

Le kit est une livraison de direction et d’étude, sans déploiement. Les planches ne sont pas des captures de navigateur. La comparaison exacte avec le hero Chez Tonton reste en attente de capture vidéo : consultation du lien refusée par le navigateur.
