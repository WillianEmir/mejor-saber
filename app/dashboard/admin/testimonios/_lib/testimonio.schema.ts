import { z } from "zod";

export const TestimonioSchema = z.object({   
  id: z.string().optional().nullable(),
  rating: z.coerce
    .number({ message: "La calificación es requerida." }) 
    .int()
    .min(1, { message: "La calificación debe ser como mínimo 1." })
    .max(5, { message: "La calificación debe ser como máximo 5." }),
  comentario: z
    .string() 
    .min(10, { message: "El comentario debe tener al menos 10 caracteres." })
    .max(1000, { message: "El comentario no puede exceder los 1000 caracteres." }),
  publicado: z.coerce.boolean(),
  userId: z.string().min(1, { message: "Por favor, seleccione un usuario." }),
});

export type TestimonioFormType = z.infer<typeof TestimonioSchema>;

export type TestimonioType = z.infer<typeof TestimonioSchema> & {
  id: string;
  createdAt: Date;
  user: {
    name: string;
    lastName: string | null;
    email: string; 
  };
};

export type UserForSelect = {
  id: string;
  name: string;
  lastName: string | null;
};

// Schema para la validación del formulario de testimonios públicos
export const TestimonialSchema = z.object({
  rating: z.number().min(1).max(5),
  comentario: z.string().min(10, 'El comentario debe tener al menos 10 caracteres').max(500, 'El comentario no puede tener más de 500 caracteres'),
});

export type TestimonialFormType = z.infer<typeof TestimonialSchema>;