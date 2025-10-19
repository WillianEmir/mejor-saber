'use server'

import prisma from '@/src/lib/prisma'; 
import { User } from '@/src/generated/prisma';
import { SimulacroResultType, SimulacroWithRelationsType } from './simulacro.schema';

// Obtiene los simulacros de un usuario por su Id
export async function getSimulacrosByUserId(userId: User['id']): Promise<SimulacroWithRelationsType[]> {
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
    console.error('Error al obtener los simulacros del usuario la base de datos:', error);
    throw new Error('Error de base de datos: No se pudieron obtener los simulacros del usuario.');
  }
}

// Obtiene el resultado de un simulacro
export const getSimulacroResult = async (simulacroId: string): Promise<SimulacroResultType[]> => {
  try {
    const simulacroPreguntas = await prisma.simulacroPregunta.findMany({
      where: {
        simulacroId,
      },
      include: {
        pregunta: {
          include: {
            opciones: true,
          },
        },
        opcionSeleccionada: true,
      },
    });
    return simulacroPreguntas;
  } catch (error) {
    console.error('Error al obtener el resultado del simulacro la base de datos:', error);
    throw new Error('Error de base de datos: No se pudieron obtener el resultado del simulacro.');
  }
};

