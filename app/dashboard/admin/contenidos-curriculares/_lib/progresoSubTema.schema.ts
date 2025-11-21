import { ProgresoSubTema } from "@/src/generated/prisma"
import z from "zod"

// Schema para la validación del Progreso de un subtema
export const ProgresoSubTemaSchema = z.object({
  id: z.string().optional(),
  completado: z.boolean(),
  usuarioId: z.string().uuid({message: 'El ID del usuario debe ser un UUID válido.'}),
  subTemaId: z.string().uuid({message: 'El ID del subtema debe ser un UUID válido.'})
})

// Type para el Progreso de un subtema
export type ProgresoSubTemaType = Omit<ProgresoSubTema, 'createdAt' | 'updatedAt'>