'use server';

import prisma from '@/src/lib/prisma';

export async function getAdminDashboardStats() {
  try {
    const [userCount, questionCount, simulacroCount, schoolCount] = await prisma.$transaction([
      prisma.user.count(),
      prisma.pregunta.count(),
      prisma.simulacro.count(),
      prisma.school.count(),
    ]);
    return { userCount, questionCount, simulacroCount, schoolCount };
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return { userCount: 0, questionCount: 0, simulacroCount: 0, schoolCount: 0 };
  }
}

export async function getQuestionCountHierarchy() {
  try {
    const areas = await prisma.area.findMany({
      include: {
        competencias: {
          include: {
            afirmaciones: {
              include: {
                evidencias: {
                  include: {
                    _count: {
                      select: { preguntas: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    // Aggregate counts up the hierarchy
    const hierarchy = areas.map(area => {
      let areaQuestionCount = 0;
      const competencias = area.competencias.map(competencia => {
        let competenciaQuestionCount = 0;
        const afirmaciones = competencia.afirmaciones.map(afirmacion => {
          let afirmacionQuestionCount = 0;
          const evidencias = afirmacion.evidencias.map(evidencia => {
            const count = evidencia._count.preguntas;
            afirmacionQuestionCount += count;
            return {
              id: evidencia.id,
              nombre: evidencia.nombre,
              preguntaCount: count,
            };
          });
          competenciaQuestionCount += afirmacionQuestionCount;
          return {
            id: afirmacion.id,
            nombre: afirmacion.nombre,
            preguntaCount: afirmacionQuestionCount,
            evidencias,
          };
        });
        areaQuestionCount += competenciaQuestionCount;
        return {
          id: competencia.id,
          nombre: competencia.nombre,
          preguntaCount: competenciaQuestionCount,
          afirmaciones,
        };
      });
      return {
        id: area.id,
        nombre: area.nombre,
        preguntaCount: areaQuestionCount,
        competencias,
      };
    });

    return hierarchy;
  } catch (error) {
    console.error("Error fetching question count hierarchy:", error);
    return [];
  }
}
