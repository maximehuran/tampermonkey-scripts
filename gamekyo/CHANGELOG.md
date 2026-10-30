# Changelog — Gamekyo Modern

Toutes les versions sont aussi publiées dans les [Releases](https://github.com/maximehuran/tampermonkey-scripts/releases).

## 1.4.1 — Notifications

### Nouveautés
- Notifications (requêtes, messages) en carte : icône, texte, membres en pastilles cliquables, bouton fermer.
- Pastille rouge sur l'icône Messages tant qu'une notification est affichée.
- Avatar du compte placé juste avant le menu burger (ordre : écrire, messages, thème, avatar).

### Corrections
- Notification centrée et mal découpée sur mobile.

## 1.4.0 — Réglages

### Nouveautés
- Panneau **Réglages** (bouton ⚙︎ dans la barre du haut, dans le menu burger sur mobile), appliqué en direct et mémorisé :
  - thème Automatique / Clair / Sombre ;
  - logo Classique, Minimal ou D'origine ;
  - taille du texte des articles (Normale, Grande, Très grande) ;
  - masquer la colonne de gauche et/ou de droite (le contenu principal s'élargit) ;
  - masquer des rubriques du menu (Accueil, News, Blogs, Vidéos, Tests) ;
  - CSS personnalisé, appliqué après celui du script.
- Compatibilité **Dark Reader** : en thème sombre, le script ajoute `darkreader-lock` pour éviter un double assombrissement ; en thème clair, Dark Reader reste libre d'agir.

## 1.3.0 — Finitions visuelles

### Nouveautés
- Logo aux couleurs historiques de Gamekyo (jaune sur bleu).
- Icônes de plateforme (MULTI, NS2, PS5…) plus discrètes.
- « Qui a aimé ? » affiché sur la même ligne que le bouton like.

### Corrections
- Bouton like, titre « Commentaires » et galerie d'un article collés au bord gauche.
- « Qui a aimé ? » affiché même sans aucun like.
- Petites icônes du site (commentaire, répondre, supprimer, tags, flèches) illisibles en mode sombre.
- Bloc Facebook blanc (module abandonné) : désormais masqué.

## 1.2.0 — Rédaction

### Nouveautés
- Aperçu en direct du BBCode : nouvel article, modification d'un article publié, commentaires, messages privés.
- Raccourcis Ctrl/Cmd + B / I / U.
- Sélecteur de smileys dans l'éditeur d'article.
- Compteur de caractères du titre, champ de texte qui s'agrandit avec le contenu.
- Barre d'outils BBCode modernisée.

### Corrections
- Survol des zones modifiables sur place (titre, texte, source) surligné en crème, rendant le texte illisible en mode sombre.

## 1.1.0 — Mode connecté

### Nouveautés
- Menu compte dans la barre du haut : avatar, barre d'expérience, statut « défilante », liens du compte, déconnexion.
- Raccourcis « Écrire un article » et « Messages ».
- Styles de l'espace membre : menu d'administration, fils d'activité, demandes et amis en ligne, gestion des amis et groupes, édition du profil, galeries, messagerie, autocomplétion.

### Corrections
- Bloc compte (avatar, expérience, statut) invisible une fois connecté.
- Bandeau vide en haut des pages de profil.
- Libellés du menu compte mal capitalisés.

## 1.0.0 — Première version

### Nouveautés
- Barre de navigation fixe avec recherche, design en cartes.
- Mode sombre avec bouton et mémorisation, suivi du thème système.
- Mise en page responsive (3 → 2 → 1 colonnes), menu burger, ajout de la balise viewport.
- Accueil : diaporama titré, fil d'actus en cartes, tuiles populaires et avis.
- Images en meilleure résolution, chargement différé.
- Articles : typographie, temps de lecture, barre de progression, vidéos responsives, spoilers au clic.
- Commentaires, listes, fiches jeu, profils, groupes et galeries modernisés.
- Notes en badges colorés, bouton retour en haut, liens externes dans un nouvel onglet.

### Corrections
- Messages en bulles (inscription, murs de profil, messagerie) au fond jaune illisible en mode sombre.
