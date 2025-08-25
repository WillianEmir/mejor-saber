'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { AreaSchema, type AreaFormState } from '../schemas/area.schema';

export async function createOrUpdateArea(
  prevState: AreaFormState,
  formData: FormData,
): Promise<AreaFormState> {
  // 1. Validar los campos del formulario usando Zod.
  const validatedFields = AreaSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
  });

  // 2. Si la validación del formulario falla, devolver los errores.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, nombre } = validatedFields.data;

  try {
    if (id) { 
      // 3a. Lógica de actualización
      await prisma.area.update({ where: { id }, data: { nombre } });
    } else {
      // 3b. Lógica de creación
      await prisma.area.create({ data: { nombre } });
      revalidatePath('/dashboard/admin/areas');
    }
  } catch (e) {
    // 4. Manejo de errores de la base de datos
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        errors: { nombre: ['Ya existe un área con este nombre.'] },
        message: 'Error en la base de datos.',
      };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.' };
  }

  return { message: id ? 'Área actualizada exitosamente.' : 'Área creada exitosamente.' };
} 

export async function deleteArea(id: string): Promise<{ message: string } | void> {
  try {
    await prisma.area.delete({ where: { id } });
    return {message: 'Área eliminada exitosamente.'}
  } catch (e) { 
    if (e instanceof Error) {
      return { message: e.message };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.' };
  }
}