import z from "zod";

export const ResetSchema = z.object({ 
  email: z.email({  message: "El correo electrónico es obligatorio" }) 
});