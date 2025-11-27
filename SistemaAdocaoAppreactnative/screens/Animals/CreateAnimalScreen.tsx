
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'CreateAnimal'>;

const CreateAnimalScreen = ({ navigation }: Props) => {

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setNome('');
      setEspecie('');
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
        nome, 
        especie, 
        raca: 'SRD', 
        idade: 1, 
        sexo: 'F', 
        descricao: 'Cadastrado via App', 
        status: 'A', 
        data_entrada: new Date().toISOString().split('T')[0], 
        ong: 1 
    };

    await fetch('http://localhost:8000/animals/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({payload}),
    });


    navigation.navigate('Animals');  
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Animal para Adoção</Text>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        placeholder="Nome do Animal"
      />

       <Text style={styles.label}>Espécie</Text>
      <TextInput
        value={especie}
        onChangeText={setEspecie}
        style={styles.input} 
        placeholder="Cachorro, Gato, Pássaro..."
      />

      {saving
        ? <ActivityIndicator size="large" color="#4B7BE5" />
        : <Button title="Salvar Animal" onPress={handleSave} color="#4B7BE5" />
      }
      <Button title="Voltar" onPress={() => navigation.navigate('Animals')} /> 
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
    alignSelf: 'center' },
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

export default CreateAnimalScreen;
