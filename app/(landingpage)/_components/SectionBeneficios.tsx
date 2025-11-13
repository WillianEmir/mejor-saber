import Image from 'next/image'
import {
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Análisis de Desempeño Profundo',
    description:
      'Nuestra plataforma no solo te da un puntaje. Desglosamos tus resultados por cada competencia evaluada, permitiéndote ver exactamente dónde necesitas mejorar. Los reportes visuales te ayudan a seguir tu progreso a lo largo del tiempo.',
    icon: ChartBarIcon,
    imageSrc: '/beneficios_1.jpg',
    imageAlt: 'Gráficos de progreso y análisis de desempeño en la plataforma.',
  },
  {
    name: 'Rutas de Aprendizaje Adaptativas',
    description:
      'Olvídate de estudiar a ciegas. Usamos tus resultados para construir una ruta de estudio personalizada, sugiriéndote temas y preguntas específicas para que refuerces tus debilidades y optimices tu tiempo de preparación.',
    icon: AdjustmentsHorizontalIcon,
    imageSrc: '/beneficios_2.jpg',
    imageAlt: 'Estudiante utilizando la plataforma en una tableta.',
  },
  {
    name: 'Retroalimentación para Cada Pregunta',
    description:
      'Transforma cada error en una lección. Ofrecemos explicaciones claras y detalladas para cada una de las preguntas de nuestros simulacros, asegurando que entiendas el porqué de la respuesta correcta y no vuelvas a cometer el mismo error.',
    icon: ChatBubbleLeftRightIcon,
    imageSrc: '/beneficios_3.jpg',
    imageAlt: 'Primer plano de un estudiante concentrado resolviendo un problema.',
  },
]

export default function SectionBeneficios() {
  return (
    <div id="beneficios" className="relative bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Beneficios Clave</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Una ventaja competitiva para tu futuro
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Descubre las herramientas que te ayudarán a entender, practicar y dominar cada componente de la prueba.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="space-y-20">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2"
              >
                <div className={index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}>
                  <dl className="space-y-10 text-base leading-7 text-gray-600 dark:text-gray-300">
                    <div className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900 dark:text-white">
                        <feature.icon
                          className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                          aria-hidden="true"
                        />
                        {feature.name}
                      </dt>
                      <dd className="inline"> {feature.description}</dd>
                    </div>
                  </dl>
                </div>
                <div className={index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}>
                  <Image
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    className="w-full max-w-lg rounded-xl shadow-xl ring-1 ring-gray-400/10"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
