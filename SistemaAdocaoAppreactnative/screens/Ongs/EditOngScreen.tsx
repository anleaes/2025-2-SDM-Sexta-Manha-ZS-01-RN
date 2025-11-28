import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { Ong } from './OngsScreen';

type Props = DrawerScreenProps<DrawerParamList, 'EditOng'>;

const EditOngScreen = ({ route, navigation }: Props) => {
  const { ong } = route.params;
  const [nome_instituicao, setNomeInstituicao] = useState(ong.nome_instituicao);
  const [cnpj, setCnpj] = useState(ong.cnpj);
  const [endereco, setEndereco] = useState(ong.endereco);
  const [data_fundacao, setDataFundacao] = useState(ong.data_fundacao);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNomeInstituicao(ong.nome_instituicao);
    setCnpj(ong.cnpj);
    setEndereco(ong.endereco);
    setDataFundacao(ong.data_fundacao);
  }, [ong]);  

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      nome_instituicao, 
      cnpj, 
      endereco, 
      data_fundacao 
    };

    try {
    const API_URL = `http://localhost:8000/ong/${ong.id}/`;

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

    navigation.navigate('Ongs');        
    } catch (error) {
      alert('Erro ao atualizar: ' + error);
    } finally {
      setSaving(false);
     }  
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar ONG</Text>
      
      <Text style={styles.label}>Nome da Instituição</Text>
      <TextInput
        value={nome_instituicao}
        onChangeText={setNomeInstituicao}
        style={styles.input}
      />

      <Text style={styles.label}>CNPJ</Text>
      <TextInput
        value={cnpj}
        onChangeText={setCnpj}
        style={styles.input}
      />

      <Text style={styles.label}>Endereço</Text>
      <TextInput
        value={endereco}
        onChangeText={setEndereco}
        style={styles.input}
      />

      <Text style={styles.label}>Data de Fundação</Text>
      <TextInput
        value={data_fundacao}
        onChangeText={setDataFundacao}
        style={styles.input}
      />

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
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
});

export default EditOngScreen;