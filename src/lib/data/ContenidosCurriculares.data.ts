import 'server-only';

import prisma from '../prisma';
import { ContenidoCurricularType, ContenidoWithRelationsType } from '../schemas/contenidoCurricular.schema';

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