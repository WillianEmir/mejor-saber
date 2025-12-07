'use server'

import prisma from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache' 

import { EjeTematicoSchema } from './ejeTematico.schema'

import { FormState } from '@/src/types'

// Crea o edita un eje temático
export async function createOrUpdateEjeTematico(formData: FormData): Promise<FormState> {

  const validatedFields = EjeTematicoSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'), 
    descripcion: formData.get('descripcion'),
    descripcionCorta: formData.get('descripcionCorta'),
    descripcionLarga: formData.get('descripcionLarga'),
    preguntaTematica: formData.get('preguntaTematica'),
    relevanciaICFES: formData.get('relevanciaICFES'),
    video: formData.get('video'),
    orden: formData.get('orden'),
    contenidoCurricularId: formData.get('contenidoCurricularId'),
  })

  if (!validatedFields.success) { 
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, ...ejeTematicoData } = validatedFields.data

  try {
    if (id) {
      await prisma.ejeTematico.update({
        where: { id },
        data: ejeTematicoData,
      })
    } else {
      await prisma.ejeTematico.create({
        data: ejeTematicoData,
      })
    }
  } catch (e) {
    console.log(e);
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        success: false,
        message: 'Ya existe un Eje Temático con este nombre en este contenido curricular.',
      }
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
      success: false,
    }
  } 

  revalidatePath('/dashboard/admin/contenidos-curriculares')
  revalidatePath('/dashboard/admin');
  return { message: id ? 'Eje Temático actualizado exitosamente.' : 'Eje Temático creado exitosamente.', success: true }
}

// Elimina un eje temático por su Id
export async function deleteEjeTematico(id: string): Promise<FormState> {
  try {
    await prisma.ejeTematico.delete({ where: { id } })
    revalidatePath('/dashboard/admin/contenidos-curriculares')
    revalidatePath('/dashboard/admin');
    return { message: 'Eje Temático eliminado exitosamente.', success: true }
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message, success: false };
    }
    return { message: 'Error de base de datos: No se pudo eliminar el eje temático.', success: false } 
  }
}

// Actualiza la imagen de un eje temático por su Id
export async function updateEjeTematicoImage(ejeTematicoId: string, imageUrl: string): Promise<FormState> {

  const validatedFields = EjeTematicoSchema.pick({ id: true, imagen: true}).safeParse({ ejeTematicoId, imageUrl });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. La URL de la imagen no es válida.',
    };
  }

  try {
    await prisma.ejeTematico.update({
      where: { id: ejeTematicoId },
      data: { imagen: imageUrl },
    });
    revalidatePath(`/dashboard/admin/contenidos-curriculares`);
    return { success: true, message: 'Imagen actualizada correctamente.' };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    }
    return {
      success: false,
      message: 'Error de base de datos: No se pudo actualizar la imagen.',
    };
  }
}