import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'CreateMonitoramento'>;

const CreateMonitoramentoScreen = ({ navigation }: Props) => {
  const [adocao, setAdocao] = useState('');
  const [data_visita, setDataVisita] = useState('');
  const [status_saude, setStatusSaude] = useState('B');
  const [condicoes_ambientais, setCondicoesAmbientais] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [resultado, setResultado] = useState('S');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setAdocao('');
      setDataVisita('');
      setStatusSaude('B');
      setCondicoesAmbientais('');
      setObservacoes('');
      setResultado('S');
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      adocao: parseInt(adocao) || 1,
      data_visita: data_visita || new Date().toISOString().split('T')[0],
      status_saude,
      condicoes_ambientais: condicoes_ambientais || 'A ser preenchido',
      observacoes: observacoes || '',
      resultado
    };

    try {
    const API_URL = 'http://localhost:8000/monitoramento/';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }
    navigation.navigate('Monitoramentos');  

    } catch (error) {
      alert('Erro ao cadastrar: ' + error);
    } finally {
      setSaving(false);
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

  const getResultadoText = (resultado: string) => {
    return resultado === 'S' ? 'Satisfatório' : 'Insatisfatório';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Monitoramento</Text>
      
      <Text style={styles.label}>ID da Adoção</Text>
      <TextInput
        value={adocao}
        onChangeText={setAdocao}
        style={styles.input}
        placeholder="1"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Data da Visita</Text>
      <TextInput
        value={data_visita}
        onChangeText={setDataVisita}
        style={styles.input}
        placeholder="AAAA-MM-DD"
      />

      <Text style={styles.label}>Status de Saúde</Text>
      <View style={styles.statusContainer}>
        {['E', 'B', 'R', 'C'].map((status) => (
          <Button 
            key={status}
            title={getStatusSaudeText(status)} 
            onPress={() => setStatusSaude(status)} 
            color={status_saude === status ? '#4B7BE5' : '#ccc'}
          />
        ))}
      </View>

      <Text style={styles.label}>Condições do Ambiente</Text>
      <TextInput
        value={condicoes_ambientais}
        onChangeText={setCondicoesAmbientais}
        style={[styles.input, styles.textArea]}
        placeholder="Descreva as condições do lar, higiene, espaço..."
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        value={observacoes}
        onChangeText={setObservacoes}
        style={[styles.input, styles.textArea]}
        placeholder="Observações adicionais..."
        multiline
        numberOfLines={2}
      />

      <Text style={styles.label}>Resultado</Text>
      <View style={styles.resultadoContainer}>
        <Button 
          title="Satisfatório" 
          onPress={() => setResultado('S')} 
          color={resultado === 'S' ? '#4B7BE5' : '#ccc'}
        />
        <Button 
          title="Insatisfatório" 
          onPress={() => setResultado('I')} 
          color={resultado === 'I' ? '#4B7BE5' : '#ccc'}
        />
      </View>

      {saving
        ? <ActivityIndicator size="large" color="#4B7BE5" />
        : <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      }
      <Button title="Voltar" onPress={() => navigation.navigate('Monitoramentos')} />
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
    fontWeight: '600', 
    marginTop: 12, 
    marginBottom: 4 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultadoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default CreateMonitoramentoScreen;