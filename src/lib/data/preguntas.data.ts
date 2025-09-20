import 'server-only';

import prisma from '@/src/lib/prisma';
import { PreguntaWithRelationsType } from '../schemas/pregunta.schema';
import { CompetenciaType } from '../schemas/competencia.schema';

interface GetPreguntasFilters {
  areaId?: string;
  competenciaId?: string;
  afirmacionId?: string;
  evidenciaId?: string;
}

// Obtiene todas las preguntas con sus relaciones
export async function getPreguntasWithRelations(
  take: number = 10,
  skip: number = 0,
  filters: GetPreguntasFilters = {}
): Promise<PreguntaWithRelationsType[]> {
  const where = buildWhereClause(filters);

  const preguntas = await prisma.pregunta.findMany({
    take,
    skip,
    where,
    include: {
      opciones: true,
      ejesTematicos: true,
    },
  });
  return preguntas; 
}

// Obtiene el conteo total de preguntas
export async function getPreguntasCount(filters: GetPreguntasFilters = {}): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.pregunta.count({ where });
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

function buildWhereClause(filters: GetPreguntasFilters) {
  const { areaId, competenciaId, afirmacionId, evidenciaId } = filters;

  if (evidenciaId) {
    return { evidenciaId };
  }
  if (afirmacionId) {
    return {
      evidencia: {
        afirmacionId,
      },
    };
  }
  if (competenciaId) {
    return {
      evidencia: {
        afirmacion: {
          competenciaId,
        },
      },
    };
  }
  if (areaId) {
    return {
      evidencia: {
        afirmacion: {
          competencia: {
            areaId,
          },
        },
      },
    };
  }
  return {};
}
