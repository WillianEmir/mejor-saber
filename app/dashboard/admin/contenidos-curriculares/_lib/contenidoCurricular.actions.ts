'use server'

import prisma from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'   

import { ContenidoCurricularSchema } from './contenidoCurricular.schema'

import { FormState } from '@/src/types'

// Crea o edita un contenido curricular
export async function createOrUpdateContenidoCurricular(formData: FormData): Promise<FormState> {
  
  const validatedFields = ContenidoCurricularSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    areaId: formData.get('areaId'),
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
      await prisma.contenidoCurricular.update({
        where: { id },
        data: { nombre, areaId },
      })
    } else {
      await prisma.contenidoCurricular.create({
        data: {
          areaId,
          nombre,
        },
      })
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      console.log(e)
      return {
        success: false,
        message: 'Ya existe un Contenido Curricular con este nombre en esta área.',
      }
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
      success: false,
    }
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares`)
  revalidatePath('/dashboard/admin');
  return { message: id ? 'Contenido Curricular actualizado exitosamente.' : 'Contenido Curricular creado exitosamente.', success: true }
}

// Elimina un contenido curricular por su Id
export async function deleteContenidoCurricular(id: string): Promise<FormState> {
  try {
    await prisma.contenidoCurricular.delete({ where: { id } })
    revalidatePath('/dashboard/admin/contenidos-curriculares')
    revalidatePath('/dashboard/admin');
    return { message: 'Contenido Curricular eliminado exitosamente.', success: true }
  } catch (e) {
    console.log(e);    
    if (e instanceof Error) {
      return { message: e.message, success: false }
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.', success: false }
  }
}