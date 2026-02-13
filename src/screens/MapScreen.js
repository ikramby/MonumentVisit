import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Données exemple de monuments
const MONUMENTS_DATA = [
  {
    id: '1',
    name: 'Tour Eiffel',
    description: 'Monument emblématique de Paris, construit en 1889',
    latitude: 48.8584,
    longitude: 2.2945,
    category: 'Monument historique',
  },
  {
    id: '2',
    name: 'Arc de Triomphe',
    description: 'Monument commémoratif au centre de la Place Charles de Gaulle',
    latitude: 48.8738,
    longitude: 2.2950,
    category: 'Monument historique',
  },
  {
    id: '3',
    name: 'Notre-Dame',
    description: 'Cathédrale gothique sur l\'île de la Cité',
    latitude: 48.8530,
    longitude: 2.3499,
    category: 'Édifice religieux',
  },
  {
    id: '4',
    name: 'Sacré-Cœur',
    description: 'Basilique située au sommet de la butte Montmartre',
    latitude: 48.8867,
    longitude: 2.3431,
    category: 'Édifice religieux',
  },
  {
    id: '5',
    name: 'Louvre',
    description: 'Plus grand musée d\'art du monde',
    latitude: 48.8606,
    longitude: 2.3376,
    category: 'Musée',
  },
];

const MapScreen = () => {
  const [selectedMonument, setSelectedMonument] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    try {
      const storedVisits = await AsyncStorage.getItem('visits');
      if (storedVisits) {
        setVisits(JSON.parse(storedVisits));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des visites:', error);
    }
  };

  const handleMarkerPress = (monument) => {
    setSelectedMonument(monument);
    setModalVisible(true);
  };

  const addToCalendar = async () => {
    try {
      const newVisit = {
        id: Date.now().toString(),
        monumentId: selectedMonument.id,
        monumentName: selectedMonument.name,
        date: new Date().toISOString().split('T')[0],
        status: 'planifié',
      };

      const updatedVisits = [...visits, newVisit];
      await AsyncStorage.setItem('visits', JSON.stringify(updatedVisits));
      setVisits(updatedVisits);
      
      Alert.alert('Succès', `${selectedMonument.name} ajouté au calendrier`);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter au calendrier');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}>
        {MONUMENTS_DATA.map((monument) => (
          <Marker
            key={monument.id}
            coordinate={{
              latitude: monument.latitude,
              longitude: monument.longitude,
            }}
            title={monument.name}
            description={monument.description}
            onPress={() => handleMarkerPress(monument)}
            pinColor="#2196F3"
          />
        ))}
      </MapView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {selectedMonument && (
                <>
                  <Text style={styles.modalTitle}>{selectedMonument.name}</Text>
                  <Text style={styles.modalCategory}>{selectedMonument.category}</Text>
                  <Text style={styles.modalDescription}>
                    {selectedMonument.description}
                  </Text>
                  
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.button, styles.primaryButton]}
                      onPress={addToCalendar}>
                      <Text style={styles.buttonText}>
                        📅 Ajouter au calendrier
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.button, styles.secondaryButton]}
                      onPress={() => setModalVisible(false)}>
                      <Text style={styles.secondaryButtonText}>Fermer</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalCategory: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 16,
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapScreen;
