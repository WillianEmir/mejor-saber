
"use server";

import { Role } from "@/src/generated/prisma";
import prisma from "../prisma";

export const getSchoolDashboardStats = async (schoolId: string) => {
  try {
    const studentCount = await prisma.user.count({
      where: {
        schoolId,
        role: Role.USER,
      },
    });

    const completedSimulacros = await prisma.simulacro.count({
      where: {
        user: {
          schoolId,
        },
        score: {
          not: null,
        },
      },
    });

    const averageScore = await prisma.simulacro.aggregate({
      _avg: {
        score: true,
      },
      where: {
        user: {
          schoolId,
        },
      },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersCount = await prisma.user.count({
      where: {
        schoolId,
        role: Role.USER,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    return {
      studentCount,
      completedSimulacros,
      averageScore: averageScore._avg.score?.toFixed(2) || "N/A",
      newUsersCount,
    };
  } catch (error) {
    console.error(error);
    return {
      studentCount: 0,
      completedSimulacros: 0,
      averageScore: "N/A",
      newUsersCount: 0,
    };
  }
};
