import nodemailer from "nodemailer"; 

// Create a test account or replace with real credentials.
export const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "9b26d4ee8c3956",
    pass: "f0b2b066d1df50",
  },
});

// Wrap in an async IIFE so we can use await.
export const sendEmailNewUser = async (email: string, name:string, password: string) => {
  await transporter.sendMail({
    from: '"Admin App Saber 11" <maddison53@ethereal.email>',
    to: email,
    subject: "Bienvenido a la plataforma",
    text: "Hello world?", // plain‑text body
    html: `<p>Hola ${name},</p><p>Tu cuenta ha sido creada. Tu contraseña es: <strong>${password}</strong></p><p>Por favor, cambia tu contraseña después de iniciar sesión.</p>`
  });
}