

import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';
import AnimalsScreen, { Animal } from '../screens/Animals/AnimalsScreen';
import CreateAnimalScreen from '../screens/Animals/CreateAnimalScreen';
import EditAnimalScreen from '../screens/Animals/EditAnimalScreen';
import HomeScreen from '../screens/HomeScreen'; 
import OngsScreen, { Ong } from '../screens/Ongs/OngsScreen';
import EditOng from '../screens/Ongs/EditOngScreen';
import CreateOng from '../screens/Ongs/CreateOngScreen';
import AdocoesScreen, {Adocao} from '../screens/Adocoes/AdocoesScreen';
import CreateAdocaoScreen from '../screens/Adocoes/CreateAdocaoScreen';
import EditAdocaoScreen from '../screens/Adocoes/EditAdocaoScreen';


export type DrawerParamList = {
  Home: undefined;
  Animals: undefined;
  CreateAnimal: undefined; 
  EditAnimal: { animal: Animal };
  Ongs: undefined;
  CreateOng: undefined;
  EditOng: { ong: Ong };
  Adocoes: undefined;
  CreateAdocao: undefined;
  EditAdocao: { adocao: Adocao };
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#4B7BE5',
        drawerLabelStyle: { marginLeft: 0, fontSize: 16 },
        drawerStyle: { backgroundColor: '#fff', width: 250 },
        headerStyle: { backgroundColor: '#4B7BE5' },
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color}  />,
          title: 'Início',
        }}
      />
      <Drawer.Screen
        name="Animals"
        component={AnimalsScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="paw-outline" size={size} color={color} />,
          title: 'Animais',
        }}
      />
      <Drawer.Screen
        name="CreateAnimal"
        component={CreateAnimalScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Novo animal' }}
      />
      <Drawer.Screen
        name="EditAnimal"
        component={EditAnimalScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Editar animal' }}
      />

      <Drawer.Screen
        name="Ongs"
        component={OngsScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="business-outline" size={size} color={color} />,
          title: 'Ong',
        }}
      />     
      <Drawer.Screen
        name="CreateOng"
        component={CreateOng}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Nova ONG' }}
      />
      <Drawer.Screen
        name="EditOng"
        component={EditOng}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Editar ONG' }}
      />

      <Drawer.Screen
        name="Adocoes"
        component={AdocoesScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
          title: 'Adocao',
        }}
      />
      <Drawer.Screen
        name="CreateAdocao"
        component={CreateAdocaoScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Adocao' }}
      />
      <Drawer.Screen
        name="EditAdocao"
        component={EditAdocaoScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Adocao' }}
      />



    </Drawer.Navigator>  
  );
};

export default DrawerNavigator;
