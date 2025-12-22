import { auth } from '@/auth'
import prisma from '@/src/lib/prisma';

import { CompetenciaProgressType, EvidenciaProgressType } from './progress.schema';
import { BarChartDataType } from '@/src/components/ui/charts/BarChart';
import { SummaryData } from '../_components/dashboard.schema';

// Obtiene los datos del estado inicial, estado final y promedio de todos los simulacros realizados por el usuario
export async function getStudentProgressChartsData(): Promise<{
  summaryData: SummaryData,
  overallProgressData: BarChartDataType, 
  areaProgressData: BarChartDataType,
  areaAverages: { name: string, first: number, average: number, last: number }[],
  competenciaAverages: CompetenciaProgressType[],
  evidenciaAverages: EvidenciaProgressType[],
}> {
  const session = await auth(); 
  if (!session?.user?.id || !session.user.name) {
    throw new Error('Usuario no autenticado');
  }

  // 1. Obtención y Agregación de Datos Base desde simulacroPregunta
  const simulacroPreguntas = await prisma.simulacroPregunta.findMany({
    where: {
      simulacro: {
        userId: session.user.id,
        areaId: {
          not: null
        },
      },
      // Asegurarnos que la pregunta tiene la jerarquía completa
      pregunta: {
        evidencia: {
          afirmacion: {
            competencia: {}
          }
        }
      }
    },
    orderBy: {
      simulacro: {
        createdAt: 'asc',
      },
    },
    include: {
      simulacro: true,
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
  }); 

  const emptyChartData: BarChartDataType = {
    labels: [],
    datasets: [{
      label: 'Sin datos',
      data: [],
      backgroundColor: [],
    }]
  };

  const emptySummaryData: SummaryData = {
    userName: session.user.name,
    simulationsTaken: 0,
    generalAverage: 0,
    averageTimePerQuestion: 0,
    bestPerformingArea: null,
    worstPerformingArea: null,
    areaAverages: [],
  };

  if (simulacroPreguntas.length === 0) {
    return {
      summaryData: emptySummaryData,
      overallProgressData: {
        labels: ['Estado Inicial', 'Promedio General', 'Estado Final'],
        datasets: [{
          label: 'Puntaje Global ICFES (0-500)',
          data: [0, 0, 0],
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(75, 192, 192, 0.5)'
          ],
        }]
      },
      areaProgressData: emptyChartData,
      areaAverages: [],
      competenciaAverages: [],
      evidenciaAverages: []
    };
  }

  // Agregamos resultados por simulacro y competencia
  const performanceBySimulacro = new Map<string, Map<string, { correct: number; total: number }>>();
  const performanceBySimulacroEvidencia = new Map<string, Map<string, { correct: number; total: number }>>();
  const simulacroDates = new Map<string, Date>();
  const simulacroDetails = new Map<string, { duration: number, questionCount: number, score: number }>();

  for (const sp of simulacroPreguntas) {
    const competencia = sp.pregunta?.evidencia?.afirmacion?.competencia;
    const evidencia = sp.pregunta?.evidencia;
    const { simulacro } = sp;

    simulacroDates.set(simulacro.id, simulacro.createdAt);

    if (!simulacroDetails.has(simulacro.id)) {
      simulacroDetails.set(simulacro.id, {
        duration: simulacro.duracionMinutos || 0,
        questionCount: 0,
        score: simulacro.score || 0
      });
    }
    simulacroDetails.get(simulacro.id)!.questionCount++;

    // Group by competencia
    if (competencia) {
      let simulacroMap = performanceBySimulacro.get(simulacro.id);
      if (!simulacroMap) {
        simulacroMap = new Map();
        performanceBySimulacro.set(simulacro.id, simulacroMap);
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

    // Group by evidencia
    if (evidencia) {
      let simulacroMap = performanceBySimulacroEvidencia.get(simulacro.id);
      if (!simulacroMap) {
        simulacroMap = new Map();
        performanceBySimulacroEvidencia.set(simulacro.id, simulacroMap);
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

  // Ordenamos los simulacros por fecha
  const sortedSimulacroIds = Array.from(simulacroDates.keys()).sort((a, b) => simulacroDates.get(a)!.getTime() - simulacroDates.get(b)!.getTime());
  
  // Calculamos puntajes cronológicos por competencia
  const progressByCompetencia = new Map<string, { name: string; areaName: string; scores: number[] }>();  
  
  const allCompetencias = await prisma.competencia.findMany({ include: { area: true } });
  const competenciasMap = new Map(allCompetencias.map(c => [c.id, c]));

  const competencyCountByArea = new Map<string, number>();
  for (const comp of allCompetencias) {
    const areaName = comp.area.nombre;
    competencyCountByArea.set(areaName, (competencyCountByArea.get(areaName) || 0) + 1);
  }

  for (const simulacroId of sortedSimulacroIds) {
    const simulacroMap = performanceBySimulacro.get(simulacroId);
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

  const progressByEvidencia = new Map<string, {
    name: string;
    competenciaName: string;
    areaName: string;
    scores: number[];
  }>();

  
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

  for (const simulacroId of sortedSimulacroIds) {
    const simulacroMap = performanceBySimulacroEvidencia.get(simulacroId);
    if (!simulacroMap) continue;

    for (const [evidenciaId, stats] of simulacroMap.entries()) {
      if (stats.total === 0) continue;
      const score = (stats.correct / stats.total) * 100;

      let evidenciaProgress = progressByEvidencia.get(evidenciaId);
      const evidenciaInfo = evidenciasMap.get(evidenciaId);

      if (!evidenciaInfo) continue;

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


  // --- CÁLCULOS ---
  
  const calculateIcfesScore = (areaScores: Map<string, number>): number => {
    const mat = areaScores.get('Matemáticas') || 0;
    const lec = areaScores.get('Lectura Crítica') || 0;
    const soc = areaScores.get('Sociales y Ciudadanas') || 0;
    const cie = areaScores.get('Ciencias Naturales') || 0;
    const ing = areaScores.get('Inglés') || 0;

    if ([mat, lec, soc, cie, ing].every(v => v === 0)) return 0;
    
    const weightedSum = (mat * 3) + (lec * 3) + (soc * 3) + (cie * 3) + (ing * 1);
    const finalScore = (weightedSum / 13) * 5;

    return Math.round(finalScore);
  };  

  const getAreaScores = (scoreSelector: (scores: number[]) => number | undefined): Map<string, number> => {
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
      const average = totalCompetencies > 0 ? sumOfScores / totalCompetencies : 0;
      areaAverages.set(areaName, average);
    }
    return areaAverages;
  };
  
  // --- CONSTRUCCIÓN DE DATOS PARA GRÁFICOS Y COMPONENTES ---

  const initialAreaScores = getAreaScores(scores => scores[0]);
  const finalAreaScores = getAreaScores(scores => scores[scores.length - 1]);
  const averageAreaScores = getAreaScores(scores => scores.reduce((acc, s) => acc + s, 0) / scores.length);

  const areaNames = Array.from(competencyCountByArea.keys());
  
  // 1. Datos para la tabla de Áreas (y otros componentes)
  const areaAverages = areaNames.map(name => ({
    name: name,
    first: initialAreaScores.get(name) || 0,
    average: averageAreaScores.get(name) || 0,
    last: finalAreaScores.get(name) || 0,
  }));
  
  // 2. Datos para Gráfico de Progreso por Área
  const areaProgressData: BarChartDataType = {
    labels: areaNames,
    datasets: [
      {
        label: "Primer Resultado",
        data: areaAverages.map(a => a.first),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: "Promedio",
        data: areaAverages.map(a => a.average),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: "Último Resultado",
        data: areaAverages.map(a => a.last),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  // 3. Datos para Gráfico de Progreso General (ICFES)
  const estadoInicial = calculateIcfesScore(initialAreaScores);
  const estadoFinal = calculateIcfesScore(finalAreaScores);
  const promedioGeneralIcfes = calculateIcfesScore(averageAreaScores);

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
          'rgba(75, 192, 192, 0.5)'
        ],
      },
    ],
  };

  // 4. Datos para la tabla de Competencias
  const competenciaAverages: CompetenciaProgressType[] = Array.from(progressByCompetencia.values()).map(
    ({ name, areaName, scores }) => {
      const average = scores.length > 0 ? scores.reduce((acc, s) => acc + s, 0) / scores.length : 0;
      return {
        name,
        areaName,
        first: scores[0] || 0,
        last: scores[scores.length - 1] || 0,
        average,
      };
    }
  );

  const evidenciaAverages: EvidenciaProgressType[] = Array.from(progressByEvidencia.values()).map(
    ({ name, competenciaName, areaName, scores }) => {
      const average = scores.length > 0 ? scores.reduce((acc, s) => acc + s, 0) / scores.length : 0;
      return {
        name,
        competenciaName,
        areaName,
        first: scores[0] || 0,
        last: scores[scores.length - 1] || 0,
        average,
      };
    }
  );

  // 5. Datos para el Dashboard Summary
  const simulationsTaken = simulacroDetails.size;
  const totalDurationInMinutes = Array.from(simulacroDetails.values()).reduce((acc, s) => acc + s.duration, 0);
  const totalQuestions = Array.from(simulacroDetails.values()).reduce((acc, s) => acc + s.questionCount, 0);
  const generalAverage = promedioGeneralIcfes;
  const averageTimePerQuestion = totalQuestions > 0 ? (totalDurationInMinutes * 60) / totalQuestions : 0;

  const summaryAreaAverages = areaAverages.map(a => ({ name: a.name, average: a.average }));
  const sortedAreas = [...summaryAreaAverages].sort((a, b) => b.average - a.average);
  const bestPerformingArea = sortedAreas.length > 0 ? sortedAreas[0] : null;
  const worstPerformingArea = sortedAreas.length > 0 ? sortedAreas[sortedAreas.length - 1] : null;

  const summaryData: SummaryData = {
    userName: session.user.name,
    simulationsTaken,
    generalAverage,
    averageTimePerQuestion,
    bestPerformingArea,
    worstPerformingArea,
    areaAverages: summaryAreaAverages,
  };


  return { summaryData, overallProgressData, areaProgressData, areaAverages, competenciaAverages, evidenciaAverages };
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