'use server'

import { auth } from '@/auth'; // Updated import
import { revalidatePath } from 'next/cache'
import prisma from '@/src/lib/prisma'
import { FormState } from '@/src/types'

async function getUserId() {
  const session = await auth() // Updated call
  if (!session?.user?.id) {
    throw new Error('Usuario no autenticado')
  }
  return session.user.id
}
 
export async function toggleSeccionProgreso(seccionId: string, path: string, isCompleted: boolean): Promise<FormState> {
  try { 
    const userId = await getUserId()

    await prisma.progresoSeccion.upsert({
      where: { usuarioId_seccionId: { usuarioId: userId, seccionId } },
      update: { completada: !isCompleted },
      create: { usuarioId: userId, seccionId, completada: true },
    })

    revalidatePath(path)
    return {
      success: true,
      message: 'Progreso de la Sección actualizado exitosamente.'
    };
  } catch (error) {
    console.error('Error al crear el SeccionProgreso:', error);
    return {
      success: false,
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };
  }
}

export async function toggleSubTemaProgreso(subTemaId: string, path: string, isCompleted: boolean): Promise<FormState> {
  try {
    const userId = await getUserId()

    await prisma.progresoSubTema.upsert({
      where: { usuarioId_subTemaId: { usuarioId: userId, subTemaId } },
      update: { completado: !isCompleted },
      create: { usuarioId: userId, subTemaId, completado: true },
    })

    revalidatePath(path)
    return {
      success: true,
      message: 'Progreso del Tema actualizado exitosamente.'
    };
  } catch (error) {
    console.error('Error al crear el SubTemaProgreso:', error);
    return {
      success: false,
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };
  }
}

export async function toggleActividadProgreso(actividadId: string, path: string, isCompleted: boolean): Promise<FormState> {
  try {
    const userId = await getUserId()

    await prisma.progresoActividad.upsert({
      where: { usuarioId_actividadId: { usuarioId: userId, actividadId } },
      update: { completado: !isCompleted, intentos: { increment: 1 } }, // Increment attempts on toggle
      create: { usuarioId: userId, actividadId, completado: true, intentos: 1 },
    })

    revalidatePath(path)
    return {
      success: true,
      message: 'Progreso de la Actividad actualizado exitosamente.'
    };
  } catch (error) {
    console.error('Error al crear el ActividadProgreso:', error);
    return {
      success: false,
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };

  }
}