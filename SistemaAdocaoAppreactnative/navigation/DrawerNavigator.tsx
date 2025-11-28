

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
import AgendamentosScreen, { AgendamentoVisita } from '../screens/Agendamentos/AgendamentosScreen';
import CreateAgendamentoScreen from '../screens/Agendamentos/CreateAgendamentoScreen';
import EditAgendamentoScreen from '../screens/Agendamentos/EditAgendamentoScreen';
import PagamentosScreen, { Pagamento } from '../screens/Pagamentos/PagamentosScreen';
import CreatePagamentoScreen from '../screens/Pagamentos/CreatePagamentoScreen';
import EditPagamentoScreen from '../screens/Pagamentos/EditPagamentoScreen';


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

  Agendamentos: undefined;
  CreateAgendamento: undefined;  
  EditAgendamento: { agendamentoVisita: AgendamentoVisita };

  Pagamentos: undefined;
  CreatePagamento: undefined; 
  EditPagamento: { pagamento: Pagamento };
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

      <Drawer.Screen
        name="Agendamentos"
        component={AgendamentosScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="alarm-outline" size={size} color={color} />,
          title: 'Agendamento Visitacao',
        }}
      />  
      <Drawer.Screen
        name="CreateAgendamento"
        component={CreateAgendamentoScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Agendar Visitacao' }}
      />
      <Drawer.Screen
        name="EditAgendamento"
        component={EditAgendamentoScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Adocao' }}
      />

      <Drawer.Screen
        name="Pagamentos"
        component={PagamentosScreen}
        options={{
         drawerIcon: ({ color, size }) => <Ionicons name="card-outline" size={size} color={color} />,
        title: 'Pagamentos',
        }}
      />
      <Drawer.Screen
        name="CreatePagamento"
        component={CreatePagamentoScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Novo Pagamento' }}
      />
      <Drawer.Screen
        name="EditPagamento"
        component={EditPagamentoScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Pagamento' }}
      />


    </Drawer.Navigator>  
  );
};

export default DrawerNavigator;
