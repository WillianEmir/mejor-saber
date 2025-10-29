'use server'

import { ActividadInteractivaType } from './actividadInteractiva.schema';
import prisma from '@/src/lib/prisma';
import { SeccionType } from './seccion.schema';

// Obtiene todas las actividades interactivas
export async function getActividadesInteractivas(): Promise<ActividadInteractivaType[] | null> {
  try {
    const actividadesInteractivas = await prisma.actividadInteractiva.findMany({
      orderBy: { nombre: 'asc' },
    });
    return actividadesInteractivas;
  } catch (error) {
    console.error('Error de base de datos al obtener las actividades interactivas:', error);
    throw new Error('No se pudieron obtener las actividades interactivas.');
  }
}

// Obtine una actividad interactiva por su Id
export async function getActividadInteractivaById(id: ActividadInteractivaType['id']): Promise<ActividadInteractivaType | null> {
  try {
    const actividadInteractiva = await prisma.actividadInteractiva.findUnique({
      where: { id },
    });
    return actividadInteractiva;
  } catch (error) {
    console.error('Error de base de datos al obtener las actividades interactivas:', error);
    throw new Error('No se pudieron obtener las actividades interactivas.');
  }
}

// Obtine las actividades interactivas de una sección de un eje temático
export async function getActividadInteractivaBySeccionId(id: SeccionType['id']): Promise<ActividadInteractivaType[] | null> {
  try {
    const actividadesInteractivas = await prisma.actividadInteractiva.findMany({
      where: { id },
      orderBy: { nombre: 'asc' },
    });
    return actividadesInteractivas;
  } catch (error) {
    console.error('Error de base de datos al obtener las actividades interactivas:', error);
    throw new Error('No se pudieron obtener las actividades interactivas.');
  }
}