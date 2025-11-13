
import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce una dirección de correo electrónico válida.' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria.' }),
  remember: z.boolean().optional(),
});

export type SignInType = z.infer<typeof SignInSchema>;
