'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { ActividadInteractivaFormState, ActividadInteractivaSchema, ProgresoActividadInteractivaFormState, ProgresoActividadInteractivaSchema } from '../schemas/actividadInteractiva.schema';
import { EjeTematicoType } from '../../../app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.schema';

// ----- ********************* ----- //
// ----- ACTIVIDAD INTERACTIVA ----- //
// ----- ********************* ----- //

export async function createOrUpdateActividadInteractiva(
  prevState: ActividadInteractivaFormState,
  formData: FormData,
): Promise<ActividadInteractivaFormState> {

  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = ActividadInteractivaSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, ...actividadData } = validatedFields.data;

  try {
    if (id) {
      await prisma.actividadInteractiva.update({
        where: { id },
        data: actividadData,
      });
    } else {
      await prisma.actividadInteractiva.create({
        data: actividadData,
      });
    }
  } catch (e) {
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };
  }

  const ejeTematicoId = formData.get('ejeTematicoId') as string;
  if (!ejeTematicoId) {
    return { message: 'Error: El ID del eje temático es requerido.' };
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
  return { message: id ? 'Actividad actualizada exitosamente.' : 'Actividad creada exitosamente.' };
}

export async function deleteActividadInteractiva(id: string, ejeTematicoId: EjeTematicoType['id']): Promise<{ message: string } | void> {
  try {
    await prisma.actividadInteractiva.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
    return { message: 'Actividad eliminada exitosamente.' }
  } catch (e) {
    return { message: 'Error de base de datos: No se pudo eliminar la actividad.' };
  }
}

// ----- ****************************** ----- //
// ----- PROGRESO ACTIVIDAD INTERACTIVA ----- //
// ----- ****************************** ----- //

export async function createOrUpdateProgresoActividad(
  prevState: ProgresoActividadInteractivaFormState,
  formData: FormData,
  ejeTematicoId: EjeTematicoType['id']
): Promise<ProgresoActividadInteractivaFormState> {

  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = ProgresoActividadInteractivaSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, ...progresoData } = validatedFields.data;

  try {
    if (id) {
      await prisma.progresoActividad.update({
        where: { id },
        data: progresoData,
      });
    } else {
      await prisma.progresoActividad.create({
        data: progresoData,
      });
    }
  } catch (e) {
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
  return { message: id ? 'Progreso de la Actividad actualizado exitosamente.' : 'Progreso de la Actividad  creado exitosamente.' };
}

export async function deleteProgresoActividad(id: string, ejeTematicoId: EjeTematicoType['id']): Promise<{ message: string } | void> {
  try {
    await prisma.progresoActividad.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
    return { message: 'Progreso de la Actividad eliminado exitosamente.' }
  } catch (e) {
    return { message: 'Error de base de datos: No se pudo eliminar la actividad.' };
  }
}