import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';

import ConsultationScreen from './screens/ConsultationScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import HistoryScreen from './screens/HistoryScreen';
import ContactsScreen from './screens/ContactsScreen';
import ConsultationDetailScreen from './screens/ConsultationDetailScreen';
import TemplatesScreen from './screens/TemplatesScreen';
import PremiumScreen from './screens/PremiumScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

const ConsultationStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1e40af' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="ConsultationMain"
      component={ConsultationScreen}
      options={{ title: 'Консультация' }}
    />
    <Stack.Screen
      name="ConsultationDetail"
      component={ConsultationDetailScreen}
      options={{ title: 'Ответ' }}
    />
  </Stack.Navigator>
);

const CategoriesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1e40af' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="CategoriesMain"
      component={CategoriesScreen}
      options={{ title: 'Категории прав' }}
    />
  </Stack.Navigator>
);

const HistoryStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1e40af' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="HistoryMain"
      component={HistoryScreen}
      options={{ title: 'История' }}
    />
  </Stack.Navigator>
);

const ContactsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1e40af' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="ContactsMain"
      component={ContactsScreen}
      options={{ title: 'Контакты' }}
    />
  </Stack.Navigator>
);

const TemplatesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1e40af' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="TemplatesMain"
      component={TemplatesScreen}
      options={{ title: 'Шаблоны' }}
    />
  </Stack.Navigator>
);

const PremiumStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1e40af' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="PremiumMain"
      component={PremiumScreen}
      options={{ title: 'Premium' }}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1e40af' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="SettingsMain"
      component={SettingsScreen}
      options={{ title: 'Настройки' }}
    />
  </Stack.Navigator>
);

export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';

              if (route.name === 'Consultation') {
                iconName = focused ? 'chatbubble' : 'chatbubble-outline';
              } else if (route.name === 'Categories') {
                iconName = focused ? 'list' : 'list-outline';
              } else if (route.name === 'History') {
                iconName = focused ? 'time' : 'time-outline';
              } else if (route.name === 'Contacts') {
                iconName = focused ? 'call' : 'call-outline';
              } else if (route.name === 'Templates') {
                iconName = focused ? 'document-text' : 'document-text-outline';
              } else if (route.name === 'Premium') {
                iconName = focused ? 'star' : 'star-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#1e40af',
            tabBarInactiveTintColor: '#9ca3af',
          })}
        >
          <Tab.Screen
            name="Consultation"
            component={ConsultationStack}
            options={{ title: 'Вопрос' }}
          />
          <Tab.Screen
            name="Categories"
            component={CategoriesStack}
            options={{ title: 'Категории' }}
          />
          <Tab.Screen
            name="History"
            component={HistoryStack}
            options={{ title: 'История' }}
          />
          <Tab.Screen
            name="Contacts"
            component={ContactsStack}
            options={{ title: 'Контакты' }}
          />
          <Tab.Screen
            name="Templates"
            component={TemplatesStack}
            options={{ title: 'Шаблоны' }}
          />
          <Tab.Screen
            name="Premium"
            component={PremiumStack}
            options={{ title: 'Premium' }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsStack}
            options={{ title: 'Настройки' }}
          />
        </Tab.Navigator>        
      </NavigationContainer>
    </>
  );
}
