import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'Pagamentos'>;

export type Pagamento = {
  id: number;
  valor: string;
  data_pagamento: string;
  forma_pagamento: string;
  comprovante_url: string;
  campanha: number;
  doador: number;
  campanha_titulo?: string;
  doador_nome?: string;
};

const PagamentosScreen = ({ navigation }: Props) => {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://10.0.2.2:8000/pagamentos/';

  const fetchPagamentos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPagamentos(data);
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPagamentos();
    }, [])
  );

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      setPagamentos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar pagamento:", error);
    }
  };

  const getFormaPagamentoText = (forma: string) => {
    switch(forma) {
      case 'PIX': return 'Pix';
      case 'CC': return 'Cartão de Crédito';
      case 'BO': return 'Boleto';
      case 'TR': return 'Transferência';
      default: return forma;
    }
  };

  const getFormaPagamentoColor = (forma: string) => {
    switch(forma) {
      case 'PIX': return styles.formaPix;
      case 'CC': return styles.formaCartao;
      case 'BO': return styles.formaBoleto;
      case 'TR': return styles.formaTransferencia;
      default: return styles.formaPix;
    }
  };

  const renderItem = ({ item }: { item: Pagamento }) => (
    <View style={styles.card}>
      <Text style={styles.valor}>R$ {item.valor}</Text>
      <Text style={styles.description}>
        Forma: {getFormaPagamentoText(item.forma_pagamento)}
      </Text>
      <Text style={styles.date}>
        Data: {new Date(item.data_pagamento).toLocaleDateString('pt-BR')}
      </Text>
      <Text style={styles.description}>
        Doador: {item.doador_nome || `ID ${item.doador}`}
      </Text>
      <Text style={styles.description}>
        Campanha: {item.campanha_titulo || `ID ${item.campanha}`}
      </Text>
      
      <Text style={[styles.formaPagamento, getFormaPagamentoColor(item.forma_pagamento)]}>
        {getFormaPagamentoText(item.forma_pagamento)}
      </Text>
      
      {item.comprovante_url && (
        <Text style={styles.comprovante}>📎 Comprovante disponível</Text>
      )}
      
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditPagamento', { pagamento: item })}
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
      <Text style={styles.title}>Pagamentos de Doações</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={pagamentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePagamento')}
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
  valor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
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
  formaPagamento: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  formaPix: {
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
  },
  formaCartao: {
    backgroundColor: '#F3E5F5',
    color: '#7B1FA2',
  },
  formaBoleto: {
    backgroundColor: '#FFF3E0',
    color: '#EF6C00',
  },
  formaTransferencia: {
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
  },
  comprovante: {
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

export default PagamentosScreen;