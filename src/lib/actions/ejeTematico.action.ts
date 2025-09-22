'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { EjeTematicoFormState, EjeTematicoSchema, EjeTematicoType, ProgresoSeccionFormState, ProgresoSeccionSchema, SeccionFormState, SeccionSchema, SeccionType } from '../schemas/ejeTematico.schema';
import { UserType } from '../schemas/user.schema';

// ----- ************ ----- //
// ----- EJE TEMÁTICO ----- //
// ----- ************ ----- //

export async function createOrUpdateEjeTematico(
  prevState: EjeTematicoFormState,
  formData: FormData,
): Promise<EjeTematicoFormState> {

  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = EjeTematicoSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, ...ejeTematicoData } = validatedFields.data;

  try {
    if (id) {
      await prisma.ejeTematico.update({
        where: { id },
        data: ejeTematicoData,
      });
    } else {
      await prisma.ejeTematico.create({
        data: ejeTematicoData,
      });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        errors: {
          nombre: ['Ya existe un Eje Temático con este nombre en este contenido curricular.'],
        },
        message: 'Error: El nombre ya está en uso.',
      };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };
  }

  revalidatePath('/dashboard/admin/contenidos-curriculares');
  return { message: id ? 'Eje Temático actualizado exitosamente.' : 'Eje Temático creado exitosamente.' };
}

export async function deleteEjeTematico(id: string): Promise<{ message: string } | void> {
  try {
    await prisma.ejeTematico.delete({ where: { id } });
    revalidatePath('/dashboard/admin/contenidos-curriculares')
    return { message: 'Eje Temático eliminado exitosamente.' }
  } catch (e) {
    return { message: 'Error de base de datos: No se pudo eliminar el eje temático.' };
  }
}

// ----- ******* ----- //
// ----- SECCION ----- //
// ----- ******* ----- //

export async function createOrUpdateSeccion(
  prevState: SeccionFormState,
  formData: FormData,
): Promise<SeccionFormState> {

  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = SeccionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, ...seccionData } = validatedFields.data;

  try {
    if (id) {
      await prisma.seccion.update({
        where: { id },
        data: seccionData,
      });
    } else {
      await prisma.seccion.create({
        data: seccionData,
      });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        errors: {
          nombre: ['Ya existe una sección con este nombre en este contenido curricular.'],
        },
        message: 'Error: El nombre ya está en uso.',
      };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares${seccionData.ejeTematicoId}`);
  return { message: id ? 'Sección actualizada exitosamente.' : 'Sección creada exitosamente.' };
}

export async function deleteSeccion(id: SeccionType['id'], ejeTematicoId: EjeTematicoType['id']): Promise<{ message: string } | void> {
  try {
    await prisma.seccion.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`)
    return { message: 'Sección eliminada exitosamente.' }
  } catch (e) {
    return { message: 'Error de base de datos: No se pudo eliminar la sección.' };
  }
}

// ----- **************** ----- //
// ----- PROGRESO SECCION ----- //
// ----- **************** ----- //

export async function createOrUpdateProgresoSeccion(
  prevState: ProgresoSeccionFormState,
  formData: FormData,
  ejeTematicoId: EjeTematicoType['id'],
  seccionData: SeccionType
): Promise<ProgresoSeccionFormState> {

  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = ProgresoSeccionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, ...progresoData } = validatedFields.data;

  try {
    if (id) {
      await prisma.progresoSeccion.update({
        where: { id },
        data: progresoData,
      });
    } else {
      await prisma.progresoSeccion.create({
        data: progresoData,
      });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        errors: {
          nombre: ['Ya existe un Progreso de Sección con este nombre en este contenido curricular.'],
        },
        message: 'Error: El nombre ya está en uso.',
      };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
  return { message: id ? 'Progreso de Sección actualizado exitosamente.' : 'Progreso de Sección creado exitosamente.' };
}

export async function deleteProgresoSeccion(id: SeccionType['id'], ejeTematicoId: EjeTematicoType['id'], userId: UserType['id']): Promise<{ message: string } | void> {
  try {
    await prisma.progresoSeccion.delete(
      {
        where: {
          usuarioId_seccionId: {
            usuarioId: userId,
            seccionId: id
          }
        }
      }
    );
    revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`)
    return { message: 'Progreso de Sección eliminado exitosamente.' }
  } catch (e) {
    return { message: 'Error de base de datos: No se pudo eliminar el progreso de la sección.' };
  }
}