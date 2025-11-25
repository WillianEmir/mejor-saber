import { User } from "@/src/generated/prisma";
import z from "zod";

export const ResetSchema = z.object({  
  email: z.email({  message: "El correo electrónico es obligatorio" }) 
});

export type ResetType = z.infer<typeof ResetSchema>;
export type UserResetPasswordType = Pick<User, 'id'>