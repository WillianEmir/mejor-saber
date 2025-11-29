import { Role, User } from '@/src/generated/prisma';
import { z } from 'zod'; 

// Type for displaying user data safely (without password) 
export type UserType = Omit<User, 'password'>;

// Schema for creating/updating users from the admin panel 
export const UpsertUserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido').nullable(),
  email: z.email({ message: 'Email no válido' }),
  role: z.enum(Role, {error: 'Rol no válido'}),
  isActive: z.boolean(),
  schoolId: z.string().optional().nullable(),
  lastLogin: z.date().optional().nullable(),
});

// Type for creating/updating users from the admin panel
export type UpsertUserType = z.infer<typeof UpsertUserSchema>;

// Schema for creating/updating users from the admin school panel
export const UpsertUserSchoolSchema = UpsertUserSchema.extend({
  idDocument: z.string().min(1, 'El documento de identidad es requerido'),
  schoolSedeId: z.string().optional().nullable(),
  degree: z.string().optional().nullable(),
}).omit({ role: true, isActive: true });

// Type for creating/updating users from the admin school panel
export type UpsertUserSchoolType = z.infer<typeof UpsertUserSchoolSchema>;
