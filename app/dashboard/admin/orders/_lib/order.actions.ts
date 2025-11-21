'use server'

import { revalidatePath } from 'next/cache'
import { UpdateOrderStatusSchema } from './order.schema'
import prisma from '@/src/lib/prisma'
import { OrderStatus, Role } from '@/src/generated/prisma'

export async function updateOrderStatus( id: string, status: OrderStatus ) {

  const validatedFields = UpdateOrderStatusSchema.safeParse({
    id,
    status,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación.',
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: { status },
      })

      const product = await tx.product.findUnique({
        where: { id: order.productId },
        select: { name: true},
      })

      if (status === 'COMPLETED') {
        await tx.user.update({
          where: { id: order.userId },
          data: {
            isActive: true,
            activationDate: new Date(),
            role: product?.name === 'Institucional' ? Role.ADMINSCHOOL : Role.USER,
          },
        })
      } else if (status === 'FAILED') {
        
        const user = await tx.user.findUnique({
          where: { id: order.userId },
          select: { schoolId: true },
        })

        if (user?.schoolId) {
          await tx.school.delete({
            where: { id: user.schoolId },
          })
        }

        await tx.user.update({
          where: { id: order.userId },
          data: {
            isActive: false,
            activationDate: null,
            schoolId: null,
            role: Role.USER,
          },
        })
      }
    })

    revalidatePath('/dashboard/admin/orders')
    return { message: 'Estado de la orden actualizado.' }
  } catch (error) {
    return { message: 'Error de base de datos.', error }
  }
}
