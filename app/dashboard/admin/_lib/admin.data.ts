'use server' 

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

export async function getContenidoCurricularStats() {
  try {
    const areas = await prisma.area.findMany({
      include: {
        contenidosCurriculares: {
          include: {
            _count: {
              select: { ejesTematicos: true },
            },
          },
          orderBy: {
            nombre: 'asc',
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });
    return areas;
  } catch (error) {
    console.error("Error fetching contenido curricular stats:", error);
    return [];
  }
}

export async function getTestimoniosStats() {
  try {
    const testimonios = await prisma.testimonio.groupBy({
      by: ['rating'],
      _count: {
        rating: true,
      },
      orderBy: {
        rating: 'asc',
      },
    });
    return testimonios;
  } catch (error) {
    console.error("Error fetching testimonios stats:", error);
    return [];
  }
}

export async function getScoreDistributionByArea() {
  try {
    const areas = await prisma.area.findMany({
      include: {
        competencias: {
          include: {
            simulacros: {
              select: {
                score: true,
              },
            },
          },
        },
      },
    });

    const scoreDistribution = areas.map(area => {
      const scores = area.competencias.flatMap(c => c.simulacros.map(s => s.score).filter(s => s !== null)) as number[];
      const buckets = [0, 0, 0, 0, 0]; // 0-20, 21-40, 41-60, 61-80, 81-100
      scores.forEach(score => {
        if (score <= 20) buckets[0]++;
        else if (score <= 40) buckets[1]++;
        else if (score <= 60) buckets[2]++;
        else if (score <= 80) buckets[3]++;
        else buckets[4]++;
      });
      return {
        area: area.nombre,
        distribution: buckets,
      };
    });

    return scoreDistribution;
  } catch (error) {
    console.error("Error fetching score distribution by area:", error);
    return [];
  }
}
