'use client';

import { Checkbox } from "@headlessui/react";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { signup } from "@/src/lib/actions/user.action";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/auth/signin');
        }, 2000);
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
                Crear una Cuenta
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ¡Ingresa tus datos para registrarte!
              </p>
            </div>
            <div>
              <div className="relative py-3 sm:py-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name">
                      Nombre Completo <span className="text-error-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      type="text"
                      className="w-full border border-slate-300 rounded-sm p-3"
                      required
                    />
                    {error?.name && <p className="text-red-500 text-sm mt-1">{error.name[0]}</p>}
                  </div>
                  <div>
                    <label htmlFor="email">
                      Email <span className="text-error-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      placeholder="info@gmail.com"
                      type="email"
                      className="w-full border border-slate-300 rounded-sm p-3"
                      required
                    />
                    {error?.email && <p className="text-red-500 text-sm mt-1">{error.email[0]}</p>}
                  </div>
                  <div>
                    <label htmlFor="password">
                      Contraseña <span className="text-error-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingresa tu contraseña"
                        className="w-full border border-slate-300 rounded-sm p-3"
                        required
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
                     {error?.password && <p className="text-red-500 text-sm mt-1">{error.password[0]}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isChecked}
                        onChange={setIsChecked}
                        className="group block w-5 h-5 rounded border bg-white data-[checked]:bg-blue-500"
                      />
                      <p className="font-normal text-gray-500 dark:text-gray-400">
                        Acepto los{" "}
                        <Link href="/terminos" className="text-gray-800 dark:text-white/90">Términos y Condiciones</Link>, y la{" "}
                        <Link href="/terminos" className="text-gray-800 dark:text-white">Política de Privacidad</Link>
                      </p>
                    </div>
                  </div>
                  {error?._form && <p className="text-red-500 text-sm text-center">{error._form[0]}</p>}
                  {success && <p className="text-green-500 text-sm text-center">¡Registro exitoso! Redirigiendo...</p>}
                  <div>
                    <button 
                      type="submit" 
                      disabled={isPending || !isChecked}
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowe"
                    >
                      {isPending ? 'Registrando...' : 'Registrarse'}
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-5">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  ¿Ya tienes una cuenta? {""}
                  <Link
                    href="/dashboard/auth/signin"
                    className="text-indigo-600 hover:underline"
                  >
                    Iniciar Sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-light-100 w-full hidden lg:block"></div>
      </div>
    </>
  );
}