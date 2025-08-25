'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { AfirmacionSchema, type AfirmacionFormState } from '../schemas/afirmacion.schema';

export async function createOrUpdateAfirmacion(
  prevState: AfirmacionFormState,
  formData: FormData,
): Promise<AfirmacionFormState> {
  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = AfirmacionSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    competenciaId: formData.get('competenciaId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, nombre, competenciaId } = validatedFields.data;

  try {
    if (id) {
      await prisma.afirmacion.update({
        where: { id },
        data: { nombre, competenciaId },
      });
    } else {
      await prisma.afirmacion.create({
        data: {
          nombre,
          competenciaId,
        },
      });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        errors: {
          nombre: ['Ya existe una afirmación con este nombre para esta competencia.'],
        },
        message: 'Error en la base de datos.',
      };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
    };
  }

  revalidatePath('/dashboard/admin-afirmaciones');
  return { message: id ? 'Afirmación actualizada exitosamente.' : 'Afirmación creada exitosamente.' };
}

export async function deleteAfirmacion(id: string): Promise<{ message: string } | void> {
  try {
    await prisma.afirmacion.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/areas/${id}`)
    return {message: 'Afirmación eliminada exitosamente.'}
  } catch (e) { 
    if (e instanceof Error) {
      return { message: e.message };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.' };
  }
} 