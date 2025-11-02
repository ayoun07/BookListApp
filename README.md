# 📚 BookListApp

Une application simple pour gérer une liste de livres.

## ✨ Fonctionnalités principales

- **Créer des livres** : Ajoutez facilement de nouveaux livres à votre liste
- **Afficher la liste des livres** : Consultez tous les livres disponibles
- **Afficher un livre par ID** : Récupérez et affichez les détails d'un livre spécifique via son identifiant
- **Mettre à jour les livres** : Modifiez les informations d'un livre existant
- **Basée sur Expo** : Développée avec Expo pour un déploiement facile sur Android et iOS

## ⚙️ Prérequis et dépendances

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- **Node.js** (version ≥ 16.0) – [https://nodejs.org/](https://nodejs.org/)
- **npm** (inclus avec Node.js)
- **Expo CLI** :
```bash
  npm install -g expo-cli
```
- **Expo Go** (application mobile) : installez-la sur votre appareil iOS ou Android, ou configurez un émulateur Android
- **TypeScript** (globalement) :
```bash
  npm install -g typescript
```

## 🚀 Installation et configuration

Suivez les étapes ci-dessous pour installer et exécuter le projet :

### 1. Cloner le dépôt
```bash
git clone 
cd BookListApp/Frontend
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Démarrer le serveur de développement Expo
```bash
npx expo start
```

Cela ouvrira un QR code dans votre terminal.

### 4. Exécuter l'application

- **Avec Expo Go** : scannez le QR code avec l'application Expo Go sur votre téléphone
- **Avec un émulateur Android** : si un émulateur est configuré, appuyez sur `a` dans le terminal pour lancer l'app
- **Build de développement** : vous pouvez aussi créer une version native grâce au processus de build d'Expo (voir la [documentation officielle d'Expo](https://docs.expo.dev/))

## 💡 Exemples d'utilisation & documentation API

### ➕ Création d'un livre

Le composant `BookCreate.tsx` fournit une interface pour créer de nouveaux livres.  
Il utilise un formulaire pour collecter les informations, puis envoie une requête POST à l'API backend.

### 📖 Affichage de la liste des livres

Le composant `BookList.tsx` affiche tous les livres récupérés depuis l'API.  
Il utilise le hook `useQuery` de `@tanstack/react-query` pour gérer la récupération et la mise en cache des données efficacement.

### 🔍 Affichage d'un livre par ID

Le composant `BookListById.tsx` récupère et affiche les détails d'un livre spécifique à partir de son ID.  
Il combine `useQuery` avec `useParams` de React Navigation pour obtenir l'identifiant du livre et effectuer la requête correspondante.

### ✏️ Mise à jour d'un livre

Le composant `BookUpdate.tsx` permet de modifier un livre existant.  
Il récupère les données du livre, les affiche dans un formulaire, puis envoie une requête PUT ou PATCH à l'API pour enregistrer les changements.

## 🌐 Client API

Le fichier `Frontend/api/apiClient.ts` configure le client Axios utilisé pour communiquer avec le backend.  
L'URL de base (`baseURL`) est définie par défaut sur `http://localhost:3000`.
```typescript
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
```

Axios est utilisé ici pour effectuer toutes les requêtes HTTP (GET, POST, PUT, DELETE, etc.).

## ⚙️ Options de configuration

**URL du backend** :  
L'adresse du serveur backend est définie dans `Frontend/api/apiClient.ts` (champ `baseURL`).  
Modifiez-la si nécessaire pour pointer vers un serveur distant ou de production.

## 🤝 Contribution

Les contributions au projet BookListApp sont les bienvenues !

Pour contribuer :

1. Forkez le dépôt
2. Créez une branche pour votre fonctionnalité ou correction :
```bash
   git checkout -b feature/ma-fonctionnalite
```
3. Implémentez vos changements
4. Ajoutez des tests si nécessaire
5. Soumettez une Pull Request claire et descriptive

Merci de respecter les conventions de code du projet.

## 📜 Licence

Aucune licence spécifique n'est indiquée pour ce projet.  
Tous les droits sont réservés par le propriétaire du dépôt.

## 🙏 Remerciements

- Utilisation de [Expo](https://expo.dev/) pour le développement multiplateforme
- Utilisation de [React Navigation](https://reactnavigation.org/) pour la gestion des écrans
- Utilisation de [React Query](https://tanstack.com/query) pour la gestion des requêtes et du cache
- Utilisation de [Axios](https://axios-http.com/) pour les appels HTTP
