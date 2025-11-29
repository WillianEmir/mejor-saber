'use server'

import prisma from '@/src/lib/prisma';

import { PreguntaWithRelationsType } from './pregunta.schema';
import { AreaWithRelationsType } from '../../areas/_lib/area.schema';

interface GetPreguntasFilters { 
  areaId?: string;
  competenciaId?: string;
  afirmacionId?: string;
  evidenciaId?: string;
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

// Obtiene todas las preguntas con sus relaciones
export async function getPreguntasWithRelations(take: number = 10, skip: number = 0, filters: GetPreguntasFilters = {}): Promise<PreguntaWithRelationsType[]> {
  
  const where = buildWhereClause(filters);

  try {
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
  } catch (error) {
    console.error('Error al obtener las preguntas de la base de datos:', error);
    throw new Error('Error de base de datos: No se pudo obtener las preguntas.');
  }
}

// Obtiene el conteo total de preguntas
export async function getPreguntasCount(filters: GetPreguntasFilters = {}): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.pregunta.count({ where });
}

// Obtiene todas las áreas con sus competencias, afirmaciones, evidencias y contenidos curriculares
export const getAreasWithRelations = async (): Promise<AreaWithRelationsType[]> => {
  try {
    const areas = await prisma.area.findMany({
      include: {
        competencias: {
          include: {
            afirmaciones: {
              include: {
                evidencias: true,
              },
            },
          },
        },
        contenidosCurriculares: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
    return areas;
  } catch (error) {
    console.error('Error fetching areas with relations:', error);
    throw new Error('No se pudieron obtener las áreas con sus relaciones.');
  }
};