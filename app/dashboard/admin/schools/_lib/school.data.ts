'use server';

import prisma from '@/src/lib/prisma'; 
import { SchoolWithSedesType } from './school.schema';

export async function getSchools() : Promise<SchoolWithSedesType[]> { 
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        nombre: 'asc',
      },
      include: {
        sedes: true,
      },
    });
    return schools;
  } catch (error) {
    console.error('Error fetching schools:', error);
    return [];
  }
}