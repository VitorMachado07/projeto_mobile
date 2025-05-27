import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Paciente } from '../types/Paciente';
import CadastroPaciente from '../components/CadastroPaciente';
import ListaPacientes from '../components/ListaPaciente';

const TelaPrincipal: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pacientes')
      .orderBy('prioridade', 'desc')
      .onSnapshot(snapshot => {
        const lista: Paciente[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Paciente[];
        setPacientes(lista);
      }, error => {
        console.error('Erro ao carregar pacientes:', error);
        Alert.alert('Erro', 'Não foi possível carregar os pacientes.');
      });

    return () => unsubscribe();
  }, []);

  const handleAdicionar = async (paciente: Paciente) => {
    if (!paciente.nome || !paciente.idade || !paciente.descricao || !paciente.prioridade) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
      return;
    }

    try {
      await firestore().collection('pacientes').add(paciente);
      Alert.alert('Paciente adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o paciente.');
    }
  };

  const handleRemover = async (id: string) => {
    try {
      await firestore().collection('pacientes').doc(id).delete();
      Alert.alert('Paciente removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover paciente:', error);
      Alert.alert('Erro', 'Não foi possível remover o paciente.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Fila de Atendimento - UPA</Text>
        <View style={styles.formContainer}>
          <CadastroPaciente onAdicionar={handleAdicionar} />
        </View>
        <View style={styles.listaContainer}>
          <ListaPacientes pacientes={pacientes} onRemover={handleRemover} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e9f0f7',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#e9f0f7',
    flexGrow: 1,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    color: '#34495e',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    marginBottom: 30,
  },
  listaContainer: {
    flex: 1,
  },
});

export default TelaPrincipal;
