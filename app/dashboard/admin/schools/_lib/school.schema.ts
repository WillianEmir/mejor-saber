import { School, SchoolSede } from '@/src/generated/prisma';
import { z } from 'zod';

// Esquema de validación para la creación/edición de una Escuela 
export const SchoolSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, 'El nombre de la Institución Educativa no puede estar vacío.'),
  email: z.email().optional().nullable(),
  DANE: z.string().min(1, 'El código DANE no puede estar vacío.'),
  address: z.string().optional().nullable(),
  department: z.string().optional().nullable(), 
  city: z.string().optional().nullable(),
  maxUsers: z.number().int().min(1, {error: 'Minimo 1 usuario'}).optional().nullable(),
});

// Type para un school
export type SchoolType = School;

// Type para una school con sus sedes
export type SchoolWithSedesType = SchoolType & {
  sedes: SchoolSede[]
};