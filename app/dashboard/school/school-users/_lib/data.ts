
import prisma from '@/src/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

export const getSchoolSedes = async () => {

  const session = await getServerSession(authOptions);

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
    return [];
  }
};
