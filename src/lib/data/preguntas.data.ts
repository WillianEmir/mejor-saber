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
export async function getPreguntasByCompetencia(competenciaId: CompetenciaType['id'], limit?: number): Promise<PreguntaWithRelationsType[]> {
  try {
    const preguntas = await prisma.pregunta.findMany({
      take: limit,
      where: {
        evidencia: {
          afirmacion: {
            competenciaId
          },
        },
      },
      include: {
        opciones: true,
        ejesTematicos: true,
      },
    });
    return preguntas;
  } catch (error) {
    console.error('Error al obtener las preguntas de la base de datos:', error);
    throw new Error('Error de base de datos: No se pudo obtener las preguntas.');
  }
}

// Obtiene las preguntas por Area con sus relaciones
export async function getPreguntasByArea(areaId: string, limit?: number): Promise<PreguntaWithRelationsType[]> {
  try {
    const preguntas = await prisma.pregunta.findMany({
      take: limit,
      where: {
        evidencia: {
          afirmacion: {
            competencia: {
              areaId: areaId,
            },
          },
        },
      },
      include: {
        opciones: true,
        ejesTematicos: true,
      },
    });
    return preguntas;
  } catch (error) {
    console.error('Error al obtener preguntas de la base de datos:', error);
    throw new Error('Error de base de datos: No se pudieron obtener las preguntas.');
  }
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


