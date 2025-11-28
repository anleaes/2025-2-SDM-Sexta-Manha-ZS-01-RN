import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'CreateCampanha'>;

const CreateCampanhaScreen = ({ navigation }: Props) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo_campanha, setTipoCampanha] = useState('');
  const [local, setLocal] = useState('');
  const [meta_doacao, setMetaDoacao] = useState('');
  const [data_inicio, setDataInicio] = useState('');
  const [data_fim, setDataFim] = useState('');
  const [ong, setOng] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setTitulo('');
      setDescricao('');
      setTipoCampanha('');
      setLocal('');
      setMetaDoacao('');
      setDataInicio('');
      setDataFim('');
      setOng('');
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      titulo,
      descricao: descricao || 'Campanha de arrecadação',
      tipo_campanha: tipo_campanha || 'Arrecadação',
      local,
      meta_doacao: parseFloat(meta_doacao) || 0,
      data_inicio: data_inicio || new Date().toISOString().split('T')[0],
      data_fim: data_fim || new Date().toISOString().split('T')[0],
      ong: parseInt(ong) || 1,
      status: 'A'
    };

    const res = await fetch('http://10.0.2.2:8000/campanhas/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    navigation.navigate('Campanhas');  
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Campanha</Text>
      
      <Text style={styles.label}>Título</Text>
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
        placeholder="Título da campanha"
      />

      <Text style={styles.label}>Tipo de Campanha</Text>
      <TextInput
        value={tipo_campanha}
        onChangeText={setTipoCampanha}
        style={styles.input}
        placeholder="Arrecadação, Adoção, Evento..."
      />

      <Text style={styles.label}>Local</Text>
      <TextInput
        value={local}
        onChangeText={setLocal}
        style={styles.input}
        placeholder="Local da campanha"
      />

      <Text style={styles.label}>Meta de Doação (R$)</Text>
      <TextInput
        value={meta_doacao}
        onChangeText={setMetaDoacao}
        style={styles.input}
        placeholder="0.00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Data Início</Text>
      <TextInput
        value={data_inicio}
        onChangeText={setDataInicio}
        style={styles.input}
        placeholder="AAAA-MM-DD"
      />

      <Text style={styles.label}>Data Fim</Text>
      <TextInput
        value={data_fim}
        onChangeText={setDataFim}
        style={styles.input}
        placeholder="AAAA-MM-DD"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        value={descricao}
        onChangeText={setDescricao}
        style={[styles.input, { height: 100 }]}
        placeholder="Descrição da campanha..."
        multiline
      />

      <Text style={styles.label}>ID da ONG</Text>
      <TextInput
        value={ong}
        onChangeText={setOng}
        style={styles.input}
        placeholder="1"
        keyboardType="numeric"
      />

      {saving
        ? <ActivityIndicator size="large" color="#4B7BE5" />
        : <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      }
      <Button title="Voltar" onPress={() => navigation.navigate('Campanhas')} />
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

export default CreateCampanhaScreen;