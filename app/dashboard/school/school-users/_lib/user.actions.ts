'use server';

import prisma from '@/src/lib/prisma';
import { UserSchoolSchema, UserSchool } from './user.schema';
import { FormState } from '@/src/types';
import bcrypt from 'bcryptjs';
import { sendEmailNewUser } from '@/src/lib/mailNodemailer';
import { revalidatePath } from "next/cache";

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
    sedeName: formData.get('sedeName') || undefined,
  });  
  
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, degree, sedeName, ...userData } = validatedFields.data;
  let schoolSedeId: string | undefined = undefined;

  if (sedeName && userData.schoolId) {
    const sede = await prisma.schoolSede.findFirst({
      where: {
        nombre: sedeName,
        schoolId: userData.schoolId,
      },
      select: { id: true }
    });
    if (!sede) {
      return {
        success: false,
        message: `La sede "${sedeName}" no fue encontrada para este colegio.`
      }
    }
    schoolSedeId = sede.id;
  }

  try {
    const dataToSave = { ...userData, degree, schoolSedeId };
    if (id) {
      await prisma.user.update({
        where: { id },
        data: dataToSave,
      });
      revalidatePath('/dashboard/school/school-users');
      return { success: true, message: "Usuario actualizado" };
    } else {
      const temporaryPassword = Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
      const newUser = await prisma.user.create({
        data: {
          ...dataToSave,
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
  }
}

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

type BulkCreateResult = {
  success: boolean;
  message: string;
  results: {
    successCount: number;
    failedCount: number;
    errors: { email: string, reason: string }[];
  }
}

export async function bulkCreateUsers(users: UserSchool[]): Promise<BulkCreateResult> {
  const resultSummary = {
    successCount: 0,
    failedCount: 0,
    errors: [] as { email: string, reason: string }[],
  };
  
  if (users.length === 0) {
    return { success: true, message: "No se proporcionaron usuarios para importar.", results: resultSummary };
  }

  const schoolId = users[0].schoolId;

  // Fetch all sedes for the school once
  const sedes = await prisma.schoolSede.findMany({ where: { schoolId }, select: { id: true, nombre: true } });
  const sedeNameToIdMap = new Map(sedes.map(s => [s.nombre, s.id]));

  const existingEmails = (await prisma.user.findMany({
    where: { email: { in: users.map(u => u.email) } },
    select: { email: true },
  })).map(u => u.email);

  const validUsersToCreate: Omit<UserSchool, 'sedeName'>[] = [];
  const usersToEmail: { email: string; name: string; tempPass: string }[] = [];

  for (const user of users) {
    const { sedeName, ...restOfUser } = user;

    if (existingEmails.includes(user.email)) {
      resultSummary.failedCount++;
      resultSummary.errors.push({ email: user.email, reason: 'El email ya existe en la base de datos.' });
      continue;
    }
    
    if (validUsersToCreate.some(u => u.email === user.email)) {
      resultSummary.failedCount++;
      resultSummary.errors.push({ email: user.email, reason: 'El email está duplicado en el archivo de importación.' });
      continue;
    }

    let schoolSedeId: string | undefined = undefined;
    if (sedeName) {
      if (sedeNameToIdMap.has(sedeName)) {
        schoolSedeId = sedeNameToIdMap.get(sedeName);
      } else {
        resultSummary.failedCount++;
        resultSummary.errors.push({ email: user.email, reason: `La sede '${sedeName}' no es válida.` });
        continue;
      }
    }

    const temporaryPassword = Math.random().toString(36).substring(2, 15);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
    
    validUsersToCreate.push({
      ...restOfUser,
      schoolSedeId,
      isActive: true,
      password: hashedPassword,
    } as any); // Cast to any to overcome type mismatch for createMany
    
    usersToEmail.push({ email: user.email, name: user.name, tempPass: temporaryPassword });
  }  

  if (validUsersToCreate.length > 0) {
    try {
      const createResult = await prisma.user.createMany({
        data: validUsersToCreate,
        skipDuplicates: true, 
      });

      resultSummary.successCount = createResult.count;

      for (const user of usersToEmail) {
        try {
          await sendEmailNewUser(user.email, user.name, user.tempPass);
          await new Promise(resolve => setTimeout(resolve, 10000));
        } catch (emailError) {
          console.error(`Failed to send email to ${user.email}:`, emailError);
        }
      }

    } catch (error) {
      console.error("Error during bulk user creation:", error);
      return { 
        success: false, 
        message: "Ocurrió un error de base de datos durante la creación masiva.",
        results: resultSummary 
      };
    }
  }

  if (resultSummary.successCount > 0) {
    revalidatePath('/dashboard/school/school-users');
  }

  const message = `Importación completada. Creados: ${resultSummary.successCount}. Fallidos: ${resultSummary.failedCount}.`;

  return {
    success: true,
    message,
    results: resultSummary,
  };
}