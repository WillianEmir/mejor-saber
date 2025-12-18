import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'; // Added ArrowLeftIcon

import { SimulacroResultType } from '../_lib/simulacro.schema';
import { Button } from '@/src/components/ui/Button';
import Image from 'next/image';
import { CompetenciaType } from '@/app/dashboard/admin/areas/_lib/competencia.schema'; // Added import
import { Areatype } from '@/app/dashboard/admin/areas/_lib/area.schema'; // Added import

// This type should match SimulacroDisplayResultType from SimulacroQuestions.tsx
type SimulacroDisplayResultType = {
  id: string;
  score: number;
  duracionMinutos: number;
  preguntas: SimulacroResultType[];
  area: Areatype | null;
  competencia: (CompetenciaType & { area: Areatype }) | null;
}; 
 
interface SimulacrumResultProps {
  simulacroData: SimulacroDisplayResultType
}

export default function SimulacroResult({ simulacroData }: SimulacrumResultProps) {

  const totalPreguntas = simulacroData.preguntas.length;
  const correctas = simulacroData.preguntas.filter(sp => {
    const preguntaOriginal = sp.pregunta;
    const opcionCorrecta = preguntaOriginal.opciones.find(o => o.correcta);
    return opcionCorrecta?.id === sp.opcionSeleccionada?.id;
  }).length;
  const incorrectas = totalPreguntas - correctas;
  const puntaje = simulacroData.score;
  const areaNombre = simulacroData.area?.nombre || simulacroData.competencia?.area?.nombre || 'Área Desconocida';

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Minimalistic Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8 p-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="flex flex-col gap-3 items-center space-x-4 mb-4 md:mb-0">
          <Link href="/dashboard/user/simulacros">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Volver a Simulacros</span>
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Resultados del Simulacro</h1>
        </div>

        {/* Right Section - Simulacro Data */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center">
            <span className="font-semibold mr-2">Área:</span>
            <span>{areaNombre}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Total Preguntas:</span>
            <span>{totalPreguntas}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Correctas:</span>
            <span className="text-green-500 font-bold">{correctas}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Incorrectas:</span>
            <span className="text-red-500 font-bold">{incorrectas}</span>
          </div>
          <div className="flex items-center col-span-2">
            <span className="font-semibold mr-2">Puntaje:</span>
            <span className="text-blue-500 font-bold text-lg">{puntaje?.toFixed(2)}%</span>
          </div>
        </div>
      </div>
      {/* End Minimalistic Header */}

      <div className="space-y-6">
        {simulacroData.preguntas.map((simulacroPregunta) => {
          const { pregunta, opcionSeleccionada } = simulacroPregunta;

          return ( 
            <div key={simulacroPregunta.id} className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">

              <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pregunta.contexto }} />
              {pregunta.imagen && <Image src={pregunta.imagen} alt="Imagen de la pregunta" className="mt-4 rounded-md" width={800} height={600} />}
              <div className="prose prose-gray dark:prose-invert max-w-none mt-4" dangerouslySetInnerHTML={{ __html: pregunta.enunciado }} />

              <div className="mt-6 space-y-4">
                {pregunta.opciones.map((opcion, idx) => {
                  const letter = String.fromCharCode(97 + idx);
                  const isSelected = opcion.id === opcionSeleccionada?.id;
                  const isCorrect = opcion.correcta;
                  const isSelectedAndCorrect = isSelected && isCorrect;
                  const isSelectedAndIncorrect = isSelected && !isCorrect;

                  return (
                    <div key={opcion.id} className="flex items-start mb-4">
                      <span className="font-bold mr-2 mt-4">{letter}.</span>
                      <div
                        className={`flex items-start rounded-md p-4 border-2 grow
                          ${isSelectedAndCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
                          ${isSelectedAndIncorrect ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                          ${!isSelected && isCorrect ? 'border-green-500' : ''}
                          ${!isSelected && !isCorrect ? 'border-gray-200 dark:border-gray-600' : ''}
                        `}
                      >
                        <div className="shrink-0">
                          {isSelectedAndCorrect && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                          {isSelectedAndIncorrect && <XCircleIcon className="h-6 w-6 text-red-500" />}
                          {!isSelected && isCorrect && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                        </div>
                        <div className="ml-4 grow">
                          {isSelected && <p className="font-bold text-sm mb-2 text-blue-600 dark:text-blue-400">Tu Respuesta</p>}
                          <div className="grow">
                            {/\.(jpeg|jpg|gif|png|svg)$/i.test(opcion.respuesta) ? (
                              <Image
                                src={opcion.respuesta}
                                alt="Respuesta de la opción"
                                className="max-w-full h-auto rounded-md"
                                width={800}
                                height={600}
                              />
                            ) : (
                              <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: opcion.respuesta }} />
                            )}
                          </div>
                          {opcion.retroalimentacion && (isCorrect || isSelected) && (
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                              <p className='font-semibold'>Retroalimentación:</p>
                              <p>{opcion.retroalimentacion}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
