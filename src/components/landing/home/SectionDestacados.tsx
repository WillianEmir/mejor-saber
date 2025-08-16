import { Battery0Icon, AcademicCapIcon, SparklesIcon } from '@heroicons/react/24/outline'

const features = [
  {
    description:
      'No es solo una herramienta de estudio, sino una solución integral que resuelve problemáticas clave que enfrentan los estudiantes al prepararse para las Pruebas SABER 11',
    icon: Battery0Icon,
  },
  {
    description:
      'La plataforma interactiva que te guía hacia el mejor rendimiento en tus exámenes de estado, con simulacros, IA personalizada y contenido exclusivo.',
    icon: AcademicCapIcon,
  },
  {
    description:
      'No más preicfes interminables y aburridos, realiza un test y estudia enfocado unicamente en tus debilidades.',
    icon: SparklesIcon,
  },
]

export default function SectionDestacados() {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <p className="mt-2 text-lg text-cyan-700">
        Descubre las ventajas de nuestra plataforma
        </p>
      </header>
      <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
        <div
          key={feature.description}
          className="border border-slate-100 relative flex flex-col items-center bg-white rounded-lg shadow-lg p-8 transition hover:shadow-lg"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-cyan-200 mb-4">
          <feature.icon className="h-8 w-8 text-cyan-700" aria-hidden="true" />
          </div>
          <p className="text-base text-gray-700 text-center">{feature.description}</p>
        </div>
        ))}
      </dl>
      </div>
    </section>
  )
}
