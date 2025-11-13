import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '@/src/lib/prisma';

import { getSimulacrosByUserId } from '../simulacros/_lib/simulacro.data'

import { CompetenciaProgressType, ProgressDataType } from './progress.schema';
import { BarChartDataType } from '@/src/components/ui/charts/BarChart';

// Obtiene los datos del estado inicial, estado final y promedio de todos los simulacros realizados por el usuario
export async function getOverallProgressChartData() : Promise<BarChartDataType> {
  
  // Verifica si el usuario está autenticado
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Usuario no autenticado');
  }

  const simulacros = await getSimulacrosByUserId(session.user.id);

  if (simulacros.length === 0) {
    return { labels: [], datasets: [] };
  }

  const initialScore = simulacros[0].score || 0;
  const finalScore = simulacros[simulacros.length - 1].score || 0;
  const overallAverage = simulacros.reduce((acc, s) => acc + (s.score || 0), 0) / simulacros.length;

  const generalProgressData = {
    labels: ['Estado Inicial', 'Promedio General', 'Estado Final'],
    datasets: [
      {
        label: 'Estado General',
        borderWidth: 1,
        borderRadius: 5,
        data: [initialScore, overallAverage, finalScore],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(155, 132, 192, 0.5)'
        ],
      },
      
    ],
  };
 
  return generalProgressData;
}

export async function getUserProgressData(): Promise<ProgressDataType> {

  // Verificar si el usuario está autenticado
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Usuario no autenticado')

  const simulacros = (await getSimulacrosByUserId(session?.user?.id)).reverse();

  if (simulacros.length === 0) {
    return {
      overallAverage: 0,
      bestArea: null,
      worstArea: null,
      areaAverages: [],
      simulacros: [],
    }
  }

  const overallAverage = simulacros.reduce((acc, s) => acc + (s.score || 0), 0) / simulacros.length

  const areaData: { [key: string]: { scores: number[] } } = {};

  simulacros.forEach(simulacro => {
    const areaName = simulacro.competencia.area.nombre;
    if (!areaData[areaName]) {
      areaData[areaName] = { scores: [] };
    }
    areaData[areaName].scores.push(simulacro.score || 0);
  });

  const areaAverages = Object.entries(areaData).map(([name, data]) => {
    const average = data.scores.reduce((acc, score) => acc + score, 0) / data.scores.length;
    const first = data.scores[0];
    const last = data.scores[data.scores.length - 1];
    return { name, first, average, last };
  });

  if (areaAverages.length === 0) {
    return {
      overallAverage,
      bestArea: null,
      worstArea: null,
      areaAverages: [],
      simulacros,
    }
  }

  const sortedAreas = [...areaAverages].sort((a, b) => b.average - a.average)

  const bestArea = sortedAreas[0]
  const worstArea = sortedAreas[sortedAreas.length - 1]

  const areaProgressData = {
    labels: areaAverages.map(a => a.name),
    datasets: [
      {
        label: 'Primer Simulacro',
        data: areaAverages.map(a => a.first),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Promedio',
        data: areaAverages.map(a => a.average),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Último Simulacro',
        data: areaAverages.map(a => a.last),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return {
    overallAverage,
    bestArea,
    worstArea,
    areaAverages,
    simulacros,
    areaProgressData,
  }
}

export async function getCompetenciaProgressData() : Promise<CompetenciaProgressType[]> {

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Usuario no autenticado')

  const simulacros = await getSimulacrosByUserId(session.user.id)

  if (simulacros.length === 0) {
    return []
  }

  const progressByCompetencia: {
    [key: string]: {
      name: string
      areaName: string
      first: number
      last: number
      sum: number
      count: number
    }
  } = {}

  simulacros.forEach(simulacro => {
    const competenciaName = simulacro.competencia.nombre
    const areaName = simulacro.competencia.area.nombre;
    const score = simulacro.score || 0

    if (!progressByCompetencia[competenciaName]) {
      progressByCompetencia[competenciaName] = {
        name: competenciaName,
        areaName: areaName,
        first: score,
        last: score,
        sum: score,
        count: 1,
      }
    } else {
      progressByCompetencia[competenciaName].last = score
      progressByCompetencia[competenciaName].sum += score
      progressByCompetencia[competenciaName].count++
    }
  })

  return Object.values(progressByCompetencia).map(item => ({
    name: item.name,
    areaName: item.areaName,
    first: item.first,
    last: item.last,
    average: item.sum / item.count,
  }))
}

export async function getEvidenciaProgressData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Usuario no autenticado');
  }

  const simulacroPreguntas = await prisma.simulacroPregunta.findMany({
    where: {
      simulacro: {
        userId: session.user.id,
      },
    },
    include: {
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

  if (simulacroPreguntas.length === 0) {
    return []; 
  }

  const progressByEvidencia: { [key: string]: { name: string; competenciaName: string; areaName: string; correct: number; total: number } } = {};

  simulacroPreguntas.forEach(sp => {
    const evidencia = sp.pregunta?.evidencia;
    if (evidencia) {
      const evidenciaName = evidencia.nombre;
      const competenciaName = evidencia.afirmacion.competencia.nombre;
      const areaName = evidencia.afirmacion.competencia.area.nombre;

      if (!progressByEvidencia[evidenciaName]) {
        progressByEvidencia[evidenciaName] = { name: evidenciaName, competenciaName, areaName, correct: 0, total: 0 };
      }
      if (sp.correcta) {
        progressByEvidencia[evidenciaName].correct++;
      }
      progressByEvidencia[evidenciaName].total++;
    }
  });

  return Object.values(progressByEvidencia).map(item => ({
    name: item.name,
    competenciaName: item.competenciaName,
    areaName: item.areaName,
    average: (item.correct / item.total) * 100,
  }));
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
