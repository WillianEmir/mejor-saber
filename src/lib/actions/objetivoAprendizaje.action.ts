'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { ObjetivoAprendizajeSchema, type ObjetivoAprendizajeFormState } from '../schemas/objetivoAprendizaje.schema';
import { EjeTematicoType } from '../schemas/ejeTematico.schema';

// Server Action para crear y editar un objetivo de aprendizaje
export async function createOrUpdateObjetivoAprendizaje(
  prevState: ObjetivoAprendizajeFormState,
  formData: FormData
): Promise<ObjetivoAprendizajeFormState> {

  // 1. Validar los campos del formulario usando Zod.
  const validatedFields = ObjetivoAprendizajeSchema.safeParse(Object.fromEntries(formData.entries()));

  // 2. Si la validación del formulario falla, devolver los errores.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
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
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        errors: {
          descripcion: ['Ya existe un objetivo de aprendizaje con este nombre.'],
        },
        message: 'Error en la base de datos.',
      };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
    };
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares/${data.ejeTematicoId}`);
  return {
    message: id
      ? 'Objetivo de aprendizaje actualizado exitosamente.'
      : 'Objetivo de aprendizaje creado exitosamente.',
  };
}

export async function deleteObjetivoAprendizaje(
  id: string,
  ejeTematicoId: EjeTematicoType['id']
): Promise<{ message: string } | void> {
  try {
    await prisma.objetivoAprendizaje.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
    return { message: 'Objetivo de aprendizaje eliminado exitosamente.' };
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
    };
  }
}
