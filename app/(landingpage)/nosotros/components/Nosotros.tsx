import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'

const stats = [
  {
    name: 'Años de experiencia en el sector educativo.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Alianzas estratégicas con colegios en todo el país.',
    icon: BuildingOffice2Icon,
  },
  {
    name: 'Miles de estudiantes han mejorado su desempeño con nosotros.',
    icon: SparklesIcon,
  },
]

export default function Nosotros() {
  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Sección Principal */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-4">
            <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 pb-9 pt-64 shadow-2xl sm:px-12 lg:max-w-lg lg:px-8 lg:pb-8 xl:px-10 xl:pb-10">
              <Image
                className="absolute inset-0 h-full w-full object-cover brightness-125 saturate-0"
                src="/nosotros.jpg"
                alt="Equipo de Saber 11 colaborando en una oficina"
                width={800}
                height={800}
              />
            </div>
          </div>
          <div>
            <div className="text-base leading-7 text-gray-700 dark:text-gray-300 lg:max-w-lg">
              <p className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Nuestra Esencia</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Nacimos para Impulsar el Talento Colombiano
              </h1>
              <div className="max-w-xl space-y-6 mt-6">
                <p>
                  Nuestra misión es cerrar la brecha de acceso a la educación superior de calidad en Colombia. Creemos que cada estudiante, sin importar su contexto, merece la oportunidad de alcanzar su máximo potencial. Por eso, hemos creado una plataforma que democratiza la preparación para las Pruebas SABER 11.
                </p>
                <p>
                  Contamos con un equipo multidisciplinario con más de una década de experiencia en la gestión de procesos del sector educativo, desde el diseño de material pedagógico hasta el seguimiento y acompañamiento personalizado del desempeño académico. Entendemos los retos que enfrentan los colegios y los estudiantes porque hemos estado allí.
                </p>
                <p>
                  Esta profunda experiencia se traduce en una metodología única que combina tecnología de punta con estrategias pedagógicas probadas, garantizando que cada recurso, simulacro y ruta de aprendizaje esté diseñado para generar un impacto real y medible en los resultados de los estudiantes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Estadísticas */}
        <div className="mx-auto mt-24 max-w-2xl lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 text-center sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.name} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600 dark:text-gray-400">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                  <stat.icon className="h-12 w-12 mx-auto text-blue-600" aria-hidden="true" />
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}