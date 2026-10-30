# Twitch Ad Auto-Mute

**[Installer](https://raw.githubusercontent.com/maximehuran/tampermonkey-scripts/main/twitch/twitch-ad-mute.user.js)** · [Retour au dépôt](../README.md)

Coupe le son quand une publicité démarre sur Twitch et le remet quand elle se termine.

## Fonctionnalités

- **Coupure automatique** du son au début d'une pub, rétablissement à la fin.
- Passe par le **bouton du lecteur Twitch** : l'interface reste synchronisée et Twitch ne remet pas le son de lui-même quand la vidéo est remplacée après la pub.
- **Respecte vos choix** : le son n'est remis que si c'est le script qui l'avait coupé (un stream déjà muet le reste), et si vous remettez le son pendant une pub, le script n'y touche plus jusqu'à la suivante.
- **Pastille** « 🔇 Pub en cours — son coupé » affichée pendant la pub.
- Cible le lecteur principal (la plus grande vidéo de la page), pas les aperçus au survol.
- Réaction immédiate aux changements du lecteur, avec une vérification de secours chaque seconde.
- Fonctionne sur `www.twitch.tv`, `m.twitch.tv` et le lecteur intégré `player.twitch.tv`.

## Dépannage

La détection repose sur des éléments de l'interface Twitch (libellé « Publicité », compte à rebours…). Twitch modifie régulièrement son site : si le script ne réagit plus, il faut mettre à jour la liste `AD_SELECTORS` en haut du fichier.

Les messages `[Twitch Ad Auto-Mute]` dans la console du navigateur (F12) indiquent si une pub a bien été détectée.
