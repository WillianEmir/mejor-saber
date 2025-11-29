'use server';

import prisma from '@/src/lib/prisma';  
import { revalidatePath } from 'next/cache';

import { AreaSchema } from './area.schema';
import { FormState } from '@/src/types';

// Server Action para crear o editar un área
export async function createOrUpdateArea(formData: FormData): Promise<FormState> {

  const validatedFields = AreaSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, nombre } = validatedFields.data;

  try {
    if (id) {
      await prisma.area.update({ where: { id }, data: { nombre } });
    } else {
      await prisma.area.create({ data: { nombre } });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        success: false,
        message: 'Error en la base de datos. Ya existe un área con este nombre.',
      };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.', success: false };
  }

  revalidatePath('/dashboard/admin/areas');
  return { message: id ? 'Área actualizada exitosamente.' : 'Área creada exitosamente.', success: true};
} 

// Elimina un área por su Id
export async function deleteArea(id: string): Promise<FormState> {
  try {
    await prisma.area.delete({ where: { id } });
    return { message: 'Área eliminada exitosamente.', success: true }
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, message: e.message };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.', success: false };
  }
}