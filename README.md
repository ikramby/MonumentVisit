# Application Mobile Monument Visit 🏛️

Application React Native pour planifier et gérer vos visites de monuments avec carte interactive et calendrier.

## 📱 Fonctionnalités

### 🗺️ Carte Interactive
- Affichage des monuments sur une carte Google Maps
- Marqueurs cliquables pour voir les détails
- Ajout rapide au calendrier depuis la carte

### 📅 Calendrier de Visites
- Visualisation des visites planifiées
- Marquage des dates avec visites
- Statut des visites (planifié / complété)
- Suppression et modification des visites

### 📋 Liste des Monuments
- Liste détaillée de tous les monuments
- Recherche par nom ou description
- Filtrage par catégorie
- Informations complètes (horaires, tarifs, description)

## 🚀 Installation

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn
- React Native CLI
- Android Studio (pour Android) ou Xcode (pour iOS)

### Étapes d'installation

1. **Installer les dépendances**
```bash
cd MonumentVisitApp
npm install
```

2. **Configuration pour Android**
```bash
# Installer les pods pour iOS (Mac uniquement)
cd ios
pod install
cd ..
```

3. **Configuration de Google Maps (Important)**

Pour Android, ajoutez votre clé API Google Maps dans `android/app/src/main/AndroidManifest.xml` :
```xml
<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="VOTRE_CLE_API_GOOGLE_MAPS"/>
</application>
```

Pour iOS, ajoutez votre clé API dans `ios/MonumentVisitApp/AppDelegate.mm` :
```objc
#import <GoogleMaps/GoogleMaps.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"VOTRE_CLE_API_GOOGLE_MAPS"];
  // ...
}
```

**Obtenir une clé API Google Maps :**
1. Allez sur https://console.cloud.google.com/
2. Créez un nouveau projet
3. Activez l'API "Maps SDK for Android" et "Maps SDK for iOS"
4. Créez des identifiants (clé API)

## 🏃 Lancer l'application

### Android
```bash
npm run android
```

### iOS (Mac uniquement)
```bash
npm run ios
```

### Metro Bundler
```bash
npm start
```

## 📦 Structure du Projet

```
MonumentVisitApp/
├── App.js                          # Composant principal et navigation
├── src/
│   ├── screens/
│   │   ├── MapScreen.js           # Écran carte avec markers
│   │   ├── CalendarScreen.js      # Écran calendrier
│   │   └── MonumentsListScreen.js # Liste des monuments
│   ├── components/                 # Composants réutilisables
│   ├── navigation/                 # Configuration navigation
│   └── utils/                      # Utilitaires
├── android/                        # Configuration Android
├── ios/                           # Configuration iOS
└── package.json
```

## 🎨 Personnalisation

### Ajouter des monuments

Modifiez le fichier `src/screens/MapScreen.js` et `src/screens/MonumentsListScreen.js` pour ajouter vos propres monuments dans le tableau `MONUMENTS_DATA` :

```javascript
{
  id: '8',
  name: 'Votre Monument',
  description: 'Description du monument',
  latitude: 48.8566,
  longitude: 2.3522,
  category: 'Monument historique',
  horaires: '9h - 18h',
  tarif: '10€',
}
```

### Modifier les couleurs

Les couleurs principales sont définies dans les styles de chaque écran. Thème actuel :
- Couleur principale : `#2196F3` (bleu)
- Succès : `#4CAF50` (vert)
- Erreur : `#f44336` (rouge)

## 🔧 Dépendances Principales

- **react-native** : Framework mobile
- **react-navigation** : Navigation entre écrans
- **react-native-maps** : Intégration Google Maps
- **react-native-calendars** : Composant calendrier
- **@react-native-async-storage/async-storage** : Stockage local

## 📝 Fonctionnalités à Développer

- [ ] Authentification utilisateur
- [ ] Synchronisation cloud
- [ ] Notes personnelles sur les visites
- [ ] Photos des visites
- [ ] Partage d'itinéraires
- [ ] Notifications de rappel
- [ ] Mode hors ligne
- [ ] Statistiques des visites

## 🐛 Dépannage

### Erreur de build Android
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Erreur de pods iOS
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Metro Bundler bloqué
```bash
npm start -- --reset-cache
```

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Développement

Créé avec React Native - Framework de développement mobile multiplateforme.

---

**Bon développement ! 🚀**
