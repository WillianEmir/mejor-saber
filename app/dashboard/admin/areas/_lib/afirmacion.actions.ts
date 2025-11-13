'use server'

import { revalidatePath } from 'next/cache'

import { FormState } from '@/src/types'
import prisma from '@/src/lib/prisma'

import { AfirmacionSchema } from './afirmacion.schema'

export async function createOrUpdateAfirmacion(formData: FormData): Promise<FormState> {
  const validatedFields = AfirmacionSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    competenciaId: formData.get('competenciaId'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  } 

  const { id, nombre, competenciaId } = validatedFields.data

  try {
    if (id) {
      await prisma.afirmacion.update({
        where: { id },
        data: { nombre, competenciaId },
      })
    } else {
      await prisma.afirmacion.create({
        data: {
          nombre,
          competenciaId,
        },
      })
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        success: false,
        message: 'Error en la base de datos.',
        errors: {
          nombre: ['Ya existe una afirmación con este nombre para esta competencia.'],
        },
      }
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
      success: false,
    }
  }

  const competencia = await prisma.competencia.findUnique({
    where: { id: competenciaId },
    select: { areaId: true },
  })

  if (competencia) {
    revalidatePath(`/dashboard/admin/areas/${competencia.areaId}`)
  }

  return { message: id ? 'Afirmación actualizada exitosamente.' : 'Afirmación creada exitosamente.', success: true }
}

export async function deleteAfirmacion(id: string, areaId: string): Promise<FormState> {
  try {
    await prisma.afirmacion.delete({ where: { id } })
    revalidatePath(`/dashboard/admin/areas/${areaId}`)
    return { message: 'Afirmación eliminada exitosamente.', success: true }
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message, success: false }
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.', success: false }
  }
}