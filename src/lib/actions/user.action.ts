'use server'; 

import { PrismaClient } from '@/src/generated/prisma'; 
import * as bcrypt from 'bcrypt';
import { signupSchema } from '../schemas/user.schema';

const prisma = new PrismaClient();

export async function signup(formData: FormData) {
  
  const result = signupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        error: { email: ["El correo electrónico ya está en uso"] },
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
    };
  } catch (error) {
    return {
      error: { _form: ["Ocurrió un error inesperado."] },
    };
  }
}