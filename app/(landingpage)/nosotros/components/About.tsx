import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

const stats = [
  {
    name: 'Años de experiencia en el sector educativo.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Alianzas estratégicas con muchos colegios en el país.',
    icon: BuildingOffice2Icon,
  },
  {
    name: 'Miles de estudiantes han mejorado su desempeño académico con nosotros.',
    icon: SparklesIcon,
  },
];

export default function About() {
  return (
    <section className="relative bg-white  dark:bg-neutral-dark">
      <div className="container mx-auto px-6 pb-16 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-dark py-8 sm:py-12 dark:text-neutral-light sm:text-4xl">Nacimos para Impulsar el Talento Colombiano</h1>
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-16 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* Columna de Información */}
          <div>
            <p className="mt-2 text-lg leading-8 dark:text-neutral-light/90">
              Nuestra misión es cerrar la brecha de acceso a la educación superior de calidad en Colombia. Creemos que cada estudiante, sin importar su contexto, merece la oportunidad de alcanzar su máximo potencial. Por eso, hemos creado una plataforma que democratiza la preparación para las Pruebas SABER 11.
            </p>
            <p className="mt-2 text-lg leading-8 dark:text-neutral-light/90">
              Contamos con un equipo multidisciplinario con más de una década de experiencia en la gestión de procesos del sector educativo, desde el diseño de material pedagógico hasta el seguimiento y acompañamiento personalizado del desempeño académico. Entendemos los retos que enfrentan los colegios y los estudiantes porque hemos estado allí.
            </p>
            <p className="mt-2 text-lg leading-8 dark:text-neutral-light/90">
              Esta profunda experiencia se traduce en una metodología única que combina tecnología de punta con estrategias pedagógicas probadas, garantizando que cada recurso, simulacro y ruta de aprendizaje esté diseñado para generar un impacto real y medible en los resultados de los estudiantes.
            </p>
            {/* Sección de Estadísticas */}
          </div>

          {/* Columna de la Imagen */}
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/nosotros.jpg"
              alt="Equipo de Saber 11 colaborando en una oficina"
              width={500}
              height={500}
              className="w-full max-w-lg rounded-2xl object-cover shadow-xl ring-1 ring-gray-400/10"
            />
            <dl className="grid grid-cols-1 gap-8  pt-6 sm:grid-cols-1 lg:grid-cols-1">
              {stats.map((stat) => (
                <div key={stat.name} className="flex items-center gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Estadística</span>
                    <stat.icon className="h-7 w-7 text-primary dark:text-neutral-light" aria-hidden="true" />
                  </dt>
                  <dd className="text-base leading-7 text-neutral-dark dark:text-neutral-light">{stat.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}