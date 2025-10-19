
import { AreaCompetenciasType, AreaWithRelationsType, Areatype, MaterialRepasoType } from '../schemas/area.schema';
import prisma from '../prisma';

// Obtiene todas las áreas, sin relaciones.
export const getAreas = async (): Promise<Areatype[]> => {
  try {
    const areas = await prisma.area.findMany({
      select: {
        id: true,
        nombre: true,
        descripcionCorta: true,
        descripcionLarga: true,
        imagen: true
      },
      orderBy: { nombre: 'asc' },
    });
    return areas;
  } catch (error) {
    console.error('Error al obtener áreas de la base de datos:', error);
    throw new Error('Error de base de datos: No se pudieron obtener las áreas.');
  }
};

// Obtiene un área por su Id, con sus competencias.
export const getAreaCompetencias = async (id: string): Promise<AreaCompetenciasType | null> => {
  try {
    const area = await prisma.area.findUnique({
      where: { id },
      include: { competencias: true },
    });
    return area;
  } catch (error) {
    console.error('Error al obtener el área de la base de datos:', error);
    throw new Error('Error de base de datos: No se pudo obtener el área.');
  }
};

// Obtiene un área por su Id.
export const getAreaById = async (id: string): Promise<Areatype | null> => {
  try {
    const area = await prisma.area.findUnique({
      where: { id },
    });
    return area;
  } catch (error) {
    console.error(`Error fetching area with id ${id}:`, error);
    throw new Error('No se pudo obtener el área.');
  }
};

