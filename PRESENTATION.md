# 🏛️ Monument Visit - Application Mobile React Native

## 📱 Présentation de l'Application

**Monument Visit** est une application mobile multiplateforme (iOS/Android) développée avec React Native qui permet aux utilisateurs de :
- 🗺️ Visualiser des monuments sur une carte interactive
- 📅 Planifier et gérer leurs visites dans un calendrier
- 📋 Consulter des informations détaillées sur chaque monument

---

## ✨ Fonctionnalités Principales

### 1. 🗺️ Carte Interactive (MapScreen)
**Fonctionnalités :**
- Affichage des monuments sur Google Maps
- Marqueurs personnalisés pour chaque monument
- Modal d'information au clic sur un marqueur
- Bouton rapide "Ajouter au calendrier"
- Navigation fluide sur la carte

**Technologies utilisées :**
- `react-native-maps` pour l'intégration Google Maps
- Gestion des permissions de localisation
- Marqueurs cliquables avec coordonnées GPS

### 2. 📅 Calendrier de Visites (CalendarScreen)
**Fonctionnalités :**
- Visualisation mensuelle des visites planifiées
- Marqueurs colorés par statut (planifié/complété)
- Liste des visites pour la date sélectionnée
- Toggle pour marquer une visite comme complétée
- Suppression de visites avec confirmation
- Légende des couleurs

**Technologies utilisées :**
- `react-native-calendars` pour le composant calendrier
- `AsyncStorage` pour la persistance locale des données
- Gestion d'état avec React Hooks

### 3. 📋 Liste des Monuments (MonumentsListScreen)
**Fonctionnalités :**
- Liste complète de tous les monuments
- Barre de recherche en temps réel
- Filtres par catégorie (Monument historique, Musée, Église, Château)
- Cartes d'information avec :
  - Nom du monument
  - Catégorie
  - Description
  - Horaires d'ouverture
  - Tarifs
- Modal détaillée pour chaque monument
- Ajout rapide au calendrier

**Technologies utilisées :**
- FlatList optimisée pour les performances
- Filtrage et recherche en temps réel
- ScrollView horizontal pour les filtres

---

## 🎨 Design et Interface Utilisateur

### Palette de Couleurs
- **Primaire** : #2196F3 (Bleu moderne)
- **Succès** : #4CAF50 (Vert)
- **Erreur** : #f44336 (Rouge)
- **Fond** : #f5f5f5 (Gris clair)
- **Texte principal** : #333333
- **Texte secondaire** : #666666

### Principes de Design
- **Material Design** : Utilisation des ombres et élévations
- **Navigation intuitive** : Bottom tabs pour accès rapide
- **Modals** : Pour les informations détaillées
- **Feedback visuel** : Animations et états interactifs
- **Lisibilité** : Typographie claire et hiérarchisée

---

## 📦 Architecture du Projet

```
MonumentVisitApp/
│
├── App.js                          # Point d'entrée principal
│   ├── NavigationContainer         # Conteneur de navigation
│   └── Bottom Tabs Navigator       # Navigation par onglets
│
├── src/
│   └── screens/
│       ├── MapScreen.js            # Écran carte
│       │   ├── MapView             # Carte Google Maps
│       │   ├── Markers             # Marqueurs des monuments
│       │   └── Modal               # Détails monument
│       │
│       ├── CalendarScreen.js       # Écran calendrier
│       │   ├── Calendar            # Composant calendrier
│       │   ├── FlatList            # Liste des visites
│       │   └── Legend              # Légende des statuts
│       │
│       └── MonumentsListScreen.js  # Liste monuments
│           ├── SearchBar           # Barre de recherche
│           ├── Category Filters    # Filtres par catégorie
│           ├── FlatList            # Liste scrollable
│           └── Modal               # Détails complets
│
├── android/                        # Configuration Android
├── ios/                           # Configuration iOS
└── package.json                   # Dépendances
```

---

## 🔧 Technologies et Dépendances

### Core
- **React Native 0.73** : Framework principal
- **React 18.2** : Bibliothèque UI

### Navigation
- **@react-navigation/native** : Système de navigation
- **@react-navigation/bottom-tabs** : Navigation par onglets
- **@react-navigation/stack** : Navigation par pile

### Fonctionnalités
- **react-native-maps** : Intégration Google Maps
- **react-native-calendars** : Composant calendrier
- **@react-native-async-storage/async-storage** : Stockage local

