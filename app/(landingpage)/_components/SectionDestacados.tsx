import {
  BoltIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Simulacros Ilimitados',
    description: 'Practica con miles de preguntas y simulacros completos que replican la experiencia real del examen Saber 11.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Análisis de Desempeño',
    description: 'Recibe reportes detallados después de cada prueba para identificar tus fortalezas y debilidades por competencia.',
    icon: ScaleIcon,
  },
  {
    name: 'Ruta de Estudio Personalizada',
    description: 'Nuestra IA analiza tus resultados para crear un plan de estudio enfocado en las áreas que más necesitas mejorar.',
    icon: BoltIcon,
  },
  {
    name: 'Acceso Multiplataforma',
    description: 'Estudia en cualquier momento y lugar. Nuestra plataforma está optimizada para computadores, tablets y celulares.',
    icon: DevicePhoneMobileIcon,
  },
]

export default function SectionDestacados() {
  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Preparación Inteligente</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Todo lo que necesitas para triunfar
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Nuestra plataforma no solo te permite practicar, sino que te guía para que estudies de la manera más eficiente posible.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
