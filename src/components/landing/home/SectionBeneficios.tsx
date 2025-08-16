import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

const sections = [
  {
    title: 'Avanza más rápido',
    features: [
      {
        name: 'Simulacros Oficiales.',
        description: 'Practica con simulacros completos, diseñados para replicar fielmente las Pruebas SABER 11 del ICFES.',
        icon: CloudArrowUpIcon,
      },
      {
        name: 'Ruta de Estudio Personalizada.',
        description: 'Un plan de aprendizaje inteligente que se adapta a tus fortalezas y debilidades.',
        icon: LockClosedIcon,
      },
      {
        name: 'Análisis de Desempeño.',
        description: 'Identifica tus áreas de mejora con gráficos detallados y un seguimiento claro de tu progreso.',
        icon: ServerIcon,
      },
    ],
    imageFirst: false,
    imageSrc: '/beneficios_1.jpg'
  },
  {
    title: 'Aumenta tus oportunidades',
    features: [
      {
        name: 'Retroalimentación Detallada.',
        description: 'Obtén explicaciones completas para cada pregunta, aprendiendo de tus errores para no repetirlos.',
        icon: CloudArrowUpIcon,
      },
      {
        name: 'Contenido de Alta Calidad.',
        description: 'Accede a material de estudio, resúmenes y videos creados por expertos en educación.',
        icon: LockClosedIcon,
      },
      {
        name: 'Acceso 24/7.',
        description: 'Entrena a tu propio ritmo, desde cualquier lugar y en cualquier dispositivo.',
        icon: ServerIcon,
      },
    ],
    imageFirst: true,
    imageSrc: '/beneficios_2.jpg'
  },
  {
    title: 'Tu futuro está en juego',
    features: [
      {
        name: 'Plataforma Intuitiva.',
        description: 'Interfaz de usuario limpia y fácil de usar, diseñada para que te concentres en estudia.',
        icon: CloudArrowUpIcon,
      },
      {
        name: 'Preparación por Áreas.',
        description: 'Fortalece tus conocimientos en áreas específicas como Matemáticas, Lectura Crítica o Ciencias Naturales.',
        icon: LockClosedIcon,
      },
      {
        name: 'Comunidad de Aprendizaje.',
        description: 'Conéctate con otros estudiantes y comparte consejos para optimizar tu preparación.',
        icon: ServerIcon,
      },
    ],
    imageFirst: false,
    imageSrc: '/beneficios_3.jpg'
  },
]

function FeatureList({ features }: { features: typeof sections[0]['features'] }) {
  return (
    <dl className="mt-8 space-y-6">
      {features.map((feature) => (
        <div key={feature.name} className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <feature.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          </div>
          <div>
            <dt className="font-semibold text-gray-900">{feature.name}</dt>
            <dd className="text-gray-600">{feature.description}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}

export default function SectionBeneficios() {
  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Beneficios</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Descubre cómo nuestra plataforma puede ayudarte a alcanzar tus metas académicas y potenciar tu aprendizaje.
          </p>
        </header>
        <div className="space-y-16">
          {sections.map((section, idx) => (
            <div
              key={section.title}
              className={`flex flex-col-reverse lg:flex-row ${section.imageFirst ? 'lg:flex-row-reverse' : ''} items-center gap-10 lg:gap-20`}
            >
              <div className="w-full lg:w-1/2">
                <h2 className="text-lg font-semibold text-indigo-600 mb-4">{section.title}</h2>
                <FeatureList features={section.features} />
              </div>
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md aspect-square">
                  <Image
                    alt={`imagen de ${section.title}`}
                    src={section.imageSrc}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="rounded-2xl shadow-2xl ring-1 ring-gray-300 object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
