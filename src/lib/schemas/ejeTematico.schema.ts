import { EjeTematico } from "@/src/generated/prisma";
import z from "zod";

export const EjeTematicoSchema = z.object({
  id: z.uuid({error: 'El ID debe ser un UUID válido.'}).optional(),
  nombre: z.string().min(1, 'El nombre no puede estar vacío.' ),
  contenidoCurricularId: z.uuid({error: 'El ID de área debe ser un UUID válido.'}) 
}); 

// Type para los Ejes Temáticos
export type EjeTematicoType = Omit<EjeTematico, 'createdAt' | 'updatedAt'>;

// Tipo para el estado del formulario que será usado por useFormState
export type EjeTematicoFormState = {
  errors?: {
    nombre?: string[];
  }; 
  message?: string | null;
} 