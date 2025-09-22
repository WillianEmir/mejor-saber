import 'server-only'; 

import prisma from '../prisma';
import { ObjetivoAprendizajeType } from '../schemas/objetivoAprendizaje.schema';
import { EjeTematicoType } from '../schemas/ejeTematico.schema';

// Obtiene los objetivos de aprendizaje
export async function getObjetivosAprendizaje(): Promise<ObjetivoAprendizajeType[] | null> {
  try {
    const objetivosAprendizaje = await prisma.objetivoAprendizaje.findMany({
      orderBy: { descripcion: 'asc' },
    });
    return objetivosAprendizaje;
  } catch (error) {
    console.error('Error de base de datos al obtener los Objetivos de Aprendizaje:', error);
    throw new Error('No se pudieron obtener los Objetivos de Aprendizaje.');
  }
}

// Obtine un objetivo de aprendizaje por su Id
export async function getObjetivoAprendizajeById(id: ObjetivoAprendizajeType['id']): Promise<ObjetivoAprendizajeType | null> {
  try {
    const objetivoAprendizaje = await prisma.objetivoAprendizaje.findUnique({
      where: { id }
    });
    return objetivoAprendizaje;
  } catch (error) {
    console.error('Error de base de datos al obtener el Objetivo de Aprendizaje:', error);
    throw new Error('No se pudieron obtener el Objetivo de Aprendizaje.');
  }
}

// Obtine los objetivos de aprendizaje por eje temático
export async function getObjetivosAprendizajeByEjeTematicoId(id: EjeTematicoType['id']): Promise<ObjetivoAprendizajeType[] | null> {
  try {
    const objetivosAprendizaje = await prisma.objetivoAprendizaje.findMany({
      where: { ejeTematicoId: id },
      orderBy: { descripcion: 'asc' },
    });
    return objetivosAprendizaje;
  } catch (error) {
    console.error('Error de base de datos al obtener los Objetivos de Aprendizaje:', error);
    throw new Error('No se pudieron obtener los Objetivos de Aprendizaje.');
  }
}

