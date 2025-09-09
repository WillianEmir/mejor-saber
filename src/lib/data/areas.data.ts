'use server'

import { Area } from '@/src/generated/prisma';
import prisma from '../prisma';
import { Areatype, AreaWithRelationsType } from '../schemas/area.schema';

// Obtiene todas id y name de todas las áreas
export async function getAreas(): Promise<Areatype[]> { 
  try {
    const areas = await prisma.area.findMany({
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true, 
      }
    }); 
    return areas;
  } catch (error) {
    console.error('Error de base de datos al obtener las áreas:', error);
    throw new Error('No se pudieron obtener las áreas.');
  } 
}

// Obtiene un área con sus relaciones 
export async function getAreaById(id: Area['id']): Promise<AreaWithRelationsType> {
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
        contenidosCurriculares: true
      },
    });
    return area;
  } catch (error) {
    console.error('Error de base de datos al obtener el área:', error);
    throw new Error('No se pudo obtener el área.'); 
  }
}

// Obtiene todas las áreas con sus relaciones
export async function getAreasWithRelations() : Promise<AreaWithRelationsType[]> {
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
        contenidosCurriculares: true
      },
    });
    return areas;
  } catch (error) {
    console.error('Error de base de datos al obtener el área:', error);
    throw new Error('No se pudo obtener el área.');
  }
}
