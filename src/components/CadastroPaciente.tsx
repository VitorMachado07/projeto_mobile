import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Paciente } from '../types/Paciente';

interface Props {
  onAdicionar?: () => void; // Chama uma função depois de adicionar (ex: recarregar lista)
}

const prioridades = [
  { nivel: 1, descricao: 'Leve', cor: '#BBDEFB' },
  { nivel: 2, descricao: 'Menos Grave', cor: '#C8E6C9' },
  { nivel: 3, descricao: 'Urgência', cor: '#FFF59D' },
  { nivel: 4, descricao: 'Muita Urgência', cor: '#FFCC80' },
  { nivel: 5, descricao: 'Emergência', cor: '#EF9A9A' },
];

const CadastroPaciente: React.FC<Props> = ({ onAdicionar }) => {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<number>(1);

  const handleSubmit = async () => {
    if (!nome || !idade || !descricao) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos antes de salvar.');
      return;
    }

    const idadeNum = parseInt(idade);
    if (isNaN(idadeNum)) {
      Alert.alert('Idade inválida', 'Digite uma idade válida.');
      return;
    }

    try {
      const novoPaciente: Paciente = {
        nome,
        idade: idadeNum,
        descricao,
        prioridade,
      };

      const docRef = await firestore().collection('pacientes').add(novoPaciente);
      console.log('Paciente adicionado com ID:', docRef.id);

      Alert.alert('Sucesso', 'Paciente adicionado com sucesso!');
      setNome('');
      setIdade('');
      setDescricao('');
      setPrioridade(1);

      if (onAdicionar) {
        onAdicionar(); // Atualiza lista após adicionar
      }

    } catch (error: any) {
      console.error('Erro ao adicionar paciente:', error);
      Alert.alert('Erro', `Não foi possível adicionar o paciente: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput value={nome} onChangeText={setNome} style={styles.input} />

      <Text style={styles.label}>Idade:</Text>
      <TextInput
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Descrição do Problema:</Text>
      <TextInput value={descricao} onChangeText={setDescricao} style={styles.input} />

      <Text style={styles.label}>Prioridade:</Text>
      <View style={styles.prioridadeContainer}>
        {prioridades.map((p) => (
          <TouchableOpacity
            key={p.nivel}
            onPress={() => setPrioridade(p.nivel)}
            style={[
              styles.prioridadeBotao,
              { backgroundColor: p.cor },
              prioridade === p.nivel && styles.prioridadeSelecionada,
            ]}
          >
            <Text style={styles.textoBotao}>
              {p.nivel} - {p.descricao}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Adicionar Paciente" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  prioridadeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  prioridadeBotao: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 6,
    marginBottom: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  prioridadeSelecionada: {
    borderWidth: 2,
    borderColor: '#333',
  },
  textoBotao: {
    fontWeight: '600',
    color: '#222',
  },
});

export default CadastroPaciente;
