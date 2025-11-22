'use server'; 

import { revalidatePath } from 'next/cache'; 
import prisma from '@/src/lib/prisma';
import { auth } from '@/auth'; // Updated import

import { SimulacroSchema } from './simulacro.schema';
import { FormState } from '@/src/types';

export const createSimulacro = async (
  score: number,
  duracionMinutos: number,
  competenciaId: string,
  preguntas: { preguntaId: string; opcionSeleccionadaId: string; correcta: boolean }[]
): Promise<FormState> => {
  
  // Obtén la sesión y verifica la autenticación usando getServerSession
  const session = await auth(); // Updated call
  
  if (!session?.user?.id) {
    return {
      success: false,
      message: 'Error de autenticación: El usuario no ha iniciado sesión.',
    };
  }
  
  const userId = session.user.id

  // Valida los datos (incluyendo el userId de la sesión)
  const validatedFields = SimulacroSchema.safeParse({
    score,
    duracionMinutos,
    userId,
    competenciaId,
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
    await prisma.simulacro.create({
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

    revalidatePath('/dashboard/simulacros');

    return { 
      success: true,
      message: 'Simulacro creado exitosamente.' 
    };
  } catch (e) {
    // Registra el error en el servidor para depuración
    console.error('Error al crear el simulacro:', e);
    return {
      success: false,
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
    };
  }
};