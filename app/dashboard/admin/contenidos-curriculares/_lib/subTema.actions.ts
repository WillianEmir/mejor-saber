'use server';

import { revalidatePath } from 'next/cache';
import { SubTemaSchema } from './subTema.schema';
import { FormState } from '@/src/types';
import prisma from '@/src/lib/prisma';
import { EjeTematicoType } from './ejeTematico.schema';

export async function createOrUpdateSubTema(formData: FormData): Promise<FormState> {

  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = SubTemaSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    video: formData.get('video'),
    ejemplo: formData.get('ejemplo'),
    seccionId: formData.get('seccionId'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...subTemaData } = validatedFields.data;

  try {
    if (id) {
      await prisma.subTema.update({
        where: { id },
        data: subTemaData,
      });
    } else {
      await prisma.subTema.create({
        data: subTemaData,
      });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        success: false,
        message: 'Error en la base de datos.',
        errors: { nombre: ['Ya existe un SubTema con este nombre para esta competencia.'] },
      };
    }
    return {
      success: false,
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };
  }

  const ejeTematicoId = formData.get('ejeTematicoId') as string;
  if (!ejeTematicoId) {
    return { message: 'Error: El ID del eje temático es requerido.', success: false };
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
  return { message: id ? 'Afirmación actualizada exitosamente.' : 'Afirmación creada exitosamente.', success: true };
}

// Elimina un subtema por su Id
export async function deleteSubTema(id: string, ejeTematicoId: EjeTematicoType['id']): Promise<FormState> {
  try {
    await prisma.subTema.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`)
    return { message: 'SubTema eliminado exitosamente.', success: true }
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message, success: false };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.', success: false };
  }
}

// Actualiza la imagen de un sub tema por su Id
export async function updateSubTemaImage(subTemaId: string, imageUrl: string): Promise<FormState> {

  const validatedFields = SubTemaSchema.pick({ id: true, imagen: true }).safeParse({ subTemaId, imageUrl });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. La URL de la imagen no es válida.',
    };
  }

  try {
    await prisma.subTema.update({
      where: { id: subTemaId },
      data: { imagen: imageUrl },
    });
    revalidatePath(`/dashboard/admin/contenidos-curriculares`);
    return { success: true, message: 'Imagen actualizada correctamente.' };
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message, success: false };
    }
    return {
      success: false,
      message: 'Error de base de datos: No se pudo actualizar la imagen.',
    };
  }
}