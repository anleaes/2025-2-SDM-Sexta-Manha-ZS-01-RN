import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'Agendamentos'>;

export type AgendamentoVisita = {
  id: number;
  data_hora_visita: string;
  local_visita: string;
  status_agendamento: string;
  observacoes: string;
  feedback_ong: string;
  solicitante: number;
  ong: number;
  adocao: number;
  solicitante_nome?: string;
  ong_nome?: string;
};

const AgendamentosScreen = ({ navigation }: Props) => {
  const [agendamentos, setAgendamentos] = useState<AgendamentoVisita[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://10.0.2.2:8000/agendamentos/';

  const fetchAgendamentos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setAgendamentos(data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAgendamentos();
    }, [])
  );

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      setAgendamentos(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'P': return 'Pendente';
      case 'C': return 'Confirmado';
      case 'R': return 'Realizado';
      case 'A': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'P': return styles.statusPendente;
      case 'C': return styles.statusConfirmado;
      case 'R': return styles.statusRealizado;
      case 'A': return styles.statusCancelado;
      default: return styles.statusPendente;
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR');
  };

  const renderItem = ({ item }: { item: AgendamentoVisita }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Agendamento #{item.id}</Text>
      <Text style={styles.description}>
        Local: {item.local_visita}
      </Text>
      <Text style={styles.dateTime}>
        {formatDateTime(item.data_hora_visita)}
      </Text>
      <Text style={styles.description}>
        Solicitante: {item.solicitante_nome || `ID ${item.solicitante}`}
      </Text>
      <Text style={styles.description}>
        ONG: {item.ong_nome || `ID ${item.ong}`}
      </Text>
      <Text style={[styles.status, getStatusColor(item.status_agendamento)]}>
        {getStatusText(item.status_agendamento)}
      </Text>
      
      {item.observacoes && (
        <Text style={styles.observacoes}>Observações: {item.observacoes}</Text>
      )}
      
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditAgendamento', { agendamentoVisita: item })}
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
      <Text style={styles.title}>Agendamentos de Visita</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateAgendamento')}
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
  dateTime: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
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
  statusPendente: {
    backgroundColor: '#FFF3E0',
    color: '#EF6C00',
  },
  statusConfirmado: {
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
  },
  statusRealizado: {
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
  },
  statusCancelado: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  observacoes: {
    fontSize: 12,
    color: '#666',
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

export default AgendamentosScreen;