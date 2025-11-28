import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { getApiUrl, API_CONFIG } from '../../config/api';

type Props = DrawerScreenProps<DrawerParamList, 'Adocoes'>;

export type Adocao = {
  id: number;
  data_solicitacao: string;
  data_conclusao: string;
  status: string;
  requer_documentos: boolean;
  observacoes: string;
  solicitante: number;
  animal: number;
  animal_nome?: string;
  solicitante_nome?: string;
};

const AdocoesScreen = ({ navigation }: Props) => {
  const [adocoes, setAdocoes] = useState<Adocao[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.ADOCOES);

  const fetchAdocoes = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setAdocoes(data);
    } catch (error) {
      console.error("Erro ao buscar adoções:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAdocoes();
    }, [])
  );

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      setAdocoes(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Erro ao deletar adoção:", error);
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'S': return 'Solicitada';
      case 'E': return 'Em Avaliação';
      case 'A': return 'Aprovada';
      case 'C': return 'Concluída';
      case 'R': return 'Rejeitada';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'S': return styles.statusSolicitada;
      case 'E': return styles.statusAvaliacao;
      case 'A': return styles.statusAprovada;
      case 'C': return styles.statusConcluida;
      case 'R': return styles.statusRejeitada;
      default: return styles.statusSolicitada;
    }
  };

  const renderItem = ({ item }: { item: Adocao }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Adoção #{item.id}</Text>
      <Text style={styles.description}>
        Animal: {item.animal_nome || `ID ${item.animal}`}
      </Text>
      <Text style={styles.description}>
        Solicitante: {item.solicitante_nome || `ID ${item.solicitante}`}
      </Text>
      <Text style={styles.date}>
        Solicitação: {new Date(item.data_solicitacao).toLocaleDateString('pt-BR')}
      </Text>
      {item.data_conclusao && (
        <Text style={styles.date}>
          Conclusão: {new Date(item.data_conclusao).toLocaleDateString('pt-BR')}
        </Text>
      )}
      <Text style={[styles.status, getStatusColor(item.status)]}>
        {getStatusText(item.status)}
      </Text>
      {item.requer_documentos && (
        <Text style={styles.documentos}>Requer documentos</Text>
      )}
      
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditAdocao', { adocao: item })}
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
      <Text style={styles.title}>Solicitações de Adoção</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={adocoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateAdocao')}
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
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusSolicitada: {
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
  },
  statusAvaliacao: {
    backgroundColor: '#FFF3E0',
    color: '#EF6C00',
  },
  statusAprovada: {
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
  },
  statusConcluida: {
    backgroundColor: '#F3E5F5',
    color: '#7B1FA2',
  },
  statusRejeitada: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  documentos: {
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

export default AdocoesScreen;