# Configuration Firebase pour WW3

## Étape 1 : Créer un projet Firebase

1. Allez sur https://console.firebase.google.com/
2. Cliquez sur "Ajouter un projet"
3. Nom du projet : `WW3-Alliance` (ou autre)
4. Désactivez Google Analytics (pas nécessaire)
5. Créez le projet

## Étape 2 : Activer Authentication

1. Dans le menu, cliquez sur "Authentication"
2. Cliquez sur "Commencer"
3. Activez "E-mail/Mot de passe"
4. Allez dans l'onglet "Users"
5. Ajoutez vos admins (email + mot de passe)

## Étape 3 : Activer Realtime Database

1. Dans le menu, cliquez sur "Realtime Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez un emplacement (europe-west1)
4. **Mode test** pour commencer (à sécuriser après)

## Étape 4 : Récupérer la configuration

1. Paramètres du projet (icône engrenage) > Paramètres du projet
2. Descendez jusqu'à "Vos applications"
3. Cliquez sur l'icône Web `</>`
4. Copiez les valeurs de `firebaseConfig`

## Étape 5 : Configurer le projet

Remplacez les valeurs dans `admin.html` et `firebase-config.js` :
```javascript
const firebaseConfig = {
  apiKey: "VOTRE_VALEUR",
  authDomain: "VOTRE_VALEUR",
  projectId: "VOTRE_VALEUR",
  storageBucket: "VOTRE_VALEUR",
  messagingSenderId: "VOTRE_VALEUR",
  appId: "VOTRE_VALEUR",
  databaseURL: "VOTRE_VALEUR"
};
```

## Étape 6 : Tester

1. Ouvrez `admin.html` dans le navigateur
2. Connectez-vous avec un email créé dans Authentication
3. Ajoutez une unité de test

## Prochaine étape

Une fois Firebase configuré, je modifierai les pages air.html, terre.html et naval.html pour charger les données depuis Firebase.
