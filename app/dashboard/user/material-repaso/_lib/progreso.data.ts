import prisma from "@/src/lib/prisma";
import { MaterialRepasoType } from "@/app/dashboard/admin/areas/_lib/area.schema";

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