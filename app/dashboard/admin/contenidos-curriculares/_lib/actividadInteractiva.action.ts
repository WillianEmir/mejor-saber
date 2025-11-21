'use server';

import { revalidatePath } from 'next/cache';
import { ActividadInteractivaSchema } from './actividadInteractiva.schema';
import { EjeTematicoType } from './ejeTematico.schema';
import prisma from '@/src/lib/prisma';
import { FormState } from '@/src/types';

export async function createOrUpdateActividadInteractiva(formData: FormData): Promise<FormState> {

  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = ActividadInteractivaSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    tipo: formData.get('tipo'),
    match: formData.get('match'),
    retroalimentacion: formData.get('retroalimentacion'),
    imagen: formData.get('imagen'),
    seccionId: formData.get('seccionId'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...actividadData } = validatedFields.data;

  try {
    if (id) {
      await prisma.actividadInteractiva.update({
        where: { id },
        data: actividadData,
      });
    } else {
      await prisma.actividadInteractiva.create({
        data: actividadData,
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message, success: false };
    } return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
      success: false,
    };
  }

  const ejeTematicoId = formData.get('ejeTematicoId') as string;
  if (!ejeTematicoId) {
    return { message: 'Error: El ID del eje temático es requerido.', success: false };
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
  return { message: id ? 'Actividad actualizada exitosamente.' : 'Actividad creada exitosamente.', success: true };
}

export async function deleteActividadInteractiva(id: string, ejeTematicoId: EjeTematicoType['id']): Promise<FormState> {
  try {
    await prisma.actividadInteractiva.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
    return { message: 'Actividad eliminada exitosamente.', success: true }
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message, success: false };
    }
    return { message: 'Error de base de datos: No se pudo eliminar la actividad.', success: false };
  }
}

// Actualiza la imagen de una actividdad intyeractiva por su Id
export async function updateActividadImage(actividadId: string, imageUrl: string): Promise<FormState> {

  const validatedFields = ActividadInteractivaSchema.pick({ id: true, imagen: true }).safeParse({ actividadId, imageUrl });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. La URL de la imagen no es válida.',
    };
  }

  try {
    await prisma.actividadInteractiva.update({
      where: { id: actividadId },
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