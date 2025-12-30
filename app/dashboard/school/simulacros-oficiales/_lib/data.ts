import prisma from '@/src/lib/prisma';

export async function getAreas() {
  try {
    const areas = await prisma.area.findMany({
      select: {
        id: true,
        nombre: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
    return areas;
  } catch (error) {
    console.error('Error fetching areas:', error);
    return [];
  }
}

export async function getOfficialSimulacrosBySchoolId(schoolId: string) {
  try {
    const officialSimulacros = await prisma.simulacroOficial.findMany({
      where: {
        schoolId: schoolId,
      },
      include: {
        area: {
          select: {
            id: true, 
            nombre: true,
          },
        },
      },
    });
    return officialSimulacros;
  } catch (error) {
    console.error('Error fetching official simulacros for school:', error);
    return [];
  }
}

export async function getOfficialSimulacroResults(simulacroOficialId: string, schoolId: string) {
  try {
    const simulacroOficial = await prisma.simulacroOficial.findUnique({
      where: {
        id: simulacroOficialId,
        schoolId: schoolId, // Security check
      },
      include: {
        area: true,
        simulacros: { // Fetch all related simulacros
          include: {
            user: { // Include user details for each simulacro
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          },
          orderBy: {
            score: 'desc' // Order by score, for example
          }
        }
      }
    });
    return simulacroOficial;
  } catch (error) {
    console.error('Error fetching official simulacro results:', error);
    return null;
  }
}
