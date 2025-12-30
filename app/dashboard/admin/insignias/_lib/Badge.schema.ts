import * as z from "zod";

export const badgeSchema = z.object({
  id: z.string().optional(), // Optional for creation, required for update
  name: z.string().min(1, "El nombre de la insignia es requerido.").max(100, "El nombre no puede exceder los 100 caracteres."),
  description: z.string().min(1, "La descripción de la insignia es requerida.").max(500, "La descripción no puede exceder los 500 caracteres."),
  iconUrl: z.string().min(1, "La URL del icono es requerida."),
  criteria: z.string().min(1, "El criterio para ganar la insignia es requerido.").max(500, "El criterio no puede exceder los 500 caracteres."),
});

export type BadgeFormValues = z.infer<typeof badgeSchema>; 
