import { CompetenciaType } from "@/app/dashboard/admin/areas/_lib/competencia.schema";
import { PreguntaWithRelationsType } from "@/app/dashboard/admin/preguntas/_lib/pregunta.schema";
import prisma from "@/src/lib/prisma";

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