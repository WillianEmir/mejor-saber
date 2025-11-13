
import { z } from 'zod';

export const UserSchoolSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  idDocument: z.string().optional(),
  schoolId: z.string(),
  role: z.enum(['USER', 'DOCENTE']).default('USER'),
  degree: z.string().optional(),
  schoolSedeId: z.string().optional(),
});

export type UserSchool = z.infer<typeof UserSchoolSchema>;

export type UserSchoolModal = UserSchool & {
  gradeNumber: string;
  gradeLetter: string;
}
