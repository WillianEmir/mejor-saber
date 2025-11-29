'use server'

import prisma from '@/src/lib/prisma';
import { AreaWithRelationsType, Areatype } from './area.schema';

// Obtiene todas las áreas, sin relaciones. 
export async function getAreas(): Promise<Areatype[]> {
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
    throw new Error('Error de base de datos: No se pudieron obtener las áreas.');
  }
};

// Obtiene un área por su Id, con sus relaciones.
export async function getAreaWithRelationsById(id: string): Promise<AreaWithRelationsType | null> {
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
    throw new Error('No se pudo obtener el área con sus relaciones.');
  }
};