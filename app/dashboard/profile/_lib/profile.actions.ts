'use server';

import { revalidatePath } from 'next/cache';
import prisma from "@/src/lib/prisma";
import { UpdateProfileSchema, UpdateProfileType } from "./profile.schema";
import { FormState } from '@/src/types';

export async function updateUser(data: UpdateProfileType): Promise<FormState> {
  const result = UpdateProfileSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { id, ...userData } = result.data;

  try {
    await prisma.user.update({
      where: { id },
      data: userData,
    });

    revalidatePath('/dashboard/profile');
    return {
      message: 'Perfil de usuario actualizado exitosamente.',
      success: true,
    };
  } catch (e) {
    return {
      message: `Hubo un problema al actualizar el perfil de usuario.: ${e}`,
      success: false,
    };
  }
}