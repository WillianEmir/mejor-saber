'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { PreguntaFormState, PreguntaSchema } from '../schemas/pregunta.schema';

export async function createOrUpdatePregunta(
  prevState: PreguntaFormState,
  formData: FormData,
): Promise<PreguntaFormState> {

  // 1. Extraer y estructurar los datos del formulario para una validación unificada.
  const rawData = {
    id: formData.get('id') || undefined,
    contexto: formData.get('contexto'),
    imagen: formData.get('imagen') || undefined,
    enunciado: formData.get('enunciado'),
    groupFlag: formData.get('groupFlag') || undefined,
    opciones: ['a', 'b', 'c', 'd', 'e', 'f', 'g']
      .filter(key => formData.get(`respuesta_${key}`) !== null && formData.get(`respuesta_${key}`) !== '')
      .map(key => ({
        respuesta: formData.get(`respuesta_${key}`) as string,
        correcta: formData.get(`correcta_${key}`) !== null,
        retroalimentacion: formData.get(`retroalimentacion_${key}`) as string | null,
      })),
    evidenciaId: formData.get('evidenciaId'),
    ejesTematicos: formData.getAll('ejeTematico').map(id => String(id)),
  };

  // 2. Validar los campos del formulario usando Zod.
  const validatedFields = PreguntaSchema.safeParse(rawData);
  
  // 3. Si la validación del formulario falla, devolver los errores.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, ejesTematicos, opciones, ...preguntaData } = validatedFields.data;

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
        message: 'Error en la base de datos: Ya existe un registro con datos similares.',
      };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.' };
  }

  return { message: id ? 'Pregunta actualizada exitosamente.' : 'Pregunta creada exitosamente.' };
}

export async function deletePregunta(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.pregunta.delete({ where: { id } });
    revalidatePath('/dashboard/admin/preguntas');
    return { success: true, message: 'Pregunta eliminada exitosamente.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Error de base de datos: No se pudo eliminar la pregunta.' };
  }
}

