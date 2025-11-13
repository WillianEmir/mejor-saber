import { SchoolSede } from "@/src/generated/prisma";
import z from "zod";

// Esquema de validación para la creación/edición de una Escuela Sede
export const SchoolSedeSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, 'El nombre de la Sede no puede estar vacío.'),
  DANE: z.string().min(1, 'El código DANE no puede estar vacío.'),
  schoolId: z.string().min(1, 'El ID de la escuela es obligatorio.'),
})

// Type para una Escuela Sede
export type SchoolSedeType = SchoolSede; 