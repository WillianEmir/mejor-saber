'use server';

import prisma from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ObjetivoAprendizajeSchema } from './objetivoAprendizaje.schema'; 
import { EjeTematicoType } from './ejeTematico.schema';
import { FormState } from '@/src/types';

// Server Action para crear y editar un objetivo de aprendizaje
export async function createOrUpdateObjetivoAprendizaje(formData: FormData): Promise<FormState> {

  const validatedFields = ObjetivoAprendizajeSchema.safeParse({
    id: formData.get('id') || undefined,
    descripcion: formData.get('descripcion'),
    ejeTematicoId: formData.get('ejeTematicoId'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...data } = validatedFields.data;

  try {
    if (id) {
      await prisma.objetivoAprendizaje.update(
        {
          where: { id },
          data
        }
      );
    } else {
      await prisma.objetivoAprendizaje.create(
        { data }
      );
    }
  } catch (e) {
    console.log(e);
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        success: false,
        message: 'Ya existe un objetivo de aprendizaje con este nombre.',
      };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
      success: false,
    };
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares/${data.ejeTematicoId}`);
  return {
    message: id
      ? 'Objetivo de aprendizaje actualizado exitosamente.'
      : 'Objetivo de aprendizaje creado exitosamente.',
    success: true,
  };
}

// Server Action para eliminar un objetivo de aprendizaje por su Id
export async function deleteObjetivoAprendizaje(id: string, ejeTematicoId: EjeTematicoType['id']): Promise<FormState> {
  try {
    await prisma.objetivoAprendizaje.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
    return { message: 'Objetivo de aprendizaje eliminado exitosamente.', success: true };
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message, success: false};
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
      success: false,
    };
  }
}
