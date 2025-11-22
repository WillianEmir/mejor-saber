'use server'

import { auth } from "@/auth"; // Updated import
import z from "zod";
import { ChangePasswordSchema } from "./changePassword.schema";
import prisma from "@/src/lib/prisma";
import bcryptjs from "bcryptjs";

export async function changePassword( values: z.infer<typeof ChangePasswordSchema>) {

  const session = await auth(); // Updated call

  if (!session?.user) {
    return { error: "No autenticado" };
  }

  const validatedFields = ChangePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos" };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.password) {
    return { error: "Usuario no encontrado" };
  }

  const passwordsMatch = await bcryptjs.compare(currentPassword, user.password);

  if (!passwordsMatch) {
    return { error: "La contraseña actual es incorrecta" };
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: "Contraseña actualizada correctamente" };
}