### UI/UX
- **react-native-safe-area-context** : Gestion des zones sûres
- **react-native-screens** : Optimisation des écrans
- **react-native-gesture-handler** : Gestion des gestes

---

## 💾 Gestion des Données

### Structure de Données

#### Monument
```javascript
{
  id: string,
  name: string,
  description: string,
  latitude: number,
  longitude: number,
  category: string,
  horaires: string,
  tarif: string
}
```

#### Visite (stockée dans AsyncStorage)
```javascript
{
  id: string,
  monumentId: string,
  monumentName: string,
  date: string (ISO format),
  status: 'planifié' | 'complété'
}
```

### Persistance
- Utilisation d'**AsyncStorage** pour le stockage local
- Données conservées même après fermeture de l'app
- Chargement automatique au démarrage

---

## 🚀 Points Forts de l'Application

### 1. **Performance**
- FlatList pour le rendu optimisé des listes
- Chargement asynchrone des données
- Navigation fluide entre les écrans

### 2. **Expérience Utilisateur**
- Interface intuitive et moderne
- Feedback visuel immédiat
- Confirmation pour les actions destructives
- Messages d'état clairs (succès/erreur)

### 3. **Maintenabilité**
- Code structuré et modulaire
- Séparation des écrans
- Styles encapsulés par composant
- Commentaires et documentation

### 4. **Évolutivité**
- Architecture extensible
- Facile d'ajouter de nouveaux monuments
- Possibilité d'intégrer une API backend
- Prêt pour authentification utilisateur

---

## 🎯 Cas d'Usage

### Scénario 1 : Touriste planifiant son séjour
1. Ouvre l'app et consulte la carte
2. Explore les différents monuments disponibles
3. Sélectionne ceux qui l'intéressent
4. Les ajoute à son calendrier pour organiser ses journées

### Scénario 2 : Utilisateur local découvrant sa ville
1. Navigue dans la liste des monuments
2. Utilise les filtres pour trouver des musées
3. Lit les descriptions et horaires
4. Planifie une visite pour le weekend

### Scénario 3 : Gestion des visites complétées
1. Consulte son calendrier
2. Marque les monuments visités comme "complétés"
3. Visualise son historique de visites

---

## 🔮 Évolutions Possibles

### Court Terme
- [ ] Ajouter plus de monuments
- [ ] Intégrer des photos pour chaque monument
- [ ] Ajouter un système de favoris
- [ ] Implémenter la géolocalisation de l'utilisateur

### Moyen Terme
- [ ] Backend avec API REST
- [ ] Authentification utilisateur
- [ ] Synchronisation cloud
- [ ] Partage d'itinéraires entre utilisateurs
- [ ] Notifications de rappel

### Long Terme
- [ ] Mode hors ligne complet
- [ ] Réalité augmentée pour les visites
- [ ] Guides audio
- [ ] Statistiques et gamification
- [ ] Support multilingue
- [ ] Intégration réseaux sociaux

---

## 📊 Statistiques du Projet

- **Lignes de code** : ~1500+
- **Écrans** : 3 principaux
- **Composants réutilisables** : Multiples
- **Monuments inclus** : 7 (exemple de Paris)
- **Temps de développement estimé** : 2-3 jours

---

## 🎓 Apprentissages Clés

Ce projet démontre la maîtrise de :
- React Native et ses composants natifs
- Navigation entre écrans multiples
- Intégration de cartes interactives
- Gestion d'état avec Hooks
- Persistance de données locale
- UI/UX design moderne
- Architecture d'application mobile

---

## 📝 Notes Techniques

### Performance
- Utilisation de `React.memo` possible pour optimiser le rendu
- FlatList avec `keyExtractor` pour performance optimale
- Chargement asynchrone des images (si ajoutées)

### Sécurité
- Clé API Google Maps à sécuriser en production
- Validation des entrées utilisateur
- Gestion des permissions système

### Tests
- Tests unitaires à implémenter avec Jest
- Tests d'intégration avec React Native Testing Library
- Tests E2E avec Detox

---

## 🏆 Conclusion

**Monument Visit** est une application mobile complète et fonctionnelle qui démontre :
- Une architecture solide et maintenable
- Une interface utilisateur moderne et intuitive
- L'intégration de technologies avancées (Maps, Calendrier)
- La gestion d'état et de données persistantes
- Un design responsive et adapté au mobile

L'application est prête à être utilisée et peut facilement être étendue avec de nouvelles fonctionnalités selon les besoins des utilisateurs.

---

**Développé avec ❤️ en React Native**
