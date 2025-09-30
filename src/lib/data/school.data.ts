'use server';

import prisma from '@/src/lib/prisma';
import { SchoolType, SchoolWithSedesType } from '../schemas/school.schema';

// ----- *********** ----- //
// ----- SCHOOL SEDE ----- //
// ----- *********** ----- //

// Función para obtener todas las school sedes de una school específica
export async function getSchoolSedesBySchoolId(id: string) : Promise<SchoolWithSedesType | null> {
  try {
    const schoolSedes = await prisma.school.findUnique({
      where: { id },
      include: { sedes: true }
    });

    if (!schoolSedes) return null;

    return schoolSedes;

  } catch (error) {
    throw new Error('No se pudieron obtener las sedes de la escuela.')  
  }
}

// ----- ****** ----- //
// ----- SCHOOL ----- //
// ----- ****** ----- //

// Función para obtener todas las schools
export async function getSchools() : Promise<SchoolWithSedesType[] | null> {
  try {
    const schools = await prisma.school.findMany({ include: { sedes: true } });

    if (!schools) return null;

    return schools;

  } catch (error) {
    throw new Error('No se pudieron obtener los subtemas.')  
  }
}

// Función para obtener una school por su ID
export async function getSchoolById(id: string) : Promise<SchoolType | null> {
  try {
    const school = await prisma.school.findUnique({
      where: { id }
    });

    if (!school) return null;

    return school;

  } catch (error) {
    throw new Error('No se pudo obtener la escuela.')  
  }
}
