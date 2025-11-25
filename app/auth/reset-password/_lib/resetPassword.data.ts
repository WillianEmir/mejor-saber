'use server'

import prisma from "@/src/lib/prisma";
import { UserResetPasswordType } from "./resetPassword.schema"; 
import { transporter } from "@/src/lib/mailNodemailer";

export async function getUserResetPassword(email: string) : Promise<UserResetPasswordType | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true
    }
  });
  return user;
}

export async function getTwoFactorTokenByEmail(email: string) {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findFirst({
      where: { email },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
}; 

export async function generateTwoFactorToken(email: string) {
  
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(new Date().getTime() + 30 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await prisma.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  const twoFactorToken = await prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};


export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await transporter.sendMail({
    from: '"Admin App Saber 11" <maddison53@ethereal.email>',
    to: email,
    subject: "Tu código de verificación",
    text: "Hello world",
    html: `<p>Hola Usuario,</p><p>Tu Token es: ${token}</p><p>Por favor, cambia tu contraseña después de iniciar sesión.</p>`
  });
}