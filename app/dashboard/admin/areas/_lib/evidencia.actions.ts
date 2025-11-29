'use server'

import prisma from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'

import { EvidenciaSchema } from './evidencia.schema'
import { type FormState } from '@/src/types'

// Server Action para crear o editar una evidencia
export async function createOrUpdateEvidencia(formData: FormData): Promise<FormState> {

  const validatedFields = EvidenciaSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    afirmacionId: formData.get('afirmacionId'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, nombre, afirmacionId } = validatedFields.data

  try {
    if (id) {
      await prisma.evidencia.update({
        where: { id },
        data: { nombre, afirmacionId },
      })
    } else {
      await prisma.evidencia.create({
        data: {
          nombre,
          afirmacionId,
        },
      })
    }
  } catch (e) {
    console.log(e);
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        success: false,
        message: 'Error en la base de datos. Ya existe una evidencia con este nombre para esta afirmación.',
      }
    }

    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
      success: false,
    }
  }

  const afirmacion = await prisma.afirmacion.findUnique({
    where: { id: afirmacionId },
    select: { competencia: { select: { areaId: true } } },
  })

  if (afirmacion?.competencia.areaId) {
    revalidatePath(`/dashboard/admin/areas/${afirmacion.competencia.areaId}`)
  }

  return { message: id ? 'Evidencia actualizada exitosamente.' : 'Evidencia creada exitosamente.', success: true }
}

// Elimina una evidencia por su id
export async function deleteEviencia(id: string, areaId: string): Promise<FormState> {
  try {
    await prisma.evidencia.delete({ where: { id } })
    revalidatePath(`/dashboard/admin/areas/${areaId}`)
    return { message: 'Evidencia eliminada exitosamente.', success: true }
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message, success: false }
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.', success: false }
  }
}