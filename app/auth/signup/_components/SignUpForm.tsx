'use client';

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EyeIcon, EyeSlashIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

import { signup } from "../_lib/singUp.actions";
import { SignupSchema, SignUpType } from "../_lib/singUp.schema";

import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Social } from "./Social";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SignUpType>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      terms: false,
    }
  });

  const onSubmit = (data: SignUpType) => {

    const parsedData = SignupSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);

    startTransition(async () => {
      const result = await signup(formData)
      if (result.success) {
        toast.success(result.message)
        form.reset()
        router.push('/auth/signin')
      } else {
        toast.error(result.message)
      }
    })
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
                Crear una Cuenta
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ¡Ingresa tus datos para registrarte!
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                            type={showPassword ? "text" : "password"}
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
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Acepto los{" "}
                          <Link href="/terminos" className="text-gray-800 dark:text-white/90">Términos y Condiciones</Link>, y la{" "}
                          <Link href="/terminos" className="text-gray-800 dark:text-white">Política de Privacidad</Link>
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isPending || !form.watch('terms')}
                  className="w-full"
                >
                  {isPending ? 'Registrando...' : 'Registrarse'}
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

            <Social />

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                ¿Ya tienes una cuenta? {""}
                <Link
                  href="/auth/signin"
                  className="text-indigo-600 hover:underline"
                >
                  Iniciar Sesión
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
