import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'CreatePessoa'>;

const CreatePessoaScreen = ({ navigation }: Props) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [preferencias_animal, setPreferenciasAnimal] = useState('');
  const [tipo_relacionamento, setTipoRelacionamento] = useState('A');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setNome('');
      setEmail('');
      setSenha('');
      setTelefone('');
      setCpf('');
      setPreferenciasAnimal('');
      setTipoRelacionamento('A');
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      nome,
      email,
      senha: senha || '123456', // senha padrão
      telefone: telefone || '',
      cpf,
      preferencias_animal: preferencias_animal || '',
      tipo_relacionamento,
      campanhas_participadas: []
    };

    const res = await fetch('http://10.0.2.2:8000/pessoas/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    navigation.navigate('Pessoas');  
    setSaving(false);
  };

  const getTipoRelacionamentoText = (tipo: string) => {
    switch(tipo) {
      case 'A': return 'Adotante';
      case 'D': return 'Doador';
      case 'ADM': return 'Administrador';
      default: return tipo;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Pessoa</Text>
      
      <Text style={styles.label}>Nome *</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        placeholder="Nome completo"
      />

      <Text style={styles.label}>Email *</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="email@exemplo.com"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        placeholder="Senha (opcional)"
        secureTextEntry
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
        placeholder="(00) 00000-0000"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>CPF *</Text>
      <TextInput
        value={cpf}
        onChangeText={setCpf}
        style={styles.input}
        placeholder="000.000.000-00"
      />

      <Text style={styles.label}>Tipo de Relacionamento</Text>
      <View style={styles.tipoContainer}>
        {['A', 'D', 'ADM'].map((tipo) => (
          <Button 
            key={tipo}
            title={getTipoRelacionamentoText(tipo)} 
            onPress={() => setTipoRelacionamento(tipo)} 
            color={tipo_relacionamento === tipo ? '#4B7BE5' : '#ccc'}
          />
        ))}
      </View>

      <Text style={styles.label}>Preferências de Animal</Text>
      <TextInput
        value={preferencias_animal}
        onChangeText={setPreferenciasAnimal}
        style={[styles.input, { height: 80 }]}
        placeholder="Preferências por espécie, raça, tamanho..."
        multiline
      />

      {saving
        ? <ActivityIndicator size="large" color="#4B7BE5" />
        : <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      }
      <Button title="Voltar" onPress={() => navigation.navigate('Pessoas')} />
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
  tipoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default CreatePessoaScreen;