import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import DashboardScreen from './screens/DashboardScreen';
import EditScreen from './screens/EditScreen';
import IndexScreen from './screens/IndexScreen';
import TestScreen from './screens/TestScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Index"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Index" component={IndexScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen name="Edit" component={EditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
