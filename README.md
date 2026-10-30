# tampermonkey-scripts

Collection de scripts utilisateur (« userscripts ») pour [Tampermonkey](https://www.tampermonkey.net/), qui modifient des sites web directement dans le navigateur.

| Script | Site | Rôle |
| --- | --- | --- |
| [Gamekyo Modern](gamekyo/gamekyo-modern.user.js) | gamekyo.com | Refonte moderne du site, mode sombre, responsive |
| [Twitch Ad Auto-Mute](twitch/twitch-ad-mute.user.js) | twitch.tv | Coupe le son pendant les pubs et le remet ensuite |

## Installation

1. Installer l'extension Tampermonkey pour votre navigateur depuis [tampermonkey.net](https://www.tampermonkey.net/) (Chrome, Firefox, Edge, Safari, Opera).
2. Sur Chrome et Edge, activer le **mode développeur** dans la page des extensions (requis par Tampermonkey depuis Manifest V3).
3. Cliquer sur le lien d'installation du script voulu ci-dessous : Tampermonkey ouvre une page de confirmation, cliquer sur **Installer**.

### Mises à jour automatiques

Chaque script déclare `@updateURL` / `@downloadURL` pointant vers ce dépôt. S'il a été installé via son lien « raw », Tampermonkey vérifie régulièrement s'il existe une nouvelle version (on peut forcer la vérification depuis le tableau de bord : *Utilitaires → Rechercher des mises à jour*).

Une mise à jour n'est proposée que si le numéro `@version` augmente : penser à l'incrémenter à chaque modification.

---

## Gamekyo Modern

**[Installer](https://raw.githubusercontent.com/maximehuran/tampermonkey-scripts/main/gamekyo/gamekyo-modern.user.js)**

Modernise [gamekyo.com](https://www.gamekyo.com/) sans toucher à ses fonctionnalités :

- **Navigation** : barre fixe en haut avec logo, rubriques (section active en surbrillance), recherche et compte.
- **Mode sombre** : bouton soleil/lune. Par défaut le thème suit celui du système ; le choix manuel est mémorisé.
- **Responsive** : mise en page en 3, 2 puis 1 colonne selon la largeur, menu burger sur mobile (le site d'origine n'avait pas de balise viewport, le script l'ajoute).
- **Accueil** : diaporama avec titres, fil d'actus en cartes avec grandes vignettes, tuiles « populaires » et « avis ».
- **Images** : les vignettes 80×60 générées par le site sont remplacées par les images d'origine, avatars en meilleure résolution, chargement différé.
- **Articles** (news, vidéos, blogs, avis) : typographie lisible, temps de lecture, barre de progression, vidéos adaptées à la largeur, tags en pastilles, spoilers révélés au clic.
- **Commentaires et messages** : avatars ronds, bulles, formulaires modernisés.
- **Mode connecté** : menu compte dans la barre du haut (avatar, barre d'expérience, statut « défilante », liens vers ma page, profil, blog, amis, groupes, médias, messages, déconnexion), raccourcis « écrire un article » et « messages ».
- **Espace membre** : menu d'administration, fils d'activité, gestion des amis et groupes, édition du profil (champs modifiables au clic), galeries, messagerie.
- **Listes** (news, blogs, vidéos, tests) : notes en badges colorés (vert ≥ 8, orange ≥ 5, rouge en dessous).
- **Divers** : bouton retour en haut, liens externes dans un nouvel onglet.

Les publicités ne sont pas bloquées, seulement contenues pour ne pas casser la mise en page.

## Twitch Ad Auto-Mute

**[Installer](https://raw.githubusercontent.com/maximehuran/tampermonkey-scripts/main/twitch/twitch-ad-mute.user.js)**

Coupe le son quand une publicité démarre sur Twitch et le remet quand elle se termine. Une petite pastille « Pub en cours — son coupé » s'affiche pendant la pub.

Comportement :

- Le son est coupé via le bouton du lecteur Twitch, pour que l'interface reste synchronisée et que Twitch ne remette pas le son de lui-même.
- Le son n'est remis que si c'est le script qui l'avait coupé : si le stream était déjà muet, il le reste.
- Si vous remettez le son manuellement pendant une pub, le script n'y retouche plus jusqu'à la pub suivante.
- Fonctionne sur `www.twitch.tv`, `m.twitch.tv` et le lecteur intégré `player.twitch.tv`.

La détection repose sur des éléments de l'interface Twitch (libellé « Publicité », compte à rebours…). Twitch modifie régulièrement son site : si le script ne réagit plus, il faut mettre à jour la liste `AD_SELECTORS` en haut du fichier. Les messages `[Twitch Ad Auto-Mute]` dans la console du navigateur aident à vérifier qu'il détecte bien les pubs.
