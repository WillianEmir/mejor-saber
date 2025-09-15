import { Role, User } from '@/src/generated/prisma';
import { z } from 'zod';

// Schema for Sign Up (public)
export const SignupSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  email: z.email('Email no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Type for displaying user data safely (without password)
export type UserType = Omit<User, 'password'>;

// Schema for creating/updating users from the admin panel
export const UpsertUserSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.email({ message: 'Email no válido' }),
  role: z.enum(Role),
  isActive: z.boolean(),
});

export type UpsertUserType = z.infer<typeof UpsertUserSchema>;
