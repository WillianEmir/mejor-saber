'use server' 

import prisma from '@/src/lib/prisma'; 

import { ContenidoCurricularType, ContenidoWithRelationsType } from './contenidoCurricular.schema';

// Obtiene todos los contenidos currculares con sus relaciones
export async function getContenidosWithRelations(): Promise<ContenidoWithRelationsType[]> {
  try {
    const contenidosCurriculares = await prisma.contenidoCurricular.findMany({ 
      include: { 
        area: true,
        ejesTematicos: true 
      }
    });
    return contenidosCurriculares;
  } catch (error) {
    console.error('Error de base de datos al obtener los Contenidos Curriculares:', error);
    throw new Error('No se pudieron obtener los Contenidos Curriculares.');
  }
}




// Obtiene un contenido curricular por su ID
export async function getContenidoCurricular(id: string): Promise<ContenidoCurricularType | null> {
  try {
    const contenidoCurricular = await prisma.contenidoCurricular.findUnique({
      where: { id },
    });
    return contenidoCurricular;
  } catch (error) {
    console.error('Error de base de datos al obtener el Contenido Curricular:', error);
    throw new Error('No se pudo obtener el Contenido Curricular.');
  }
}