'use server'

import prisma from "@/src/lib/prisma";

export const getBadges = async () => {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return badges;
  } catch (error) {
    console.error("Error al obtener insignias:", error);
    return [];
  }
};

export const getBadgeById = async (id: string) => {
  try {
    const badge = await prisma.badge.findUnique({
      where: { id },
    });
    return badge;
  } catch (error) {
    console.error(`Error al obtener insignia con ID ${id}:`, error);
    return null;
  }
};
