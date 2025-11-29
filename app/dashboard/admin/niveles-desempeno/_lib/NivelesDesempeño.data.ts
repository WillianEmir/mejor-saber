'use server'

import prisma from "@/src/lib/prisma";
import { NivelDesempenoType } from "./NivelesDesempeño.schema";

// Obtiene todos los niveles de desempeño con sus áreas
export async function getNivelesDesempeno(): Promise<NivelDesempenoType[]> {
  try {
    const niveles = await prisma.nivelDesempeno.findMany({ 
      include: {
        area: {
          omit: {
            createdAt: true,
            updatedAt: true,
          }
        }
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      }
    });
    return niveles;
  } catch (error) {
    console.error("Error obteniendo los niveles de desempeño:", error);
    return [];
  }
};
