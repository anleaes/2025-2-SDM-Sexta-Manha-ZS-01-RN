import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { Animal } from './AnimalsScreen';

type Props = DrawerScreenProps<DrawerParamList, 'EditAnimal'>;

const EditAnimalScreen = ({ route, navigation }: Props) => {
  const { animal } = route.params;
  const [nome, setNome] = useState(animal.nome);
  const [especie, setEspecie] = useState(animal.especie);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNome(animal.nome);
    setEspecie(animal.especie);
  }, [animal]);  

  const handleSave = async () => {
    setSaving(true);

    const res = await fetch(
      `http://localhost:8000/categorias/${animal.id}/`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, especie }),
      }
    );
    navigation.navigate('Animals');        
    setSaving(false);  
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <Text style={styles.label}>Especie</Text>
      <TextInput
        value={especie}
        onChangeText={setEspecie}
        style={[styles.input, { height: 100 }]}
        multiline
      />
      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
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
  label: { 
    fontWeight: 'bold', 
    marginTop: 12, 
    marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
});

export default EditAnimalScreen;
