'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/src/lib/prisma';
import { auth } from '@/auth';

import { SimulacroSchema } from './simulacro.schema';
import { FormState } from '@/src/types';

export const createSimulacro = async (
  score: number,
  duracionMinutos: number,
  competenciaId: string | undefined,
  areaId: string | undefined,
  preguntas: {
    preguntaId: string; opcionSeleccionadaId: string | null; correcta: boolean
  }[]
): Promise<FormState & {simulacroId?: string}> => {

  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: 'Error de autenticación: El usuario no ha iniciado sesión.',
    };
  }

  const userId = session.user.id

  const validatedFields = SimulacroSchema.safeParse({
    score,
    duracionMinutos,
    userId,
    competenciaId,
    areaId,
    preguntas,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { preguntas: selectedPreguntaIds, ...simulacroData } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true, freeSimulacrosCount: true },
    });

    if (!user) {
      return {
        success: false,
        message: 'Error: Usuario no encontrado.',
      };
    }

    if (!user.isActive && user.freeSimulacrosCount >= 2) {
      return {
        success: false,
        message: 'Has agotado tu simulacro gratuito. Por favor, adquiere un plan para continuar.',
      };
    }

    const newSimulacro = await prisma.simulacro.create({
      data: {
        ...simulacroData,
        preguntas: {
          create: selectedPreguntaIds.map(pregunta => ({
            preguntaId: pregunta.preguntaId,
            opcionSeleccionadaId: pregunta.opcionSeleccionadaId,
            correcta: pregunta.correcta,
          })),
        },
      },
    });

    if (!user.isActive) {
      await prisma.user.update({
        where: { id: userId },
        data: { freeSimulacrosCount: { increment: 1 } },
      })
    }

    revalidatePath('/dashboard/simulacros');
    revalidatePath('/dashboard/user');
    revalidatePath('/dashboard/admin');

    return {
      success: true,
      message: 'Simulacro creado exitosamente.',
      simulacroId: newSimulacro.id,
    };

  } catch (e: any) {
    if (e.digest?.startsWith('NEXT_REDIRECT')) {
      throw e;
    }
    console.error('Error al crear el simulacro:', e);
    return {
      success: false,
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
    };
  }
};