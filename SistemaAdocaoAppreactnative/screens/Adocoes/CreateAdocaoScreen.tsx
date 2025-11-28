import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'CreateAdocao'>;

const CreateAdocaoScreen = ({ navigation }: Props) => {
  const [solicitante, setSolicitante] = useState('');
  const [animal, setAnimal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSolicitante('');
      setAnimal('');
      setObservacoes('');
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      solicitante: parseInt(solicitante) || 1,
      animal: parseInt(animal) || 1,
      observacoes: observacoes || '',
      status: 'S',
      requer_documentos: true
    };

    try {
    const API_URL = `http://localhost:8000/adocao/`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    navigation.navigate('Adocoes');  

     } catch (error) {
      alert('Erro ao cadastrar: ' + error);
    } finally {
      setSaving(false);
  }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Adoção</Text>
      
      <Text style={styles.label}>ID do Solicitante</Text>
      <TextInput
        value={solicitante}
        onChangeText={setSolicitante}
        style={styles.input}
        placeholder="1"
        keyboardType="numeric"
      />

      <Text style={styles.label}>ID do Animal</Text>
      <TextInput
        value={animal}
        onChangeText={setAnimal}
        style={styles.input}
        placeholder="1"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        value={observacoes}
        onChangeText={setObservacoes}
        style={[styles.input, { height: 100 }]}
        placeholder="Observações sobre a adoção..."
        multiline
      />

      {saving
        ? <ActivityIndicator size="large" color="#4B7BE5" />
        : <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      }
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

export default CreateAdocaoScreen;