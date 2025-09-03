import 'server-only'; 

import prisma from '@/src/lib/prisma';
import { PreguntaType } from '../schemas/pregunta.schema';
import { CompetenciaType } from '../schemas/competencia.schema';

export async function getPreguntas(): Promise<PreguntaType[]> {
  const preguntas = await prisma.pregunta.findMany({
    include: {
      opciones: true,
      contenidosCurriculares: true,
    },
  });
  return preguntas;
}

export async function getPreguntasByCompetencia(competenciaId: CompetenciaType['id']): Promise<PreguntaType[]> {
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
      contenidosCurriculares: true,
    },
  });
 
  return preguntas;
}
