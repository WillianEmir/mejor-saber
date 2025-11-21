import prisma from "@/src/lib/prisma";
import { ProductType } from "./product.schema";

// Obtiene todos los productos con sus caracteristicas
export async function getProductsWithCharacteristics(): Promise<ProductType[] | []> {
  try {
    const products = await prisma.product.findMany({
      include: {
        characteristics: true,
      },
      orderBy: {
        price: 'asc',
      },
    });

    return products;

  } catch (error) {
    if(error instanceof Error) {
      return [];
    }
    return [];
  }
}

// Obtiene un producto por su Id
export async function getProductById(id: string): Promise<ProductType | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        characteristics: true,
      },
    });

    return product;
  } catch (error) {
    if(error instanceof Error) {
      return null;
    }
    return null;
  }

}