import * as z from "zod"; 

export const NewPasswordTwoStepVerificationSchema = z.object({ 
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
  token: z.string().min(1, { message: "El código es obligatorio" }),
});

export type NewPasswordTwoStepVerificationType = z.infer<typeof NewPasswordTwoStepVerificationSchema>;