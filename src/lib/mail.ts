import { Resend } from "resend";
import TwoFactorTokenEmail from "../components/emails/TwoFactorTokenEmail";  

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({ 
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: "Tu código de verificación",
    react: TwoFactorTokenEmail({ token }),
  });
};

export const sendNewUserPassword = async (email: string, name:string, password: string) => {
  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: "Bienvenido a la plataforma",
    html: `<p>Hola ${name},</p><p>Tu cuenta ha sido creada. Tu contraseña es: <strong>${password}</strong></p><p>Por favor, cambia tu contraseña después de iniciar sesión.</p>`
  });
}
