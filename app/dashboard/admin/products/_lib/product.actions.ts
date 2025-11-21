'use server';

import { revalidatePath } from 'next/cache';

import { ProductSchema } from './product.schema';
import prisma from '@/src/lib/prisma';

import { FormState } from '@/src/types';

export async function createOrUpdateProducto( formData: FormData ): Promise<FormState> {  

  const validatedFields = ProductSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    price: formData.get("price"),
    durationInDays: formData.get("durationInDays"),
    description: formData.get("description"),
    isActive: formData.get("isActive") === "true" ? true : false,
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
    if(id) {
      await prisma.product.update({
        where: { id },
        data,
      });
    } else {
      await prisma.product.create({
        data, 
      });
    }
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, message: 'Error al crear el producto.' };
  }

  revalidatePath('/dashboard/admin/products');
  return { success: true, message: id ? 'Producto actualizado exitosamente.' : 'Producto creado exitosamente.' };
};

export async function deleteProduct (id: string) : Promise<FormState> {
  try {
    await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, message: 'Error al eliminar el producto.' };
  }
  revalidatePath('/dashboard/admin/products');
  return { success: true, message: 'Producto eliminado exitosamente.' };
};