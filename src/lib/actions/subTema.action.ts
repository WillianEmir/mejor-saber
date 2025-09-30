'use server';

import { revalidatePath } from 'next/cache'; 
import prisma from '../prisma';
import { ProgresoSubTemaFormState, ProgresoSubTemaSchema, SubTemaFormState, SubTemaSchema } from '../schemas/subTema.schema';
import { EjeTematicoType } from '../schemas/ejeTematico.schema';

// ----- ******* ----- //
// ----- SUBTEMA ----- // 
// ----- ******* ----- //

export async function createOrUpdateSubTema(
  prevState: SubTemaFormState,
  formData: FormData
): Promise<SubTemaFormState> {
  
  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = SubTemaSchema.safeParse(Object.fromEntries(formData.entries()));
  
  console.log(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, ...subTemaData } = validatedFields.data;

  try {
    if (id) {
      await prisma.subTema.update({
        where: { id },
        data: subTemaData,
      });
    } else {
      await prisma.subTema.create({
        data: subTemaData,
      });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        errors: {
          nombre: ['Ya existe un SubTema con este nombre para esta competencia.'],
        },
        message: 'Error en la base de datos.',
      };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
    };
  }

  const ejeTematicoId = formData.get('ejeTematicoId') as string;
  if (!ejeTematicoId) {
    return { message: 'Error: El ID del eje temático es requerido.' };
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
  return { message: id ? 'Afirmación actualizada exitosamente.' : 'Afirmación creada exitosamente.' };
}

export async function deleteSubTema(id: string, ejeTematicoId: EjeTematicoType['id']): Promise<{ message: string } | void> {
  try {
    await prisma.subTema.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`)
    return {message: 'SubTema eliminado exitosamente.'}
  } catch (e) { 
    if (e instanceof Error) {
      return { message: e.message };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.' };
  }
}

// ----- **************** ----- //
// ----- PROGRESO SUBTEMA ----- //
// ----- **************** ----- //

export async function createOrUpdateProgresoSubtema(
  prevState: ProgresoSubTemaFormState,
  formData: FormData,
  ejeTematicoId: EjeTematicoType['id']
): Promise<ProgresoSubTemaFormState> {
  
  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = ProgresoSubTemaSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
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
        errors: {
          nombre: ['Ya existe un Progreso SubTema con este nombre para esta Sub Tema.'],
        },
        message: 'Error en la base de datos.',
      };
    }
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
    };
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
  return { message: id ? 'Progreso del Sub Tema actualizado exitosamente.' : 'Progreso del Sub Tema creado exitosamente.' };
}

export async function deleteProgresoSubTema(id: string, ejeTematicoId: EjeTematicoType['id']): Promise<{ message: string } | void> {
  try {
    await prisma.subTema.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`)
    return {message: 'Progreso del SubTema eliminado exitosamente.'}
  } catch (e) { 
    if (e instanceof Error) {
      return { message: e.message };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.' };
  }
}