// Obtiene las Áreas de repaso con el progreso alcanzado en cada Eje Temático
export async function getMaterialRepasoByUserId(userId: string): Promise<MaterialRepasoType[]> { 

  try {
    const areas = await prisma.area.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        contenidosCurriculares: {
          orderBy: { nombre: 'asc' },
          include: {
            ejesTematicos: {
              orderBy: { nombre: 'asc' },
              include: {
                secciones: {
                  include: {
                    subTemas: true,
                    actividades: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Helper function to get unique items
    const getUniqueItems = (arr: any[]) => [...new Map(arr.map(item => [item.id, item])).values()];

    // Calculate progress for each EjeTematico
    for (const area of areas) {
      for (const contenido of area.contenidosCurriculares) {
        for (const eje of contenido.ejesTematicos) {
          const allSubTemas = eje.secciones.flatMap(s => s.subTemas);
          const allActividades = eje.secciones.flatMap(s => s.actividades);
          const uniqueSubTemas = getUniqueItems(allSubTemas);
          const uniqueActividades = getUniqueItems(allActividades);
          const totalItems = uniqueSubTemas.length + uniqueActividades.length;

          if (totalItems === 0) {
            (eje as any).progress = 0;
            continue;
          }

          const completedSubTemas = await prisma.progresoSubTema.count({
            where: {
              usuarioId: userId,
              completado: true,
              subTemaId: { in: uniqueSubTemas.map(st => st.id) },
            },
          });

          const completedActividades = await prisma.progresoActividad.count({
            where: {
              usuarioId: userId,
              completado: true,
              actividadId: { in: uniqueActividades.map(a => a.id) },
            },
          });

          const totalCompleted = completedSubTemas + completedActividades;
          (eje as any).progress = Math.round((totalCompleted / totalItems) * 100);
        }
      }
    }

    return areas;
  } catch (error) {
    console.error("Error fetching material de repaso for user:", error);
    throw new Error("No se pudo obtener el material de repaso para el usuario.");
  }
}

// Obtiene el material de repaso personalizado basado en las respuestas incorrectas del usuario
export async function getMaterialPersonalizadoByUserId(userId: string): Promise<MaterialRepasoType[]> {
  try {
    // 1. Obtener las preguntas respondidas incorrectamente por el usuario
    const incorrectAnswers = await prisma.simulacroPregunta.findMany({
      where: {
        simulacro: {
          userId: userId,
        },
        correcta: false,
      },
      select: {
        preguntaId: true,
      },
    });

    if (incorrectAnswers.length === 0) {
      return [];
    }

    const incorrectQuestionIds = [...new Set(incorrectAnswers.map(a => a.preguntaId))];

    // 2. Obtener los ejes temáticos asociados a esas preguntas
    const preguntasConEjes = await prisma.pregunta.findMany({
      where: {
        id: { in: incorrectQuestionIds },
      },
      include: {
        ejesTematicos: true,
      },
    });

    const ejesTematicosIds = [...new Set(preguntasConEjes.flatMap(p => p.ejesTematicos.map(e => e.id)))];

    if (ejesTematicosIds.length === 0) {
      return [];
    }

    // 3. Obtener las áreas y la estructura de contenido para los ejes temáticos relevantes
    const areas = await prisma.area.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        contenidosCurriculares: {
          orderBy: { nombre: 'asc' },
          include: {
            ejesTematicos: {
              where: {
                id: { in: ejesTematicosIds },
              },
              orderBy: { nombre: 'asc' },
              include: {
                secciones: {
                  include: {
                    subTemas: true,
                    actividades: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Filtrar contenidos curriculares que no tienen ejes temáticos
    const areasWithContent = areas.map(area => ({
      ...area,
      contenidosCurriculares: area.contenidosCurriculares.filter(cc => cc.ejesTematicos.length > 0),
    })).filter(area => area.contenidosCurriculares.length > 0);


    // Helper function to get unique items
    const getUniqueItems = (arr: any[]) => [...new Map(arr.map(item => [item.id, item])).values()];

    // 4. Calcular el progreso para los ejes temáticos filtrados
    for (const area of areasWithContent) {
      for (const contenido of area.contenidosCurriculares) {
        for (const eje of contenido.ejesTematicos) {
          const allSubTemas = eje.secciones.flatMap(s => s.subTemas);
          const allActividades = eje.secciones.flatMap(s => s.actividades);
          const uniqueSubTemas = getUniqueItems(allSubTemas);
          const uniqueActividades = getUniqueItems(allActividades);
          const totalItems = uniqueSubTemas.length + uniqueActividades.length;

          if (totalItems === 0) {
            (eje as any).progress = 0;
            continue;
          }

          const completedSubTemas = await prisma.progresoSubTema.count({
            where: {
              usuarioId: userId,
              completado: true,
              subTemaId: { in: uniqueSubTemas.map(st => st.id) },
            },
          });

          const completedActividades = await prisma.progresoActividad.count({
            where: {
              usuarioId: userId,
              completado: true,
              actividadId: { in: uniqueActividades.map(a => a.id) },
            },
          });

          const totalCompleted = completedSubTemas + completedActividades;
          (eje as any).progress = Math.round((totalCompleted / totalItems) * 100);
        }
      }
    }

    return areasWithContent;
  } catch (error) {
    console.error("Error fetching material personalizado for user:", error);
    throw new Error("No se pudo obtener el material personalizado para el usuario.");
  }
}

/**
 * Obtiene todas las áreas con sus relaciones completas.
 * @returns Un array de áreas con todas sus relaciones.
 */
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

/**
 * Obtiene un área específica por su ID con todas sus relaciones.
 * @param id - El ID del área a obtener.
 * @returns El área con sus relaciones o null si no existe.
 */
export const getAreaWithRelationsById = async (id: string): Promise<AreaWithRelationsType | null> => {
  try {
    const area = await prisma.area.findUnique({
      where: { id },
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
    });
    return area;
  } catch (error) {
    console.error(`Error fetching area with relations with id ${id}:`, error);
    throw new Error('No se pudo obtener el área con sus relaciones.');
  }
};

export async function getAreasWithContenidos() {

  try {

    const areas = await prisma.area.findMany({

      include: {

        contenidosCurriculares: {

          include: {

            ejesTematicos: {

              orderBy: {

                nombre: 'asc',

              },

            },

          },

          orderBy: {

            nombre: 'asc',

          },

        },

      },

      orderBy: {

        nombre: 'asc',

      }

    });

    return areas;

  } catch (error) {

    console.error("Error fetching areas with contenidos:", error);

    return [];

  }

}