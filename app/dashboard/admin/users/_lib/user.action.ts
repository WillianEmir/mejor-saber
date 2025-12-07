'use server';

import { revalidatePath } from 'next/cache'; 
import prisma from '@/src/lib/prisma';
import * as bcrypt from 'bcrypt';
import { UpsertUserSchema } from './user.schema';
import { sendEmailNewUser } from '@/src/lib/mailNodemailer';
import { FormState } from '@/src/types';

// Action for creating/updating users from the admin panel
export async function upsertUser(formData: FormData): Promise<FormState> {


  const result = UpsertUserSchema.safeParse({
    id: formData.get('id') || undefined,
    name: formData.get('name'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    role: formData.get('role'),
    isActive: formData.get('isActive') === 'true',
    schoolId: formData.get('schoolId') || undefined,
  });
  
  if (!result.success) {
    return {
      success: false,
      message: "Error de validación. Por favor, corrija los campos.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { id, ...userData } = result.data;
  
  const dataToUpsert = {
    ...userData,
    schoolId: userData.schoolId || null,
  };

  try {
    if (id) {
      await prisma.user.update({
        where: { id },
        data: dataToUpsert,
      });
    } else {
      const temporaryPassword = Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      const newUser = await prisma.user.create({
        data: {
          ...dataToUpsert,
          password: hashedPassword,
        },
      });

      await sendEmailNewUser(newUser.email, newUser.name!, temporaryPassword);
    }

    revalidatePath('/dashboard/admin/users');
    revalidatePath('/dashboard/admin');
    return { success: true, message: id ? 'Usuario actualizado exitosamente.' : 'Usuario creado exitosamente.' };
  } catch (e) {
    return {
      success: false,
      message: `Ocurrió un error inesperado. ${e}`, 
    };
  } 
}

// Action for deleting a user from the admin panel
export async function deleteUser(id: string): Promise<FormState> {
  if (!id) {
    return { success: false, message: 'ID de usuario no proporcionado.' };
  }

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/dashboard/admin/users');
    revalidatePath('/dashboard/admin');
    return { success: true, message: 'Usuario eliminado exitosamente.' };
  } catch (e) {
    return { success: false, message: `Error de base de datos: No se pudo eliminar el usuario. ${e}` };
  }
}
