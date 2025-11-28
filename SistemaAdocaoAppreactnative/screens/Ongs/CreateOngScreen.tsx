import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'CreateOng'>;

const CreateOngScreen = ({ navigation }: Props) => {
  const [nome_instituicao, setNomeInstituicao] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [data_fundacao, setDataFundacao] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setNomeInstituicao('');
      setCnpj('');
      setEndereco('');
      setDataFundacao('');
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      nome_instituicao, 
      cnpj, 
      endereco, 
      data_fundacao: data_fundacao || new Date().toISOString().split('T')[0]
    };

    try {
    const API_URL = 'http://localhost:8000/ong/';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    navigation.navigate('Ongs');  

    } catch (error) {
      alert('Erro ao cadastrar: ' + error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova ONG</Text>
      
      <Text style={styles.label}>Nome da Instituição</Text>
      <TextInput
        value={nome_instituicao}
        onChangeText={setNomeInstituicao}
        style={styles.input}
        placeholder="Nome da ONG"
      />

      <Text style={styles.label}>CNPJ</Text>
      <TextInput
        value={cnpj}
        onChangeText={setCnpj}
        style={styles.input}
        placeholder="00.000.000/0000-00"
      />

      <Text style={styles.label}>Endereço</Text>
      <TextInput
        value={endereco}
        onChangeText={setEndereco}
        style={styles.input}
        placeholder="Endereço completo"
      />

      <Text style={styles.label}>Data de Fundação</Text>
      <TextInput
        value={data_fundacao}
        onChangeText={setDataFundacao}
        style={styles.input}
        placeholder="AAAA-MM-DD"
      />

      {saving
        ? <ActivityIndicator size="large" color="#4B7BE5" />
        : <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      }
      <Button title="Voltar" onPress={() => navigation.navigate('Ongs')} />
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

export default CreateOngScreen;