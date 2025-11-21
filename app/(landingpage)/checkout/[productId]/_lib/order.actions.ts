'use server'

import prisma from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ManualOrderSchema } from './order.schema'
import { FormState } from '@/src/types'

export async function createManualOrder(data: FormData): Promise<FormState> {

  const parsedData = ManualOrderSchema.safeParse({
    productId: data.get('productId'),
    userId: data.get('userId'),
    totalAmount: data.get('totalAmount'),
    referenciaPago: data.get('referenciaPago'),
    paymentMethod: data.get('paymentMethod'),
    schoolName: data.get('schoolName'),
    daneCode: data.get('daneCode'),
    numberOfStudents: data.get('numberOfStudents') ? parseInt(data.get('numberOfStudents') as string) : undefined,
  })
  console.log(data.get('numberOfStudents'));
  

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, revisa los campos.',
    }
  }

  try {
    const { userId, productId, totalAmount, referenciaPago, paymentMethod, schoolName, daneCode, numberOfStudents } = parsedData.data

    const [userExists, productExists] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.product.findUnique({ where: { id: productId } }),
    ])

    if (!userExists) {
      return { success: false, message: 'Usuario no encontrado.' }
    }

    if (!productExists) {
      return { success: false, message: 'Producto no encontrado.' }
    }

    if (schoolName && daneCode) {
      const newSchool = await prisma.school.create({
        data: {
          nombre: schoolName,
          DANE: daneCode,
          maxUsers: numberOfStudents,
          sedes: {
            create: [
              {
                nombre: schoolName,
                DANE: daneCode,
              }
            ]
          }
        },
      })

      await prisma.user.update({
        where: { id: userId },
        data: { schoolId: newSchool.id },
      })
    }

    await prisma.order.create({
      data: {
        userId,
        productId,
        totalAmount,
        referenciaPago,
        paymentMethod
      },
    })

    revalidatePath('/dashboard/admin/orders')
    revalidatePath(`/dashboard/user/orders`)

    return {
      success: true,
      message: '¡Orden creada con éxito! Será procesada en un máximo de 24 horas. Recibirás una notificación cuando el estado cambie.',
    }
  } catch (error) {
    console.error('Error creating manual order:', error)
    return {
      success: false,
      message: 'Error al crear la orden. Por favor, inténtalo de nuevo.',
    }
  }
}
