'use client';

import { useState } from 'react';
import { OpcionPregunta, Pregunta } from '@/src/generated/prisma';
import { Button } from '@/src/components/ui/Button'; // Assuming a generic Button component exists
import { CheckCircle, Info } from 'lucide-react';

interface PreguntaWithOptions extends Pregunta {
  opciones: OpcionPregunta[];
}

interface PreguntaCardProps {
  pregunta: PreguntaWithOptions;
}

export default function PreguntaCard({ pregunta }: PreguntaCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const correctaOpcion = pregunta.opciones.find(op => op.correcta);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
      <div className="p-6">
        {pregunta.contexto && 
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">Contexto</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: pregunta.contexto }} />
          </div>
        }
        
        {pregunta.imagen && 
          <div className="mb-4 rounded-lg overflow-hidden border dark:border-gray-700">
            <img src={pregunta.imagen} alt="Imagen de la pregunta" className="w-full h-auto object-contain" />
          </div>
        }

        <div className="prose prose-base dark:prose-invert max-w-none font-semibold text-gray-800 dark:text-white" dangerouslySetInnerHTML={{ __html: pregunta.enunciado }} />
      </div>

      <div className="px-6 pb-6 space-y-3">
        {pregunta.opciones.map(opcion => (
          <div 
            key={opcion.id}
            className={`p-3 border-2 rounded-lg transition-all duration-300 
              ${showAnswer && opcion.correcta ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : 'border-gray-200 dark:border-gray-600'}
            `}
          >
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: opcion.respuesta }} />
          </div>
        ))}
      </div>

      <div className="px-6 pb-6">
        {!showAnswer ? (
          <Button onClick={() => setShowAnswer(true)} className="w-full">
            Mostrar Respuesta
          </Button>
        ) : (
          correctaOpcion?.retroalimentacion && (
            <div className="mt-4 p-4 border-t-4 border-blue-500 bg-blue-50 dark:bg-gray-900/50 rounded-b-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-md text-blue-800 dark:text-blue-300">Retroalimentación</h3>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{correctaOpcion.retroalimentacion}</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
