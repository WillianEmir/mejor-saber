'use server'

import { getUserByEmail } from "@/app/dashboard/admin/users/_lib/user.data";
import { ResetSchema } from "./resetPassword.schema";
import { generateTwoFactorToken } from "@/src/lib/tokens";
import { sendTwoFactorTokenEmail } from "@/src/lib/mail";
import { FormState } from "@/src/types";

export async function reset(formData: FormData): Promise<FormState> {
  const validatedFields = ResetSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { message: "¡Correo electrónico no encontrado!", success: false };
  }

  const twoFactorToken = await generateTwoFactorToken(email);

  await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

  return { message: "¡Código de confirmación enviado!", success: true };
};