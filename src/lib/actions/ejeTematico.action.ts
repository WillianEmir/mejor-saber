'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { EjeTematicoFormState, EjeTematicoSchema } from '../schemas/ejeTematico.schema';

export async function createOrUpdateEjeTematico(
  prevState: EjeTematicoFormState,
  formData: FormData,
): Promise<EjeTematicoFormState> { 

  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = EjeTematicoSchema.safeParse({
    id: formData.get('id') || undefined, 
    nombre: formData.get('nombre'),
    contenidoCurricularId: formData.get('contenidoCurricularId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, nombre, contenidoCurricularId } = validatedFields.data;  

  try {
    if (id) {
      await prisma.ejeTematico.update({
        where: { id },
        data: { nombre, contenidoCurricularId },
      });
    } else {
      await prisma.ejeTematico.create({
        data: {
          contenidoCurricularId,
          nombre,
        },
      });
    } 
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        errors: {
          nombre: ['Ya existe un Eje Temático con este nombre en esta área.'],
        },
        message: 'Error en la base de datos.',
      };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares`);
  return { message: id ? 'Eje Temático actualizado exitosamente.' : 'Eje Temático creado exitosamente.' };
}

export async function deleteEjeTematico(id: string): Promise<{ message: string } | void> {
  try {
    await prisma.ejeTematico.delete({ where: { id } });
    revalidatePath('/dashboard/admin/contenidos-curriculares')
    return {message: 'Eje Temático eliminado exitosamente.'}
  } catch (e) { 
    if (e instanceof Error) {
      return { message: e.message }; 
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.' };
  }
} 