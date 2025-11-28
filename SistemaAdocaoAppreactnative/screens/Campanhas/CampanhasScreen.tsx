import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { getApiUrl, API_CONFIG } from '../../config/api';


type Props = DrawerScreenProps<DrawerParamList, 'Campanhas'>;

export type Campanha = {
  id: number;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  local: string;
  meta_doacao: string;
  status: string;
  tipo_campanha: string;
  ong: number;
  ong_nome?: string;
};

const CampanhasScreen = ({ navigation }: Props) => {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.CAMPANHAS);

  const fetchCampanhas = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCampanhas(data);
    } catch (error) {
      console.error("Erro ao buscar campanhas:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCampanhas();
    }, [])
  );

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      setCampanhas(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Erro ao deletar campanha:", error);
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'A': return 'Ativa';
      case 'F': return 'Finalizada';
      case 'C': return 'Cancelada';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'A': return styles.statusAtiva;
      case 'F': return styles.statusFinalizada;
      case 'C': return styles.statusCancelada;
      default: return styles.statusAtiva;
    }
  };

  const renderItem = ({ item }: { item: Campanha }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.titulo}</Text>
      <Text style={styles.tipo}>{item.tipo_campanha}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.descricao}
      </Text>
      <Text style={styles.local}>📍 {item.local}</Text>
      <Text style={styles.meta}>🎯 Meta: R$ {item.meta_doacao}</Text>
      <Text style={styles.date}>
        {new Date(item.data_inicio).toLocaleDateString('pt-BR')} - {new Date(item.data_fim).toLocaleDateString('pt-BR')}
      </Text>
      <Text style={styles.description}>
        ONG: {item.ong_nome || `ID ${item.ong}`}
      </Text>
      
      <Text style={[styles.status, getStatusColor(item.status)]}>
        {getStatusText(item.status)}
      </Text>
      
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditCampanha', { campanha: item })}
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
      <Text style={styles.title}>Campanhas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={campanhas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateCampanha')}
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
  tipo: {
    fontSize: 14,
    color: '#4B7BE5',
    fontWeight: '500',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  local: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  meta: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusAtiva: {
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
  },
  statusFinalizada: {
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
  },
  statusCancelada: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
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

export default CampanhasScreen;