import { Resend } from "resend";
import TwoFactorTokenEmail from "../components/emails/TwoFactorTokenEmail";  

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({ 
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: "Tu código de verificación",
    react: TwoFactorTokenEmail({ token }),
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  // await resend.emails.send({
  //   from: 'Acme <onboarding@resend.dev>',
  //   to: email,
  //   subject: "Restablece tu contraseña",
  //   // html: `<p>Haz clic <a href="${resetLink}">aquí</a> para restablecer la contraseña.</p>`
  //   react: ResetPasswordEmail({ resetLink }),
  // });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  // await resend.emails.send({
  //   from: 'Acme <onboarding@resend.dev>',
  //   to: email,
  //   subject: "Confirma tu correo electrónico",
  //   // html: `<p>Haz clic <a href="${confirmLink}">aquí</a> para confirmar el correo electrónico.</p>`
  //   react: VerificationEmail({ confirmLink }),
  // });
};

export const sendNewUserPassword = async (email: string, name:string, password: string) => {
  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: "Bienvenido a la plataforma",
    html: `<p>Hola ${name},</p><p>Tu cuenta ha sido creada. Tu contraseña es: <strong>${password}</strong></p><p>Por favor, cambia tu contraseña después de iniciar sesión.</p>`
  });
}
