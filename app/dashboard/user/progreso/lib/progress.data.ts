import { getSimulacrosByUserId } from '../../simulacros/lib/simulacro.data'
import { SimulacroWithRelationsType } from '../../simulacros/lib/simulacro.schema'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '@/src/lib/prisma';

export interface ProgressData {
  overallAverage: number
  bestArea: { name: string; average: number } | null
  worstArea: { name: string; average: number } | null
  areaAverages: { name: string; average: number }[]
  simulacros: SimulacroWithRelationsType[]
}

export async function getUserProgressData(): Promise<ProgressData> {
  
  // Verificar si el usuario está autenticado
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Usuario no autenticado')
  }

  const simulacros = await getSimulacrosByUserId(session.user.id)

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

  const areaData: { [key: string]: { totalScore: number; count: number } } = {}

  simulacros.forEach(simulacro => {
    const areaName = simulacro.competencia.area.nombre
    if (!areaData[areaName]) {
      areaData[areaName] = { totalScore: 0, count: 0 }
    }
    areaData[areaName].totalScore += simulacro.score || 0
    areaData[areaName].count++
  })

  const areaAverages = Object.entries(areaData).map(([name, data]) => ({
    name,
    average: data.totalScore / data.count,
  }))

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

  return {
    overallAverage,
    bestArea,
    worstArea,
    areaAverages,
    simulacros,
  }
}

export async function getCompetenciaProgressData() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Usuario no autenticado')
  }

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

export async function getOverallProgressChartData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Usuario no autenticado');
  }

  const simulacros = await getSimulacrosByUserId(session.user.id);

  if (simulacros.length === 0) {
    return {
      initialScore: 0,
      overallAverage: 0,
      finalScore: 0,
    };
  }

  const initialScore = simulacros[0].score || 0;
  const finalScore = simulacros[simulacros.length - 1].score || 0;
  const overallAverage =
    simulacros.reduce((acc, s) => acc + (s.score || 0), 0) /
    simulacros.length;

  return {
    initialScore,
    overallAverage,
    finalScore,
  };
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
