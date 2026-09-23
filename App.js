import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import MisAhorros from './screens/MisAhorros';
import TodosAhorros from './screens/TodosAhorros';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Mis Ahorros">
          <Drawer.Screen name="Mis Ahorros" component={MisAhorros} />
          <Drawer.Screen name="Todos los Ahorros" component={TodosAhorros} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}