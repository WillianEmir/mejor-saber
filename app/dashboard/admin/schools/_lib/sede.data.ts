'use server'

import prisma from "@/src/lib/prisma";
import { SchoolWithSedesType } from "./school.schema";

// Función para obtener todas las sedes de una school por su Id
export async function getSchoolSedesBySchoolId(id: string): Promise<SchoolWithSedesType | null> {
  try {
    const schoolSedes = await prisma.school.findUnique({
      where: { id },
      include: { sedes: true }
    });
    return schoolSedes;
  } catch (error) {
    console.error('Error obteniendo las escuelas con sus sedes:', error);
    throw new Error('No se pudieron obtener las escuelas con sus relaciones.');
  }
} 