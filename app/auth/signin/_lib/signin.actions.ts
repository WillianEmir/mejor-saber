'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

import { SignInSchema } from './signin.schema';

import { FormState } from '@/src/types';

export async function login( formdata: FormData): Promise<FormState> {

  const parsedCredentials = SignInSchema.safeParse({
    email: formdata.get('email'),
    password: formdata.get('password'),
    remember: formdata.get('remember') === 'on',
  });

  if (!parsedCredentials.success) {
    return { 
      message: 'Invalid fields!',
      success: false,
      errors: parsedCredentials.error.flatten().fieldErrors
    };
  }

  const { email, password } = parsedCredentials.data;

  try {
    await signIn('credentials', { email, password, redirect: false });    
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Email o contraseña incorrectos.', success: false};
        default:
          return { message: 'Algo salió mal.', success: false};
      }
    }
    return { message: 'Algo salió mal.', success: false};
  }
}
