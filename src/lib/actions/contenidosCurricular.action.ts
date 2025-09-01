'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { ContenidoCurricularSchema, type ContenidoCurricularFormState } from '../schemas/contenidoCurricular.schema';

export async function createOrUpdateContenidoCurricular(
  prevState: ContenidoCurricularFormState,
  formData: FormData,
): Promise<ContenidoCurricularFormState> {

  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = ContenidoCurricularSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    areaId: formData.get('areaId'),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.data);
    
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, nombre, areaId } = validatedFields.data;  

  try {
    if (id) {
      await prisma.contenidoCurricular.update({
        where: { id },
        data: { nombre, areaId },
      });
    } else {
      await prisma.contenidoCurricular.create({
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
          nombre: ['Ya existe un Contenido Curricular con este nombre en esta área.'],
        },
        message: 'Error en la base de datos.',
      };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares`);
  return { message: id ? 'Contenido Curricular actualizado exitosamente.' : 'Contenido Curricular creado exitosamente.' };
}

export async function deleteContenidoCurricular(id: string): Promise<{ message: string } | void> {
  try {
    await prisma.contenidoCurricular.delete({ where: { id } });
    return {message: 'Contenido Curricular eliminado exitosamente.'}
  } catch (e) { 
    if (e instanceof Error) {
      return { message: e.message };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.' };
  }
} 