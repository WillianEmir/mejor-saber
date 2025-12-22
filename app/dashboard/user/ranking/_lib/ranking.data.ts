'use server'

import prisma from '@/src/lib/prisma';
import { RankingBySchoolType } from './ranking.schema';

export async function getRankingBySchool (schoolId: string) : Promise<RankingBySchoolType[]> {
  try {
    const students = await prisma.user.findMany({
      where: {
        schoolId,
        role: 'USER', 
      },
      include: {
        simulacros: {
          select: {
            score: true,
          },
        },
      },
      omit: {
        password: true,
      }
    });

    const ranking = students.map(student => {
      const totalScore = student.simulacros.reduce((acc, simulacro) => acc + (simulacro.score || 0), 0);
      const averageScore = student.simulacros.length > 0 ? totalScore / student.simulacros.length : 0;
      return {
        id: student.id,
        name: `${student.name} ${student.lastName || ''}`.trim(),
        image: student.image,
        score: averageScore,
      };
    }).sort((a, b) => b.score - a.score);

    return ranking;
  } catch (error) {
    console.error('Error fetching ranking by school:', error);
    return [];
  }
};

export async function getRankingByArea (schoolId: string, areaId: string) : Promise<RankingBySchoolType[]> {
  try {
    const students = await prisma.user.findMany({
      where: {
        schoolId,
        role: 'USER',
      },
      include: {
        simulacros: {
          include: {
            competencia: true,
          },
        },
      },
      omit: {
        password: true,
      }
    });

    const ranking = students.map(student => {
      const areaSimulacros = student.simulacros.filter(
        simulacro => simulacro.competencia && simulacro.competencia.areaId === areaId
      );

      const totalScore = areaSimulacros.reduce((acc, simulacro) => acc + (simulacro.score || 0), 0);
      const averageScore = areaSimulacros.length > 0 ? totalScore / areaSimulacros.length : 0;
      return {
        id: student.id,
        name: `${student.name} ${student.lastName || ''}`.trim(),
        image: student.image,
        score: averageScore,
      };
    }).sort((a, b) => b.score - a.score);

    return ranking;
  } catch (error) {
    console.error('Error fetching ranking by area:', error);
    return [];
  }
};