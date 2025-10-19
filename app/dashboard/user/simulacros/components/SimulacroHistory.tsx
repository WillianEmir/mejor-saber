import Link from "next/link";
import { SimulacroWithRelationsType } from "../lib/simulacro.schema";

interface SimulacroAreasListProps { 
  simulacros: SimulacroWithRelationsType[];
}

export default function SimulacroAreasList({ simulacros }: SimulacroAreasListProps) {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Simulacros</h2>
      <div className="mt-4 space-y-4">
        {simulacros.map((simulacro) => (
          <div key={simulacro.id} className="rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{simulacro.competencia.area.nombre} - {simulacro.competencia.nombre}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Realizado el: {new Date(simulacro.createdAt).toLocaleDateString()}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Puntaje: {simulacro.score?.toFixed(2)}</p>
            </div>
            <Link
              href={`/dashboard/user/simulacros/${simulacro.id}`}
              className="inline-block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-primary focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Ver Resultados
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
