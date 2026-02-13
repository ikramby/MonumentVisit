import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

// Import des écrans
import MapScreen from './src/screens/MapScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import MonumentsListScreen from './src/screens/MonumentsListScreen';
import RecommendationScreen from './src/screens/RecommendationScreen';

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
            tabBarLabelStyle: styles.tabBarLabel,
          }}>
          
          <Tab.Screen
            name="Recommandations"
            component={RecommendationScreen}
            options={{
              tabBarLabel: 'Pour Vous',
              tabBarIcon: ({ color }) => '🎯',
              headerTitle: 'Recommandations',
            }}
          />

          <Tab.Screen
            name="Carte"
            component={MapScreen}
            options={{
              tabBarLabel: 'Carte',
              tabBarIcon: ({ color }) => '🗺️',
              headerTitle: 'Carte des Monuments',
            }}
          />
          
          <Tab.Screen
            name="Monuments"
            component={MonumentsListScreen}
            options={{
              tabBarLabel: 'Liste',
              tabBarIcon: ({ color }) => '📋',
              headerTitle: 'Tous les Monuments',
            }}
          />
          
          <Tab.Screen
            name="Calendrier"
            component={CalendarScreen}
            options={{
              tabBarLabel: 'Agenda',
              tabBarIcon: ({ color }) => '📅',
              headerTitle: 'Mon Agenda',
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
    height: 65,
    paddingBottom: 10,
    paddingTop: 8,
  },
  header: {
    backgroundColor: '#2196F3',
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
