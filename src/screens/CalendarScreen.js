import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalendarScreen = () => {
  const [visits, setVisits] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    loadVisits();
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    updateMarkedDates();
  }, [visits, selectedDate]);

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

  const updateMarkedDates = () => {
    const marked = {};
    
    visits.forEach(visit => {
      marked[visit.date] = {
        marked: true,
        dotColor: visit.status === 'complété' ? '#4CAF50' : '#2196F3',
      };
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#2196F3',
      };
    }

    setMarkedDates(marked);
  };

  const getVisitsForDate = (date) => {
    return visits.filter(visit => visit.date === date);
  };

  const deleteVisit = async (visitId) => {
    Alert.alert(
      'Confirmer',
      'Voulez-vous supprimer cette visite ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedVisits = visits.filter(v => v.id !== visitId);
              await AsyncStorage.setItem('visits', JSON.stringify(updatedVisits));
              setVisits(updatedVisits);
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer la visite');
            }
          },
        },
      ]
    );
  };

  const toggleVisitStatus = async (visitId) => {
    try {
      const updatedVisits = visits.map(visit => {
        if (visit.id === visitId) {
          return {
            ...visit,
            status: visit.status === 'planifié' ? 'complété' : 'planifié',
          };
        }
        return visit;
      });
      
      await AsyncStorage.setItem('visits', JSON.stringify(updatedVisits));
      setVisits(updatedVisits);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le statut');
    }
  };

  const renderVisitItem = ({ item }) => (
    <View style={styles.visitItem}>
      <View style={styles.visitHeader}>
        <Text style={styles.visitName}>{item.monumentName}</Text>
        <TouchableOpacity
          onPress={() => toggleVisitStatus(item.id)}
          style={styles.statusBadge}>
          <Text style={[
            styles.statusText,
            item.status === 'complété' && styles.completedText
          ]}>
            {item.status === 'complété' ? '✓ Complété' : '○ Planifié'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteVisit(item.id)}>
        <Text style={styles.deleteButtonText}>🗑️ Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  const visitsForSelectedDate = getVisitsForDate(selectedDate);

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#2196F3',
          todayTextColor: '#2196F3',
          dotColor: '#2196F3',
          arrowColor: '#2196F3',
        }}
      />

      <View style={styles.visitsList}>
        <Text style={styles.visitsTitle}>
          Visites pour le {new Date(selectedDate).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </Text>
        
        {visitsForSelectedDate.length > 0 ? (
          <FlatList
            data={visitsForSelectedDate}
            renderItem={renderVisitItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>📅</Text>
            <Text style={styles.emptyMessage}>
              Aucune visite prévue pour cette date
            </Text>
            <Text style={styles.emptyHint}>
              Ajoutez des monuments depuis la carte
            </Text>
          </View>
        )}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>Planifié</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Complété</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  visitsList: {
    flex: 1,
    padding: 16,
  },
  visitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  listContent: {
    gap: 12,
  },
  visitItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  visitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
  },
  statusText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  completedText: {
    color: '#4CAF50',
  },
  deleteButton: {
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#f44336',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
});

export default CalendarScreen;
