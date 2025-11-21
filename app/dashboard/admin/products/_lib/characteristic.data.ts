'use server'

import { type ProductCharacteristic } from "@/src/generated/prisma";
import prisma from "@/src/lib/prisma";

export async function getProductCharacteristics(): Promise<ProductCharacteristic[] | []> {
  try {
    const productCharacteristics = await prisma.productCharacteristic.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return productCharacteristics;

  } catch (error) {
    if(error instanceof Error) {
      return [];
    }
    return [];
  }
} 