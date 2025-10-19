import { AreaCompetenciasType } from '@/src/lib/schemas/area.schema'; 
import Link from 'next/link'; 

interface SimulacroCompetenciasListProps {    
  area: AreaCompetenciasType;
} 

export default function SimulacroCompetenciasList({ area }: SimulacroCompetenciasListProps) {
  return (
    <div className="min-h-screen bg-white p-4 dark:bg-neutral-dark sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Simulacros: {area.nombre}
            </h1>

            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Elige una competencia para iniciar la práctica.
            </p>
          </div>

          <Link
            href="/dashboard/user/simulacros"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm shadow-gray-500 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            &larr; Volver a las áreas
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex transform flex-col justify-between rounded-md border-2 border-primary bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 dark:border-primary dark:bg-gray-800">
            <div>
              <h3 className="text-lg font-semibold text-primary dark:text-white">
                Simulacro Completo
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Incluye todas las competencias de {area.nombre}.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href={`/dashboard/user/simulacros/${area.id}/all`}
                className="inline-block w-full rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-primary/80 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Iniciar Práctica Completa
              </Link>
            </div>
          </div>

          {area.competencias.map((competencia) => (
            <div
              key={competencia.id}
              className="flex transform flex-col justify-between rounded-md border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{competencia.nombre}</h3>
                {/* Si las competencias tuvieran descripción, se mostraría aquí */}
                {/* <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{competencia.description}</p> */}
              </div>
              <div className="mt-6">
                <Link
                  href={`/dashboard/user/simulacros/${area.id}/${competencia.id}`}
                  className="inline-block w-full rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-primary/80 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
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