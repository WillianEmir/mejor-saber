'use server';

import { revalidatePath } from 'next/cache';
import { NivelDesempenoSchema } from './NivelesDesempeno.schema'; 
import prisma from '@/src/lib/prisma';
import { FormState } from '@/src/types';

// Crea o edita un nivel de desempeño
export async function createOrUpdateNivelDesempeno( formData: FormData ): Promise<FormState> { 
  
  const validatedFields = NivelDesempenoSchema.safeParse({
    id: formData.get('id') || undefined,
    nivel: formData.get('nivel'),
    descripcion: formData.get('descripcion'),
    puntajeMin: formData.get('puntajeMin'),
    puntajeMax: formData.get('puntajeMax'),
    areaId: formData.get('areaId'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...nivelData } = validatedFields.data;

  try {
    if (id) {
      await prisma.nivelDesempeno.update({
        where: { id },
        data: nivelData,
      });
    } else {
      await prisma.nivelDesempeno.create({
        data: nivelData,
      });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        success: false,
        message: 'Error en la base de datos.',
        errors: { nivel: ['Ya existe un nivel de desempeño con este nombre en esta área.'] },
      };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
      success: false,
    };
  }

  revalidatePath('/dashboard/admin/niveles-desempeno');
  return { message: id ? 'Nivel de desempeño actualizado exitosamente.' : 'Nivel de desempeño creado exitosamente.', success: true};
}

// Elimina un nivel de desempeño
export async function deleteNivelDesempeno(id: string): Promise<FormState> {
  try {
    await prisma.nivelDesempeno.delete({ where: { id } });
    revalidatePath('/dashboard/admin/niveles-desempeno');
    return { message: 'Nivel de desempeño eliminado exitosamente.', success: true};
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message, success: false};
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.', success: false};
  }
}