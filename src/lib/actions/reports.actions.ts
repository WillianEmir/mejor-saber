"use server";

import prisma from "../prisma";


export const getSimulacroResults = async (schoolId: string) => {
  try {
    const results = await prisma.simulacro.findMany({
      where: {
        user: {
          schoolId,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        competencia: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getStudentProgress = async (schoolId: string) => {
  try {
    const students = await prisma.user.findMany({
      where: {
        schoolId,
        role: 'USER',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        progresosSeccion: {
          select: {
            avance: true,
            seccion: {
              select: {
                ejeTematicoId: true,
              },
            },
          },
        },
      },
    });

    const ejesTematicos = await prisma.ejeTematico.findMany({
      select: {
        id: true,
        nombre: true,
      },
    });

    const progressData = students.map(student => {
      const progressByEje = ejesTematicos.map(eje => {
        const seccionesOfEje = student.progresosSeccion.filter(
          p => p.seccion.ejeTematicoId === eje.id
        );
        const totalAvance = seccionesOfEje.reduce((acc, p) => acc + p.avance, 0);
        const averageProgress = seccionesOfEje.length > 0 ? totalAvance / seccionesOfEje.length : 0;
        return {
          ejeId: eje.id,
          ejeNombre: eje.nombre,
          progress: averageProgress,
        };
      });
      return {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName || ''}`.trim(),
        progress: progressByEje,
      };
    });

    return progressData;

  } catch (error) {
    console.error(error);
    return [];
  }
};