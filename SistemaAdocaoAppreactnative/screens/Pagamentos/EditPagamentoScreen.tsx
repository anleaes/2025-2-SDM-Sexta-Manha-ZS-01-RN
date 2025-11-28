import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { Pagamento } from './PagamentosScreen';

type Props = DrawerScreenProps<DrawerParamList, 'EditPagamento'>;

const EditPagamentoScreen = ({ route, navigation }: Props) => {
  const { pagamento } = route.params;
  const [valor, setValor] = useState(pagamento.valor);
  const [forma_pagamento, setFormaPagamento] = useState(pagamento.forma_pagamento);
  const [data_pagamento, setDataPagamento] = useState(pagamento.data_pagamento);
  const [comprovante_url, setComprovanteUrl] = useState(pagamento.comprovante_url || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValor(pagamento.valor);
    setFormaPagamento(pagamento.forma_pagamento);
    setDataPagamento(pagamento.data_pagamento);
    setComprovanteUrl(pagamento.comprovante_url || '');
  }, [pagamento]);  

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      valor: parseFloat(valor) || 0,
      forma_pagamento,
      data_pagamento,
      comprovante_url,
      campanha: pagamento.campanha,
      doador: pagamento.doador
    };
    try {
      const API_URL = `http://localhost:8000/pagamento/${pagamento.id}/`;
    
      const response = await fetch(API_URL,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }
    
    navigation.navigate('Pagamentos'); 
      
    } catch (error) {
      alert('Erro ao atualizar: ' + error);
    } finally {
    setSaving(false); 
    } 
  };

  const getFormaPagamentoText = (forma: string) => {
    switch(forma) {
      case 'PIX': return 'Pix';
      case 'CC': return 'Cartão de Crédito';
      case 'BO': return 'Boleto';
      case 'TR': return 'Transferência';
      default: return forma;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Pagamento #{pagamento.id}</Text>
      
      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput
        value={valor}
        onChangeText={setValor}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Forma de Pagamento</Text>
      <View style={styles.formaContainer}>
        {['PIX', 'CC', 'BO', 'TR'].map((forma) => (
          <Button 
            key={forma}
            title={getFormaPagamentoText(forma)} 
            onPress={() => setFormaPagamento(forma)} 
            color={forma_pagamento === forma ? '#4B7BE5' : '#ccc'}
          />
        ))}
      </View>

      <Text style={styles.label}>Data do Pagamento</Text>
      <TextInput
        value={data_pagamento}
        onChangeText={setDataPagamento}
        style={styles.input}
        placeholder="AAAA-MM-DD"
      />

      <Text style={styles.label}>URL do Comprovante</Text>
      <TextInput
        value={comprovante_url}
        onChangeText={setComprovanteUrl}
        style={styles.input}
        placeholder="https://..."
      />

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
      <Button title="Voltar" onPress={() => navigation.navigate('Pagamentos')} />
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
  formaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default EditPagamentoScreen;