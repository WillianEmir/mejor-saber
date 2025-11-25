'use server' 

import { auth } from '@/auth';
import prisma from '@/src/lib/prisma';

// Obtiene el promedio del primer, último y total de simulacros
export const getScoreDistributionData = async () => {

  const session = await auth();
  if (!session?.user?.schoolId) {
    return null;
  }

  const schoolId = session.user.schoolId;

  const schoolUsers = await prisma.user.findMany({
    where: { schoolId, role: 'USER' },
    select: { id: true },
  });

  const userIds = schoolUsers.map((user) => user.id);

  const simulacros = await prisma.simulacro.findMany({
    where: { userId: { in: userIds } },
    orderBy: { createdAt: 'asc' },
  });

  if (simulacros.length === 0) {
    return {
      firstSimulacroAvg: 0,
      overallAvg: 0,
      lastSimulacroAvg: 0,
    };
  }

  const firstSimulacros = await prisma.simulacro.findMany({
    where: { userId: { in: userIds } },
    distinct: ['userId', 'competenciaId'],
    orderBy: { createdAt: 'asc' },
  });

  const lastSimulacros = await prisma.simulacro.findMany({
    where: { userId: { in: userIds } },
    distinct: ['userId', 'competenciaId'],
    orderBy: { createdAt: 'desc' },
  });

  const firstSimulacroAvg = firstSimulacros.reduce((sum, s) => sum + (s.score || 0), 0) / firstSimulacros.length;
  const lastSimulacroAvg = lastSimulacros.reduce((sum, s) => sum + (s.score || 0), 0) / lastSimulacros.length;
  const totalScore = simulacros.reduce((sum, s) => sum + (s.score || 0), 0);
  const overallAvg = totalScore / simulacros.length;

  return {
    firstSimulacroAvg,
    overallAvg,
    lastSimulacroAvg,
  };
};

export const getSchoolStats = async () => { 

  const session = await auth();
  
  if (!session?.user?.schoolId) {
    return null;
  }

  const schoolId = session.user.schoolId;

  const studentCount = await prisma.user.count({
    where: {
      schoolId,
      role: 'USER',
    },
  });

  const teacherCount = await prisma.user.count({
    where: {
      schoolId,
      role: 'DOCENTE',
    },
  });

  const schoolUsers = await prisma.user.findMany({
    where: {
      schoolId,
      role: 'USER',
    },
    select: {
      id: true,
    },
  });

  const userIds = schoolUsers.map((user) => user.id);

  const completedSimulations = await prisma.simulacro.count({
    where: {
      userId: {
        in: userIds,
      },
    },
  });

  const averageScoreAggregation = await prisma.simulacro.aggregate({
    _avg: {
      score: true,
    },
    where: {
      userId: {
        in: userIds,
      },
    },
  });

  const averageScore = averageScoreAggregation._avg.score || 0;

  return {
    studentCount,
    teacherCount,
    completedSimulations,
    averageScore,
  };
};

export const getAllSchoolSimulations = async () => {
  const session = await auth();

  if (!session?.user?.schoolId) {
    return null;
  }

  const schoolId = session.user.schoolId;

  const schoolStudents = await prisma.user.findMany({
    where: {
      schoolId,
      role: 'USER',
    },
    select: {
      id: true,
    },
  });

  const studentIds = schoolStudents.map((student) => student.id);

  const allSimulations = await prisma.simulacro.findMany({
    where: {
      userId: {
        in: studentIds,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          lastName: true,
        },
      },
      competencia: {
        select: {
          nombre: true,
          area: {
            select: {
              nombre: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return allSimulations;
};