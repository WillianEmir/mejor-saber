import { Battery0Icon, AcademicCapIcon, SparklesIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Solución Integral', 
    description:
      'No es solo una herramienta de estudio, sino una solución integral que resuelve problemáticas clave que enfrentan los estudiantes al prepararse para las Pruebas SABER 11',
    icon: Battery0Icon,
  },
  {
    name: 'Plataforma Interactiva',
    description:
      'La plataforma interactiva que te guía hacia el mejor rendimiento en tus exámenes de estado, con simulacros alineados con el ICFES, guía personalizada y contenido de estudio exclusivo.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Estudio Enfocado',
    description:
      'No más preicfes interminables y aburridos, realiza un test y estudia enfocado unicamente en tus debilidades.',
    icon: SparklesIcon,
  },
]

export default function SectionDestacados() {
  return (
    <div className="bg-gray-50 py-20 sm:py-32 dark:bg-neutral-dark/80 ">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary dark:text-neutral-light">Tu Éxito, Nuestra Misión</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-dark sm:text-4xl dark:text-neutral-light">
            Todo lo que necesitas para alcanzar tus metas
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-neutral-light">
            Descubre las ventajas de nuestra plataforma y prepárate para el éxito en las Pruebas SABER 11.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col items-center justify-start rounded-lg bg-white p-8 text-center shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-neutral-dark/80 dark:shadow-neutral-light/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <feature.icon className="h-8 w-8 text-white dark:text-neutral-light" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-7 text-neutral-dark dark:text-neutral-light">{feature.name}</h3>
                <p className="mt-2 text-base leading-7 text-neutral-dark/80 dark:text-neutral-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
