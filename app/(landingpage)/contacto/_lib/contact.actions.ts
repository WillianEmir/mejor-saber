'use server';

import nodemailer from 'nodemailer';
import { ContactSchema } from '@/app/(landingpage)/contacto/_lib/contact.schema';
import { transporter } from '@/src/lib/mailNodemailer';

export async function sendContactEmail(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsedData = ContactSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, revisa los campos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = parsedData.data;

  try {
    await transporter.sendMail({
      from: '"Admin App Saber 11" <maddison53@ethereal.email>',
      to: 'wemhack@gmal.com',
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Has recibido un nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <h3 style="color: #333;">Mensaje:</h3>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    });

    return {
      success: true,
      message: '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.',
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.',
    };
  }
}
