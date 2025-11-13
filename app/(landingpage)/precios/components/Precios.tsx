'use client'

import PricingCard from '@/app/(landingpage)/precios/components/PricingCard'
 
const plans = [
  {
    name: 'Básico',
    price: '$0',
    description: 'Para el estudiante que quiere probar nuestra metodología y empezar a prepararse.',
    features: [
      'Acceso a 1 simulacro completo',
      'Banco de preguntas limitado',
      'Análisis de resultados básico',
      'Soporte por correo electrónico',
    ],
    isFeatured: false,
    cta: 'Empieza Gratis',
    href: '/auth/signin'
  },
  {
    name: 'Pro',
    price: '$25',
    description: 'El plan ideal para una preparación completa y alcanzar el máximo potencial.',
    features: [
      'Simulacros ilimitados',
      'Acceso completo al banco de preguntas',
      'Análisis de desempeño avanzado por competencia',
      'Material de estudio y guías por área',
      'Ranking nacional de usuarios',
      'Soporte prioritario',
    ],
    isFeatured: true,
    cta: 'Adquirir Plan Pro',
    href: '/auth/signin'
  },
  {
    name: 'Institucional',
    price: 'Contacto',
    description: 'Una solución integral para colegios que buscan potenciar a todos sus estudiantes.',
    features: [
      'Todo lo del plan Pro para estudiantes ilimitados',
      'Panel de control para docentes y directivos',
      'Seguimiento del progreso grupal e individual',
      'Reportes institucionales personalizados',
      'Capacitación y soporte dedicado',
    ],
    isFeatured: false,
    cta: 'Contactar a Ventas',
    href: '/auth/signin'
  },
]

export default function Precios() {
  return (
    <div className="relative isolate bg-white dark:bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#80caff] to-[#4f46e5] opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Precios</h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          El plan perfecto para tus necesidades
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-300">
        Elige el plan que mejor se adapte a tu camino hacia un puntaje sobresaliente en la prueba Saber 11.
      </p>
      <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
    </div>
  )
}