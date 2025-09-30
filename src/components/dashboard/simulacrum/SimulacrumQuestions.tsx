'use client'

import { useState, useEffect, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ClockIcon, ChevronLeftIcon, ChevronRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Competencia, EjeTematico } from '@/src/generated/prisma';
import { PreguntaWithRelationsType } from '@/src/lib/schemas/pregunta.schema';
import { createSimulacro } from '@/src/lib/actions/simulacro.action';
import { CompetenciaType } from '@/src/lib/schemas/competencia.schema';

interface TimerProps {
  time: number;
  competenciaName: string;
  onFinish: () => void;
  isPending: boolean;
}

const Timer = ({ time, competenciaName, onFinish, isPending }: TimerProps) => {
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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                {formatTime(time)}
              </span>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 hidden md:block">
              {competenciaName}
            </h1>
          </div>
          <button 
            onClick={onFinish}
            disabled={isPending}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50">
            {isPending ? 'Finalizando...' : 'Finalizar Intento'}
          </button>
        </div>
      </div>
    </div>
  );
};
 
interface SimulacrumQuestionsProps {
  preguntas: PreguntaWithRelationsType[];
  competencia: CompetenciaType;
}

export default function SimulacrumQuestions({ preguntas, competencia }: SimulacrumQuestionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [time, setTime] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const unansweredQuestions = preguntas.length - Object.keys(selectedAnswers).length;
      if (unansweredQuestions > 0) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [preguntas, selectedAnswers]);

  const groupedQuestions = useMemo(() => {
    const groups: { [key: string]: { group: string, questions: { index: number }[] } } = {};
    const hasGroupFlags = preguntas.some(p => p.groupFlag);

    if (!hasGroupFlags) {
      return null; // No grouping
    }

    preguntas.forEach((p, index) => {
      const group = p.groupFlag || 'Otras';
      if (!groups[group]) {
        groups[group] = { group, questions: [] };
      }
      groups[group].questions.push({ index });
    });

    // Sort questions within each group
    for (const group in groups) {
      groups[group].questions.sort((a, b) => a.index - b.index);
    }

    // Sort the groups themselves based on the index of their first question
    const sortedGroups = Object.values(groups).sort((a, b) => {
      return a.questions[0].index - b.questions[0].index;
    });

    return sortedGroups;
  }, [preguntas]);

  const currentPregunta = preguntas[currentQuestionIndex];

  const handleSelectOption = (preguntaId: string, opcionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [preguntaId]: opcionId }));
  };

  const handleFinish = () => {
    const unansweredQuestions = preguntas.length - Object.keys(selectedAnswers).length;
    if (unansweredQuestions > 0) {
      if (!window.confirm(`Aún tienes ${unansweredQuestions} preguntas sin responder. ¿Estás seguro de que quieres finalizar el intento?`)) {
        return;
      }
    }

    startTransition(async () => {
      const correctAnswers = preguntas.reduce((acc, pregunta) => {
        const selectedOptionId = selectedAnswers[pregunta.id];
        if (!selectedOptionId) return acc;

        const correctOption = pregunta.opciones.find(o => o.correcta);
        if (correctOption && correctOption.id === selectedOptionId) {
          return acc + 1;
        }
        return acc;
      }, 0);

      const score = (correctAnswers / preguntas.length) * 100;
      const duracionMinutos = Math.floor(time / 60);

      const simulacroPreguntas = preguntas.map(p => {
        const selectedOptionId = selectedAnswers[p.id] ?? null;
        const correctOption = p.opciones.find(o => o.correcta);
        return {
          preguntaId: p.id,
          opcionSeleccionadaId: selectedOptionId,
          correcta: correctOption ? selectedOptionId === correctOption.id : false,
        };
      }).filter(p => p.opcionSeleccionadaId !== null) as { preguntaId: string; opcionSeleccionadaId: string; correcta: boolean }[];

      if (simulacroPreguntas.length === 0) {
        // Handle case with no answers, maybe show a notification
        console.log("No answers selected");
        return;
      }

      const result = await createSimulacro(
        score,
        duracionMinutos,        
        competencia.id,
        simulacroPreguntas
      );

      if (result.message) {
        // TODO: Show success toast
        router.push(`/dashboard/user/simulacros`);
      } else {
        // TODO: Show error toast
        console.error(result.errors);
      }
    });
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, preguntas.length - 1));
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Timer 
        time={time}
        competenciaName={competencia.nombre}
        onFinish={handleFinish}
        isPending={isPending}
      />

      <main className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <aside className="lg:col-span-3">
              <div className="sticky top-24">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Preguntas</h2>
                <div className="space-y-4">
                  {groupedQuestions ? (
                    groupedQuestions.map(({ group, questions }) => (
                      <div key={group}>
                        {/* <h3 className="text-md font-semibold text-gray-600 dark:text-gray-400 mb-2">{group}</h3> */}
                        <div className="space-y-2">
                          {questions.map(({ index }) => {
                            const isSelected = currentQuestionIndex === index;
                            const isAnswered = selectedAnswers[preguntas[index].id];
                            const buttonClass = isSelected
                              ? 'bg-blue-500 text-white font-semibold'
                              : isAnswered
                                ? 'bg-green-100 dark:bg-green-800'
                                : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700';
                            return (
                              <button
                                key={preguntas[index].id}
                                onClick={() => setCurrentQuestionIndex(index)}
                                className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 text-sm ${buttonClass}`}
                              >
                                Pregunta {index + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-2">
                      {preguntas.map((pregunta, index) => {
                        const isSelected = currentQuestionIndex === index;
                        const isAnswered = selectedAnswers[pregunta.id];
                        const buttonClass = isSelected
                          ? 'bg-blue-500 text-white font-semibold'
                          : isAnswered
                            ? 'bg-green-100 dark:bg-green-800'
                            : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700';
                        return (
                          <button
                            key={pregunta.id}
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 text-sm ${buttonClass}`}
                          >
                            Pregunta {index + 1}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </aside>

            <div className="lg:col-span-9">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <BookOpenIcon className="h-5 w-5" />
                    <span>{currentPregunta.ejesTematicos[0]?.nombre || 'General'}</span>
                  </div>

                  {currentPregunta.contexto && (
                    <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-bold">Contexto</h4>
                        <p className="whitespace-pre-line">{currentPregunta.contexto}</p>
                    </div>
                  )}

                  {currentPregunta.imagen && (
                    <div className="my-6">
                      <Image
                      src={currentPregunta.imagen}
                      alt={`Imagen para la pregunta ${currentQuestionIndex + 1}`}
                      width={800}
                      height={600}
                      className="rounded-lg w-full h-auto object-contain"
                      style={{ maxHeight: '100vh' }}
                      />
                    </div>
                  )}

                  <h3 className="font-bold">Pregunta {currentQuestionIndex + 1}</h3>
                  <p>{currentPregunta.enunciado}</p>

                  <div className="mt-6 space-y-4">
                    {currentPregunta.opciones.map((opcion, index) => (
                      <label
                        key={opcion.id}
                        className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selectedAnswers[currentPregunta.id] === opcion.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50 ring-2 ring-blue-500'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                          }`}
                      >
                        <input
                          type="radio"
                          name={`pregunta-${currentPregunta.id}`}
                          checked={selectedAnswers[currentPregunta.id] === opcion.id}
                          onChange={() => handleSelectOption(currentPregunta.id, opcion.id)}
                          className="sr-only"
                        />
                        <span className="mr-4 font-semibold">{String.fromCharCode(97 + index)}.</span>
                        {opcion.respuesta.startsWith('http') ? (
                          <div className="relative h-40 w-full">
                            <Image
                              src={opcion.respuesta}
                              alt={`Opción para la pregunta ${currentQuestionIndex + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="rounded-md object-contain"
                            />
                          </div>
                        ) : (
                          <span className="flex-1 text-gray-800 dark:text-gray-200">{opcion.respuesta}</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

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
