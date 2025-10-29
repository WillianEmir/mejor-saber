import 'server-only';

import type { CompetenciaType } from './competencia.schema';
import prisma from '@/src/lib/prisma';

// Obtiene todas las competencias
export async function getCompetencias(): Promise<CompetenciaType[]> {
  try {
    const competencias = await prisma.competencia.findMany({
      orderBy: { nombre: 'asc' },
    });
    return competencias;
  } catch (error) {
    console.error('Error de base de datos al obtener las competencias:', error);
    throw new Error('No se pudieron obtener las competencias.');
  }
}

// Obtiene una competencia por su ID
export async function getCompetenciaById(id: string): Promise<CompetenciaType | null> {
  try {
    const competencia = await prisma.competencia.findUnique({
      where: { id },
    });
    return competencia;
  } catch (error) {
    console.error('Error de base de datos al obtener la competencia:', error);
    throw new Error('No se pudo obtener la competencia.');
  }
}
