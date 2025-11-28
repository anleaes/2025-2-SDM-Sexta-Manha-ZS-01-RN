import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { AgendamentoVisita } from './AgendamentosScreen';

type Props = DrawerScreenProps<DrawerParamList, 'EditAgendamento'>;

const EditAgendamentoScreen = ({ route, navigation }: Props) => {
  const { agendamentoVisita } = route.params;
  const [status_agendamento, setStatusAgendamento] = useState(agendamentoVisita.status_agendamento);
  const [local_visita, setLocalVisita] = useState(agendamentoVisita.local_visita);
  const [data_hora_visita, setDataHoraVisita] = useState(agendamentoVisita.data_hora_visita);
  const [observacoes, setObservacoes] = useState(agendamentoVisita.observacoes || '');
  const [feedback_ong, setFeedbackOng] = useState(agendamentoVisita.feedback_ong || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatusAgendamento(agendamentoVisita.status_agendamento);
    setLocalVisita(agendamentoVisita.local_visita);
    setDataHoraVisita(agendamentoVisita.data_hora_visita);
    setObservacoes(agendamentoVisita.observacoes || '');
    setFeedbackOng(agendamentoVisita.feedback_ong || '');
  }, [agendamentoVisita]);  

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      status_agendamento,
      local_visita,
      data_hora_visita,
      observacoes,
      feedback_ong,
      solicitante: agendamentoVisita.solicitante,
      ong: agendamentoVisita.ong,
      adocao: agendamentoVisita.adocao
    };

    try {
    const API_URL = `http://localhost:8000/agendamento/${agendamentoVisita.id}/`;

     const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    navigation.navigate('Agendamentos');        
     } catch (error) {
      alert('Erro ao atualizar: ' + error);
    } finally {
      setSaving(false);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Agendamento #{agendamentoVisita.id}</Text>
      
      <Text style={styles.label}>Status</Text>
      <View style={styles.statusContainer}>
        {['P', 'C', 'R', 'A'].map((s) => (
          <Button 
            key={s}
            title={getStatusText(s)} 
            onPress={() => setStatusAgendamento(s)} 
            color={status_agendamento === s ? '#4B7BE5' : '#ccc'}
          />
        ))}
      </View>

      <Text style={styles.label}>Local da Visita</Text>
      <TextInput
        value={local_visita}
        onChangeText={setLocalVisita}
        style={styles.input}
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
        multiline
      />

      <Text style={styles.label}>Feedback da ONG</Text>
      <TextInput
        value={feedback_ong}
        onChangeText={setFeedbackOng}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
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

export default EditAgendamentoScreen;