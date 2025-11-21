'use server'

import { revalidatePath } from 'next/cache'

import prisma from '@/src/lib/prisma'
import { characteristicSchema } from './characteristic.schema'
import { FormState } from '@/src/types'

export async function createOrUpdateProductoCharacteristic(formData: FormData): Promise<FormState> {

  const validatedFields = characteristicSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    productId: formData.get("productId"),
  });  

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación. Por favor, corrija los campos.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }


  const { id, ...data } = validatedFields.data;

  try {
    if (id) {
      await prisma.productCharacteristic.update({
        where: { id },
        data,
      });
    } else {
      await prisma.productCharacteristic.create({
        data,
      });
    }
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, message: 'Error al crear la característica.' };
  }

  revalidatePath('/dashboard/admin/products');
  return { success: true, message: id ? 'Característica actualizada exitosamente.' : 'Característica creada exitosamente.' };
};

export async function deleteCharacteristic(id: string): Promise<FormState> {
  try {
    await prisma.productCharacteristic.delete({
      where: { id },
    })

    revalidatePath('/dashboard/admin/products')

    return {
      success: true,
      message: 'Característica eliminada con éxito.',
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error al eliminar la característica.',
    }
  }
}
