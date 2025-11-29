import z from "zod";
import { ProgresoActividad, ProgresoSeccion, ProgresoSubTema, Seccion, TipoSeccion } from "@/src/generated/prisma";
import { SubTemaType } from "./subTema.schema";
import { ActividadInteractivaType } from "./actividadInteractiva.schema";

// schema para validar cada sección
export const SeccionSchema = z.object({
  id: z.uuid({ message: 'El ID debe ser un UUID válido.' }).optional(),
  nombre: z.string().min(1, 'El nombre de la sección no puede estar vacío.'),
  descripcion: z.string().optional().nullable(),
  tipo: z.enum(TipoSeccion, { error: 'El tipo de sección no es válido.' }),
  ejeTematicoId: z.uuid({ message: 'El ID del eje temático debe ser un UUID válido.' })
})

// Type para las secciones
export type SeccionType = Omit<Seccion, 'createdAt' | 'updatedAt'>;

// Type para las secciones con sus relaciones
export type SeccionWithRelationsType = SeccionType & {
  subTemas: (SubTemaType & {
    progresos: ProgresoSubTema[]
  })[],
  actividades: (ActividadInteractivaType& {
    progresos: ProgresoActividad[]
  })[],
  progresos: (ProgresoSeccion)[]
}