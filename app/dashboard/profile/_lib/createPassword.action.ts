'use server'

import { auth } from "@/auth";
import { CreatePasswordSchema, CreatePasswordType } from "./createPassword.schema";
import prisma from "@/src/lib/prisma";
import bcryptjs from "bcryptjs";
import { FormState } from "@/src/types";

export async function createPassword(values: CreatePasswordType): Promise<FormState> {

  const session = await auth();

  if (!session?.user) {
    return { message: "No autenticado", success: false };
  }

  const validatedFields = CreatePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      message: "Campos inválidos",
      success: false,
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { newPassword } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, password: true },
  });

  if (!user) {
    return { message: "Usuario no encontrado", success: false};
  }

  if (user.password) {
    return { message: "El usuario ya tiene una contraseña", success: false};
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { message: "Contraseña creada correctamente", success: true};
}
