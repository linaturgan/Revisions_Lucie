# Validation du site

Essais réalisés le 11 septembre 2026 dans Chrome (Playwright), en contexte de test isolé sans modifier les données du navigateur personnel.

- Parcours complet des fiches E1 et L1, affichage de chaque réponse et bilan de fin.
- Solution et boutons Bon/Faux masqués avant Vérifier ; une seule notation par fiche malgré un second clic programmatique.
- Conservation des résultats après rechargement, séances partielles conservées.
- Suppression individuelle et globale des notions à retravailler sans modifier les scores ; retour d’une notion après une nouvelle erreur ; retrait après une réponse Bon.
- Révision ciblée depuis la liste des erreurs ; renommage avec caractères HTML traité comme du texte.
- Affichage ordinateur et téléphone (390 × 844). Correction des longs titres avec le texte agrandi à 200 %.
- Schémas inspectés visuellement ; ils défilent horizontalement sur les petits écrans pour garder leurs légendes lisibles.
- JavaScript, liens locaux, identifiants uniques et correspondance de chaque source photographique vérifiés.
- Adaptateur Firebase simulé : écriture, interruption et reprise sans doublon. Cela ne valide pas un vrai projet Firebase ni l’exécution des règles Firestore.
- Outil WebMCP de révélation testé avec un registre simulé (entrée valide, entrée invalide, seconde révélation refusée). La prise en charge native n’était pas disponible dans le navigateur de test.

À effectuer après configuration : essais Firebase réels, vérification des règles d’accès entre deux utilisateurs et contrôle du site publié sur GitHub Pages. Aucun déploiement distant n’a été effectué.

## Validation réelle de Firebase

Le 11 septembre 2026, connexion au projet revisions-lucie avec des comptes anonymes de test :

- Authentification anonyme réussie.
- Profil « Test technique Codex », séance et réponse fictive écrits, puis relus directement depuis le serveur Firestore.
- Après suppression du journal local (identité Firebase conservée), récupération du résultat depuis Firebase.
- Réinitialisation des notions à retravailler synchronisée, sans effacer le score.
- Tentative de lecture du journal du premier compte depuis un deuxième compte : refus permission-denied, conformément aux règles.

Le profil de test et ses événements restent isolés sous users/G9yf0DFLSygrWD50nfmjxFQYcdz2. Deux comptes anonymes de test ont été créés ; ils ne modifient pas le profil personnel de Lucie. La validation après publication GitHub Pages reste à effectuer.
