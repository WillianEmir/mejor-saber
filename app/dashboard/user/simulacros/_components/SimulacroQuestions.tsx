'use client'

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { ChevronLeftIcon, ChevronRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';

import { createSimulacro } from '@/app/dashboard/user/simulacros/_lib/simulacro.action';
import { Timer } from './SimulacroTimer';
import { ConfirmationDialog } from '@/src/components/ui/ConfirmationDialog';

import { CompetenciaWithAreaType } from '@/app/dashboard/admin/areas/_lib/competencia.schema';
import { Areatype } from '@/app/dashboard/admin/areas/_lib/area.schema';
import { PreguntaWithRelationsType } from '@/app/dashboard/admin/preguntas/_lib/pregunta.schema';
import { useRouter } from 'next/navigation';

interface SimulacrumQuestionsProps {
  preguntas: PreguntaWithRelationsType[];
  competencia?: CompetenciaWithAreaType;  
  area?: Areatype;
}

export default function SimulacroQuestions({ preguntas, competencia, area }: SimulacrumQuestionsProps) {

  const [isPending, startTransition] = useTransition();
  const [time, setTime] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string | null }>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const router = useRouter();

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
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [preguntas, selectedAnswers]);

  const currentPregunta = preguntas[currentQuestionIndex];

  const handleSelectOption = (preguntaId: string, opcionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [preguntaId]: opcionId }));
  };

  const submitSimulacro = () => {
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

      const simulacroPreguntasData = preguntas.map(p => ({
        preguntaId: p.id,
        opcionSeleccionadaId: selectedAnswers[p.id] ?? null,
        correcta: p.opciones.find(o => o.correcta)?.id === selectedAnswers[p.id],
      }));

      if (simulacroPreguntasData.filter(p => p.opcionSeleccionadaId !== null).length === 0) {
        toast.warning("No has respondido ninguna pregunta. El simulacro no se guardará.");
        return;
      }
      const areaId = competencia?.area?.id || area?.id;

      if (!areaId) {
        toast.error("Error: No se pudo determinar el área para el simulacro.");
        return;
      }

      const result = await createSimulacro(
        score,
        duracionMinutos,
        competencia?.id,
        areaId,
        simulacroPreguntasData
      );

      if(result.success) {
        toast.success(result.message);
        router.push(`/dashboard/user/simulacros/resultados/${result.simulacroId}`);
      } else {
        toast.error(result.message)
      }
    });
  }

  const unansweredQuestions = preguntas.length - Object.keys(selectedAnswers).length;

  const handleFinish = () => {
    setShowConfirmDialog(true);
  };

  const onDialogConfirm = () => {
    setShowConfirmDialog(false);
    if(unansweredQuestions <= preguntas.length ) {
      router.push('/dashboard/user/simulacros')
    } else {
      submitSimulacro();
    }
  }

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, preguntas.length - 1));
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <>
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={onDialogConfirm}
        title={unansweredQuestions > 0 ? "¿Terminar el simulacro?" : "¡Excelente!"}
        description={
          unansweredQuestions > 0
            ? `Aún tienes ${unansweredQuestions} preguntas sin responder. ¿Estás seguro de que quieres terminar el simulacro, sin guardar los resultados?`
            : "Has respondido todas las preguntas. ¿Deseas finalizar y ver tus resultados?"
        }
        isPending={isPending}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Timer
          time={time}
          competenciaName={competencia?.nombre}
          areaName={area?.nombre}
          onFinish={handleFinish}
          isPending={isPending}
        />

        <main className="py-8 md:py-12">
          {/* ... El resto del JSX del simulacro se mantiene igual ... */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <aside className="lg:col-span-3">
                <div className="sticky top-24">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Preguntas</h2>
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
                          className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 text-sm cursor-pointer ${buttonClass}`}
                        >
                          Pregunta {index + 1}
                        </button>
                      );
                    })}
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
    </>
  );
}