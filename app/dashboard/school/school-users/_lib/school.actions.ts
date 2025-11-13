'use server'

import { UpsertUserSchoolSchema, UpsertUserSchoolType } from "@/app/dashboard/admin/users/_lib/user.schema";
import { sendEmailNewUser } from "@/src/lib/mailNodemailer";
import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache"; 

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

      await sendEmailNewUser(newUser.email, newUser.name!, temporaryPassword);
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