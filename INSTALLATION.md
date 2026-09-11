# Mise en place de Firebase et GitHub Pages

## 1. Créer le projet Firebase de Lucie

1. Ouvrir https://console.firebase.google.com/ avec ton compte Google.
2. Créer un projet nommé « Révisions Lucie ». L’identifiant proposé doit être distinct de `revisions-leo`.
3. Google Analytics n’est pas nécessaire pour ce site : il peut rester désactivé.
4. Dans l’accueil du projet, ajouter une application Web (icône `</>`), nommée « Site révisions Lucie ». Firebase Hosting n’est pas nécessaire, car le site sera sur GitHub Pages.
5. Copier l’objet `firebaseConfig` affiché (apiKey, authDomain, projectId, appId, etc.). Tu peux me transmettre cet objet Web pour que je le mette en place. Ce n’est ni ton mot de passe Google ni une clé privée de compte de service.

Source : https://firebase.google.com/docs/web/setup

## 2. Activer l’identification

Dans Authentication → Commencer → Méthode de connexion, activer **Anonyme** et enregistrer. Le code crée alors un identifiant pour ce navigateur, sans demander de mot de passe.

Un compte anonyme ne suit pas automatiquement Lucie d’un appareil à l’autre. Effacer les données du navigateur peut faire perdre l’accès au compte anonyme. Pour un accès partagé téléphone/ordinateur, nous pourrons ajouter ensuite un vrai moyen de connexion et lier le compte anonyme existant.

Source : https://firebase.google.com/docs/auth/web/anonymous-auth

## 3. Créer la base de données

1. Ouvrir Firestore Database → Créer une base de données.
2. Choisir l’édition Standard et la base par défaut. Choisir une région européenne adaptée, puis le mode Production.
3. Dans l’onglet Règles, remplacer le contenu par celui de `firestore.rules` de ce dossier et cliquer Publier.

Ces règles autorisent chaque compte à lire et écrire uniquement son propre journal dans `users/{uid}/events`. Les autres chemins restent interdits. Ne pas reprendre les règles de Léo : son identifiant administrateur et sa structure sont différents.

Source : https://firebase.google.com/docs/firestore/quickstart

## 4. Brancher le site

Dans `firebase-config.js`, remplacer `null` par l’objet Firebase, en conservant `export const firebaseConfig = ...;`. Ne pas ajouter d’imports ni de deuxième `initializeApp` : ils sont déjà dans `suivi.js`.

Dans Authentication → Paramètres → Domaines autorisés, ajouter le domaine GitHub Pages (par exemple `ton-compte.github.io`, sans chemin). Ajouter `localhost` pour les essais locaux si nécessaire.

Les résultats locaux existants sont envoyés au projet de Lucie dès la première connexion réussie. Après une synchronisation réussie, le site affiche le message motivant « Vas-y Dany est là pour t'aider et te soutenir!!! ». En cas d’échec, les résultats restent en attente sur cet appareil.

## 5. Créer le dépôt et publier sur GitHub Pages

La publication se fera après validation du site et choix du compte GitHub.

1. Créer le dépôt `Revisions_Lucie` sur ton compte GitHub.
2. Envoyer les fichiers du site. Le dossier `sources/` et les fichiers `.DS_Store` sont ignorés par `.gitignore` et ne doivent pas être ajoutés de force.
3. Dans Settings → Pages, choisir « Deploy from a branch », la branche principale, et le dossier `/ (root)`.
4. Enregistrer et attendre que GitHub affiche l’adresse publiée. Le fichier `.nojekyll` permet de servir directement ce site statique.
5. Ajouter le domaine publié aux domaines Firebase, comme indiqué ci-dessus.

Ne pas utiliser l’upload manuel de tout le dossier avec ses photos : l’interface Web n’applique pas automatiquement les exclusions Git comme le ferait un ajout via Git.

Source : https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 6. Vérification après connexion à Firebase

- Répondre Faux à une fiche : elle apparaît dans Mon espace et dans Firestore.
- Recharger la page : les scores restent présents.
- Supprimer une notion, puis toute la liste : les scores restent présents.
- Répondre à nouveau Faux : la notion revient.
- Couper puis rétablir la connexion : les réponses en attente se synchronisent sans doublon.
- Tester avec un autre navigateur : il doit avoir son propre profil et ne doit pas voir les données du premier.

Ces vérifications réelles restent à faire après création du projet ; aucun service Firebase distant n’est encore configuré.
