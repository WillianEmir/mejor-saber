import z from "zod";

// Schema for updating user profile (self-service)
export const UpdateProfileSchema = z.object({
  id: z.string().min(1, 'ID de usuario es requerido'),
  idDocument: z.string().optional().nullable(),
  name: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
});

export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;