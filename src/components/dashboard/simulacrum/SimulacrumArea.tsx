
import {
  ChartBarIcon,
  PencilSquareIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

// Datos de las competencias de matemáticas, extraídos de la documentación del ICFES.
const competencias = [
  {
    name: 'Interpretación y representación',
    description: 'Comprende y transforma la información cuantitativa y esquemática presentada en distintos formatos.',
    icon: ChartBarIcon,
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop',
    href: '#', // TODO: Actualizar con el enlace real al simulacro
  },
  {
    name: 'Formulación y ejecución',
    description: 'Plantea e implementa estrategias que lleven a soluciones adecuadas frente a un problema.',
    icon: PencilSquareIcon,
    imageUrl: 'https://images.unsplash.com/photo-1453733190371-0a9bedd82893?q=80&w=800&auto=format&fit=crop',
    href: '#', // TODO: Actualizar con el enlace real al simulacro
  },
  {
    name: 'Argumentación',
    description: 'Valida procedimientos y estrategias matemáticas utilizadas para dar solución a los problemas planteados.',
    icon: ChatBubbleLeftRightIcon,
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop',
    href: '#', // TODO: Actualizar con el enlace real al simulacro
  },
];

export default function SimulacrumArea() {
  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simulacros de Matemáticas
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Elige una competencia y pon a prueba tus habilidades.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {competencias.map((competencia) => (
            <article
              key={competencia.name}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={competencia.imageUrl}
                  alt={`Imagen representativa de ${competencia.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="flex-1">
                  <div className="flex items-center gap-x-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                      <competencia.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">{competencia.name}</h3>
                  </div>
                  <p className="mt-5 min-h-[60px] text-sm leading-6 text-gray-600">{competencia.description}</p>
                </div>
                <div className="mt-6">
                  <Link
                    href='/dashboard/simulacros/matematicas/id'
                    className="inline-block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Iniciar Simulacro
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}