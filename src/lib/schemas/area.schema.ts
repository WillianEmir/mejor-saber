import { z } from 'zod';

// Esquema de validación para la creación/edición de un Área
export const AreaSchema = z.object({
  id: z.string().optional(), // Opcional, solo presente en edición
  nombre: z.string({error: 'El nombre es obligatorio.'}).trim().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
});

// Type para las áreas
export type Areatype = z.infer<typeof AreaSchema>;

// Tipo para el estado del formulario que será usado por useFormState
export type AreaFormState = {
  errors?: {
    nombre?: string[];
  };
  message?: string | null;
}
