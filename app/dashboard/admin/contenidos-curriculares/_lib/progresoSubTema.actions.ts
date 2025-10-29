'use server'

import { FormState } from "@/src/types";
import { EjeTematicoType } from "./ejeTematico.schema";
import { ProgresoSubTemaSchema } from "./progresoSubTema.schema";
import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrUpdateProgresoSubtema( formData: FormData ): Promise<FormState> {
  
  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = ProgresoSubTemaSchema.safeParse({
    id: formData.get('id') || undefined,
    completado: formData.get('completado') === 'true',
    usuarioId: formData.get('usuarioId'),
    subTemaId: formData.get('subTemaId'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...progresoData } = validatedFields.data;

  try {
    if (id) {
      await prisma.progresoSubTema.update({
        where: { id },
        data: progresoData,
      });
    } else {
      await prisma.progresoSubTema.create({
        data: progresoData,
      });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        success: false,
        errors: {
          nombre: ['Ya existe un Progreso SubTema con este nombre para esta Sub Tema.'],
        },
        message: 'Error en la base de datos.',
      };
    }
    return {
      success: false,
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
    };
  }

    const ejeTematicoId = formData.get('ejeTematicoId') as string;
  if (!ejeTematicoId) {
    return { message: 'Error: El ID del eje temático es requerido.', success: false};
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
  return { message: id ? 'Progreso del Sub Tema actualizado exitosamente.' : 'Progreso del Sub Tema creado exitosamente.', success: true};
}

export async function deleteProgresoSubTema(id: string, ejeTematicoId: EjeTematicoType['id']): Promise<FormState> {
  try {
    await prisma.subTema.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`)
    return {message: 'Progreso del SubTema eliminado exitosamente.', success: true}
  } catch (e) { 
    if (e instanceof Error) {
      return { message: e.message, success: false};
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.', success: false};
  }
}