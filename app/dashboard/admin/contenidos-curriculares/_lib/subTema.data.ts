'use server'

import { SubTemaType } from './subTema.schema';
import { SeccionType } from './seccion.schema';
import prisma from '@/src/lib/prisma';

// Obtiene todos los subtemas
export async function getSubtemas(): Promise<SubTemaType[] | null> {
  try {
    const subtemas = await prisma.subTema.findMany({
      orderBy: { nombre: 'asc' },
    });
    return subtemas;
  } catch (error) {
    throw new Error('No se pudieron obtener los subtemas.');
  }
}

// Obtine un subtema por su Id
export async function getSubtemaById(id: SubTemaType['id']): Promise<SubTemaType | null> {
  try {
    const subTema = await prisma.subTema.findUnique({
      where: { id },
    });
    return subTema;
  } catch (error) {
    throw new Error('No se pudo obtener el subtema.');
  }
}

// Obtine los subtemas de una sección de un eje temático
export async function getSubtemasBySeccionId(id: SeccionType['id']): Promise<SubTemaType[] | null> {
  try {
    const subTemas = await prisma.subTema.findMany({
      where: { seccionId: id },
      orderBy: { nombre: 'asc' },
    });
    return subTemas;
  } catch (error) {
    throw new Error('No se pudieron obtener los subtemas.');
  }
}