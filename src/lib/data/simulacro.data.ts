'use server'

import { Competencia, User } from '@/src/generated/prisma';
import prisma from '@/src/lib/prisma';
import { SimulacroType } from '../schemas/simulacro.schema';

export async function getSimulacroByCompetenciaId(competenciaId: Competencia['id'], userId: User['id']) : Promise<SimulacroType[]> {
  const simulacro = await prisma.simulacro.findMany({
    where: { competenciaId, userId },
    include: {preguntas: true}
  })
  return simulacro;

}