'use client'

import Link from 'next/link'
import { Button } from '@/src/components/ui/Button'
import { useCurrentUser } from '@/src/hooks/use-current-user'
import { redirectByRole } from '@/src/lib/utils.client'
import { useRouter } from 'next/navigation'

function Star({ className, ...props }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default function Hero() {
  const { data: session, status } = useCurrentUser()
  const isLoggedIn = status === 'authenticated'
  const router = useRouter()

  return (
    <div className="relative isolate overflow-hidden bg-white dark:bg-gray-900">
      <div className="px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 dark:text-gray-400 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:ring-white/10 dark:hover:ring-white/20">
              Únete a más de 5,000 estudiantes exitosos.{' '}
              <Link href="/#testimonios" className="font-semibold text-blue-600 dark:text-blue-400">
                <span className="absolute inset-0" aria-hidden="true" />
                Lee sus historias <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Tu Mejor Puntaje en Saber 11 Comienza Aquí
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Transforma tu preparación con simulacros ilimitados, análisis de desempeño y una ruta de estudio personalizada. Alcanza la universidad de tus sueños.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button onClick={() => redirectByRole(session?.user?.role, router)}>
                {isLoggedIn ? 'Ir al Dashboard' : 'Empieza Gratis Ahora'}
              </Button>
              <Link href="/#beneficios" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Descubrir Beneficios <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-400" />
              <Star className="h-5 w-5 text-yellow-400" />
              <Star className="h-5 w-5 text-yellow-400" />
              <Star className="h-5 w-5 text-yellow-400" />
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Calificación de <strong>4.9 de 5</strong> por nuestra comunidad.
            </p>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#80caff] to-[#4f46e5] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  )
}