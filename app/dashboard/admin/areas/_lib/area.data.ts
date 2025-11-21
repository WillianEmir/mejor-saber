
import prisma from '@/src/lib/prisma';
import { AreaCompetenciasType, AreaWithRelationsType, Areatype } from './area.schema';

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