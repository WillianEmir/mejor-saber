'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { EvidenciaSchema, type EvidenciaFormState } from '../schemas/evidencia.schema';

export async function createOrUpdateEvidencia(
  prevState: EvidenciaFormState,
  formData: FormData,
): Promise<EvidenciaFormState> {

  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = EvidenciaSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    afirmacionId: formData.get('afirmacionId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, nombre, afirmacionId } = validatedFields.data;

  try {
    if (id) {
      await prisma.evidencia.update({
        where: { id },
        data: { nombre, afirmacionId },
      });
    } else {
      await prisma.evidencia.create({
        data: {
          nombre,
          afirmacionId,
        },
      });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        errors: {
          nombre: ['Ya existe una evidencia con este nombre para esta afirmación.'],
        },
        message: 'Error en la base de datos.',
      };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
    };
  }

  revalidatePath('/dashboard/admin-evidencias');
  return { message: id ? 'Evidencia actualizada exitosamente.' : 'Evidencia creada exitosamente.' };
}

export async function deleteEviencia(id: string): Promise<{ message: string } | void> {
  try {
    await prisma.evidencia.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/areas/${id}`)
    return {message: 'Evidencia eliminada exitosamente.'}
  } catch (e) { 
    if (e instanceof Error) {
      return { message: e.message };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.' };
  }
} 