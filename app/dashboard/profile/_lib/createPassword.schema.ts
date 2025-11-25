import * as z from 'zod';

export const CreatePasswordSchema = z.object({ 
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
}); 

export type CreatePasswordType = z.infer<typeof CreatePasswordSchema>;
