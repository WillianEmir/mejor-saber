'use server'

import prisma from '@/src/lib/prisma';
import { auth } from '@/auth';

import { SummaryData } from '../../user/_components/dashboard.schema';
import { CompetenciaProgressType, EvidenciaProgressType } from '../../user/_lib/progress.schema';
import { NivelDesempenoData, SchoolProgressData } from './school.schema';

import { BarChartDataType } from '@/src/components/ui/charts/BarChart';

// Define la estructura de datos para la exportación de estudiantes
export type StudentExportDataType = {
  id: string;
  name: string;
  lastName: string;
  degree: string;
  sede: string;
  simulationsTaken: number;
  generalAverage: number;
  initialOverallScore: number;
  finalOverallScore: number;
  areaAverages: { name: string; first: number; average: number; last: number }[];
  competenciaAverages: CompetenciaProgressType[];
  evidenciaAverages: EvidenciaProgressType[];
};

// Obtiene los datos del estado inicial, estado final, promedio y otros datos de todos los simulacros realizados por los usuarios de una escuela
export async function getSchoolProgressChartsData(schoolId: string): Promise<SchoolProgressData> {

  const session = await auth();
  if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ADMINSCHOOL') {
    throw new Error('Usuario no autorizado');
  }

  // 1. Obtención y Agregación de Datos Base desde simulacroPregunta
  const [simulacroPreguntas, nivelesDefiniciones] = await Promise.all([
    prisma.simulacroPregunta.findMany({
      where: {
        simulacro: {
          user: {
            schoolId: schoolId,
          },
          areaId: {
            not: null,
          },
        },
      },
      orderBy: {
        simulacro: {
          createdAt: 'asc',
        },
      },
      include: {
        simulacro: {
          include: {
            user: {
              include: {
                schoolSede: true,
              },
            },
          },
        },
        pregunta: {
          include: {
            evidencia: {
              include: {
                afirmacion: {
                  include: {
                    competencia: {
                      include: {
                        area: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.nivelDesempeno.findMany({ include: { area: true } }),
  ]);

  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: {
      _count: {
        select: { users: true },
      },
    },
  });

  const userName = school?.nombre ?? 'Escuela';

  const emptyChartData: BarChartDataType = {
    labels: [],
    datasets: [
      {
        label: 'Sin datos',
        data: [],
        backgroundColor: [],
      },
    ],
  };

  const emptySummaryData: SummaryData = {
    userName: userName,
    simulationsTaken: 0,
    generalAverage: 0,
    averageTimePerQuestion: 0,
    bestPerformingArea: null,
    worstPerformingArea: null,
    areaAverages: [],
    registeredUsers: school?._count.users ?? 0,
    maxUsers: school?.maxUsers,
  };

  if (simulacroPreguntas.length === 0) {
    return {
      summaryData: emptySummaryData,
      overallProgressData: {
        labels: ['Estado Inicial', 'Promedio General', 'Estado Final'],
        datasets: [
          {
            label: 'Puntaje Global ICFES (0-500)',
            data: [0, 0, 0],
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(75, 192, 192, 0.5)',
            ],
          },
        ],
      },
      areaProgressData: emptyChartData,
      areaAverages: [],
      competenciaAverages: [],
      evidenciaAverages: [],
      studentExportData: [],
      nivelesDesempenoData: [],
      nivelesDefiniciones: [],
    };
  }

  // Mapa para almacenar los datos de cada estudiante
  const studentData = new Map<
    string,
    {
      details: {
        id: string;
        name: string;
        lastName: string;
        degree: string;
        sede: string;
      };
      performanceBySimulacro: Map<
        string,
        Map<string, { correct: number; total: number }>
      >;
      performanceBySimulacroEvidencia: Map<
        string,
        Map<string, { correct: number; total: number }>
      >;
      simulacroDates: Map<string, Date>;
      simulacroDetails: Map<
        string,
        { duration: number; questionCount: number; score: number }
      >;
    }
  >();

  for (const sp of simulacroPreguntas) {
    const userId = sp.simulacro.user.id;

    if (!studentData.has(userId)) {
      studentData.set(userId, {
        details: {
          id: userId,
          name: sp.simulacro.user.name,
          lastName: sp.simulacro.user.lastName ?? '',
          degree: sp.simulacro.user.degree ?? 'No especificado',
          sede: sp.simulacro.user.schoolSede?.nombre ?? 'No especificada',
        },
        performanceBySimulacro: new Map(),
        performanceBySimulacroEvidencia: new Map(),
        simulacroDates: new Map(),
        simulacroDetails: new Map(),
      });
    }

    const student = studentData.get(userId)!;
    const competencia = sp.pregunta?.evidencia?.afirmacion?.competencia;
    const evidencia = sp.pregunta?.evidencia;
    const { simulacro } = sp;

    student.simulacroDates.set(simulacro.id, simulacro.createdAt);

    if (!student.simulacroDetails.has(simulacro.id)) {
      student.simulacroDetails.set(simulacro.id, {
        duration: simulacro.duracionMinutos || 0,
        questionCount: 0,
        score: simulacro.score || 0,
      });
    }
    student.simulacroDetails.get(simulacro.id)!.questionCount++;

    if (competencia) {
      let simulacroMap = student.performanceBySimulacro.get(simulacro.id);
      if (!simulacroMap) {
        simulacroMap = new Map();
        student.performanceBySimulacro.set(simulacro.id, simulacroMap);
      }
      let competenciaStats = simulacroMap.get(competencia.id);
      if (!competenciaStats) {
        competenciaStats = { correct: 0, total: 0 };
        simulacroMap.set(competencia.id, competenciaStats);
      }
      competenciaStats.total++;
      if (sp.correcta) {
        competenciaStats.correct++;
      }
    }

    if (evidencia) {
      let simulacroMap = student.performanceBySimulacroEvidencia.get(
        simulacro.id
      );
      if (!simulacroMap) {
        simulacroMap = new Map();
        student.performanceBySimulacroEvidencia.set(simulacro.id, simulacroMap);
      }
      let evidenciaStats = simulacroMap.get(evidencia.id);
      if (!evidenciaStats) {
        evidenciaStats = { correct: 0, total: 0 };
        simulacroMap.set(evidencia.id, evidenciaStats);
      }
      evidenciaStats.total++;
      if (sp.correcta) {
        evidenciaStats.correct++;
      }
    }
  }

  const allCompetencias = await prisma.competencia.findMany({
    include: { area: true },
  });
  const competenciasMap = new Map(allCompetencias.map(c => [c.id, c]));
  const competencyCountByArea = new Map<string, number>();
  allCompetencias.forEach(comp => {
    const areaName = comp.area.nombre;
    competencyCountByArea.set(
      areaName,
      (competencyCountByArea.get(areaName) || 0) + 1
    );
  });

  const allEvidencias = await prisma.evidencia.findMany({
    include: {
      afirmacion: {
        include: {
          competencia: {
            include: {
              area: true,
            },
          },
        },
      },
    },
  });
  const evidenciasMap = new Map(allEvidencias.map(e => [e.id, e]));

  const calculateIcfesScore = (areaScores: Map<string, number>): number => {
    const mat = areaScores.get('Matemáticas') || 0;
    const lec = areaScores.get('Lectura Crítica') || 0;
    const soc = areaScores.get('Sociales y Ciudadanas') || 0;
    const cie = areaScores.get('Ciencias Naturales') || 0;
    const ing = areaScores.get('Inglés') || 0;
    if ([mat, lec, soc, cie, ing].every(v => v === 0)) return 0;
    const weightedSum = mat * 3 + lec * 3 + soc * 3 + cie * 3 + ing * 1;
    const finalScore = (weightedSum / 13) * 5;
    return Math.round(finalScore);
  };

  const schoolAggregatedMetrics = {
    initialScores: [] as number[],
    finalScores: [] as number[],
    averageScores: [] as number[],
    areaAverages: new Map<
      string,
      { first: number[]; average: number[]; last: number[] }
    >(),
  };

  const studentExportData: StudentExportDataType[] = [];

  const schoolCompetencyMetrics = new Map<
    string,
    {
      name: string;
      areaName: string;
      firstScores: number[];
      lastScores: number[];
      allScores: number[];
    }
  >();

  const schoolNivelesMetrics = new Map<string, { [key: string]: number }>();

  const avg = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((acc, v) => acc + v, 0) / arr.length : 0;

  const schoolEvidenciaMetrics = new Map<
    string,
    {
      name: string;
      competenciaName: string;
      areaName: string;
      firstScores: number[];
      lastScores: number[];
      allScores: number[];
    }
  >();

  for (const student of studentData.values()) {
    const sortedSimulacroIds = Array.from(student.simulacroDates.keys()).sort(
      (a, b) =>
        student.simulacroDates.get(a)!.getTime() -
        student.simulacroDates.get(b)!.getTime()
    );

    const progressByCompetencia = new Map<
      string,
      { name: string; areaName: string; scores: number[] }
    >();

    for (const simulacroId of sortedSimulacroIds) {
      const simulacroMap = student.performanceBySimulacro.get(simulacroId);
      if (!simulacroMap) continue;

      for (const [competenciaId, stats] of simulacroMap.entries()) {
        if (stats.total === 0) continue;
        const score = (stats.correct / stats.total) * 100;
        let competenciaProgress = progressByCompetencia.get(competenciaId);
        const competenciaInfo = competenciasMap.get(competenciaId);
        if (!competenciaInfo) continue;

        if (!competenciaProgress) {
          competenciaProgress = {
            name: competenciaInfo.nombre,
            areaName: competenciaInfo.area.nombre,
            scores: [],
          };
          progressByCompetencia.set(competenciaId, competenciaProgress);
        }
        competenciaProgress.scores.push(score);
      }
    }

    for (const [competenciaId, data] of progressByCompetencia.entries()) {
      if (!schoolCompetencyMetrics.has(competenciaId)) {
        schoolCompetencyMetrics.set(competenciaId, {
          name: data.name,
          areaName: data.areaName,
          firstScores: [],
          lastScores: [],
          allScores: [],
        });
      }
      const metric = schoolCompetencyMetrics.get(competenciaId)!;
      if (data.scores.length > 0) {
        metric.firstScores.push(data.scores[0]);
        metric.lastScores.push(data.scores[data.scores.length - 1]);
        metric.allScores.push(...data.scores);
      }
    }

    // ... (El resto del bucle de estudiante sigue aquí)
    const getAreaScores = (
      scoreSelector: (scores: number[]) => number | undefined
    ): Map<string, number> => {
      const competencyScoresByArea = new Map<string, number[]>();
      for (const { areaName, scores } of progressByCompetencia.values()) {
        const selectedScore = scoreSelector(scores);
        if (selectedScore !== undefined) {
          if (!competencyScoresByArea.has(areaName)) {
            competencyScoresByArea.set(areaName, []);
          }
          competencyScoresByArea.get(areaName)!.push(selectedScore);
        }
      }
      const areaAverages = new Map<string, number>();
      for (const [areaName, totalCompetencies] of competencyCountByArea.entries()) {
        const scores = competencyScoresByArea.get(areaName) || [];
        const sumOfScores = scores.reduce((acc, s) => acc + s, 0);
        const average =
          totalCompetencies > 0 ? sumOfScores / totalCompetencies : 0;
        areaAverages.set(areaName, average);
      }
      return areaAverages;
    };

    const initialAreaScores = getAreaScores(scores => scores[0]);
    const finalAreaScores = getAreaScores(scores => scores[scores.length - 1]);
    const averageAreaScores = getAreaScores(
      scores => scores.reduce((acc, s) => acc + s, 0) / scores.length
    );

    for (const [areaName, score] of averageAreaScores.entries()) {
      const nivelDef = nivelesDefiniciones.find(
        n => n.area.nombre === areaName && score >= n.puntajeMin && score <= n.puntajeMax
      );
      if (nivelDef) {
        if (!schoolNivelesMetrics.has(areaName)) {
          schoolNivelesMetrics.set(areaName, { 'NIVEL1': 0, 'NIVEL2': 0, 'NIVEL3': 0, 'NIVEL4': 0 });
        }
        const areaMetrics = schoolNivelesMetrics.get(areaName)!;
        areaMetrics[nivelDef.nivel]++;
      }
    }

    const studentInitialScore = calculateIcfesScore(initialAreaScores);
    const studentFinalScore = calculateIcfesScore(finalAreaScores);
    const studentAverageScore = calculateIcfesScore(averageAreaScores);

    schoolAggregatedMetrics.initialScores.push(studentInitialScore);
    schoolAggregatedMetrics.finalScores.push(studentFinalScore);
    schoolAggregatedMetrics.averageScores.push(studentAverageScore);

    const studentAreaAverages = Array.from(competencyCountByArea.keys()).map(
      name => ({
        name: name,
        first: initialAreaScores.get(name) || 0,
        average: averageAreaScores.get(name) || 0,
        last: finalAreaScores.get(name) || 0,
      })
    );

    studentAreaAverages.forEach(area => {
      if (!schoolAggregatedMetrics.areaAverages.has(area.name)) {
        schoolAggregatedMetrics.areaAverages.set(area.name, {
          first: [],
          average: [],
          last: [],
        });
      }
      const schoolArea = schoolAggregatedMetrics.areaAverages.get(area.name)!;
      schoolArea.first.push(area.first);
      schoolArea.average.push(area.average);
      schoolArea.last.push(area.last);
    });

    const studentCompetenciaAverages: CompetenciaProgressType[] = Array.from(
      progressByCompetencia.values()
    ).map(metric => ({
      name: metric.name,
      areaName: metric.areaName,
      first: metric.scores.length > 0 ? metric.scores[0] : 0,
      last: metric.scores.length > 0 ? metric.scores[metric.scores.length - 1] : 0,
      average: avg(metric.scores),
    }));

    const progressByEvidencia = new Map<
      string,
      {
        name: string;
        competenciaName: string;
        areaName: string;
        scores: number[];
      }
    >();

    for (const simulacroId of sortedSimulacroIds) {
      const simulacroMap = student.performanceBySimulacroEvidencia.get(simulacroId);
      if (!simulacroMap) continue;

      for (const [evidenciaId, stats] of simulacroMap.entries()) {
        if (stats.total === 0) continue;
        const score = (stats.correct / stats.total) * 100;
        const evidenciaInfo = evidenciasMap.get(evidenciaId);
        if (!evidenciaInfo) continue;

        let evidenciaProgress = progressByEvidencia.get(evidenciaId);
        if (!evidenciaProgress) {
          evidenciaProgress = {
            name: evidenciaInfo.nombre,
            competenciaName: evidenciaInfo.afirmacion.competencia.nombre,
            areaName: evidenciaInfo.afirmacion.competencia.area.nombre,
            scores: [],
          };
          progressByEvidencia.set(evidenciaId, evidenciaProgress);
        }
        evidenciaProgress.scores.push(score);
      }
    }

    const studentEvidenciaAverages: EvidenciaProgressType[] = Array.from(
      progressByEvidencia.values()
    ).map(metric => ({
      name: metric.name,
      competenciaName: metric.competenciaName,
      areaName: metric.areaName,
      first: metric.scores.length > 0 ? metric.scores[0] : 0,
      last: metric.scores.length > 0 ? metric.scores[metric.scores.length - 1] : 0,
      average: avg(metric.scores),
    }));

    for (const [evidenciaId, data] of progressByEvidencia.entries()) {
      if (!schoolEvidenciaMetrics.has(evidenciaId)) {
        schoolEvidenciaMetrics.set(evidenciaId, {
          name: data.name,
          competenciaName: data.competenciaName,
          areaName: data.areaName,
          firstScores: [],
          lastScores: [],
          allScores: [],
        });
      }
      const metric = schoolEvidenciaMetrics.get(evidenciaId)!;
      if (data.scores.length > 0) {
        metric.firstScores.push(data.scores[0]);
        metric.lastScores.push(data.scores[data.scores.length - 1]);
        metric.allScores.push(...data.scores);
      }
    }

    studentExportData.push({
      id: student.details.id,
      name: student.details.name,
      lastName: student.details.lastName,
      degree: student.details.degree,
      sede: student.details.sede,
      simulationsTaken: student.simulacroDetails.size,
      generalAverage: studentAverageScore,
      initialOverallScore: studentInitialScore,
      finalOverallScore: studentFinalScore,
      areaAverages: studentAreaAverages,
      competenciaAverages: studentCompetenciaAverages,
      evidenciaAverages: studentEvidenciaAverages,
    });
  }

  const competenciaAverages: CompetenciaProgressType[] = Array.from(
    schoolCompetencyMetrics.values()
  ).map(metric => ({
    name: metric.name,
    areaName: metric.areaName,
    first: avg(metric.firstScores),
    last: avg(metric.lastScores),
    average: avg(metric.allScores),
  }));

  const estadoInicial = avg(schoolAggregatedMetrics.initialScores);
  const estadoFinal = avg(schoolAggregatedMetrics.finalScores);
  const promedioGeneralIcfes = avg(schoolAggregatedMetrics.averageScores);

  const overallProgressData: BarChartDataType = {
    labels: ['Estado Inicial', 'Promedio General', 'Estado Final'],
    datasets: [
      {
        label: 'Puntaje Global ICFES (0-500)',
        borderWidth: 1,
        borderRadius: 5,
        data: [estadoInicial, promedioGeneralIcfes, estadoFinal],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
      },
    ],
  };

  const areaNames = Array.from(competencyCountByArea.keys());
  const areaAverages = areaNames.map(name => {
    const schoolArea = schoolAggregatedMetrics.areaAverages.get(name) ?? {
      first: [],
      average: [],
      last: [],
    };
    return {
      name: name,
      first: avg(schoolArea.first),
      average: avg(schoolArea.average),
      last: avg(schoolArea.last),
    };
  });

  const areaProgressData: BarChartDataType = {
    labels: areaNames,
    datasets: [
      {
        label: 'Primer Resultado',
        data: areaAverages.map(a => a.first),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Promedio',
        data: areaAverages.map(a => a.average),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Último Resultado',
        data: areaAverages.map(a => a.last),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };



  for (const student of studentData.values()) {
    const sortedSimulacroIds = Array.from(student.simulacroDates.keys()).sort(
      (a, b) =>
        student.simulacroDates.get(a)!.getTime() -
        student.simulacroDates.get(b)!.getTime()
    );

    // ... (cálculo de progressByCompetencia)

    const progressByEvidencia = new Map<
      string,
      {
        name: string;
        competenciaName: string;
        areaName: string;
        scores: number[];
      }
    >();

    for (const simulacroId of sortedSimulacroIds) {
      const simulacroMap = student.performanceBySimulacroEvidencia.get(simulacroId);
      if (!simulacroMap) continue;

      for (const [evidenciaId, stats] of simulacroMap.entries()) {
        if (stats.total === 0) continue;
        const score = (stats.correct / stats.total) * 100;
        const evidenciaInfo = evidenciasMap.get(evidenciaId);
        if (!evidenciaInfo) continue;

        let evidenciaProgress = progressByEvidencia.get(evidenciaId);
        if (!evidenciaProgress) {
          evidenciaProgress = {
            name: evidenciaInfo.nombre,
            competenciaName: evidenciaInfo.afirmacion.competencia.nombre,
            areaName: evidenciaInfo.afirmacion.competencia.area.nombre,
            scores: [],
          };
          progressByEvidencia.set(evidenciaId, evidenciaProgress);
        }
        evidenciaProgress.scores.push(score);
      }
    }

    for (const [evidenciaId, data] of progressByEvidencia.entries()) {
      if (!schoolEvidenciaMetrics.has(evidenciaId)) {
        schoolEvidenciaMetrics.set(evidenciaId, {
          name: data.name,
          competenciaName: data.competenciaName,
          areaName: data.areaName,
          firstScores: [],
          lastScores: [],
          allScores: [],
        });
      }
      const metric = schoolEvidenciaMetrics.get(evidenciaId)!;
      if (data.scores.length > 0) {
        metric.firstScores.push(data.scores[0]);
        metric.lastScores.push(data.scores[data.scores.length - 1]);
        metric.allScores.push(...data.scores);
      }
    }

    // ... (cálculo de promedios de área y puntajes icfes)
  }

  // ... (cálculo de promedios de competencias)

  const evidenciaAverages: EvidenciaProgressType[] = Array.from(
    schoolEvidenciaMetrics.values()
  ).map(metric => ({
    name: metric.name,
    competenciaName: metric.competenciaName,
    areaName: metric.areaName,
    first: avg(metric.firstScores),
    last: avg(metric.lastScores),
    average: avg(metric.allScores),
  }));

  const nivelesDesempenoData: NivelDesempenoData[] = Array.from(schoolNivelesMetrics.entries()).map(
    ([areaName, niveles]) => ({
      areaName,
      niveles: Object.entries(niveles).map(([nivel, studentCount]) => ({
        nivel,
        studentCount,
      })),
    })
  );

  const totalSimulations = Array.from(studentData.values()).reduce(
    (acc, s) => acc + s.simulacroDetails.size,
    0
  );
  const totalDuration = Array.from(studentData.values()).reduce(
    (acc, s) =>
      acc +
      Array.from(s.simulacroDetails.values()).reduce(
        (acc2, det) => acc2 + det.duration,
        0
      ),
    0
  );
  const totalQuestions = Array.from(studentData.values()).reduce(
    (acc, s) =>
      acc +
      Array.from(s.simulacroDetails.values()).reduce(
        (acc2, det) => acc2 + det.questionCount,
        0
      ),
    0
  );

  const summaryAreaAverages = areaAverages.map(a => ({
    name: a.name,
    average: a.average,
  }));
  const sortedAreas = [...summaryAreaAverages].sort(
    (a, b) => b.average - a.average
  );

  const summaryData: SummaryData = {
    userName: userName,
    simulationsTaken: totalSimulations,
    generalAverage: promedioGeneralIcfes,
    averageTimePerQuestion:
      totalQuestions > 0 ? (totalDuration * 60) / totalQuestions : 0,
    bestPerformingArea: sortedAreas[0] ?? null,
    worstPerformingArea: sortedAreas[sortedAreas.length - 1] ?? null,
    areaAverages: summaryAreaAverages,
    registeredUsers: school?._count.users ?? 0,
    maxUsers: school?.maxUsers,
  };

  return {
    summaryData,
    overallProgressData,
    areaProgressData,
    areaAverages,
    competenciaAverages,
    evidenciaAverages,
    studentExportData,
    nivelesDesempenoData,
    nivelesDefiniciones,
  };
}

export async function getNivelesDesempenoData() {
  const nivelesDesempeno = await prisma.nivelDesempeno.findMany({
    include: {
      area: {
        select: {
          nombre: true,
        },
      },
    },
  });
  return nivelesDesempeno;
}

export async function getSchoolSedes(schoolId: string) {
  const sedes = await prisma.schoolSede.findMany({
    where: {
      schoolId: schoolId,
    },
    select: {
      id: true,
      nombre: true,
    },
  });
  return sedes;
}

export async function getSchoolDegrees(schoolId: string) {
  const degrees = await prisma.user.findMany({
    where: {
      schoolId: schoolId,
      degree: {
        not: null,
      },
    },
    distinct: ['degree'],
    select: {
      degree: true,
    },
    orderBy: {
      degree: 'asc',
    }
  });
  return degrees.map(d => d.degree!);
}

export async function getAreas() {
  const areas = await prisma.area.findMany({
    select: {
      id: true,
      nombre: true,
    },
  });
  return areas;
}

export async function getCompetenciasPorArea(areaId: string) {
  const competencias = await prisma.competencia.findMany({
    where: {
      areaId: areaId,
    },
    select: {
      id: true,
      nombre: true,
    },
  });
  return competencias;
}