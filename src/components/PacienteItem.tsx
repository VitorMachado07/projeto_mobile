import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Paciente } from '../types/Paciente';

interface Props {
  paciente: Paciente;
  onRemover: (id: string) => void;
}

const coresPrioridade = ['#BBDEFB', '#C8E6C9', '#FFF59D', '#FFCC80', '#EF9A9A'];
const descricoes = ['Leve', 'Menos Grave', 'Urgência', 'Muita Urgência', 'Emergência'];

const PacienteItem: React.FC<Props> = ({ paciente, onRemover }) => {
  const prioridadeIndex = paciente.prioridade - 1;
  const cor = coresPrioridade[prioridadeIndex] || '#E0E0E0';
  const descricaoPrioridade = descricoes[prioridadeIndex] || 'Desconhecida';

  return (
    <View style={[styles.card, { backgroundColor: cor }]}>
      <Text style={styles.titulo}>{paciente.nome} ({paciente.idade} anos)</Text>
      <Text>Problema: {paciente.descricao}</Text>
      <Text>Prioridade: {paciente.prioridade} - {descricaoPrioridade}</Text>
      {paciente.id && (
        <Button title="Remover" onPress={() => onRemover(paciente.id!)} color="red" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default PacienteItem;
