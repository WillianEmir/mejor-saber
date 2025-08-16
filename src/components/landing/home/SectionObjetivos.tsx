import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Falta de Acceso a Recursos de Calidad',
    description:
      'La aplicación brinda a todos los estudiantes, sin importar su ubicación o situación económica, acceso a material de estudio actualizado y simulacros de alta fidelidad. Esto reduce la brecha educativa que existe entre quienes pueden pagar cursos costosos y quienes no.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Desconocimiento del Formato y la Metodología de la Prueba',
    description:
      'Muchos estudiantes llegan al examen sin familiaridad con su estructura y tipo de preguntas. La aplicación los expone a un entorno idéntico al de la prueba real, eliminando el factor sorpresa y la ansiedad del día del examen.',
    icon: LockClosedIcon,
  },
  {
    name: 'Ineficiencia en el Estudio',
    description:
      'Estudiar todo el temario sin un plan claro es ineficiente. La aplicación resuelve esto a través de su análisis de desempeño y rutas de estudio personalizadas. Le dice al estudiante exactamente en qué temas debe enfocarse para maximizar su puntaje en el menor tiempo posible.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Falta de Motivación y Aislamiento',
    description:
      'El estudio individual puede ser monótono y desmotivante. La aplicación combate esto con funcionalidades de gamificación y seguimiento del progreso, haciendo el proceso de aprendizaje más atractivo y gratificante. Ver la mejora en tiempo real motiva a los estudiantes a seguir adelante.',
    icon: FingerPrintIcon,
  },
  {
    name: 'Retroalimentación Limitada',
    description:
      'En la preparación tradicional, los estudiantes a menudo solo reciben una nota, sin entender por qué se equivocaron. La aplicación ofrece una retroalimentación detallada para cada pregunta, transformando cada error en una oportunidad de aprendizaje real.',
    icon: FingerPrintIcon,
  },
];

export default function SectionObjetivos() {
  return (
    <section className="bg-white py-20 sm:py-32 border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-8">
        <header className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Más que una app
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            No es solo una herramienta de estudio, sino una solución integral que resuelve problemáticas clave que enfrentan los estudiantes al prepararse para las Pruebas SABER 11, como la falta de acceso y la desmotivación inherentes al proceso de preparación de las Pruebas SABER 11.
          </p>
        </header>
        <h2 className="text-center text-2xl font-semibold text-indigo-700 pt-8 mb-8">
          No sufras más por ...
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 max-w-4xl mx-auto">
          {features.map((feature) => (
            <article
              key={feature.name}
              className="flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 relative"
            >
              <div className="absolute -top-6 left-6 flex items-center justify-center rounded-full bg-indigo-600 shadow-lg w-12 h-12">
                <feature.icon aria-hidden="true" className="w-6 h-6 text-white" />
              </div>
              <h3 className="mt-8 mb-2 text-lg font-semibold text-gray-900">{feature.name}</h3>
              <p className="text-base text-gray-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
