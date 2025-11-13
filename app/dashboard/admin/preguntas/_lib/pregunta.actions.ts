'use server';

import { revalidatePath } from 'next/cache';
import { PreguntaSchema } from './pregunta.schema';
import { FormState } from '@/src/types';
import prisma from '@/src/lib/prisma';

export async function createOrUpdatePregunta(formData: FormData): Promise<FormState> {

  // 1. Extraer y estructurar los datos del formulario para una validación unificada.
  const rawData = {
    id: formData.get('id') || undefined,
    contexto: formData.get('contexto'),
    imagen: formData.get('imagen') || undefined,
    enunciado: formData.get('enunciado'),
    groupFlag: formData.get('groupFlag') || undefined,
    opciones: JSON.parse(formData.get('opciones') as string || '[]'),
    evidenciaId: formData.get('evidenciaId'),
    ejesTematicos: (formData.get('ejesTematicos') as string || '').split(','),
  };

  // 2. Validar los campos del formulario usando Zod.
  const validatedFields = PreguntaSchema.safeParse(rawData);

  // 3. Si la validación del formulario falla, devolver los errores.
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ejesTematicos, opciones: rawOpciones, ...preguntaData } = validatedFields.data;

  const opciones = rawOpciones.map(({ isImage, imageUrl, ...rest }) => rest);

  try {
    if (id) {
      // 4a. Lógica de actualización
      await prisma.pregunta.update({
        where: { id },
        data: {
          ...preguntaData,
          opciones: {
            deleteMany: {},
            create: opciones,
          },
          ejesTematicos: {
            set: ejesTematicos.map((id) => ({ id: String(id) })),
          },
        },
      });
      revalidatePath(`/dashboard/admin/preguntas/${id}`);
    } else {
      // 4b. Lógica de creación
      await prisma.pregunta.create({
        data: {
          ...preguntaData,
          opciones: {
            create: opciones,
          },
          ejesTematicos: {
            connect: ejesTematicos.map((id) => ({ id: String(id) })),
          },
        },
      });
    }
    revalidatePath('/dashboard/admin/preguntas');
  } catch (e) {
    // 5. Manejo de errores de la base de datos
    console.error(e);
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        success: false,
        message: 'Error en la base de datos: Ya existe un registro con datos similares.',
      };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.', success: false };
  }

  return { message: id ? 'Pregunta actualizada exitosamente.' : 'Pregunta creada exitosamente.', success: true };
}

export async function deletePregunta(id: string): Promise<FormState> {
  try {
    await prisma.pregunta.delete({ where: { id } });
    revalidatePath('/dashboard/admin/preguntas');
    return {
      success: true,
      message: 'Pregunta eliminada exitosamente.'
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error de base de datos: No se pudo eliminar la pregunta.'
    }
  }
}