import { auth } from "@/auth";
import prisma from "@/src/lib/prisma";

export const getSchoolAreaProgress = async () => {

  const session = await auth();
  if (!session?.user?.schoolId) {
    return;
  }

  const schoolId = session.user.schoolId;

  const schoolUsers = await prisma.user.findMany({
    where: { schoolId, role: 'USER' },
    select: { id: true },
  });

  const userIds = schoolUsers.map((user) => user.id);

  const areas = await prisma.area.findMany();

  const areaProgress = await Promise.all(
    areas.map(async (area) => {
      const simulacros = await prisma.simulacro.findMany({
        where: {
          userId: { in: userIds },
          competencia: {
            areaId: area.id,
          },
        },
        orderBy: { createdAt: 'asc' },
        select: {
          score: true,
          userId: true,
          createdAt: true,
        },
      });

      if (simulacros.length === 0) {
        return {
          area: area.nombre,
          first: 0,
          average: 0,
          last: 0,
        };
      }

      const userSimulacros: {
        [key: string]: { score: number | null; userId: string; createdAt: Date }[]
      } = {};

      simulacros.forEach((s) => {
        if (!userSimulacros[s.userId]) {
          userSimulacros[s.userId] = [];
        }
        userSimulacros[s.userId].push(s);
      });

      const firstScores = [];
      const lastScores = [];

      for (const userId in userSimulacros) {
        const userSims = userSimulacros[userId];
        if (userSims.length > 0) {
          firstScores.push(userSims[0].score || 0);
          lastScores.push(userSims[userSims.length - 1].score || 0);
        }
      }

      const firstAverage = firstScores.reduce((a, b) => a + b, 0) / (firstScores.length || 1);
      const lastAverage = lastScores.reduce((a, b) => a + b, 0) / (lastScores.length || 1);
      const overallAverage = simulacros.reduce((sum, s) => sum + (s.score || 0), 0) / (simulacros.length || 1);

      return {
        area: area.nombre,
        first: firstAverage,
        average: overallAverage,
        last: lastAverage,
      };
    })
  );

  const chartData = {
    labels: areaProgress.map((p) => p.area),
    datasets: [
      {
        label: 'Primer Simulacro',
        data: areaProgress.map((p) => p.first),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Promedio',
        data: areaProgress.map((p) => p.average),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Último Simulacro',
        data: areaProgress.map((p) => p.last),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return chartData;
};

export const getSchoolCompetenciaProgress = async () => {
  const session = await auth();
  if (!session?.user?.schoolId) {
    return { competenciaProgress: [], areaAverages: [] };
  }

  const schoolId = session.user.schoolId;

  const schoolUsers = await prisma.user.findMany({
    where: { schoolId, role: 'USER' },
    select: { id: true },
  });

  const userIds = schoolUsers.map((user) => user.id);

  const competencias = await prisma.competencia.findMany({
    include: {
      area: true,
    },
  });

  const competenciaProgress = await Promise.all(
    competencias.map(async (competencia) => {
      const simulacros = await prisma.simulacro.findMany({
        where: {
          userId: { in: userIds },
          competenciaId: competencia.id,
        },
        orderBy: { createdAt: 'asc' },
        select: {
          score: true,
          userId: true,
          createdAt: true,
        },
      });

      if (simulacros.length === 0) {
        return {
          name: competencia.nombre,
          areaName: competencia.area.nombre,
          first: 0,
          average: 0,
          last: 0,
        };
      }

      const userSimulacros: { [key: string]: { score: number | null; userId: string; createdAt: Date }[] } = {};
      simulacros.forEach((s) => {
        if (!userSimulacros[s.userId]) {
          userSimulacros[s.userId] = [];
        }
        userSimulacros[s.userId].push(s);
      });

      const firstScores = [];
      const lastScores = [];

      for (const userId in userSimulacros) {
        const userSims = userSimulacros[userId];
        if (userSims.length > 0) {
          firstScores.push(userSims[0].score || 0);
          lastScores.push(userSims[userSims.length - 1].score || 0);
        }
      }

      const firstAverage = firstScores.reduce((a, b) => a + b, 0) / (firstScores.length || 1);
      const lastAverage = lastScores.reduce((a, b) => a + b, 0) / (lastScores.length || 1);
      const overallAverage = simulacros.reduce((sum, s) => sum + (s.score || 0), 0) / (simulacros.length || 1);

      return {
        name: competencia.nombre,
        areaName: competencia.area.nombre,
        first: firstAverage,
        average: overallAverage,
        last: lastAverage,
      };
    })
  );

  const areas = await prisma.area.findMany();
  const areaAverages = await Promise.all(
    areas.map(async (area) => {
      const simulacros = await prisma.simulacro.findMany({
        where: {
          userId: { in: userIds },
          competencia: {
            areaId: area.id,
          },
        },
        select: {
          score: true,
        },
      });

      const average = simulacros.reduce((sum, s) => sum + (s.score || 0), 0) / (simulacros.length || 1);

      return {
        name: area.nombre,
        average,
      };
    })
  );

  return { competenciaProgress, areaAverages };
};

export const getSchoolEvidenciaProgress = async () => {
  const session = await auth();
  if (!session?.user?.schoolId) {
    return { evidenciaProgress: [] };
  }

  const schoolId = session.user.schoolId;

  const schoolUsers = await prisma.user.findMany({
    where: { schoolId, role: 'USER' },
    select: { id: true },
  });

  const userIds = schoolUsers.map((user) => user.id);

  const evidencias = await prisma.evidencia.findMany({
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

  const evidenciaProgress = await Promise.all(
    evidencias.map(async (evidencia) => {
      const simulacroPreguntas = await prisma.simulacroPregunta.findMany({
        where: {
          simulacro: {
            userId: { in: userIds },
          },
          pregunta: {
            evidenciaId: evidencia.id,
          },
        },
        select: {
          correcta: true,
        },
      });

      const correctAnswers = simulacroPreguntas.filter((sp) => sp.correcta).length;
      const totalAnswers = simulacroPreguntas.length;
      const average = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;

      return {
        name: evidencia.nombre,
        areaName: evidencia.afirmacion.competencia.area.nombre,
        competenciaName: evidencia.afirmacion.competencia.nombre,
        average,
      };
    })
  );

  return { evidenciaProgress };
};

export const getSchoolNivelesDesempeno = async () => {
  const session = await auth();
  if (!session?.user?.schoolId) {
    return { nivelesDesempenoData: [], areaAverages: [] };
  }

  const schoolId = session.user.schoolId;

  const schoolUsers = await prisma.user.findMany({
    where: { schoolId, role: 'USER' },
    select: { id: true },
  });

  const userIds = schoolUsers.map((user) => user.id);

  const areas = await prisma.area.findMany({
    include: {
      nivelesDesempeno: true,
    },
  });

  const nivelesDesempenoData = await Promise.all(
    areas.map(async (area) => {
      const simulacros = await prisma.simulacro.findMany({
        where: {
          userId: { in: userIds },
          competencia: {
            areaId: area.id,
          },
        },
        orderBy: { createdAt: 'asc' },
        select: {
          score: true,
          userId: true,
        },
      });

      const userSimulacros: { [key: string]: { score: number | null; userId: string }[] } = {};
      simulacros.forEach((s) => {
        if (!userSimulacros[s.userId]) {
          userSimulacros[s.userId] = [];
        }
        userSimulacros[s.userId].push(s);
      });

      const niveles = area.nivelesDesempeno;
      const nivelesCount = {
        first: [
          { nivel: 'NIVEL1', count: 0 },
          { nivel: 'NIVEL2', count: 0 },
          { nivel: 'NIVEL3', count: 0 },
          { nivel: 'NIVEL4', count: 0 },
        ],
        last: [
          { nivel: 'NIVEL1', count: 0 },
          { nivel: 'NIVEL2', count: 0 },
          { nivel: 'NIVEL3', count: 0 },
          { nivel: 'NIVEL4', count: 0 },
        ],
      };

      for (const userId in userSimulacros) {
        const userSims = userSimulacros[userId];
        if (userSims.length > 0) {
          const firstScore = userSims[0].score || 0;
          const lastScore = userSims[userSims.length - 1].score || 0;

          const firstNivel = niveles.find(n => firstScore >= n.puntajeMin && firstScore <= n.puntajeMax);
          if (firstNivel) {
            const nivelIndex = nivelesCount.first.findIndex(n => n.nivel === firstNivel.nivel);
            if (nivelIndex !== -1) {
              nivelesCount.first[nivelIndex].count++;
            }
          }

          const lastNivel = niveles.find(n => lastScore >= n.puntajeMin && lastScore <= n.puntajeMax);
          if (lastNivel) {
            const nivelIndex = nivelesCount.last.findIndex(n => n.nivel === lastNivel.nivel);
            if (nivelIndex !== -1) {
              nivelesCount.last[nivelIndex].count++;
            }
          }
        }
      }

      return {
        areaName: area.nombre,
        niveles: nivelesCount,
      };
    })
  );

  const areaAverages = await Promise.all(
    areas.map(async (area) => {
      const simulacros = await prisma.simulacro.findMany({
        where: {
          userId: { in: userIds },
          competencia: {
            areaId: area.id,
          },
        },
        select: {
          score: true,
        },
      });

      const average = simulacros.reduce((sum, s) => sum + (s.score || 0), 0) / (simulacros.length || 1);

      return {
        name: area.nombre,
        average,
      };
    })
  );

  return { nivelesDesempenoData, areaAverages };
};