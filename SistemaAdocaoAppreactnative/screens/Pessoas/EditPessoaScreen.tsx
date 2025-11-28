import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { Pessoa } from './PessoasScreen';

type Props = DrawerScreenProps<DrawerParamList, 'EditPessoa'>;

const EditPessoaScreen = ({ route, navigation }: Props) => {
  const { pessoa } = route.params;
  const [nome, setNome] = useState(pessoa.nome);
  const [email, setEmail] = useState(pessoa.email);
  const [senha, setSenha] = useState(pessoa.senha || '');
  const [telefone, setTelefone] = useState(pessoa.telefone || '');
  const [cpf, setCpf] = useState(pessoa.cpf);
  const [preferencias_animal, setPreferenciasAnimal] = useState(pessoa.preferencias_animal || '');
  const [tipo_relacionamento, setTipoRelacionamento] = useState(pessoa.tipo_relacionamento);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNome(pessoa.nome);
    setEmail(pessoa.email);
    setSenha(pessoa.senha || '');
    setTelefone(pessoa.telefone || '');
    setCpf(pessoa.cpf);
    setPreferenciasAnimal(pessoa.preferencias_animal || '');
    setTipoRelacionamento(pessoa.tipo_relacionamento);
  }, [pessoa]);  

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      nome,
      email,
      senha: senha || pessoa.senha,
      telefone,
      cpf,
      preferencias_animal,
      tipo_relacionamento,
      historico_adocoes: pessoa.historico_adocoes,
      campanhas_participadas: pessoa.campanhas_participadas
    };

    try {
    const API_URL = `http://localhost:8000/pessoa/${pessoa.id}/`;


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

    navigation.navigate('Pessoas');        
    } catch (error) {
      alert('Erro ao atualizar: ' + error);
    } finally {
    setSaving(false);  
    }
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
      <Text style={styles.title}>Editar Pessoa</Text>
      
      <Text style={styles.label}>Nome</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        placeholder="Deixe em branco para manter atual"
        secureTextEntry
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>CPF</Text>
      <TextInput
        value={cpf}
        onChangeText={setCpf}
        style={styles.input}
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
        multiline
      />

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
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
  tipoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default EditPessoaScreen;