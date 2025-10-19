import {
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  ChartPieIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'

const sections = [
  {
    title: 'Avanza más rápido',
    features: [
      {
        name: 'Simulacros Oficiales',
        description:
          'Permite a los estudiantes practicar en un entorno realista, mientras que los colegios pueden realizar evaluaciones estandarizadas y medir el nivel de preparación de sus alumnos.',
        icon: DocumentTextIcon,
      },
      {
        name: 'Ruta de Estudio Personalizada',
        description:
          'Optimiza el tiempo de estudio del alumno con rutas de aprendizaje adaptativas. Los docentes pueden usar esta data para enfocar el refuerzo en temas específicos para cada grupo.',
        icon: AdjustmentsHorizontalIcon,
      },
      {
        name: 'Análisis de Desempeño',
        description:
          'Ofrece a los estudiantes un seguimiento visual de su progreso. Para los colegios, genera reportes institucionales que identifican fortalezas y debilidades a nivel de cohorte.',
        icon: ChartPieIcon,
      },
    ],
    imageSrc: '/beneficios_1.jpg',
    imageAlt: 'Estudiante utilizando la plataforma en una tableta.',
  },
  {
    title: 'Aumenta tus oportunidades',
    features: [
      {
        name: 'Retroalimentación Detallada',
        description:
          'Transforma cada error en una oportunidad de aprendizaje para el estudiante. Los docentes pueden ver los errores más comunes para reforzar esos conceptos en clase.',
        icon: ChatBubbleLeftRightIcon,
      },
      {
        name: 'Contenido de Alta Calidad',
        description:
          'Asegura que los estudiantes y docentes tengan acceso a recursos educativos actualizados y de alta calidad, alineados con el currículo nacional y listos para usar.',
        icon: AcademicCapIcon,
      },
      {
        name: 'Acceso 24/7',
        description:
          'Brinda flexibilidad total a los estudiantes para aprender a su ritmo y facilita a los colegios la asignación de tareas y repasos fuera del horario escolar.',
        icon: ClockIcon,
      },
    ],
    imageSrc: '/beneficios_2.jpg',
    imageAlt: 'Gráficos de progreso y análisis de desempeño en la plataforma.',
  },
]

function FeatureList({  title,  features,}: {  title: string,  features: (typeof sections)[0]['features']}) {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-neutral-dark sm:text-4xl dark:text-neutral-light">
        {title}
      </h2>
      <p className="mt-4 text-lg text-neutral-dark/80 dark:text-neutral-light">
        Nuestra plataforma está diseñada para darte una ventaja competitiva.
        Descubre las herramientas que te ayudarán a tener éxito.
      </p>
      <div className="mt-12 flex flex-col gap-8 sm:gap-12 sm:mt-16 lg:mt-20">
        {features.map(feature => (
          <div key={feature.name} className="relative pl-16">
            <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <feature.icon
                aria-hidden="true"
                className="h-7 w-7 text-white"
              />
            </div>
            <h3 className="text-lg font-semibold leading-7 text-neutral-dark dark:text-neutral-light">
              {feature.name}
            </h3>
            <p className="mt-2 text-base leading-7 text-neutral-dark/80 dark:text-neutral-light">
              {feature.description} 
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SectionBeneficios() { 
  return (
    <div className="py-24 sm:py-32 dark:bg-neutral-dark">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary dark:text-neutral-light">Beneficios Clave</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-dark sm:text-4xl dark:text-neutral-light">
            Todo lo que necesitas para un estudio efectivo
          </p>
          <p className="mt-6 text-lg leading-8 text-neutral-dark dark:text-neutral-light">
            Hemos diseñado cada característica pensando en tus necesidades, para que puedas concentrarte en lo que realmente importa: aprender y mejorar.
          </p>
        </div>
        <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-24">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className="relative isolate"
            >
              <div
                className={`flex flex-col lg:flex-row ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/2 p-8 sm:p-16 lg:p-20">
                  <FeatureList title={section.title} features={section.features} />
                </div>
                <div className="w-full lg:w-1/2 rounded-md overflow-hidden">
                  <Image
                    src={section.imageSrc}
                    alt={section.imageAlt}
                    width={800}
                    height={800}
                    className="h-full w-full object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
