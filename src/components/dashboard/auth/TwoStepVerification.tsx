"use client";

import Link from "next/link";
import Button from "../ui/button/Button";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";

export default function TwoStepVerification() {
  return (
    <>
      <div className="grid lg:grid-cols-2 max-md:p-3">
        <div className="flex flex-col items-center justify-center w-full h-screen">
          <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronLeftIcon className="size-6" />
              Back to dashboard
            </Link>
          </div>

          <div className="flex flex-col justify-center flex-1 h-screen w-full max-w-md mx-auto">
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Verificación de Dos Pasos
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Se ha enviado un código de verificación a tu email. Introdúcelo en el campo de abajo.
              </p>
            </div>
            <div>
              <form>
                <div className="space-y-6">
                  <div>
                    <label>
                      Escriba su código de seguridad de 6 dígitos <span className="text-error-500">*</span>{" "}
                    </label>
                    <input
                      placeholder="Código de Seguridad"
                      type="email"
                      className="w-full border border-slate-300 rounded-sm p-3"
                    />
                  </div>

                  <div>
                    <Button className="w-full" size="sm">
                      Verificar mi Cuenta
                    </Button>
                  </div>
                </div>
              </form>

              <div className="mt-5">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  ¿No recibiste el código? {""}
                  <Link
                    href="/dashboard/reset-password"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Reenviar
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
