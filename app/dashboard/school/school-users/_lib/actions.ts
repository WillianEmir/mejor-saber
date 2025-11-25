'use server';

import prisma from '@/src/lib/prisma';
import { auth } from '@/auth'; // Updated import
import { UserSchoolSchema } from './schema'; 
import { FormState } from '@/src/types';
import bcrypt from 'bcryptjs';
import { sendEmailNewUser } from '@/src/lib/mailNodemailer';
import { revalidatePath } from "next/cache"; 
import { UserSchoolType } from './school.schema';

export async function getUsersBySchoolId() : Promise<UserSchoolType[]> {

  const session = await auth(); // Updated call

  if (!session || session?.user?.role !== 'ADMINSCHOOL') {
    return [];
  }

  const schoolId = session?.user?.schoolId;

  try {
    const users = await prisma.user.findMany({
      where: {
        schoolId,
        role: { in: ['USER', 'DOCENTE'] },
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        idDocument: true,
        schoolId: true,
        role: true,
        degree: true,
        schoolSedeId: true,
      }
    });
    return users;
  } catch (error) {
    console.error("Error fetching users by school ID:", error);
    return [];
  }
}

export async function createOrUpdateUser(formData: FormData): Promise<FormState> {

  const validatedFields = UserSchoolSchema.safeParse({
    id: formData.get('id') || undefined,
    name: formData.get('name'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    idDocument: formData.get('idDocument') || undefined,
    schoolId: formData.get('schoolId'),
    role: formData.get('role'),
    degree: formData.get('degree') || undefined,
    schoolSedeId: formData.get('schoolSedeId') || undefined,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, degree, ...userData } = validatedFields.data;

  try {
    if (id) {
      await prisma.user.update({
        where: { id },
        data: { ...userData, degree },
      });
      revalidatePath('/dashboard/school/school-users');
      return { success: true, message: "Usuario actualizado" };
    } else {
      const temporaryPassword = Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
      const newUser = await prisma.user.create({
        data: {
          ...userData,
          degree,
          isActive: true,
          password: hashedPassword,
        },
      });
      await sendEmailNewUser(newUser.email, newUser.name!, temporaryPassword);
      revalidatePath('/dashboard/school/school-users');
      return { success: true, message: "Usuario creado" };
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return { success: false, message: "Error de base de datos" };
  }}

export async function deleteUser(id: string): Promise<FormState> {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/dashboard/school/school-users');
    return { success: true, message: "Usuario eliminado" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Error de base de datos" };
  }
}