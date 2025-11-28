import { DrawerScreenProps } from '@react-navigation/drawer';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerParamList } from '../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const quickActions = [
    {
      title: 'Animais',
      icon: 'paw-outline',
      color: '#4B7BE5',
      screen: 'Animals'
    },
    {
      title: 'Adoções',
      icon: 'heart-outline',
      color: '#E54848',
      screen: 'Adocoes'
    },
    {
      title: 'Pessoas',
      icon: 'people-outline',
      color: '#2E7D32',
      screen: 'Pessoas'
    },
    {
      title: 'ONGs',
      icon: 'business-outline',
      color: '#EF6C00',
      screen: 'Ongs'
    }
  ];

  const stats = [
    { label: 'Animais para adoção', value: '15', color: '#4B7BE5' },
    { label: 'Adoções realizadas', value: '32', color: '#E54848' },
    { label: 'Pessoas cadastradas', value: '48', color: '#2E7D32' },
    { label: 'ONGs parceiras', value: '5', color: '#EF6C00' }
  ];

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem-vindo ao</Text>
        <Text style={styles.appName}>Sistema de Adoção</Text>
      </View>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo</Text>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

     
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionButton, { backgroundColor: action.color }]}
              onPress={() => navigation.navigate(action.screen as any)}
            >
              <Ionicons name={action.icon as any} size={28} color="#fff" />
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.messageCard}>
        <Text style={styles.messageTitle}>Juntos fazemos a diferença</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4B7BE5',
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcome: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  appName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
    fontSize: 14,
  },
  messageCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HomeScreen;