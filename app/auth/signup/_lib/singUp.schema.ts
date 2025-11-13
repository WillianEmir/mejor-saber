import z from "zod";

// Schema for Sign Up (public)
export const SignupSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.email('Email no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  terms: z.boolean().refine(val => val === true, {
    message: "Debes aceptar los términos y condiciones.",
  }).optional(),
});

export type SignUpType = z.infer<typeof SignupSchema>;