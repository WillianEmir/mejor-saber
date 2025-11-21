'use server'

import prisma from "@/src/lib/prisma";
import { SignupSchema } from "./singUp.schema";
import bcrypt from "bcryptjs";
import { FormState } from "@/src/types";

// Action for public sign-up
export async function signup(formData: FormData) : Promise<FormState> {
  const result = SignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });  

  if (!result.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        message: 'El correo electrónico ya está en uso.',
        success: false,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: 'Registro exitoso. Por favor, inicie sesión.',
    };
    
  } catch (error) {
    console.log(error);
    return {
      message: 'Error de base de datos: No se pudo procesar la solicitud.',
      success: false,
    };
  }
}