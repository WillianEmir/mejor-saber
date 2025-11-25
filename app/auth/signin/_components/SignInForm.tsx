'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react'; 

import { EyeIcon, EyeSlashIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Checkbox } from '@/src/components/ui/checkbox';

import { SignInSchema, SignInType } from '@/app/auth/signin/_lib/signin.schema';
import { redirectByRole } from '@/src/lib/utils.client';
import { login } from '@/app/auth/signin/_lib/signin.actions';
import SocialMediaLogInButton from '@/src/components/ui/SocialMediaLogInButton';

export default function SignInForm() {
  
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const form = useForm<SignInType>({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      redirectByRole(session.user.role, router);
      form.reset();
    }
  }, [status, session]);
  
  const onSubmit = (data: SignInType) => {
    const parsedData = SignInSchema.safeParse(data);

    if (!parsedData.success) {
      parsedData.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }

    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('remember', data.remember ? 'true' : 'false');

    startTransition(async () => {   

      const result = await login(formData);
      
      if (!result.success) {
        toast.error(result.message);
      } else {
        await update(); 
        toast.success('¡Bienvenido de nuevo!');
      }
    });
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 max-md:p-3">
        <div className="flex flex-col items-center justify-center w-full h-screen">
          <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronLeftIcon className="size-6" />
              Volver al Inicio
            </Link>
          </div>

          <div className="flex flex-col justify-center flex-1 h-screen w-full max-w-md mx-auto">
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Iniciar Sesión
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ¡Ingresa tu email y contraseña para acceder!
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="info@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Ingresa tu contraseña"
                            {...field}
                          />
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                          >
                            {showPassword ? (
                              <EyeIcon className="size-5 text-gray-500 dark:text-gray-400" />
                            ) : (
                              <EyeSlashIcon className="size-5 text-gray-500 dark:text-gray-400" />
                            )}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Mantenerme conectado</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Link href="/auth/reset-password" className="text-sm text-indigo-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? 'Iniciando...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                  O continúa con
                </span>
              </div>
            </div>

            <SocialMediaLogInButton />

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                ¿No tienes una cuenta?{' '}
                <Link href="/auth/signup" className="text-indigo-600 hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-light-100 w-full hidden lg:block"></div>
      </div>
    </>
  );
}
