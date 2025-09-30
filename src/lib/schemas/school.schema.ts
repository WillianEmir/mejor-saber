import { School, SchoolSede } from '@/src/generated/prisma';
import { z } from 'zod';

// ----- *********** ----- //
// ----- SCHOOL SEDE ----- //
// ----- *********** ----- //

// Esquema de validación para la creación/edición de una Escuela Sede
export const SchoolSedeSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, 'El nombre no puede estar vacío.'),
  DANE: z.string().min(1, 'El código DANE no puede estar vacío.'),
  schoolId: z.string().min(1, 'El ID de la escuela es obligatorio.'),
})

// Type para una Escuela Sede
export type SchoolSedeType = SchoolSede;

// Type para el estado del formulario de school
export type SchoolSedeFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
}

// ----- ****** ----- //
// ----- SCHOOL ----- //
// ----- ****** ----- //

// Esquema de validación para la creación/edición de una Escuela
export const SchoolSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, 'El nombre no puede estar vacío.'),
  email: z.email().optional().nullable(),
  DANE: z.string().min(1, 'El código DANE no puede estar vacío.'),
  address: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
});

// Type para un school
export type SchoolType = School;

// Type para una school con sus sedes
export type SchoolWithSedesType = SchoolType & {
  sedes: SchoolSede[]
};

// Type para el estado del formulario de school
export type SchoolFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
}