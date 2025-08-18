'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { AreaSchema, type AreaFormState } from '../schemas/area.schema';

export async function createOrUpdateArea(
  prevState: AreaFormState,
  formData: FormData,
): Promise<AreaFormState> {
  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = AreaSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
  });

  // 2. Si la validación falla, devolver los errores para mostrarlos en el formulario
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, nombre } = validatedFields.data;

  try {
    if (id) {
      // 3a. Lógica de Actualización
      await prisma.area.update({ where: { id }, data: { nombre } });
    } else {
      // 3b. Lógica de Creación
      await prisma.area.create({ data: { nombre } });
    }
  } catch (e) {
    // Manejo de errores de la base de datos
    if (e instanceof Error) {
      // Error de unicidad de Prisma (el nombre ya existe)
      if (e.message.includes('Unique constraint failed')) {
        return {
          errors: { nombre: ['Ya existe un área con este nombre.'] },
          message: 'Error en la base de datos.',
        };
      }
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.' };
  }

  // 4. Revalidar el path para que la UI se actualice con los nuevos datos
  revalidatePath('/dashboard/admin-areas');
  return { message: id ? 'Área actualizada exitosamente.' : 'Área creada exitosamente.' };
}