import z from "zod"
import { ProgresoActividad } from "@/src/generated/prisma"
import { ActividadInteractivaType } from "./actividadInteractiva.schema"

// Schema para la validación del progreso de la actividad interactiva
export const ProgresoActividadInteractivaSchema = z.object({
  id: z.string().uuid().optional(),
  completado: z.boolean(),
  intentos: z.number().min(0),
  usuarioId: z.string().uuid({ error: 'El ID del usuario es obligatorio.' }),
  actividadId: z.string().uuid({ error: 'El ID de la actividad interactiva es obligatorio.' })
})

// Type para el progreso de la actividad interactiva
export type ProgresoActividadInteractivaType = Omit<ProgresoActividad, 'createdAt' | 'updatedAt'>

// Type para la actividad interactiva con sus progreso
export type ActividadWithProgresoType = ActividadInteractivaType & {
  progresos: ProgresoActividadInteractivaType[]
}