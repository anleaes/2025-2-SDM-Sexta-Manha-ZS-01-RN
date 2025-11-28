import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { Adocao } from './AdocoesScreen';

type Props = DrawerScreenProps<DrawerParamList, 'EditAdocao'>;

const EditAdocaoScreen = ({ route, navigation }: Props) => {
  const { adocao } = route.params;
  const [status, setStatus] = useState(adocao.status);
  const [observacoes, setObservacoes] = useState(adocao.observacoes || '');
  const [data_conclusao, setDataConclusao] = useState(adocao.data_conclusao || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(adocao.status);
    setObservacoes(adocao.observacoes || '');
    setDataConclusao(adocao.data_conclusao || '');
  }, [adocao]);  

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      status,
      observacoes,
      data_conclusao: data_conclusao || null,
      requer_documentos: adocao.requer_documentos,
      solicitante: adocao.solicitante,
      animal: adocao.animal
    };

      try {
      const API_URL = `http://localhost:8000/adocao/${adocao.id}/`;

     const response = await fetch(API_URL,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    navigation.navigate('Adocoes');   
     } catch (error) {
      alert('Erro ao atualizar: ' + error);
    } finally {
      setSaving(false);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Adoção #{adocao.id}</Text>
      
      <Text style={styles.label}>Status</Text>
      <View style={styles.statusContainer}>
        {['S', 'E', 'A', 'C', 'R'].map((s) => (
          <Button 
            key={s}
            title={getStatusText(s)} 
            onPress={() => setStatus(s)} 
            color={status === s ? '#4B7BE5' : '#ccc'}
          />
        ))}
      </View>

      <Text style={styles.label}>Data de Conclusão</Text>
      <TextInput
        value={data_conclusao}
        onChangeText={setDataConclusao}
        style={styles.input}
        placeholder="AAAA-MM-DD"
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        value={observacoes}
        onChangeText={setObservacoes}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
      <Button title="Voltar" onPress={() => navigation.navigate('Adocoes')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 12, 
    alignSelf: 'center' 
  },
  label: { 
    fontWeight: 'bold', 
    marginTop: 12, 
    marginBottom: 4 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default EditAdocaoScreen;