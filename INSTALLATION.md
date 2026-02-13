# Guide d'Installation Complet - Monument Visit App

## 🎯 Objectif
Ce guide vous accompagne pas à pas pour installer et lancer l'application Monument Visit sur votre machine.

## ⚠️ Prérequis Système

### Pour Tous
- **Node.js** version 16 ou supérieure
  - Télécharger : https://nodejs.org/
  - Vérifier : `node --version`
- **npm** (inclus avec Node.js) ou **yarn**
  - Vérifier : `npm --version`

### Pour Android
- **Java Development Kit (JDK)** version 11
  - Télécharger : https://www.oracle.com/java/technologies/downloads/
- **Android Studio**
  - Télécharger : https://developer.android.com/studio
  - Configurer Android SDK (API Level 31 minimum)
  - Configurer les variables d'environnement :
    ```bash
    # Windows
    ANDROID_HOME = C:\Users\VotreNom\AppData\Local\Android\Sdk
    
    # macOS/Linux
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```

### Pour iOS (Mac uniquement)
- **Xcode** version 12 ou supérieure
  - Télécharger depuis l'App Store
- **CocoaPods**
  - Installer : `sudo gem install cocoapods`

## 📥 Installation de l'Application

### Étape 1 : Installation des dépendances

```bash
# Se placer dans le dossier du projet
cd MonumentVisitApp

# Installer les dépendances npm
npm install

# OU avec yarn
yarn install
```

### Étape 2 : Configuration de Google Maps (IMPORTANT)

L'application utilise Google Maps et nécessite une clé API.

#### 2.1 Obtenir une clé API Google Maps

1. Aller sur https://console.cloud.google.com/
2. Créer un nouveau projet ou sélectionner un projet existant
3. Activer les APIs suivantes :
   - Maps SDK for Android
   - Maps SDK for iOS
4. Aller dans "Identifiants"
5. Cliquer sur "Créer des identifiants" > "Clé API"
6. Copier la clé générée

#### 2.2 Configuration pour Android

Éditer le fichier `android/app/src/main/AndroidManifest.xml` :

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:theme="@style/AppTheme">
        
        <!-- AJOUTER ICI -->
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="VOTRE_CLE_API_ICI"/>
        <!-- FIN -->
        
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

#### 2.3 Configuration pour iOS (Mac uniquement)

1. Installer les pods :
```bash
cd ios
pod install
cd ..
```

2. Éditer le fichier `ios/MonumentVisitApp/AppDelegate.mm` :

```objc
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <GoogleMaps/GoogleMaps.h>  // AJOUTER

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"VOTRE_CLE_API_ICI"];  // AJOUTER
  
  self.moduleName = @"MonumentVisitApp";
  self.initialProps = @{};
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// ... reste du code
@end
```

## 🚀 Lancement de l'Application

### Option 1 : Lancer sur Android

#### Avec un appareil physique
1. Activer le mode développeur sur votre téléphone Android
2. Activer le débogage USB
3. Connecter le téléphone via USB
4. Vérifier la connexion : `adb devices`
5. Lancer l'app :
```bash
npm run android
```

#### Avec un émulateur
1. Ouvrir Android Studio
2. Ouvrir "Device Manager"
3. Créer ou démarrer un émulateur (API 31+)
4. Lancer l'app :
```bash
npm run android
```

### Option 2 : Lancer sur iOS (Mac uniquement)

#### Avec un simulateur
```bash
npm run ios
```

#### Avec un appareil physique
1. Ouvrir le fichier `ios/MonumentVisitApp.xcworkspace` dans Xcode
2. Sélectionner votre appareil dans la liste
3. Cliquer sur le bouton "Play" ou Cmd+R

### Démarrer Metro Bundler séparément
```bash
npm start
```

## 🎨 Utilisation de l'Application

### Écran Carte
- Voir tous les monuments sur une carte interactive
- Cliquer sur un marqueur pour voir les détails
- Ajouter un monument à votre calendrier

### Écran Monuments
- Parcourir la liste complète des monuments
- Rechercher par nom
- Filtrer par catégorie
- Voir horaires et tarifs

### Écran Calendrier
- Voir vos visites planifiées
- Marquer une visite comme complétée
- Supprimer des visites

## 🐛 Résolution des Problèmes Courants

### Problème : "Metro Bundler failed to start"
```bash
npm start -- --reset-cache
```

### Problème : Build Android échoue
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Problème : Pods iOS ne s'installent pas
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Problème : "Command not found: react-native"
```bash
npm install -g react-native-cli
```

### Problème : La carte ne s'affiche pas
- Vérifier que la clé API Google Maps est correctement configurée
- Vérifier que les APIs Maps sont activées dans Google Cloud Console
- Vérifier les permissions de localisation

### Problème : Erreur de compilation Android
1. Ouvrir Android Studio
2. File > Invalidate Caches / Restart
3. Rebuild le projet

## 📱 Tester l'Application

### Tests manuels
1. Ouvrir l'écran Carte → Vérifier les marqueurs
2. Cliquer sur un marqueur → Modal doit s'ouvrir
3. Ajouter au calendrier → Vérifier dans l'écran Calendrier
4. Marquer comme complété → La couleur doit changer
5. Rechercher un monument → Filtrage doit fonctionner

## 🔄 Mise à Jour des Dépendances

```bash
# Mettre à jour toutes les dépendances
npm update

# Mettre à jour React Native
npx react-native upgrade

# Réinstaller les pods iOS
cd ios && pod update && cd ..
```

## 📚 Ressources Utiles

- **Documentation React Native** : https://reactnative.dev/
- **React Navigation** : https://reactnavigation.org/
- **React Native Maps** : https://github.com/react-native-maps/react-native-maps
- **Google Maps Platform** : https://developers.google.com/maps

## 💡 Conseils

1. Toujours démarrer Metro Bundler avant de lancer l'app
2. Utiliser `npm start -- --reset-cache` en cas de problème de cache
3. Garder Android Studio / Xcode à jour
4. Vérifier les logs avec `adb logcat` (Android) ou Xcode Console (iOS)

## ✅ Checklist de Vérification

- [ ] Node.js installé (v16+)
- [ ] Android Studio / Xcode installé
- [ ] Variables d'environnement configurées
- [ ] Dépendances npm installées
- [ ] Clé API Google Maps configurée
- [ ] Émulateur / Appareil connecté
- [ ] Application compilée sans erreur
- [ ] Carte s'affiche correctement
- [ ] Navigation fonctionne entre les écrans

---

**Besoin d'aide ?** Consultez les logs d'erreur et cherchez dans la documentation officielle React Native.

**Bon développement ! 🎉**
