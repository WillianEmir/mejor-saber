import { CompetenciaType } from "@/app/dashboard/admin/areas/_lib/competencia.schema";
import { PreguntaWithRelationsType } from "@/app/dashboard/admin/preguntas/_lib/pregunta.schema";
import prisma from "@/src/lib/prisma";

// Obtiene las preguntas por Competencia de forma ALEATORIA con sus relaciones
export async function getPreguntasByCompetencia(competenciaId: CompetenciaType['id']): Promise<PreguntaWithRelationsType[]> {
  try {
    // 1. Obtener todos los IDs de preguntas para la competencia.
    const preguntaIds = (await prisma.pregunta.findMany({
      where: {
        evidencia: {
          afirmacion: {
            competenciaId
          },
        },
      },
      select: {
        id: true,
      },
    })).map(p => p.id);

    // 2. Barajar los IDs y tomar la cantidad especificada por 'limit'.
    const shuffledIds = preguntaIds.sort(() => 0.5 - Math.random());
    const selectedIds = shuffledIds.slice(0, 10);

    if (selectedIds.length === 0) {
      return [];
    }

    // 3. Obtener los datos completos de las preguntas seleccionadas.
    const preguntas = await prisma.pregunta.findMany({
      where: {
        id: {
          in: selectedIds,
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

// Estrategia refactorizada: Obtiene 10 preguntas aleatorias por cada competencia de un área.
export async function getPreguntasByArea(areaId: string): Promise<PreguntaWithRelationsType[]> {
  try {
    // 1. Obtener todas las competencias del área.
    const competencias = await prisma.competencia.findMany({
      where: {
        areaId,
      },
      select: {
        id: true,
      },
    });

    if (competencias.length === 0) {
      return []; // No hay competencias, no se pueden obtener preguntas.
    }

    // 2. Usar la función refactorizada para obtener 10 preguntas por cada competencia.
    const preguntasPromises = competencias.map(competencia => 
      getPreguntasByCompetencia(competencia.id)
    );

    // 3. Ejecutar todas las promesas en paralelo y unificar los resultados.
    const preguntasPorCompetencia = await Promise.all(preguntasPromises);
    const unifiedPreguntas = preguntasPorCompetencia.flat();
    
    // Devolver el array unificado y barajado una vez más para mezclar las preguntas de distintas competencias.
    return unifiedPreguntas.sort(() => 0.5 - Math.random());

  } catch (error) {
    console.error('Error al obtener preguntas de la base de datos:', error);
    throw new Error(`Error de base de datos: No se pudieron obtener las preguntas. ${error}`);
  }
}