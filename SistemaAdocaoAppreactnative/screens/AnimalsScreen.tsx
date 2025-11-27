import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerParamList } from '../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'Animals'>;

export type Animal = {
  id: number;
  nome: string; 
  especie: string; 
  raca: string;
  sexo : string;
};

const AnimalsScreen = ({ navigation }: Props) => {

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://10.0.2.2:8000/animais/'; 

  const fetchAnimals = async () => {
    setLoading(true);
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setAnimals(data);
    } catch (error) {
        console.error("Erro ao buscar animais:", error);
    } finally {
        setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAnimals();
    }, [])
  );

  const handleDelete = async (id: number) => {
    try {
        await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
        setAnimals(prev => prev.filter(a => a.id !== id));
    } catch (error) {
        console.error("Erro ao deletar animal:", error);
    }
  };

  const renderItem = ({ item }: { item: Animal }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nome}</Text>
      <Text style={styles.description}>{item.especie} - {item.raca} - {item.sexo}</Text> 
      
      <View style={styles.row}> 
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditAnimal', { animal: item })}
        >
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.editText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return ( 
    <View style={styles.container}>
      <Text style={styles.title}>Animais Disponíveis</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={animals} 
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }} 
        />
      )}
      <TouchableOpacity
        style={styles.fab}
       
        onPress={() => navigation.navigate('CreateAnimal')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  
  editButton: {
    backgroundColor: '#4B7BE5',
    padding: 8,
    borderRadius: 6,
    marginRight: 8, 
  },
  deleteButton: {
    backgroundColor: '#E54848',
    padding: 8,
    borderRadius: 6,
  },
  editText: { 
    color: '#fff', 
    fontWeight: '500' 
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#0D47A1',
    borderRadius: 28,
    padding: 14,
    elevation: 4,
  },
  row: { 
    flexDirection: 'row', 
    marginTop: 8, 
    alignSelf: 'flex-end' 
  },
});

export default AnimalsScreen;