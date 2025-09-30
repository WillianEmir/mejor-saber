import * as z from "zod";

export const ResetSchema = z.object({ 
  email: z.email({  message: "El correo electrónico es obligatorio" }) 
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
  token: z.string().min(1, { message: "El código es obligatorio" }),
});
