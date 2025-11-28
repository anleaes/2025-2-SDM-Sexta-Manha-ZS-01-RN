import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'Monitoramentos'>;

export type MonitoramentoPosAdocao = {
  id: number;
  data_visita: string;
  status_saude: string;
  condicoes_ambientais: string;
  observacoes: string;
  resultado: string;
  adocao: number;
  adocao_info?: string;
};

const MonitoramentosScreen = ({ navigation }: Props) => {
  const [monitoramentos, setMonitoramentos] = useState<MonitoramentoPosAdocao[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://10.0.2.2:8000/monitoramentos/';

  const fetchMonitoramentos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setMonitoramentos(data);
    } catch (error) {
      console.error("Erro ao buscar monitoramentos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMonitoramentos();
    }, [])
  );

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      setMonitoramentos(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error("Erro ao deletar monitoramento:", error);
    }
  };

  const getStatusSaudeText = (status: string) => {
    switch(status) {
      case 'E': return 'Excelente';
      case 'B': return 'Bom';
      case 'R': return 'Requer Atenção';
      case 'C': return 'Crítico';
      default: return status;
    }
  };

  const getStatusSaudeColor = (status: string) => {
    switch(status) {
      case 'E': return styles.statusExcelente;
      case 'B': return styles.statusBom;
      case 'R': return styles.statusAtencao;
      case 'C': return styles.statusCritico;
      default: return styles.statusBom;
    }
  };

  const getResultadoText = (resultado: string) => {
    switch(resultado) {
      case 'S': return 'Satisfatório';
      case 'I': return 'Insatisfatório';
      default: return resultado;
    }
  };

  const getResultadoColor = (resultado: string) => {
    return resultado === 'S' ? styles.resultadoSatisfatorio : styles.resultadoInsatisfatorio;
  };

  const renderItem = ({ item }: { item: MonitoramentoPosAdocao }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Monitoramento #{item.id}</Text>
      <Text style={styles.description}>
        Adoção: {item.adocao_info || `ID ${item.adocao}`}
      </Text>
      <Text style={styles.date}>
        Data: {new Date(item.data_visita).toLocaleDateString('pt-BR')}
      </Text>
      
      <View style={styles.statusRow}>
        <Text style={[styles.status, getStatusSaudeColor(item.status_saude)]}>
          Saúde: {getStatusSaudeText(item.status_saude)}
        </Text>
        <Text style={[styles.resultado, getResultadoColor(item.resultado)]}>
          {getResultadoText(item.resultado)}
        </Text>
      </View>
      
      <Text style={styles.condicoes} numberOfLines={2}>
        Condições: {item.condicoes_ambientais}
      </Text>
      
      {item.observacoes && (
        <Text style={styles.observacoes} numberOfLines={2}>
          Observações: {item.observacoes}
        </Text>
      )}
      
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditMonitoramento', { monitoramento: item })}
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
      <Text style={styles.title}>Monitoramentos Pós-Adoção</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={monitoramentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateMonitoramento')}
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
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    borderRadius: 4,
  },
  statusExcelente: {
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
  },
  statusBom: {
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
  },
  statusAtencao: {
    backgroundColor: '#FFF3E0',
    color: '#EF6C00',
  },
  statusCritico: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  resultado: {
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    borderRadius: 4,
  },
  resultadoSatisfatorio: {
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
  },
  resultadoInsatisfatorio: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  condicoes: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
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

export default MonitoramentosScreen;