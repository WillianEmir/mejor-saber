import 'server-only';

import prisma from '../prisma';
import { PreguntaType } from '../schemas/pregunta.schema';

export async function getPreguntas(): Promise<PreguntaType[]> {
  try {
    const preguntas = await prisma.pregunta.findMany({
      include: {
        contenidosCurriculares: true,
        opciones: true
      }
    });
    return preguntas
  } catch (error) {
    console.error('Error de base de datos al obtener las preguntas:', error);
    throw new Error('No se pudieron obtener las preguntas.');
  }
}

export async function getPreguntaById(id: string): Promise<PreguntaType | null> {
  try {
    const pregunta = await prisma.pregunta.findUnique({
      where: { id },
      include: {
        contenidosCurriculares: true,
        opciones: true,
      },
    })
    return pregunta;
  } catch (error) {
    console.error('Error de base de datos al obtener la pregunta:', error);
    throw new Error('No se pudo obtener la pregunta.');
  }
}