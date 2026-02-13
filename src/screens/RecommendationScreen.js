import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationService from '../utils/LocationService';

const MONUMENTS_DATA = [
  {
    id: '1',
    name: 'Tour Eiffel',
    description: 'Monument emblématique de Paris, construit en 1889',
    latitude: 48.8584,
    longitude: 2.2945,
    category: 'Monument historique',
    horaires: '9h30 - 23h45',
    tarif: '26€',
  },
  {
    id: '2',
    name: 'Arc de Triomphe',
    description: 'Monument commémoratif au centre de la Place Charles de Gaulle',
    latitude: 48.8738,
    longitude: 2.2950,
    category: 'Monument historique',
    horaires: '10h - 22h30',
    tarif: '13€',
  },
  {
    id: '3',
    name: 'Notre-Dame de Paris',
    description: 'Cathédrale gothique située sur l\'île de la Cité',
    latitude: 48.8530,
    longitude: 2.3499,
    category: 'Édifice religieux',
    horaires: 'En restauration',
    tarif: 'Gratuit',
  },
  {
    id: '4',
    name: 'Sacré-Cœur',
    description: 'Basilique située au sommet de la butte Montmartre',
    latitude: 48.8867,
    longitude: 2.3431,
    category: 'Édifice religieux',
    horaires: '6h - 22h30',
    tarif: 'Gratuit (Dôme: 6€)',
  },
  {
    id: '5',
    name: 'Musée du Louvre',
    description: 'Plus grand musée d\'art du monde',
    latitude: 48.8606,
    longitude: 2.3376,
    category: 'Musée',
    horaires: '9h - 18h (fermé mardi)',
    tarif: '17€',
  },
  {
    id: '6',
    name: 'Panthéon',
    description: 'Monument néoclassique abritant les tombeaux de grandes personnalités',
    latitude: 48.8462,
    longitude: 2.3464,
    category: 'Monument historique',
    horaires: '10h - 18h',
    tarif: '11.50€',
  },
  {
    id: '7',
    name: 'Versailles',
    description: 'Château royal célèbre pour la Galerie des Glaces',
    latitude: 48.8049,
    longitude: 2.1204,
    category: 'Château',
    horaires: '9h - 18h30 (fermé lundi)',
    tarif: '19.50€',
  },
];

const RecommendationScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const [nearbyMonuments, setNearbyMonuments] = useState([]);
  const [recommendedRoute, setRecommendedRoute] = useState(null);
  const [maxDistance, setMaxDistance] = useState(10); // km

  useEffect(() => {
    findNearbyMonuments();
  }, []);

  const findNearbyMonuments = async () => {
    setLoading(true);
    try {
      const result = await LocationService.getNearbyMonuments(
        MONUMENTS_DATA,
        maxDistance
      );

      if (result) {
        setUserPosition(result.userPosition);
        setNearbyMonuments(result.monuments);
        
        if (result.monuments.length > 0) {
          generateRoute(result.monuments);
        } else {
          Alert.alert(
            'Aucun monument à proximité',
            `Aucun monument trouvé dans un rayon de ${maxDistance} km. Essayez d'augmenter la distance.`
          );
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRoute = (monuments) => {
    const route = LocationService.generateOptimizedRoute(monuments, 5, 6);
    setRecommendedRoute(route);
  };

  const saveRouteToCalendar = async () => {
    try {
      const visits = await AsyncStorage.getItem('visits');
      const existingVisits = visits ? JSON.parse(visits) : [];
      
      const today = new Date().toISOString().split('T')[0];
      
      const newVisits = recommendedRoute.route.map((monument, index) => ({
        id: `${Date.now()}_${index}`,
        monumentId: monument.id,
        monumentName: monument.name,
        date: today,
        status: 'planifié',
        order: monument.order,
        estimatedArrival: monument.estimatedArrival,
      }));

      const updatedVisits = [...existingVisits, ...newVisits];
      await AsyncStorage.setItem('visits', JSON.stringify(updatedVisits));
      
      Alert.alert(
        'Itinéraire sauvegardé !',
        `${newVisits.length} monuments ajoutés à votre calendrier.`,
        [
          { 
            text: 'Voir le calendrier', 
            onPress: () => navigation.navigate('Calendrier') 
          },
          { text: 'OK' }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder l\'itinéraire');
    }
  };

  const renderMonumentCard = (monument) => (
    <View key={monument.id} style={styles.monumentCard}>
      <View style={styles.orderBadge}>
        <Text style={styles.orderText}>{monument.order}</Text>
      </View>
      
      <View style={styles.monumentInfo}>
        <Text style={styles.monumentName}>{monument.name}</Text>
        <Text style={styles.monumentCategory}>{monument.category}</Text>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>
            📍 {monument.distanceFormatted} de vous
          </Text>
          <Text style={styles.detailText}>
            ⏱️ {monument.visitDuration}h de visite
          </Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>
            🚶 {monument.travelTime} min de trajet
          </Text>
          <Text style={styles.detailText}>
            🕐 Arrivée: {monument.estimatedArrival}
          </Text>
        </View>

        <View style={styles.practicalInfo}>
          <Text style={styles.infoText}>🕒 {monument.horaires}</Text>
          <Text style={styles.infoText}>💰 {monument.tarif}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>
          Recherche des monuments à proximité...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* En-tête avec position */}
        {userPosition && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>📍 Votre Position</Text>
            <Text style={styles.headerCoords}>
              {userPosition.latitude.toFixed(4)}, {userPosition.longitude.toFixed(4)}
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={findNearbyMonuments}>
              <Text style={styles.refreshButtonText}>🔄 Actualiser</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Résumé de l'itinéraire */}
        {recommendedRoute && (
          <View style={styles.routeSummary}>
            <Text style={styles.routeTitle}>🗺️ Itinéraire Recommandé</Text>
            
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {recommendedRoute.totalMonuments}
                </Text>
                <Text style={styles.summaryLabel}>Monuments</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {recommendedRoute.totalDuration}h
                </Text>
                <Text style={styles.summaryLabel}>Durée totale</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {recommendedRoute.totalDistance}km
                </Text>
                <Text style={styles.summaryLabel}>Distance</Text>
              </View>
            </View>
          </View>
        )}

        {/* Liste des monuments */}
        {recommendedRoute && (
          <View style={styles.monumentsList}>
            <Text style={styles.sectionTitle}>📋 Votre Programme</Text>
            {recommendedRoute.route.map(renderMonumentCard)}
          </View>
        )}

        {/* Message si aucun monument */}
        {!loading && nearbyMonuments.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Aucun monument à proximité</Text>
            <Text style={styles.emptyMessage}>
              Essayez d'augmenter la distance de recherche
            </Text>
            <View style={styles.distanceSelector}>
              {[5, 10, 20, 50].map(distance => (
                <TouchableOpacity
                  key={distance}
                  style={[
                    styles.distanceButton,
                    maxDistance === distance && styles.distanceButtonActive
                  ]}
                  onPress={() => {
                    setMaxDistance(distance);
                    setTimeout(findNearbyMonuments, 100);
                  }}>
                  <Text style={[
                    styles.distanceButtonText,
                    maxDistance === distance && styles.distanceButtonTextActive
                  ]}>
                    {distance} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bouton de sauvegarde */}
      {recommendedRoute && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveRouteToCalendar}>
            <Text style={styles.saveButtonText}>
              💾 Sauvegarder l'itinéraire
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerCoords: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  refreshButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: '#2196F3',
    fontWeight: '600',
    fontSize: 14,
  },
  routeSummary: {
    backgroundColor: '#2196F3',
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  routeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  monumentsList: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  monumentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  monumentInfo: {
    flex: 1,
  },
  monumentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  monumentCategory: {
    fontSize: 12,
    color: '#2196F3',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  practicalInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  distanceSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  distanceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: 'white',
  },
  distanceButtonActive: {
    backgroundColor: '#2196F3',
  },
  distanceButtonText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  distanceButtonTextActive: {
    color: 'white',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecommendationScreen;