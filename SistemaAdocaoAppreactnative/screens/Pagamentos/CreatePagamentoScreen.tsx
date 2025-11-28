import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'CreatePagamento'>;

const CreatePagamentoScreen = ({ navigation }: Props) => {
  const [valor, setValor] = useState('');
  const [forma_pagamento, setFormaPagamento] = useState('PIX');
  const [campanha, setCampanha] = useState('');
  const [doador, setDoador] = useState('');
  const [comprovante_url, setComprovanteUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setValor('');
      setFormaPagamento('PIX');
      setCampanha('');
      setDoador('');
      setComprovanteUrl('');
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    
    const payload = { 
      valor: parseFloat(valor) || 0,
      forma_pagamento,
      campanha: campanha ? parseInt(campanha) : null,
      doador: doador ? parseInt(doador) : null,
      comprovante_url: comprovante_url || '',
      data_pagamento: new Date().toISOString().split('T')[0]
    };

    try {
    const API_URL = 'http://localhost:8000/pagamento/'; 

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    navigation.navigate('Pagamentos');  

     } catch (error) {
      alert('Erro ao cadastrar: ' + error);
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
      <Text style={styles.title}>Novo Pagamento</Text>
      
      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput
        value={valor}
        onChangeText={setValor}
        style={styles.input}
        placeholder="0.00"
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

      <Text style={styles.label}>ID da Campanha (opcional)</Text>
      <TextInput
        value={campanha}
        onChangeText={setCampanha}
        style={styles.input}
        placeholder="1"
        keyboardType="numeric"
      />

      <Text style={styles.label}>ID do Doador (opcional)</Text>
      <TextInput
        value={doador}
        onChangeText={setDoador}
        style={styles.input}
        placeholder="1"
        keyboardType="numeric"
      />

      <Text style={styles.label}>URL do Comprovante (opcional)</Text>
      <TextInput
        value={comprovante_url}
        onChangeText={setComprovanteUrl}
        style={styles.input}
        placeholder="https://..."
      />

      {saving
        ? <ActivityIndicator size="large" color="#4B7BE5" />
        : <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      }
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
  formaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default CreatePagamentoScreen;