'use server'

import prisma from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'

import { FormState } from '@/src/types'
import { CompetenciaSchema } from './competencia.schema' 

// Server Action para crear o editar una competencia
export async function createOrUpdateCompetencia(formData: FormData): Promise<FormState> {

  const validatedFields = CompetenciaSchema.safeParse({
    id: formData.get('id') || undefined,
    areaId: formData.get('areaId'),
    nombre: formData.get('nombre'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, nombre, areaId } = validatedFields.data

  try {
    if (id) {
      await prisma.competencia.update({
        where: { id },
        data: { nombre, areaId },
      })
    } else {
      await prisma.competencia.create({
        data: {
          areaId,
          nombre,
        },
      })
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        success: false,
        message: 'Error en la base de datos.'
      }
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
      success: false,
    }
  }

  revalidatePath(`/dashboard/admin/areas/${areaId}`)
  return { message: id ? 'Competencia actualizada exitosamente.' : 'Competencia creada exitosamente.', success: true}
}

// Elimina una competencia por su id
export async function deleteCompetencia(id: string, areaId: string): Promise<FormState> {
  try {
    await prisma.competencia.delete({ where: { id } })
    revalidatePath(`/dashboard/admin/areas/${areaId}`)
    return { message: 'Competencia eliminada exitosamente.', success: true }
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message, success: false }
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.', success: false }
  }
}
 