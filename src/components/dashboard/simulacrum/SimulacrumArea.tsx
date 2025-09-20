import Link from 'next/link';

interface Competencia {
  id: string;
  nombre: string;
  // Asumo que puede tener una descripción, si no, se puede quitar.
  // description: string;
}

interface Area {
  id: string;
  nombre: string;
  competencias: Competencia[]; 
}

interface SimulacrumAreaProps {
  area: Area;
} 

export default function SimulacrumArea({ area }: SimulacrumAreaProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Simulacro: {area.nombre}
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Elige una competencia para iniciar la práctica.
            </p>
          </div>
          <Link
            href="/dashboard/user/simulacros"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            &larr; Volver a las áreas
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {area.competencias.map((competencia) => (
            <div
              key={competencia.id}
              className="flex transform flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{competencia.nombre}</h3>
                {/* Si las competencias tuvieran descripción, se mostraría aquí */}
                {/* <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{competencia.description}</p> */}
              </div>
              <div className="mt-6">
                <Link
                  href={`/dashboard/user/simulacros/${area.id}/${competencia.id}`}
                  className="inline-block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-blue-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Iniciar Práctica
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}