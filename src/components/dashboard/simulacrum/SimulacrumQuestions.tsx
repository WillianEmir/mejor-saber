'use client'

import React, { useState, useEffect } from 'react';
import { ClockIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Pregunta, OpcionPregunta } from '@/src/generated/prisma';
import { PreguntaType, PreguntaWithRelationsType } from '@/src/lib/schemas/pregunta.schema';

interface SimulacrumQuestionsProps {
  preguntas: PreguntaWithRelationsType[];
}

const Timer = () => {
  const [time, setTime] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-6 w-6 text-blue-500" />
            <span className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
              {formatTime(time)}
            </span>
          </div>
          <button className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700">
            Finalizar Intento
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SimulacrumQuestions({ preguntas }: SimulacrumQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});

  const currentPregunta = preguntas[currentQuestionIndex];

  const handleSelectOption = (preguntaId: string, opcionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [preguntaId]: opcionId }));
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, preguntas.length - 1));
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Timer />
      <main className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Question List */}
            <aside className="lg:col-span-3">
              <div className="sticky top-24">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Preguntas</h2>
                <div className="space-y-2">
                  {preguntas.map((p, index) => (
                    <button
                      key={p.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${currentQuestionIndex === index
                          ? 'bg-blue-500 text-white'
                          : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                      Pregunta {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Current Question */}
            <div className="lg:col-span-9">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {currentPregunta.contexto && (
                    <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-bold">Contexto</h4>
                      <p>{currentPregunta.contexto}</p>
                    </div>
                  )}

                  {currentPregunta.imagen && (
                    <div className="my-6 relative h-80 w-full">
                      <Image
                        src={currentPregunta.imagen}
                        alt={`Imagen para la pregunta ${currentQuestionIndex + 1}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 70vw"
                        className="rounded-lg object-contain"
                      />
                    </div>
                  )}

                  <h3 className="font-bold">Pregunta {currentQuestionIndex + 1}</h3>
                  <p>{currentPregunta.enunciado}</p>

                  <div className="mt-6 space-y-4">
                    {currentPregunta.opciones.map((opcion) => (
                      <label
                        key={opcion.id}
                        className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selectedAnswers[currentPregunta.id!] === opcion.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50 ring-2 ring-blue-500'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                          }`}
                      >
                        <input
                          type="radio"
                          name={`pregunta-${currentPregunta.id}`}
                          checked={selectedAnswers[currentPregunta.id!] === opcion.id}
                          onChange={() => handleSelectOption(currentPregunta.id!, opcion.id!)}
                          className="sr-only"
                        />
                        <span className="flex-1 text-gray-800 dark:text-gray-200">{opcion.respuesta}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <button
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="inline-flex items-center gap-2 rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                    Anterior
                  </button>
                  <div className="text-sm text-gray-500">
                    {currentQuestionIndex + 1} / {preguntas.length}
                  </div>
                  <button
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex === preguntas.length - 1}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    Siguiente
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}