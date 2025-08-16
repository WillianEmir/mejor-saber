import {
  BookOpenIcon,
  CalculatorIcon,
  BeakerIcon,
  GlobeAltIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link';

const areas = [
  { name: 'Matemáticas', description: 'Evalúa tus habilidades para resolver problemas matemáticos.', icon: CalculatorIcon },
  { name: 'Lectura Crítica', description: 'Mide tu capacidad para comprender y analizar textos.', icon: BookOpenIcon },
  { name: 'Sociales y Ciudadanas', description: 'Pon a prueba tus conocimientos en historia, geografía y cívica.', icon: GlobeAltIcon },
  { name: 'Ciencias Naturales', description: 'Demuestra tu entendimiento de la biología, física y química.', icon: BeakerIcon },
  { name: 'Inglés', description: 'Mide tu competencia en el idioma inglés.', icon: LanguageIcon },
];

export default function Simulacrum() {
  return (
    <>
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Simulacros por Área</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <div key={area.name} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <div>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  <area.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">{area.name}</h4>
                <p className="mt-2 text-sm text-gray-600 min-h-[40px]">{area.description}</p>
              </div>
              <div className="mt-6">
                <Link
                  href="/dashboard/simulacros/matematicas" // TODO: Link to the specific test
                  className="inline-block w-full text-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Iniciar Simulacro
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6 mt-5">Historial de Simulacros</h3>
      <h2>Aquí se podrán ver los resultados de los simulacros anteriores</h2>
    </>
  )
}
