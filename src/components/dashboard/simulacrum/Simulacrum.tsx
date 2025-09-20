import Link from 'next/link';
import {
  BookOpenIcon,
  CalculatorIcon,
  BeakerIcon,
  GlobeAltIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';
import { Areatype } from '@/src/lib/schemas/area.schema';
import { SimulacroType } from '@/src/lib/schemas/simulacro.schema';
import { CompetenciaType } from '@/src/lib/schemas/competencia.schema';

const areaDetails: { [key: string]: { description: string; icon: React.ElementType } } = {
  Matemáticas: {
    description: 'Evalúa tus habilidades para resolver problemas matemáticos.',
    icon: CalculatorIcon,
  },
  'Lectura Crítica': {
    description: 'Mide tu capacidad para comprender y analizar textos.',
    icon: BookOpenIcon,
  },
  'Sociales y Ciudadanas': {
    description: 'Pon a prueba tus conocimientos en historia, geografía y cívica.',
    icon: GlobeAltIcon,
  },
  'Ciencias Naturales': { 
    description: 'Demuestra tu entendimiento de la biología, física y química.',
    icon: BeakerIcon,
  },
  Inglés: {
    description: 'Mide tu competencia en el idioma inglés.', 
    icon: LanguageIcon,
  },
};

interface SimulacrumProps {
  areas: Areatype[];
  simulacros: (SimulacroType & { competencia: CompetenciaType & { area: Areatype } })[];
}

export default function Simulacrum({ areas, simulacros }: SimulacrumProps) {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Simulacros por Área</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Prepárate para el examen seleccionando un área de práctica.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => {
          const details = areaDetails[area.nombre] || {
            description: 'Descripción no disponible.',
            icon: LanguageIcon,
          };
          const { description, icon: Icon } = details;

          return (
            <div
              key={area.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gray-100 transition-transform duration-500 group-hover:scale-150 dark:bg-gray-700/50"></div>
              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{area.nombre}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/dashboard/user/simulacros?areaId=${area.id}`}
                    className="inline-block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-blue-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Seleccionar
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Simulacros</h2>
        <div className="mt-4 space-y-4">
          {simulacros.map((simulacro) => (
            <div key={simulacro.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{simulacro.competencia.area.nombre} - {simulacro.competencia.nombre}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Realizado el: {new Date(simulacro.createdAt).toLocaleDateString()}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Puntaje: {simulacro.score?.toFixed(2)}</p>
              </div>
              <Link
                href={`/dashboard/user/simulacros?view=result&id=${simulacro.id}`}
                className="inline-block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-blue-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Ver Resultados
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
