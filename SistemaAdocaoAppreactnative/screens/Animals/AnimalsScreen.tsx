import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'Animals'>;

export type Animal = {
  id: number;
  nome: string; 
  especie: string; 
  raca: string;
  idade: number;
  sexo: string;
  descricao: string;
  status: string;
  data_entrada: string;
  necessidades_especiais: string;
  ong: number;
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

  const handleSolicitarAdocao = async (animalId: number) => {
    try {
      const novaAdocao = {
        data_solicitacao: new Date().toISOString().split('T')[0],
        status: 'S',
        animal: animalId,
        pessoa: 1 // ID da pessoa logada
      };

      const response = await fetch('http://10.0.2.2:8000/adocoes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaAdocao),
      });

      if (response.ok) {
        alert('Solicitação de adoção enviada com sucesso!');
        // Atualiza o status do animal localmente para Reservado
        setAnimals(prev => prev.map(animal => 
          animal.id === animalId ? {...animal, status: 'R'} : animal
        ));
      }
    } catch (error) {
      console.error("Erro ao solicitar adoção:", error);
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'A': return 'Aguardando Adoção';
      case 'D': return 'Adotado';
      case 'R': return 'Reservado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'A': return styles.statusAvailable;
      case 'D': return styles.statusAdopted;
      case 'R': return styles.statusReserved;
      default: return styles.statusAvailable;
    }
  };

  const getSexoText = (sexo: string) => {
    return sexo === 'M' ? 'Macho' : 'Fêmea';
  };

  const renderItem = ({ item }: { item: Animal }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nome}</Text>
      <Text style={styles.description}>
        {item.especie} - {item.raca || 'Sem raça definida'} - {getSexoText(item.sexo)} - {item.idade} anos
      </Text>
      <Text style={[styles.status, getStatusColor(item.status)]}>
        {getStatusText(item.status)}
      </Text>
      <Text style={styles.date}>
        Entrada: {new Date(item.data_entrada).toLocaleDateString('pt-BR')}
      </Text>
      
      {item.necessidades_especiais && (
        <Text style={styles.specialNeeds}>
          Necessidades especiais: {item.necessidades_especiais}
        </Text>
      )}
      
      <View style={styles.row}>
        {item.status === 'A' && (
          <TouchableOpacity
            style={styles.adoptButton}
            onPress={() => handleSolicitarAdocao(item.id)}
          >
            <Text style={styles.buttonText}>Solicitar Adoção</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditAnimal', { animal: item })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
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
  status: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusAvailable: {
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
  },
  statusAdopted: {
    backgroundColor: '#FFF3E0',
    color: '#EF6C00',
  },
  statusReserved: {
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  specialNeeds: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
    fontStyle: 'italic',
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
  adoptButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '500',
    fontSize: 12,
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
    flexWrap: 'wrap',
  },
});

export default AnimalsScreen;