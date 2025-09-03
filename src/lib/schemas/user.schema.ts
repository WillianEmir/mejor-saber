import { User } from '@/src/generated/prisma';
import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().optional(),
  email: z.email("Email no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type SignupFormType = z.infer<typeof signupSchema>;

export const UserSchema = z.object({
  id: z.uuid({ error: 'El ID debe ser un UUID válido.' }).optional(),
  name: z.string().nullable().optional(),
  email: z.email().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  isActived: z.boolean().nullable().optional(),
  avatar: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  rol: z.string().nullable().optional(),
})

export type UserType = z.infer<typeof UserSchema>;

export type UserForAdminType = Omit<User, 'password'>;