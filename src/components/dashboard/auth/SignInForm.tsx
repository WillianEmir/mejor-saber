'use client'; 

import { Checkbox } from "@headlessui/react"; 
import Link from "next/link";
import React, { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { EyeIcon, EyeSlashIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setLoading(false);
      // El error se manejará a través del parámetro URL `error`
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('error', 'CredentialsSignin');
      router.push(newUrl.toString());
    } else {
      router.push(callbackUrl);
    }
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

            <div>
              <div className="relative py-3 sm:py-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <strong className="font-bold">Error: </strong>
                      <span className="block sm:inline">Email o contraseña incorrectos.</span>
                    </div>
                  )}

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
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isChecked} onChange={setIsChecked} className="group block w-5 h-5 rounded border bg-white data-[checked]:bg-blue-500" />
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Mantenerme conectado
                      </span>
                    </div>
                    <Link
                      href="/dashboard/auth/reset-password"
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-5">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  ¿No tienes una cuenta? {""}
                  <Link
                    href="/dashboard/auth/signup"
                    className="text-indigo-600 hover:underline"
                  >
                    Regístrate
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