# Le coin révisions de Lucie

Site statique adapté du modèle de Léo, prévu pour GitHub Pages. Une catégorie : Physique-Chimie, avec 39 fiches E1 et 37 fiches L1.

## Utilisation

Une fiche pose une question. La solution reste masquée jusqu’à « Vérifier ». « Bon » ou « Faux » enregistre une seule réponse ; « Question suivante » poursuit la séance. Les réponses déjà notées sont conservées même en quittant une séance inachevée. Recharger une page démarre une nouvelle séance, sans effacer l’historique. Une séance est comptée dès sa première réponse notée.

« Mon espace » affiche les totaux Bon/Faux, le taux de réussite pondéré par réponse, les séances, le temps actif, les résultats par chapitre, les dernières réponses et les notions à retravailler. Il permet de renommer le profil et d’ajouter une photo.

Une réponse Faux ajoute la notion à « À retravailler ». Une réponse Bon la retire. Chaque ligne dispose de « Supprimer ». Le bouton global vide la liste après confirmation, sans supprimer les scores ni les séances. Une nouvelle erreur remet la notion dans la liste. Cliquer une notion lance la révision des erreurs du chapitre en commençant par cette notion.

## État actuel

- Le site fonctionne sans configuration Firebase, avec une sauvegarde sur ce navigateur.
- Firebase est connecté : authentification anonyme, écriture, récupération des résultats et séparation des utilisateurs vérifiées. Pour la configuration, voir [INSTALLATION.md](INSTALLATION.md).
- Le suivi anonyme est lié au navigateur. Un même prénom sur deux appareils ne fusionne pas les résultats. L’association d’appareils et le tableau de bord administrateur de Léo ne sont pas portés dans cette première version ; ils demandent une décision sur les comptes et les accès.
- Les photos originales restent dans `sources/`, exclu du dépôt et de la publication. Les schémas du site sont redessinés en SVG et les textes retranscrits.
- Certaines photos sont partiellement cadrées ou rangées dans l’autre chapitre : voir [SOURCES.md](SOURCES.md).
- Aucune publication GitHub n’a encore été effectuée ; la connexion réelle à Firebase a été validée avec un profil de test séparé.

## Organisation

- `index.html` : accueil.
- `Physique_Chimie/E1.html`, `Physique_Chimie/L1.html` : les deux pages.
- `chapitres.js` : contenu des fiches, identifiants stables et provenance.
- `schemas.js` : schémas pédagogiques.
- `revision.js` : parcours de révision.
- `espace.js` : espace personnel.
- `suivi.js` : journal local et synchronisation Firebase ; chaque événement a un identifiant stable pour éviter les doublons lors des réessais.
- `firebase-config.js`, `firestore.rules`, `firebase.json` : configuration à compléter et règles d’accès.

## Aperçu local

Depuis le dossier du site, lancer `python3 -m http.server 8768`, puis ouvrir `http://localhost:8768`. Utiliser un serveur HTTP, pas un double-clic sur les fichiers HTML, car le site utilise des modules JavaScript.

Pas de compilation ni de dépendance npm. Le SDK Firebase est chargé depuis le CDN uniquement lorsque le projet est configuré. Il ne faut jamais utiliser la configuration Firebase de Léo.
