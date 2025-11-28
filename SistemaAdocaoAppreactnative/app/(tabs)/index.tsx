import DrawerNavigator from '@/navigation/DrawerNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { testConnection } from '../../config/api';

const App = () => (
  <NavigationContainer>
    <DrawerNavigator />
  </NavigationContainer>
);

registerRootComponent(App);



export default function HomeScreen() {
  useEffect(() => {
    // Teste automático ao abrir o app
    testConnection().then(success => {
      console.log('=== CONEXÃO BACKEND ===');
      console.log(success ? '✅ CONECTADO' : '❌ FALHOU');
      alert(success ? '✅ Backend CONECTADO!' : '❌ Backend FALHOU!');
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Verifique o console ou alert para ver o status da conexão</Text>
    </View>
  );
}