import * as z from 'zod';

export const CreateSimulacroOficialSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, { message: 'El nombre es obligatorio.' }),
  areaId: z.string().min(1, { message: 'Debe seleccionar un área.' }),
});

export type SimulacroOficialValues = z.infer<typeof CreateSimulacroOficialSchema>;