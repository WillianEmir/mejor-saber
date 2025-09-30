'use server';

import { revalidatePath } from 'next/cache'; 
import prisma from '@/src/lib/prisma';
import * as bcrypt from 'bcrypt';
import { sendNewUserPassword } from '@/src/lib/mail';
import { SignupSchema, UpdateProfileSchema, UpdateProfileType, UpsertUserSchema, UpsertUserSchoolSchema, UpsertUserSchoolType, UpsertUserType, UserType } from '../schemas/user.schema';
import { sendEmailNewUser } from '../mailNodemailer';

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
      const temporaryPassword = Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      const newUser = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });

      await sendNewUserPassword(newUser.email, newUser.firstName!, temporaryPassword);
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

// Action for creating/updating users from the admin school panel
export async function upsertUserByAdminSchool(data: UpsertUserSchoolType, schoolId: string) {

  const result = UpsertUserSchoolSchema.safeParse(data);

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
      const temporaryPassword = Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      const newUser = await prisma.user.create({
        data: {
          ...userData,
          schoolId,
          isActive: true,
          password: hashedPassword,
        },
      }); 

      await sendEmailNewUser(newUser.email, newUser.firstName!, temporaryPassword);
    }

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

  revalidatePath(`/dashboard/school/school-users`);
  return { success: true, message: id ? 'Usuario actualizado exitosamente.' : 'Usuario creado exitosamente.' };
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