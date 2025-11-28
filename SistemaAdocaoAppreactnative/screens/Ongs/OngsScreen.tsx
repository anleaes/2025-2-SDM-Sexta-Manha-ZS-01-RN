import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { getApiUrl, API_CONFIG } from '../../config/api';

type Props = DrawerScreenProps<DrawerParamList, 'Ongs'>;

export type Ong = {
  id: number;
  nome_instituicao: string;
  cnpj: string;
  endereco: string;
  data_fundacao: string;
};

const OngsScreen = ({ navigation }: Props) => {
  const [ongs, setOngs] = useState<Ong[]>([]);
  const [loading, setLoading] = useState(true);

   const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.ONGS);

  const fetchOngs = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setOngs(data);
    } catch (error) {
      console.error("Erro ao buscar ONGs:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOngs();
    }, [])
  );

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      setOngs(prev => prev.filter(o => o.id !== id));
    } catch (error) {
      console.error("Erro ao deletar ONG:", error);
    }
  };

  const renderItem = ({ item }: { item: Ong }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nome_instituicao}</Text>
      <Text style={styles.description}>CNPJ: {item.cnpj}</Text>
      <Text style={styles.description}>Endereço: {item.endereco}</Text>
      <Text style={styles.date}>
        Fundação: {new Date(item.data_fundacao).toLocaleDateString('pt-BR')}
      </Text>
      
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditOng', { ong: item })}
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
      <Text style={styles.title}>ONGs Cadastradas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={ongs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateOng')}
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
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#4B7BE5',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
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
  deleteButton: {
    backgroundColor: '#E54848',
    padding: 8,
    borderRadius: 6,
  },
  row: { 
    flexDirection: 'row', 
    marginTop: 8, 
    alignSelf: 'flex-end' 
  },
});

export default OngsScreen;