import { Simulacro, Competencia, Area } from '@prisma/client';
import Link from 'next/link';

interface SimulacroCardProps {
  simulacro: Simulacro & { competencia: Competencia & { area: Area } };
}

export default function SimulacroCard({ simulacro }: SimulacroCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="relative z-10">
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{simulacro.competencia.area.nombre}</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{simulacro.competencia.nombre}</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Realizado el: {new Date(simulacro.createdAt).toLocaleDateString()}</p>
          <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">Puntaje: {simulacro.score}</p>
        </div>
        <div className="mt-6">
          <Link
            href={`/dashboard/user/simulacros?view=result&id=${simulacro.id}`}
            className="inline-block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-blue-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Ver Resultados
          </Link>
        </div>
      </div>
    </div>
  );
}
