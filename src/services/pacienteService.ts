import firestore from '@react-native-firebase/firestore';
import { Paciente } from "../types/Paciente";

const COLLECTION_NAME = 'pacientes';

export const adicionarPaciente = async (paciente: Paciente) => {
  await firestore().collection(COLLECTION_NAME).add(paciente);
};

export const listarPacientes = async (): Promise<{ id: string; data: Paciente }[]> => {
  const snapshot = await firestore().collection(COLLECTION_NAME).get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    data: doc.data() as Paciente,
  }));
};

export const removerPaciente = async (id: string) => {
  await firestore().collection(COLLECTION_NAME).doc(id).delete();
};
