import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'CreateAgendamento'>;

const CreateAgendamentoScreen = ({ navigation }: Props) => {
  const [solicitante, setSolicitante] = useState('');
  const [ong, setOng] = useState('');
  const [adocao, setAdocao] = useState('');
  const [local_visita, setLocalVisita] = useState('');
  const [data_hora_visita, setDataHoraVisita] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSolicitante('');
      setOng('');
      setAdocao('');
      setLocalVisita('');
      setDataHoraVisita('');
      setObservacoes('');
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      solicitante: parseInt(solicitante) || 1,
      ong: parseInt(ong) || 1,
      adocao: parseInt(adocao) || 1,
      local_visita,
      data_hora_visita: data_hora_visita || new Date().toISOString(),
      observacoes: observacoes || '',
      status_agendamento: 'P'
    };

    const res = await fetch('http://10.0.2.2:8000/agendamentos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    navigation.navigate('Agendamentos');  
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Agendamento</Text>
      
      <Text style={styles.label}>ID do Solicitante</Text>
      <TextInput
        value={solicitante}
        onChangeText={setSolicitante}
        style={styles.input}
        placeholder="1"
        keyboardType="numeric"
      />

      <Text style={styles.label}>ID da ONG</Text>
      <TextInput
        value={ong}
        onChangeText={setOng}
        style={styles.input}
        placeholder="1"
        keyboardType="numeric"
      />

      <Text style={styles.label}>ID da Adoção</Text>
      <TextInput
        value={adocao}
        onChangeText={setAdocao}
        style={styles.input}
        placeholder="1"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Local da Visita</Text>
      <TextInput
        value={local_visita}
        onChangeText={setLocalVisita}
        style={styles.input}
        placeholder="Endereço ou local da visita"
      />

      <Text style={styles.label}>Data e Hora</Text>
      <TextInput
        value={data_hora_visita}
        onChangeText={setDataHoraVisita}
        style={styles.input}
        placeholder="AAAA-MM-DDTHH:MM:SS"
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        value={observacoes}
        onChangeText={setObservacoes}
        style={[styles.input, { height: 80 }]}
        placeholder="Observações sobre o agendamento..."
        multiline
      />

      {saving
        ? <ActivityIndicator size="large" color="#4B7BE5" />
        : <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      }
      <Button title="Voltar" onPress={() => navigation.navigate('Agendamentos')} />
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
});

export default CreateAgendamentoScreen;