'use server'

import prisma from '@/src/lib/prisma';  
import { User } from '@/src/generated/prisma'; 
import { AreaCompetenciasType, SimulacroResultType, SimulacroWithRelationsType } from './simulacro.schema';
import { Areatype } from '@/app/dashboard/admin/areas/_lib/area.schema';

// Obtiene los simulacros de un usuario por su Id
export async function getSimulacrosByUserId(userId: User['id']): Promise<SimulacroWithRelationsType[]> {
  try {
    const simulacros = await prisma.simulacro.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        area: true,
        competencia: {
          select: {
            id: true,
            nombre: true,
            area: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        _count: {
          select: { preguntas: true },
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

// Obtiene un área por su Id, con sus competencias.
export async function getAreaCompetencias(id: string): Promise<AreaCompetenciasType | null> {
  try {
    const area = await prisma.area.findUnique({ 
      where: { id },
      include: { competencias: true },
    });
    return area;
  } catch (error) {
    console.error('Error al obtener el área de la base de datos:', error);
    throw new Error('Error de base de datos: No se pudo obtener el área.');
  }
};

// Obtiene un área por su Id.

export const getAreaById = async (id: string): Promise<Areatype | null> => {

  try {

    const area = await prisma.area.findUnique({

      where: { id },

    });

    return area;

  } catch (error) {

    console.error(`Error fetching area with id ${id}:`, error);

    throw new Error('No se pudo obtener el área.');

  }

}; 

// Obtiene un simulacro por su Id con sus relaciones
export async function getSimulacroByIdWithRelations(simulacroId: string): Promise<SimulacroWithRelationsType | null> {
  try {
    const simulacro = await prisma.simulacro.findUnique({
      where: { id: simulacroId },
      include: {
        area: true,
        competencia: {
          select: {
            id: true,
            nombre: true,
            area: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
    });
    return simulacro;
  } catch (error) {
    console.error('Error al obtener el simulacro por ID con relaciones:', error);
    throw new Error('Error de base de datos: No se pudo obtener el simulacro con relaciones.');
  }
}
