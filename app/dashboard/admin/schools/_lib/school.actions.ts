'use server';

import { revalidatePath } from 'next/cache';
import { SchoolSchema } from './school.schema';
import { FormState } from '@/src/types';
import prisma from '@/src/lib/prisma';

export async function createOrUpdateSchool(formData: FormData): Promise<FormState> { 

  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = SchoolSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    email: formData.get('email') || undefined,
    DANE: formData.get('DANE'),
    address: formData.get('address') || undefined,
    department: formData.get('department') || undefined,
    city: formData.get('city') || undefined,
    maxUsers: formData.get('maxUsers') ? parseInt(formData.get('maxUsers') as string) : undefined,
  });

  console.log(validatedFields.data);
  

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
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
        data: {
          ...schooldData,
          sedes: {
            create: [
              {
                DANE: schooldData.DANE,
                nombre: schooldData.nombre,
              }
            ]
          }
        }
      });
    }
  } catch (e) {
    return {
      message: `Error de base de datos: No se pudo procesar la solicitud. ${e}`,
      success: false,
    };
  }

  revalidatePath('/dashboard/admin/schools');
  return {
    message: id ? 'School actualizada exitosamente.' : 'School creada exitosamente.',
    success: true,
  };
}

export async function deleteSchool(id: string): Promise<FormState> {
  try {
    await prisma.school.delete({ where: { id } });
    revalidatePath('/dashboard/admin/schools')
    return { message: 'School eliminada exitosamente.', success: true}
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message, success: false};
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.', success: false};
  }
}