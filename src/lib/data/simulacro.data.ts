'use server'

import { Competencia, User } from '@/src/generated/prisma';
import prisma from '@/src/lib/prisma';
import { SimulacroType, SimulacroWithRelationsType } from '../schemas/simulacro.schema';

export async function getSimulacroByCompetenciaId(competenciaId: Competencia['id'], userId: User['id']) : Promise<SimulacroType[]> {
  const simulacro = await prisma.simulacro.findMany({
    where: { competenciaId, userId },
    include: {preguntas: true}
  })
  return simulacro; 
}

export async function getSimulacrosByUserId(userId: User['id']) : Promise<SimulacroWithRelationsType[]> {
  try {
    const simulacros = await prisma.simulacro.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
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
    });
    return simulacros;
  } catch (error) {
    console.error("Error fetching simulacros by user ID:", error);
    return [];
  }
}