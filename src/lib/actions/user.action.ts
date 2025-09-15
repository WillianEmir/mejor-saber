'use server';

import prisma from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import * as bcrypt from 'bcrypt';
import { SignupSchema, UpsertUserSchema, UpsertUserType } from '../schemas/user.schema';

// Action for public sign-up
export async function signup(formData: FormData) {
  const result = SignupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  const { firstName, email, password } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        error: { email: ['El correo electrónico ya está en uso'] },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstName,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: { _form: ['Ocurrió un error inesperado.'] },
    };
  }
}

// Action for creating/updating users from the admin panel
export async function upsertUser(data: UpsertUserType) {
  const result = UpsertUserSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  const { id, ...userData } = result.data;

  try {
    if (id) {
      await prisma.user.update({
        where: { id },
        data: userData,
      });
    } else {
      // For new users created by admin, a secure random password is required.
      // This schema doesn't include a password field, so we'll generate one.
      // In a real-world scenario, you'd likely email this to the user.
      const temporaryPassword = Math.random().toString(36).slice(-8);

      // console.log(temporaryPassword);  
          
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
      
      await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
    }

    revalidatePath('/dashboard/admin/users');
    return { success: true };
  } catch (e: any) {
    if (e.code === 'P2002' && e.meta?.target?.includes('email')) {
      return {
        success: false,
        error: { email: ['El correo electrónico ya está en uso.'] },
      };
    }
    return {
      success: false,
      error: { _form: ['Ocurrió un error inesperado.'] },
    };
  }
}

// Action for deleting a user from the admin panel
export async function deleteUser(formData: FormData) {

  const id = formData.get('id')?.toString();

  if (!id) {
    return { success: false, message: 'ID de usuario no proporcionado.' };
  }

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/dashboard/admin/users');
    return { success: true, message: 'Usuario eliminado exitosamente.' };
  } catch (e) {
    return { success: false, message: 'Error de base de datos: No se pudo eliminar el usuario.' };
  }
}
