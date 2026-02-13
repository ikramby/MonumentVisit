import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

// Import des écrans
import MapScreen from './src/screens/MapScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import MonumentsListScreen from './src/screens/MonumentsListScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#2196F3',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: styles.tabBar,
            headerStyle: styles.header,
            headerTintColor: '#fff',
          }}>
          <Tab.Screen
            name="Carte"
            component={MapScreen}
            options={{
              tabBarLabel: 'Carte',
              headerTitle: 'Carte des Monuments',
            }}
          />
          <Tab.Screen
            name="Monuments"
            component={MonumentsListScreen}
            options={{
              tabBarLabel: 'Monuments',
              headerTitle: 'Liste des Monuments',
            }}
          />
          <Tab.Screen
            name="Calendrier"
            component={CalendarScreen}
            options={{
              tabBarLabel: 'Calendrier',
              headerTitle: 'Mes Visites',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 60,
    paddingBottom: 8,
  },
  header: {
    backgroundColor: '#2196F3',
  },
});
