'use server'

import { revalidatePath } from 'next/cache'
import { FormState } from '@/src/types'
import { SedeSchema } from './sede.schema'
import prisma from '@/src/lib/prisma'
import { auth } from '@/auth' // Updated import

export async function createOrUpdateSede(
  formData: FormData,
): Promise<FormState> {
  const session = await auth() // Updated call
  if (!session?.user?.schoolId) {
    return {
      success: false,
      message: 'No autorizado',
    }
  }

  const validatedFields = SedeSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    DANE: formData.get('DANE'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, nombre, DANE } = validatedFields.data

  try {
    if (id) {
      await prisma.schoolSede.update({
        where: { id, schoolId: session.user.schoolId },
        data: { nombre, DANE },
      })
    } else {
      await prisma.schoolSede.create({
        data: {
          nombre,
          DANE,
          schoolId: session.user.schoolId,
        },
      })
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        success: false,
        message: 'Error en la base de datos.',
        errors: {
          DANE: ['Ya existe una sede con este código DANE.'],
        },
      }
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
      success: false,
    }
  }

  revalidatePath('/dashboard/school/sedes')

  return {
    message: id ? 'Sede actualizada exitosamente.' : 'Sede creada exitosamente.',
    success: true,
  }
}

export async function deleteSede(id: string): Promise<FormState> {
  const session = await auth() // Updated call
  if (!session?.user?.schoolId) {
    return {
      success: false,
      message: 'No autorizado',
    }
  }
  try {
    await prisma.schoolSede.delete({ where: { id, schoolId: session.user.schoolId } })
    revalidatePath('/dashboard/school/sedes')
    return { message: 'Sede eliminada exitosamente.', success: true }
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message, success: false }
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
      success: false,
    }
  }
}