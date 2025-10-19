import {
  ArrowPathIcon,
  BuildingLibraryIcon,
  CloudArrowUpIcon,
  DocumentChartBarIcon,
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
    name: 'Seguimiento y Gestión para Colegios',
    description:
      'Los colegios pueden monitorear el progreso de sus estudiantes en tiempo real, identificar áreas de mejora y utilizar nuestros reportes para enfocar sus esfuerzos pedagógicos, ahorrando tiempo a los docentes y potenciando el rendimiento académico.',
    icon: BuildingLibraryIcon,
  },
  { 
    name: 'Retroalimentación Detallada e Instantánea',
    description:
      'En la preparación tradicional, los estudiantes a menudo solo reciben una nota, sin entender por qué se equivocaron. La aplicación ofrece una retroalimentación detallada para cada pregunta, transformando cada error en una oportunidad de aprendizaje real.',
    icon: DocumentChartBarIcon,
  },
  {
    name: 'Falta de Motivación y Aislamiento',
    description:
      'El estudio individual puede ser monótono y desmotivante. La aplicación combate esto con funcionalidades de gamificación y seguimiento del progreso, haciendo el proceso de aprendizaje más atractivo y gratificante. Ver la mejora en tiempo real motiva a los estudiantes a seguir adelante.',
    icon: FingerPrintIcon, 
  },
];

export default function SectionObjetivos() {
  return (
    <section className="py-20 sm:py-32 border-neutral-light dark:bg-neutral-dark">
      <div className="container mx-auto px-4 md:px-8">
        <header className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-dark mb-4 tracking-tight dark:text-neutral-light">
            Más que una app
          </h1>
          <p className="text-lg text-neutral-dark/90 mb-8 dark:text-neutral-light">
            Una solución integral que resuelve las problemáticas clave en la preparación para las Pruebas SABER 11. Potenciamos el aprendizaje de los estudiantes y ofrecemos a los colegios herramientas para el seguimiento y la mejora del rendimiento académico.
          </p>
        </header>
        <h2 className="text-center text-2xl font-semibold text-primary pt-8 mb-8 dark:text-neutral-light">
          Nuestra plataforma ataca los problemas de raíz:
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 max-w-4xl mx-auto">
          {features.map((feature) => (
            <article
              key={feature.name}
              className="flex flex-col rounded-xl shadow-md hover:shadow-lg dark:hover:shadow-neutral-light/20 transition-shadow duration-200 p-6 relative dark:bg-neutral-light/10 dark:shadow-neutral-light/10"
            >
              <div className="absolute -top-6 left-6 flex items-center justify-center rounded-full bg-primary shadow-lg w-12 h-12">
                <feature.icon aria-hidden="true" className="w-6 h-6 text-white" />
              </div>
              <h3 className="mt-8 mb-2 text-lg font-semibold text-neutral-dark dark:text-neutral-light">{feature.name}</h3>
              <p className="text-base text-neutral-dark/90 dark:text-neutral-light">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
