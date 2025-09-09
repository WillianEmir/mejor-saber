import 'server-only'; 

import prisma from '@/src/lib/prisma';
import { PreguntaWithRelationsType } from '../schemas/pregunta.schema';
import { CompetenciaType } from '../schemas/competencia.schema';

// Obtiene todas las preguntas con sus relaciones
export async function getPreguntasWithRelations(): Promise<PreguntaWithRelationsType[]> {
  const preguntas = await prisma.pregunta.findMany({
    include: {
      opciones: true,
      ejesTematicos: true,
    },
  });
  return preguntas;
}

// Obtiene las preguntas por Competencia con sus relaciones
export async function getPreguntasByCompetencia(competenciaId: CompetenciaType['id']): Promise<PreguntaWithRelationsType[]> {
  const preguntas = await prisma.pregunta.findMany({
    where: {
      evidencia: {
        afirmacion: {
          competenciaId: competenciaId,
        },
      },
    },
    include: {
      opciones: true,
      ejesTematicos: true,
    },
  });
 
  return preguntas; 
}
