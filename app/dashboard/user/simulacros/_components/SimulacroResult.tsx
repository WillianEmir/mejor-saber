import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

import { SimulacroResultType } from '../_lib/simulacro.schema';
import { Button } from '@/src/components/ui/Button'; 

interface SimulacrumResultProps {
  simulacroPreguntas: SimulacroResultType[]  
}

export default function SimulacroResult({ simulacroPreguntas }: SimulacrumResultProps) {

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resultados del Simulacro</h1>
        <Link href="/dashboard/user/simulacros">
            <Button>Volver a Simulacros</Button>
        </Link>
      </div>
      
      <div className="space-y-6">
        {simulacroPreguntas.map((simulacroPregunta, index) => {
          const { pregunta, opcionSeleccionada } = simulacroPregunta;
          const correctaOpcion = pregunta.opciones.find(op => op.correcta);

          return (
            <div key={simulacroPregunta.id} className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pregunta {index + 1}</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pregunta.contexto }} />
              {pregunta.imagen && <img src={pregunta.imagen} alt="Imagen de la pregunta" className="mt-4 rounded-md" />}
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
                        className={`flex items-start rounded-md p-4 border-2 flex-grow
                          ${isSelectedAndCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
                          ${isSelectedAndIncorrect ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                          ${!isSelected && isCorrect ? 'border-green-500' : ''}
                          ${!isSelected && !isCorrect ? 'border-gray-200 dark:border-gray-600' : ''}
                        `}
                      >
                        <div className="flex-shrink-0">
                          {isSelectedAndCorrect && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                          {isSelectedAndIncorrect && <XCircleIcon className="h-6 w-6 text-red-500" />}
                          {!isSelected && isCorrect && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                        </div>
                        <div className="ml-4 flex-grow">
                          {isSelected && <p className="font-bold text-sm mb-2 text-blue-600 dark:text-blue-400">Tu Respuesta</p>}
                          <div className="flex-grow">
                            {/\.(jpeg|jpg|gif|png|svg)$/i.test(opcion.respuesta) ? (
                              <img src={opcion.respuesta} alt="Respuesta de la opción" className="max-w-full h-auto rounded-md" />
                            ) : (
                              <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: opcion.respuesta }} />
                            )}
                          </div>
                          {isCorrect && opcion.retroalimentacion && (
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
