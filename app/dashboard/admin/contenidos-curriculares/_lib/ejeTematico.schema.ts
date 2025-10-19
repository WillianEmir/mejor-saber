import { EjeTematico, ProgresoActividad, ProgresoSeccion, ProgresoSubTema, Seccion, SubTema, TipoSeccion } from "@/src/generated/prisma";
import z, { float32 } from "zod";
import { ObjetivoAprendizajeType } from "../../../../../src/lib/schemas/objetivoAprendizaje.schema";
import { SubTemaType } from "../../../../../src/lib/schemas/subTema.schema";
import { ActividadInteractivaType } from "../../../../../src/lib/schemas/actividadInteractiva.schema";
import { ContenidoCurricularType } from "../../../../../src/lib/schemas/contenidoCurricular.schema";
import { Areatype } from "../../../../../src/lib/schemas/area.schema";

// ----- ******* ----- //
// ----- SECCION ----- //
// ----- ******* ----- //

// schema para validar cada sección
export const SeccionSchema = z.object({
  id: z.uuid({ message: 'El ID debe ser un UUID válido.' }).optional(),
  nombre: z.string().min(1, 'El nombre no puede estar vacío.'),
  descripcion: z.string().optional().nullable(),
  tipo: z.enum(TipoSeccion),
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

// Tipo para el estado del formulario que será usado por useFormState
export type SeccionFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
}

// ----- ************ ----- //
// ----- EJE TEMÁTICO ----- //
// ----- ************ ----- //

// Schema para la validación de los ejes temáticos 
export const EjeTematicoSchema = z.object({
  id: z.uuid({ message: 'El ID debe ser un UUID válido.' }).optional(),
  nombre: z.string().min(1, 'El nombre no puede estar vacío.'),
  descripcionCorta: z.string().optional().nullable(),
  descripcionLarga: z.string().optional().nullable(),
  imagen: z.string().optional().nullable(),
  preguntaTematica: z.string().optional().nullable(),
  relevanciaICFES: z.string().optional().nullable(),
  video: z.string().optional().nullable(),
  orden: z.coerce.number().optional().nullable(),
  contenidoCurricularId: z.uuid({ message: 'El ID de contenido curricular debe ser un UUID válido.' }),
});

// Type para el Eje Temático
export type EjeTematicoType = Omit<EjeTematico, 'createdAt' | 'updatedAt'>;

// Type para el Eje Temático con sus relaciones
export type EjeTematicoWithRelationsType = EjeTematicoType & {
  contenidoCurricular: ContenidoCurricularType & {
    area: Areatype
  },
  objetivosAprendizaje: (ObjetivoAprendizajeType)[],
  secciones: (SeccionWithRelationsType)[]
} | null


// Tipo para el estado del formulario que será usado por useFormState
export type EjeTematicoFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
}


// ----- **************** ----- //
// ----- PROGRESO SECCION ----- //
// ----- **************** ----- //

// schema para la validación del Progreso de una sección
// export const ProgresoSeccionSchema = z.object({
//   avance: float32().min(0),
//   completada: z.boolean(),
//   usuarioId: z.uuid({ message: 'El ID del usuario debe ser un UUID válido.' }),
//   seccionId: z.uuid({ message: 'El ID de la sección debe ser un UUID válido.' })
// })

// // Type para el Progreso de una sección
// export type ProgresoSeccionType = Omit<ProgresoSeccion, 'createdAt' | 'updatedAt'>;

// // Tipo para el estado del formulario que será usado por useFormState
// export type ProgresoSeccionFormState = {
//   errors?: {
//     [key: string]: string[];
//   };
//   message?: string | null;
// }