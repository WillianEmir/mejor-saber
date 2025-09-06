import 'server-only';

import prisma from '../prisma';
import { EjeTematicoType } from '../schemas/ejeTematico.schema';

export async function getEjesTematicos(): Promise<EjeTematicoType[]> {
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

export async function getEjeTematicoById(id: string): Promise<EjeTematicoType | null> {
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