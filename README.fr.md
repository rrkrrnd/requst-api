# Client Requst

Requst Client est un outil web puissant et intuitif qui vous permet d'envoyer des requêtes API, de visualiser les réponses, de gérer l'historique des requêtes et de les sauvegarder sous forme de collections.

## Fonctionnalités

### 1. Gestion des requêtes et des réponses

- **Création de requêtes**: Créez des requêtes API en sélectionnant une méthode HTTP (GET, POST, PUT, DELETE, etc.) et en saisissant l'URL de la requête.
- **Corps de la requête**: Prend en charge les corps de requête au format JSON, avec une fonction pratique de formatage JSON.
- **Gestion des en-têtes**: Ajoutez, modifiez, activez/désactivez les en-têtes de requête sous forme de paires clé-valeur.
- **Authentification**: Prend en charge l'authentification par jeton Bearer.
- **Paramètres de requête**: Gérez et activez/désactivez facilement les paramètres de requête sous forme de paires clé-valeur.
- **En-têtes globaux**: Définissez et gérez les en-têtes globaux qui sont automatiquement appliqués à toutes les requêtes.
- **Visualisation des réponses**: Affiche clairement le code d'état de la réponse, le texte d'état, le temps de réponse, les en-têtes et le corps de vos requêtes. Le corps de la réponse est automatiquement converti au format JSON pour une meilleure lisibilité.

### 2. Gestion et organisation des données

- **Collections**: Sauvegardez et gérez les requêtes fréquemment utilisées sous forme de collections.
- **Regroupement**: Organisez systématiquement les requêtes en les regroupant au sein de collections.
- **Glisser-déposer**: Réorganisez facilement les requêtes et les groupes au sein des collections par glisser-déposer.
- **Filtrage**: Recherchez rapidement des requêtes dans les collections et l'historique par nom ou URL.
- **Historique**: Sauvegarde automatiquement un enregistrement de toutes les requêtes envoyées, vous permettant de recharger facilement les requêtes précédentes ou de les sauvegarder dans des collections.
- **Exportation/Importation de données**: Exportez ou importez tout votre historique de requêtes, collections, en-têtes globaux et paramètres d'interface utilisateur sous forme de fichier JSON, ce qui facilite la sauvegarde et la restauration de vos données.

### 3. Interface utilisateur et paramètres

- **Interface utilisateur intuitive**: Fournit une interface propre et facile à utiliser pour rationaliser le processus de test d'API.
- **Thèmes**: Personalisez votre expérience utilisateur en choisissant parmi différents thèmes d'interface utilisateur.

## Utilisation

### 1. Configuration et exécution du projet

Pour exécuter le projet dans votre environnement local, suivez ces étapes :

```bash
# 1. Cloner le dépôt
git clone https://github.com/your-username/requst-client.git
cd requst-client

# 2. Installer les dépendances
npm install

# 3. Exécuter l'application
npm start
```

L'application s'exécutera sur `http://localhost:3000` (ou un autre port disponible).

### 2. Envoi de requêtes API

1.  **Saisir l'URL et la méthode**: Dans le panneau "Requête", saisissez l'URL de l'API que vous souhaitez interroger et sélectionnez la méthode HTTP (GET, POST, etc.) dans le menu déroulant.
2.  **Configurer les détails de la requête**:
    - **Corps**: Pour les requêtes POST, PUT, saisissez le corps de la requête au format JSON dans l'onglet "Corps". Cliquez sur le bouton "Formater JSON" pour formater le corps pour une meilleure lisibilité.
    - **En-têtes**: Dans l'onglet "En-têtes", ajoutez les en-têtes de requête nécessaires sous forme de paires clé-valeur.
    - **Auth**: Dans l'onglet "Auth", saisissez le jeton Bearer.
    - **Requête**: Dans l'onglet "Requête", ajoutez les paramètres de requête URL sous forme de paires clé-valeur.
    - **En-têtes globaux**: Dans l'onglet "En-têtes globaux", définissez les en-têtes globaux qui seront appliqués à toutes les requêtes.
3.  **Envoyer la requête**: Cliquez sur le bouton "Envoyer" pour envoyer la requête API.
4.  **Visualiser la réponse**: Vérifiez la réponse (état, temps, en-têtes, corps) de votre requête dans le panneau "Réponse".

### 3. Gestion des collections et de l'historique

- **Collections**: Dans l'onglet "Collections", vous pouvez sauvegarder de nouvelles requêtes, ou modifier, supprimer et regrouper celles qui existent. Vous pouvez les réorganiser par glisser-déposer.
- **Historique**: Dans l'onglet "Historique", visualisez une liste des requêtes précédemment envoyées, cliquez pour les recharger dans le panneau de requête, ou sauvegardez-les dans des collections.

### 4. Modification des paramètres

- Cliquez sur l'icône d'engrenage en haut de l'application pour ouvrir la fenêtre modale "Paramètres".
- **Thèmes**: Sélectionnez le thème d'interface utilisateur souhaité dans le menu déroulant "Sélectionner le thème".
- **Gestion des données**: Dans la section "Gestion des données", cliquez sur "Exporter les données" pour sauvegarder toutes vos données, ou sur "Importer les données" pour restaurer les données précédemment sauvegardées.
