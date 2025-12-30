'use server';

import { auth } from '@/auth';
import { CreateSimulacroOficialSchema } from './schema';
import prisma from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import { FormState } from '@/src/types';

export async function createOrUpdateSimulacroOficial(formData: FormData): Promise<FormState> {
  const session = await auth();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const userSchoolId = session?.user?.schoolId;

  if (!userId || userRole !== 'ADMINSCHOOL' || !userSchoolId) {
    return {
      success: false,
      message: 'Error de autenticación: No tienes permisos para realizar esta acción.',
    };
  }

  const validatedFields = CreateSimulacroOficialSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    areaId: formData.get('areaId'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, nombre, areaId } = validatedFields.data;

  try {
    if (id) {
      await prisma.simulacroOficial.update({
        where: { id: id, schoolId: userSchoolId }, // Ensure ADMINSCHOOL can only update their own records
        data: {
          nombre,
          areaId,
        },
      });
    } else {
      await prisma.simulacroOficial.create({
        data: {
          nombre,
          schoolId: userSchoolId,
          areaId,
          habilitado: false, // Nuevo simulacro deshabilitado por defecto
        },
      });
    }

    revalidatePath('/dashboard/school/simulacros-oficiales');
    revalidatePath('/dashboard/user');

    return {
      success: true,
      message: id ? 'Simulacro oficial actualizado exitosamente.' : 'Simulacro oficial creado exitosamente.',
    };

  } catch (error) {
    console.error('Error al procesar el simulacro oficial:', error);
    return {
      success: false,
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
    };
  }
}

export async function toggleSimulacroOficialStatus(id: string, habilitado: boolean): Promise<FormState> {
  const session = await auth();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const userSchoolId = session?.user?.schoolId;

  if (!userId || userRole !== 'ADMINSCHOOL' || !userSchoolId) {
    return {
      success: false,
      message: 'Error de autenticación: No tienes permisos para realizar esta acción.',
    };
  }

  try {
    await prisma.simulacroOficial.update({
      where: {
        id,
        schoolId: userSchoolId, // Security check: ensure ADMINSCHOOL can only update their own records
      },
      data: {
        habilitado: habilitado,
      },
    });

    revalidatePath('/dashboard/school/simulacros-oficiales');
    revalidatePath('/dashboard/user'); // Revalidate for user-facing lists

    return { success: true, message: 'Estado del simulacro oficial actualizado exitosamente.' };
  } catch (error) {
    console.error('Error al cambiar el estado del simulacro oficial:', error);
    return {
      success: false,
      message: 'Error de base de datos: No se pudo actualizar el estado del simulacro oficial.',
    };
  }
}

export async function deleteSimulacroOficial(id: string): Promise<FormState> {
  const session = await auth();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const userSchoolId = session?.user?.schoolId;

  if (!userId || userRole !== 'ADMINSCHOOL' || !userSchoolId) {
      return {
          success: false,
          message: 'Error de autenticación: No tienes permisos para realizar esta acción.',
      };
  }

  try {
      await prisma.simulacroOficial.delete({
          where: {
              id,
              schoolId: userSchoolId, // Security check
          },
      });

      revalidatePath('/dashboard/school/simulacros-oficiales');
      revalidatePath('/dashboard/user');
      
      return { success: true, message: 'Simulacro oficial eliminado exitosamente.' };
  } catch (error) {
      console.error('Error al eliminar el simulacro oficial:', error);
      return {
          success: false,
          message: 'Error de base de datos: No se pudo eliminar el simulacro oficial.',
      };
  }
}
