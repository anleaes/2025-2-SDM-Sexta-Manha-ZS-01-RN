import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { getApiUrl, API_CONFIG } from '../../config/api';

type Props = DrawerScreenProps<DrawerParamList, 'Pessoas'>;

export type Pessoa = {
  id: number;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
  preferencias_animal: string;
  historico_adocoes: string;
  tipo_relacionamento: string;
  campanhas_participadas: number[];
};

const PessoasScreen = ({ navigation }: Props) => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  
  const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.PESSOAS);

  const fetchPessoas = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPessoas(data);
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPessoas();
    }, [])
  );

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      setPessoas(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar pessoa:", error);
    }
  };

  const getTipoRelacionamentoText = (tipo: string) => {
    switch(tipo) {
      case 'A': return 'Adotante';
      case 'D': return 'Doador';
      case 'ADM': return 'Administrador';
      default: return tipo;
    }
  };

  const getTipoRelacionamentoColor = (tipo: string) => {
    switch(tipo) {
      case 'A': return styles.tipoAdotante;
      case 'D': return styles.tipoDoador;
      case 'ADM': return styles.tipoAdministrador;
      default: return styles.tipoAdotante;
    }
  };

  const renderItem = ({ item }: { item: Pessoa }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nome}</Text>
      <Text style={styles.email}>📧 {item.email}</Text>
      <Text style={styles.telefone}>📞 {item.telefone || 'Não informado'}</Text>
      <Text style={styles.cpf}>🆔 {item.cpf}</Text>
      
      <Text style={[styles.tipo, getTipoRelacionamentoColor(item.tipo_relacionamento)]}>
        {getTipoRelacionamentoText(item.tipo_relacionamento)}
      </Text>
      
      {item.preferencias_animal && (
        <Text style={styles.preferences} numberOfLines={2}>
          Preferências: {item.preferencias_animal}
        </Text>
      )}
      
      {item.campanhas_participadas && item.campanhas_participadas.length > 0 && (
        <Text style={styles.campanhas}>
          🎯 Participa de {item.campanhas_participadas.length} campanha(s)
        </Text>
      )}
      
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditPessoa', { pessoa: item })}
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
      <Text style={styles.title}>Pessoas Cadastradas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={pessoas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePessoa')}
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
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  telefone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cpf: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  tipo: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  tipoAdotante: {
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
  },
  tipoDoador: {
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
  },
  tipoAdministrador: {
    backgroundColor: '#FFF3E0',
    color: '#EF6C00',
  },
  preferences: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  campanhas: {
    fontSize: 12,
    color: '#7B1FA2',
    marginTop: 4,
    fontWeight: '500',
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

export default PessoasScreen;