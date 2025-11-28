import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { Campanha } from './CampanhasScreen';

type Props = DrawerScreenProps<DrawerParamList, 'EditCampanha'>;

const EditCampanhaScreen = ({ route, navigation }: Props) => {
  const { campanha } = route.params;
  const [titulo, setTitulo] = useState(campanha.titulo);
  const [descricao, setDescricao] = useState(campanha.descricao);
  const [tipo_campanha, setTipoCampanha] = useState(campanha.tipo_campanha);
  const [local, setLocal] = useState(campanha.local);
  const [meta_doacao, setMetaDoacao] = useState(campanha.meta_doacao);
  const [data_inicio, setDataInicio] = useState(campanha.data_inicio);
  const [data_fim, setDataFim] = useState(campanha.data_fim);
  const [status, setStatus] = useState(campanha.status);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitulo(campanha.titulo);
    setDescricao(campanha.descricao);
    setTipoCampanha(campanha.tipo_campanha);
    setLocal(campanha.local);
    setMetaDoacao(campanha.meta_doacao);
    setDataInicio(campanha.data_inicio);
    setDataFim(campanha.data_fim);
    setStatus(campanha.status);
  }, [campanha]);  

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      titulo,
      descricao,
      tipo_campanha,
      local,
      meta_doacao: parseFloat(meta_doacao) || 0,
      data_inicio,
      data_fim,
      status,
      ong: campanha.ong
    };

    const res = await fetch(
      `http://10.0.2.2:8000/campanhas/${campanha.id}/`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    
    navigation.navigate('Campanhas');        
    setSaving(false);  
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'A': return 'Ativa';
      case 'F': return 'Finalizada';
      case 'C': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Campanha</Text>
      
      <Text style={styles.label}>Título</Text>
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />

      <Text style={styles.label}>Tipo de Campanha</Text>
      <TextInput
        value={tipo_campanha}
        onChangeText={setTipoCampanha}
        style={styles.input}
      />

      <Text style={styles.label}>Local</Text>
      <TextInput
        value={local}
        onChangeText={setLocal}
        style={styles.input}
      />

      <Text style={styles.label}>Meta de Doação (R$)</Text>
      <TextInput
        value={meta_doacao}
        onChangeText={setMetaDoacao}
        style={styles.input}
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

      <Text style={styles.label}>Status</Text>
      <View style={styles.statusContainer}>
        {['A', 'F', 'C'].map((s) => (
          <Button 
            key={s}
            title={getStatusText(s)} 
            onPress={() => setStatus(s)} 
            color={status === s ? '#4B7BE5' : '#ccc'}
          />
        ))}
      </View>

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        value={descricao}
        onChangeText={setDescricao}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
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
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default EditCampanhaScreen;