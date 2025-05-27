import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Paciente } from '../types/Paciente';
import PacienteItem from './PacienteItem';

const ListaPacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pacientes')
      .onSnapshot(snapshot => {
        const lista: Paciente[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Paciente[];

        setPacientes(lista);
      }, error => {
        console.error('Erro ao buscar pacientes:', error);
      });

    // Limpa o listener quando o componente desmontar
    return () => unsubscribe();
  }, []);

  const onRemover = async (id: string) => {
    try {
      await firestore().collection('pacientes').doc(id).delete();
      Alert.alert('Paciente removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover paciente:', error);
      Alert.alert('Erro', 'Não foi possível remover o paciente.');
    }
  };

  return (
    <View>
      {pacientes.map(p => (
        <PacienteItem key={p.id} paciente={p} onRemover={onRemover} />
      ))}
    </View>
  );
};

export default ListaPacientes;
