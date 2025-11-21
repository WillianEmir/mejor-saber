
const steps = [
  {
    name: 'Regístrate y Realiza un Diagnóstico',
    description: 'Crea tu cuenta gratis y completa un simulacro inicial. Nuestra plataforma medirá tu nivel en cada una de las áreas evaluadas.',
  },
  {
    name: 'Sigue tu Ruta de Estudio',
    description: 'Basado en tus resultados, generamos un plan de estudio personalizado que se enfoca en tus áreas de mejora para optimizar tu tiempo.',
  },
  {
    name: 'Practica y Mide tu Progreso',
    description: 'Realiza simulacros ilimitados, refuerza con nuestro material de estudio y observa cómo tu puntaje mejora hasta el día de la prueba real.',
  },
]

export default function SectionObjetivos() {
  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Cómo Funciona</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Tu camino hacia el éxito en 3 simples pasos
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Hemos simplificado la preparación para que te concentres en lo que realmente importa: aprender y mejorar.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.name} className="flex flex-col gap-y-4">
                <dt className="flex items-center gap-x-3 text-lg font-semibold text-gray-900 dark:text-white">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                    {index + 1}
                  </span>
                  {step.name}
                </dt>
                <dd className="text-gray-600 dark:text-gray-300">{step.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
