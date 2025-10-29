'use server'

import prisma from '@/src/lib/prisma';
import type { AfirmacionType } from './afirmacion.schema';

// Obtiene todas las afirmaciones
export async function getAfirmaciones(): Promise<AfirmacionType[]> {
  try {
    const afirmaciones = await prisma.afirmacion.findMany({
      orderBy: { nombre: 'asc' },
    });
    return afirmaciones;
  } catch (error) {
    console.error('Error de base de datos al obtener las afirmaciones:', error);
    throw new Error('No se pudieron obtener las afirmaciones.');
  }
}

// Obtiene una afirmación por su ID
export async function getAfirmacionById(id: string): Promise<AfirmacionType | null> {
  try {
    const afirmacion = await prisma.afirmacion.findUnique({
      where: { id },
    });
    return afirmacion;
  } catch (error) {
    console.error('Error de base de datos al obtener la afirmación:', error);
    throw new Error('No se pudo obtener la afirmación.');
  }
}
