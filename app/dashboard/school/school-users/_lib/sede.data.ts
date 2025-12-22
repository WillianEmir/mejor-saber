import prisma from '@/src/lib/prisma';
import { auth } from '@/auth'; // Updated import

export const getSchoolSedes = async () => { 

  const session = await auth(); // Updated call

  if (!session || session?.user?.role !== 'ADMINSCHOOL') {
    return [];
  } 

  const schoolId = session?.user?.schoolId;
  
  try {
    const sedes = await prisma.schoolSede.findMany({
      where: {
        schoolId: schoolId!,
      },
    });
    return sedes;
  } catch (error) {
    console.error("Error fetching school sedes:", error);
    return [];
  }
};