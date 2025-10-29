import 'server-only'; 

import type { EvidenciaType } from './evidencia.schema';
import prisma from '@/src/lib/prisma';

// Obtiene todas las evidencias
export async function getEvidencias(): Promise<EvidenciaType[]> {
  try {
    const evidencias = await prisma.evidencia.findMany({
      orderBy: { nombre: 'asc' },
    });
    return evidencias;
  } catch (error) {
    console.error('Error de base de datos al obtener las evidencias:', error);
    throw new Error('No se pudieron obtener las evidencias.');
  }
}

// Obtiene una evidencia por su ID
export async function getEvidenciaById(id: string): Promise<EvidenciaType | null> {
  try {
    const evidencia = await prisma.evidencia.findUnique({
      where: { id },
    });
    return evidencia;
  } catch (error) {
    console.error('Error de base de datos al obtener la evidencia:', error);
    throw new Error('No se pudo obtener la evidencia.');
  }
}
