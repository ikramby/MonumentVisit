import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MONUMENTS_DATA = [
  {
    id: '1',
    name: 'Tour Eiffel',
    description: 'Monument emblématique de Paris, construit en 1889 pour l\'Exposition universelle. Haute de 330 mètres, elle offre une vue panoramique exceptionnelle sur la capitale.',
    latitude: 48.8584,
    longitude: 2.2945,
    category: 'Monument historique',
    horaires: '9h30 - 23h45',
    tarif: '26€',
  },
  {
    id: '2',
    name: 'Arc de Triomphe',
    description: 'Monument commémoratif situé au centre de la Place Charles de Gaulle. Construit entre 1806 et 1836, il honore les soldats français.',
    latitude: 48.8738,
    longitude: 2.2950,
    category: 'Monument historique',
    horaires: '10h - 22h30',
    tarif: '13€',
  },
  {
    id: '3',
    name: 'Notre-Dame de Paris',
    description: 'Cathédrale gothique située sur l\'île de la Cité, chef-d\'œuvre de l\'architecture médiévale française. Construction débutée en 1163.',
    latitude: 48.8530,
    longitude: 2.3499,
    category: 'Édifice religieux',
    horaires: 'En restauration',
    tarif: 'Gratuit',
  },
  {
    id: '4',
    name: 'Sacré-Cœur',
    description: 'Basilique située au sommet de la butte Montmartre. Construction achevée en 1914, elle offre une vue imprenable sur Paris.',
    latitude: 48.8867,
    longitude: 2.3431,
    category: 'Édifice religieux',
    horaires: '6h - 22h30',
    tarif: 'Gratuit (Dôme: 6€)',
  },
  {
    id: '5',
    name: 'Musée du Louvre',
    description: 'Plus grand musée d\'art du monde, abritant des collections allant de l\'Antiquité au XIXe siècle, dont la célèbre Joconde.',
    latitude: 48.8606,
    longitude: 2.3376,
    category: 'Musée',
    horaires: '9h - 18h (fermé mardi)',
    tarif: '17€',
  },
  {
    id: '6',
    name: 'Panthéon',
    description: 'Monument néoclassique abritant les tombeaux de grandes personnalités françaises comme Voltaire, Rousseau et Victor Hugo.',
    latitude: 48.8462,
    longitude: 2.3464,
    category: 'Monument historique',
    horaires: '10h - 18h',
    tarif: '11.50€',
  },
  {
    id: '7',
    name: 'Versailles',
    description: 'Château royal célèbre pour la Galerie des Glaces et ses jardins à la française. Résidence des rois Louis XIV, XV et XVI.',
    latitude: 48.8049,
    longitude: 2.1204,
    category: 'Château',
    horaires: '9h - 18h30 (fermé lundi)',
    tarif: '19.50€',
  },
];

const MonumentsListScreen = () => {
  const [monuments] = useState(MONUMENTS_DATA);
  const [filteredMonuments, setFilteredMonuments] = useState(MONUMENTS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedMonument, setSelectedMonument] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [visits, setVisits] = useState([]);

  const categories = ['Tous', 'Monument historique', 'Édifice religieux', 'Musée', 'Château'];

  useEffect(() => {
    loadVisits();
  }, []);

  useEffect(() => {
    filterMonuments();
  }, [searchQuery, selectedCategory]);

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

  const filterMonuments = () => {
    let filtered = monuments;

    if (selectedCategory !== 'Tous') {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMonuments(filtered);
  };

  const handleMonumentPress = (monument) => {
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

  const renderMonumentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.monumentCard}
      onPress={() => handleMonumentPress(item)}>
      <View style={styles.monumentHeader}>
        <Text style={styles.monumentName}>{item.name}</Text>
        <Text style={styles.monumentCategory}>{item.category}</Text>
      </View>
      <Text style={styles.monumentDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.monumentInfo}>
        <Text style={styles.infoText}>🕒 {item.horaires}</Text>
        <Text style={styles.infoText}>💰 {item.tarif}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un monument..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredMonuments}
        renderItem={renderMonumentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>🔍</Text>
            <Text style={styles.emptyMessage}>Aucun monument trouvé</Text>
          </View>
        }
      />

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
                  <Text style={styles.modalCategory}>
                    {selectedMonument.category}
                  </Text>
                  
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>📍 Description</Text>
                    <Text style={styles.modalDescription}>
                      {selectedMonument.description}
                    </Text>
                  </View>

                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>🕒 Horaires</Text>
                    <Text style={styles.infoValue}>{selectedMonument.horaires}</Text>
                  </View>

                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>💰 Tarif</Text>
                    <Text style={styles.infoValue}>{selectedMonument.tarif}</Text>
                  </View>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.button, styles.primaryButton]}
                      onPress={addToCalendar}>
                      <Text style={styles.buttonText}>
                        📅 Planifier une visite
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
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 45,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoriesContent: {
    padding: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryChipActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  monumentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monumentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  monumentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  monumentCategory: {
    fontSize: 12,
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  monumentDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  monumentInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
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
    maxHeight: '80%',
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
    marginBottom: 20,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  modalDescription: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  modalButtons: {
    gap: 12,
    marginTop: 24,
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

export default MonumentsListScreen;
