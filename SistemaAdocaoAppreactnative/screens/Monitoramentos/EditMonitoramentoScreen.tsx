import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { MonitoramentoPosAdocao } from './MonitoramentosScreen';

type Props = DrawerScreenProps<DrawerParamList, 'EditMonitoramento'>;

const EditMonitoramentoScreen = ({ route, navigation }: Props) => {
  const { monitoramento } = route.params;
  const [data_visita, setDataVisita] = useState(monitoramento.data_visita);
  const [status_saude, setStatusSaude] = useState(monitoramento.status_saude);
  const [condicoes_ambientais, setCondicoesAmbientais] = useState(monitoramento.condicoes_ambientais);
  const [observacoes, setObservacoes] = useState(monitoramento.observacoes || '');
  const [resultado, setResultado] = useState(monitoramento.resultado);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDataVisita(monitoramento.data_visita);
    setStatusSaude(monitoramento.status_saude);
    setCondicoesAmbientais(monitoramento.condicoes_ambientais);
    setObservacoes(monitoramento.observacoes || '');
    setResultado(monitoramento.resultado);
  }, [monitoramento]);  

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      data_visita,
      status_saude,
      condicoes_ambientais,
      observacoes,
      resultado,
      adocao: monitoramento.adocao
    };

    const res = await fetch(
      `http://10.0.2.2:8000/monitoramentos/${monitoramento.id}/`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    
    navigation.navigate('Monitoramentos');        
    setSaving(false);  
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
      <Text style={styles.title}>Editar Monitoramento #{monitoramento.id}</Text>
      
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
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        value={observacoes}
        onChangeText={setObservacoes}
        style={[styles.input, styles.textArea]}
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

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
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

export default EditMonitoramentoScreen;