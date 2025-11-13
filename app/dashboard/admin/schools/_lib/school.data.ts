'use server';

import prisma from '@/src/lib/prisma';

export async function getSchools() {
  try {
    const schools = await prisma.school.findMany({
      select: {
        id: true,
        nombre: true,
      },
      orderBy: {
        nombre: 'asc',
      }
    });
    return schools;
  } catch (error) {
    console.error('Error fetching schools:', error);
    return [];
  }
}