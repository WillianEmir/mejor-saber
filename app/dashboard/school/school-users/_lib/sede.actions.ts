'use server';

import prisma from "@/src/lib/prisma";

export const getSedesBySchoolId = async (schoolId: string) => {
  try {
    const sedes = await prisma.schoolSede.findMany({
      where: {
        schoolId: schoolId,
      },
      select: {
        id: true,
        nombre: true,
      }
    });
    return sedes;
  } catch (error) {
    console.error('Error fetching sedes:', error);
    return [];
  }
};
