'use server';

import { revalidatePath } from 'next/cache'; 
import prisma from '../prisma';
import { SchoolFormState, SchoolSchema, SchoolSedeFormState, SchoolSedeSchema } from '../schemas/school.schema';

// ----- *********** ----- //
// ----- SCHOOL SEDE ----- //
// ----- *********** ----- //

export async function createOrUpdateSchoolSede(
  prevState: SchoolSedeFormState,
  formData: FormData
): Promise<SchoolSedeFormState> {
  
  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = SchoolSedeSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, ...schoolSededData } = validatedFields.data;

  try {
    if (id) {
      await prisma.schoolSede.update({
        where: { id },
        data: schoolSededData,
      });
    } else {
      await prisma.schoolSede.create({
        data: schoolSededData,
      });
    }
  } catch (e) {
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
    };
  }

  revalidatePath('/dashboard/admin/schools');
  return { message: id ? 'Sede actualizada exitosamente.' : 'Sede creada exitosamente.' };
}

export async function deleteSchoolSede(id: string ): Promise<{ message: string }> {
  try {
    await prisma.schoolSede.delete({ where: { id } });
    revalidatePath('/dashboard/admin/schools')
    return {message: 'Sede eliminada exitosamente.'}
  } catch (e) { 
    if (e instanceof Error) {
      return { message: e.message };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.' };
  } 
}

// ----- ****** ----- //
// ----- SCHOOL ----- //
// ----- ****** ----- //

export async function createOrUpdateSchool( 
  prevState: SchoolFormState,
  formData: FormData
): Promise<SchoolFormState> {
  
  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = SchoolSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { id, ...schooldData } = validatedFields.data;

  try {
    if (id) {
      await prisma.school.update({
        where: { id },
        data: schooldData,
      });
    } else {
      await prisma.school.create({
        data: schooldData,
      });
    }
  } catch (e) {
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
    };
  }

  revalidatePath('/dashboard/admin/schools');
  return { message: id ? 'School actualizada exitosamente.' : 'School creada exitosamente.' };
}

export async function deleteSchool(id: string ): Promise<{ message: string }> {
  try {
    await prisma.school.delete({ where: { id } });
    revalidatePath('/dashboard/admin/schools')
    return {message: 'School eliminada exitosamente.'}
  } catch (e) { 
    if (e instanceof Error) {
      return { message: e.message };
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.' };
  }
}