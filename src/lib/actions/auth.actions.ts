"use server"; 

import * as z from "zod";
import bcrypt from "bcryptjs";

import prisma from "../prisma";
import { NewPasswordSchema, ResetSchema } from "../schemas/auth.schema";
import { getUserByEmail } from "../data/user";
import { sendTwoFactorTokenEmail } from "../mail";
import { generateTwoFactorToken } from "../tokens";
import { getTwoFactorTokenByToken } from "../data/two-factor-token";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "¡Correo electrónico no válido!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "¡Correo electrónico no encontrado!" };
  }

  const twoFactorToken = await generateTwoFactorToken(email);
  
  await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

  return { success: "¡Código de confirmación enviado!" };
};

export const newPassword = async ( values: z.infer<typeof NewPasswordSchema> ) => { 
  
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "¡Campos inválidos!" };
  }

  const { password, token } = validatedFields.data;

  const existingToken = await getTwoFactorTokenByToken(token);

  if (!existingToken) {
    return { error: "¡Código no válido!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "¡El código ha expirado!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "¡Correo electrónico no encontrado!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prisma.twoFactorToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "¡Contraseña actualizada!" };
};
