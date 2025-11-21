import z from "zod";

export const OrderSchema = z.object({
  totalAmount: z.number(),
  referenciaPago: z.string().min(1),
  userId: z.string().min(1),
  productId: z.string().min(1),
})

export type OrderType = z.infer<typeof OrderSchema>

export const ManualOrderSchema = z.object({
  productId: z.string().min(1, 'El ID del producto es requerido'),
  userId: z.string().min(1, 'El ID del usuario es requerido'),
  totalAmount: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().positive('El monto total debe ser un número positivo')
  ),
  referenciaPago: z.string().min(1, 'La referencia de pago es requerida'),
  paymentMethod: z.string().min(1, 'El método de pago es requerido'),
  schoolName: z.string().optional(),
  daneCode: z.string().optional(),
  numberOfStudents: z.number().optional(),
})

export type ManualOrderType = z.infer<typeof ManualOrderSchema>