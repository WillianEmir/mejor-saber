"use server"; 

import bcrypt from "bcryptjs";
import prisma from "@/src/lib/prisma";

import { NewPasswordTwoStepVerificationSchema } from "./twoStepVerification.schema";

import { FormState } from "@/src/types";
import { getTwoFactorTokenByToken } from "./twoStepVerification.data";
import { getUserResetPassword } from "../../reset-password/_lib/resetPassword.data";

export async function newPasswordTwoStepVerification (formData: FormData) : Promise<FormState> {
  
  const validatedFields = NewPasswordTwoStepVerificationSchema.safeParse({
    password: formData.get('password'),
    token: formData.get('token'),
  });

   if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { password, token } = validatedFields.data;

  const existingToken = await getTwoFactorTokenByToken(token);

  if (!existingToken) {
    return { message: "¡Código no válido!", success: false};
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { message: "¡El código ha expirado!", success: false};
  }

  const existingUser = await getUserResetPassword(existingToken.email);

  if (!existingUser) {
    return { message: "¡Correo electrónico no encontrado!", success: false};
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prisma.twoFactorToken.delete({
    where: { id: existingToken.id },
  });

  return { message: "¡Contraseña actualizada!", success: true};
};
