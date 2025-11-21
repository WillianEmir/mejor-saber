import { z } from 'zod';
import { OrderStatus } from '@/src/generated/prisma';

export const UpdateOrderStatusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(OrderStatus),
});
