
import { unstable_noStore as noStore } from 'next/cache';
import { AreaWithRelationsType, Areatype } from '../schemas/area.schema';
import prisma from '../prisma';

/**
 * Obtiene todas las áreas sin incluir relaciones.
 * @returns Un array de áreas.
 */
export const getAreas = async (): Promise<Areatype[]> => {
  noStore();
  try {
    const areas = await prisma.area.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });
    return areas;
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw new Error('No se pudieron obtener las áreas.');
  }
};

/**
 * Obtiene un área específica por su ID, sin incluir relaciones.
 * @param id - El ID del área a obtener.
 * @returns El área encontrada o null si no existe.
 */
export const getAreaById = async (id: string): Promise<Areatype | null> => {
  noStore();
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
 * Obtiene todas las áreas con sus relaciones completas.
 * @returns Un array de áreas con todas sus relaciones.
 */
export const getAreasWithRelations = async (): Promise<AreaWithRelationsType[]> => {
  noStore();
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
  noStore();
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

export async function getAllAreasWithContenidos() {
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