import 'server-only';

import prisma from '../prisma';
import { EjeTematicoType, ProgresoSeccionType, SeccionType } from '../schemas/ejeTematico.schema';
import { ContenidoCurricularType } from '../schemas/contenidoCurricular.schema';
import { Seccion } from '@/src/generated/prisma';
import { UserType } from '../schemas/user.schema';

// ----- ************ ----- //
// ----- EJE TEMÁTICO ----- //
// ----- ************ ----- //

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

// ----- ******* ----- //
// ----- SECCION ----- //
// ----- ******* ----- //

// Obtiene todas las secciones
export async function getSecciones(): Promise<SeccionType[] | null> {
  try {
    const secciones = await prisma.seccion.findMany({
      orderBy: { nombre: 'asc' },
    });
    return secciones;
  } catch (error) {
    console.error('Error de base de datos al obtener las secciones:', error);
    throw new Error('No se pudieron obtener las secciones.');
  }
}

// Obtine una sección por su Id
export async function getSeccionById(id: SeccionType['id']): Promise<SeccionType | null> {
  try {
    const seccion = await prisma.seccion.findUnique({
      where: { id },
    });
    return seccion;
  } catch (error) {
    console.error('Error de base de datos al obtener el Eje Temático:', error);
    throw new Error('No se pudo obtener el Eje Temático.');
  }
}

// Obtine las secciones de un eje temático
export async function getSeccionByEjeTematicoId(id: EjeTematicoType['id']): Promise<SeccionType[] | null> {
  try {
    const secciones = await prisma.seccion.findMany({
      where: { ejeTematicoId: id },
      orderBy: { nombre: 'asc' },
    });
    return secciones;
  } catch (error) {
    console.error('Error de base de datos al obtener los Ejes Temáticos:', error);
    throw new Error('No se pudo obtener los Ejes Temáticos.');
  }
}

// ----- **************** ----- //
// ----- PROGRESO SECCION ----- //
// ----- **************** ----- //

// Obtine el progreso de una sección por su Id
export async function getProgresoSeccionById(userId: UserType['id'], id: SeccionType['id']): Promise<ProgresoSeccionType | null> {
  try {
    const progresoSeccion = await prisma.progresoSeccion.findUnique({
      where: { 
        usuarioId_seccionId: {
          usuarioId: userId,
          seccionId: id
        }
      },
    });
    return progresoSeccion;
  } catch (error) {
    console.error('Error de base de datos al obtener el Progreso de la Sección:', error);
    throw new Error('No se pudo obtener el Progreso de la Sección.');
  }
}