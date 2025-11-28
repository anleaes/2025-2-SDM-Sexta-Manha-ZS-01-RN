import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { Animal } from './AnimalsScreen';

type Props = DrawerScreenProps<DrawerParamList, 'EditAnimal'>;

const EditAnimalScreen = ({ route, navigation }: Props) => {
  const { animal } = route.params;
  const [nome, setNome] = useState(animal.nome);
  const [especie, setEspecie] = useState(animal.especie);
  const [raca, setRaca] = useState(animal.raca || '');
  const [idade, setIdade] = useState(animal.idade.toString());
  const [sexo, setSexo] = useState(animal.sexo);
  const [descricao, setDescricao] = useState(animal.descricao || '');
  const [necessidadesEspeciais, setNecessidadesEspeciais] = useState(animal.necessidades_especiais || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNome(animal.nome);
    setEspecie(animal.especie);
    setRaca(animal.raca || '');
    setIdade(animal.idade.toString());
    setSexo(animal.sexo);
    setDescricao(animal.descricao || '');
    setNecessidadesEspeciais(animal.necessidades_especiais || '');
  }, [animal]);  

  const handleSave = async () => {
    if (!nome || !especie || !idade) {
      alert('Por favor, preencha pelo menos Nome, Espécie e Idade');
      return;
    }

    setSaving(true);

    const payload = {
      nome,
      especie,
      raca: raca || 'SRD',
      idade: parseInt(idade) || 1,
      sexo,
      descricao: descricao || 'Atualizado via App',
      necessidades_especiais: necessidadesEspeciais || '',
      status: animal.status,
      data_entrada: animal.data_entrada,
      ong: animal.ong
    };

    try {
      const API_URL = `http://localhost:8000/animal/${animal.id}/`;

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
      navigation.navigate('Animals');

    } catch (error) {
      alert('Erro ao atualizar ' + error);
    } finally {
      setSaving(false);
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'A': return 'Aguardando Adoção';
      case 'D': return 'Adotado';
      case 'R': return 'Reservado';
      default: return status;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Animal</Text>
      <Text style={styles.currentStatus}>
        Status atual: {getStatusText(animal.status)}
      </Text>

      <Text style={styles.label}>Nome *</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        placeholder="Nome do Animal"
      />

      <Text style={styles.label}>Espécie *</Text>
      <TextInput
        value={especie}
        onChangeText={setEspecie}
        style={styles.input}
        placeholder="Cachorro, Gato, Pássaro..."
      />

      <Text style={styles.label}>Raça</Text>
      <TextInput
        value={raca}
        onChangeText={setRaca}
        style={styles.input}
        placeholder="SRD, Labrador, Siames..."
      />

      <Text style={styles.label}>Idade (anos) *</Text>
      <TextInput
        value={idade}
        onChangeText={setIdade}
        style={styles.input}
        placeholder="1"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Sexo</Text>
      <View style={styles.sexoContainer}>
        <Button 
          title="Fêmea" 
          onPress={() => setSexo('F')} 
          color={sexo === 'F' ? '#4B7BE5' : '#ccc'}
        />
        <Button 
          title="Macho" 
          onPress={() => setSexo('M')} 
          color={sexo === 'M' ? '#4B7BE5' : '#ccc'}
        />
      </View>

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        value={descricao}
        onChangeText={setDescricao}
        style={[styles.input, styles.textArea]}
        placeholder="Descreva o animal..."
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Necessidades Especiais</Text>
      <TextInput
        value={necessidadesEspeciais}
        onChangeText={setNecessidadesEspeciais}
        style={[styles.input, styles.textArea]}
        placeholder="Medicações, cuidados especiais..."
        multiline
        numberOfLines={2}
      />

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" style={styles.loader} />
      ) : (
        <Button title="Salvar Alterações" onPress={handleSave} color="#4B7BE5" />
      )}
      
      <View style={styles.spacer} />
      <Button title="Voltar" onPress={() => navigation.navigate('Animals')} color="#666" />
    </ScrollView>
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
    alignSelf: 'center',
    color: '#333'
  },
  currentStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
  },
  label: { 
    fontWeight: '600', 
    marginTop: 12, 
    marginBottom: 4,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  sexoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  loader: {
    marginVertical: 20,
  },
  spacer: {
    height: 10,
  }
});

export default EditAnimalScreen;