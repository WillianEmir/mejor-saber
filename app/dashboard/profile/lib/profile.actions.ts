'use server';

import { revalidatePath } from 'next/cache';
import prisma from "@/src/lib/prisma";
import { UpdateProfileSchema, UpdateProfileType } from "./profile.schema";

// Action for updating own profile (self-service)
export async function updateUser(data: UpdateProfileType) {
  const result = UpdateProfileSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  const { id, ...userData } = result.data;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });

    revalidatePath('/dashboard/profile');
    return {
      message: 'Perfil de usuario actualizado exitosamente.',
      success: true,
      user: updatedUser,
    };
  } catch (e) {
    return {
      error: {
        message: 'Hubo un problema al actualizar el perfil de usuario.',
        success: false,
      },
    };
  }
}