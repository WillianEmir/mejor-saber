'use server'

import prisma from '../prisma';
import { AreasFullType, AreaWithRelationsType } from '../schemas/area.schema';

export async function getAreas() {
  try {
    const areas = await prisma.area.findMany({
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
      },
    }); 
    return areas;
  } catch (error) {
    console.error('Error de base de datos al obtener las áreas:', error);
    throw new Error('No se pudieron obtener las áreas.');
  } 
}

export async function getAreaById(id: string) : Promise<AreaWithRelationsType | null> {
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
      },
    });
    return area;
  } catch (error) {
    console.error('Error de base de datos al obtener el área:', error);
    throw new Error('No se pudo obtener el área.');
  }
}

export async function getAreasFull() : Promise<AreasFullType[]> {
  try {
    const area = await prisma.area.findMany({
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
        contenidosCurriculares: true
      },
    });
    return area;
  } catch (error) {
    console.error('Error de base de datos al obtener el área:', error);
    throw new Error('No se pudo obtener el área.');
  }
}
