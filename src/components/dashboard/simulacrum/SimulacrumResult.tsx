import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { SimulacroPregunta, OpcionPregunta, Pregunta } from '@prisma/client';

interface SimulacrumResultProps {
  simulacroPreguntas: (SimulacroPregunta & {
    pregunta: Pregunta & { opciones: OpcionPregunta[] };
    opcionSeleccionada: OpcionPregunta | null;
  })[];
}

export default function SimulacrumResult({ simulacroPreguntas }: SimulacrumResultProps) {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Resultados del Simulacro</h1>
      <div className="space-y-6">
        {simulacroPreguntas.map((simulacroPregunta, index) => {
          const { pregunta, opcionSeleccionada } = simulacroPregunta;
          const correctaOpcion = pregunta.opciones.find(op => op.correcta);

          return (
            <div key={simulacroPregunta.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pregunta {index + 1}</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pregunta.contexto }} />
              {pregunta.imagen && <img src={pregunta.imagen} alt="Imagen de la pregunta" className="mt-4 rounded-lg" />}
              <div className="prose prose-gray dark:prose-invert max-w-none mt-4" dangerouslySetInnerHTML={{ __html: pregunta.enunciado }} />

              <div className="mt-6 space-y-4">
                {pregunta.opciones.map(opcion => {
                  const isSelected = opcion.id === opcionSeleccionada?.id;
                  const isCorrect = opcion.correcta;
                  const isSelectedAndCorrect = isSelected && isCorrect;
                  const isSelectedAndIncorrect = isSelected && !isCorrect;

                  return (
                    <div
                      key={opcion.id}
                      className={`flex items-start rounded-lg p-4 border-2 
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
                        <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: opcion.respuesta }} />
                        {isCorrect && opcion.retroalimentacion && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                            <p className='font-semibold'>Retroalimentación:</p>
                            <p>{opcion.retroalimentacion}</p>
                          </div>
                        )}
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
