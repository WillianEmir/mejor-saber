'use server'

import { EjeTematicoType, EjeTematicoWithRelationsType } from './ejeTematico.schema';
import { ContenidoCurricularType } from './contenidoCurricular.schema';
import prisma from '@/src/lib/prisma';

// Obtiene todos los ejes temáticos
export async function getEjesTematicos(): Promise<EjeTematicoType[] | null> {
  try {
    const ejesTematicos = await prisma.ejeTematico.findMany({
      orderBy: { nombre: 'asc' },
    });
    return ejesTematicos;
  } catch (error) {
    console.error('Error de base de datos al obtener los Ejes Temáticos:', error);
    throw new Error('No se pudieron obtener los Ejes Temáticos.');
  }
}

// Obtine un eje temático por su Id
export async function getEjeTematicoById(id: EjeTematicoType['id']): Promise<EjeTematicoType | null> {
  try {
    const ejeTematico = await prisma.ejeTematico.findUnique({
      where: { id },
    });
    return ejeTematico;
  } catch (error) {
    console.error('Error de base de datos al obtener el Eje Temático:', error);
    throw new Error('No se pudo obtener el Eje Temático.');
  }
}

// Obtine un eje temático por su Id con todas sus relaciones 
export async function getEjeTematicodwithRelations(id: EjeTematicoType['id']): Promise<EjeTematicoWithRelationsType | null> {
  try {
    const ejeTematico = await prisma.ejeTematico.findUnique({
      where: { id },
      include: {
        contenidoCurricular: {
          include: {
            area: true
          }
        },
        objetivosAprendizaje: true,
        secciones: {
          include: {
            subTemas: {
              include: {
                progresos: true
              }
            },
            actividades: {
              include: {
                progresos: true
              }
            },
            progresos: true
          }
        }
      }
    });
    return ejeTematico;
  } catch (error) {
    console.error('Error de base de datos al obtener el Eje Temático:', error);
    throw new Error('No se pudo obtener el Eje Temático.');
  }
}

// Obtine los ejes temáticos de un contenido curricular
export async function getEjesTematicosByContenidoCurricularId(id: ContenidoCurricularType['id']): Promise<EjeTematicoType[] | null> {
  try {
    const ejesTematicos = await prisma.ejeTematico.findMany({
      where: { contenidoCurricularId: id },
      orderBy: { nombre: 'asc' },
    });
    return ejesTematicos;
  } catch (error) {
    console.error('Error de base de datos al obtener los Ejes Temáticos:', error);
    throw new Error('No se pudo obtener los Ejes Temáticos.');
  }
}