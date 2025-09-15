'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { CompetenciaSchema, type CompetenciaFormState } from '../schemas/competencia.schema';

export async function createOrUpdateCompetencia(
  prevState: CompetenciaFormState,
  formData: FormData,
): Promise<CompetenciaFormState> {
  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = CompetenciaSchema.safeParse({
    id: formData.get('id') || undefined,
    areaId: formData.get('areaId'),
    nombre: formData.get('nombre'),
  });

  if (!validatedFields.success) {
    
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, nombre, areaId } = validatedFields.data;  

  try {
    if (id) {
      await prisma.competencia.update({
        where: { id },
        data: { nombre, areaId },
      });
    } else {
      await prisma.competencia.create({
        data: {
          areaId,
          nombre,
        },
      });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        errors: {
          nombre: ['Ya existe una competencia con este nombre en esta área.'],
        },
        message: 'Error en la base de datos.',
      };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };
  }

  revalidatePath(`/dashboard/admin/admin/areas/${id}`);
  return { message: id ? 'Competencia actualizada exitosamente.' : 'Competencia creada exitosamente.' };
}

export async function deleteCompetencia(id: string): Promise<{ message: string } | void> {
  try {
    await prisma.competencia.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/admin/areas/${id}`)
    return {message: 'Competencia eliminada exitosamente.'}
  } catch (e) { 
    if (e instanceof Error) {
      return { message: e.message };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.' };
  }
} 