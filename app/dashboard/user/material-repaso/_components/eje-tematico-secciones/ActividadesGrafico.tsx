'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ActividadWithProgresoType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/progresoActividad.schema'


interface ActividadesGraficoProps {
  actividadesGrafico: ActividadWithProgresoType[]
  progresoInicial: { [key: string]: boolean }
  handleActividadToggle: (actividadId: string) => void
}

export default function ActividadesGrafico({
  actividadesGrafico,
  progresoInicial,
  handleActividadToggle,
}: ActividadesGraficoProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [incorrectAttempts, setIncorrectAttempts] = useState<Record<string, boolean>>({})

  const handleAnswer = (actividad: ActividadWithProgresoType, userAnswer: string) => {
    if (progresoInicial[actividad.id]) {
      return // Ya está completada
    }

    setSelectedAnswers(prev => ({ ...prev, [actividad.id]: userAnswer }))

    // Lógica de respuesta robusta
    const isCorrectAnswerTrue = ['true', 'verdadero'].includes(String(actividad.match).toLowerCase());
    const isUserAnswerTrue = userAnswer === 'true';

    if (isCorrectAnswerTrue === isUserAnswerTrue) {
      // Respuesta correcta
      if (!progresoInicial[actividad.id]) {
        handleActividadToggle(actividad.id)
      }
    } else {
      // Respuesta incorrecta
      setIncorrectAttempts(prev => ({ ...prev, [actividad.id]: true }))
      setTimeout(() => {
        setIncorrectAttempts(prev => ({ ...prev, [actividad.id]: false }))
        setSelectedAnswers(prev => {
            const newAnswers = {...prev};
            delete newAnswers[actividad.id];
            return newAnswers;
        })
      }, 500)
    }
  }

  const getButtonClassName = (actividad: ActividadWithProgresoType, option: string) => {
    const isCompleted = progresoInicial[actividad.id]
    const isSelected = selectedAnswers[actividad.id] === option
    const hadIncorrectAttempt = incorrectAttempts[actividad.id]

    // Lógica robusta para estilizar el botón correcto
    const isCorrectAnswerTrue = ['true', 'verdadero'].includes(String(actividad.match).toLowerCase());
    const isButtonForTrue = option === 'true';
    const isCorrectButton = isCorrectAnswerTrue === isButtonForTrue;

    const base = 'px-4 py-2 rounded-md font-semibold transition-colors duration-200 border w-28 text-center'

    if (isCompleted) {
      return `${base} ${isCorrectButton ? 'bg-green-100 dark:bg-green-900 border-green-300 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 text-gray-500'} cursor-not-allowed`
    }
    
    if (isSelected && hadIncorrectAttempt) {
        return `${base} bg-red-100 dark:bg-red-900 border-red-400 text-red-800 dark:text-red-200 animate-pulse`
    }

    if (isSelected) {
        return `${base} bg-blue-100 dark:bg-blue-900 border-blue-400 ring-2 ring-blue-400`
    }

    return `${base} bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold">Análisis de Gráficos</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Observa la imagen, lee la afirmación y determina si es verdadera o falsa.
        </p>
      </div>
      {actividadesGrafico.map(actividad => (
        <div key={actividad.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 flex flex-col md:flex-row items-center gap-6">
          {/* Imagen */}
          {actividad.imagen && (
            <div className="w-full md:w-1/3 flex-shrink-0">
              <Image
                src={actividad.imagen}
                alt={actividad.nombre}
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-auto"
              />
            </div>
          )}

          {/* Contenido */}
          <div className="w-full md:w-2/3">
            <p className="font-semibold text-base mb-4 text-gray-800 dark:text-gray-200">
              {actividad.retroalimentacion} {/* CORREGIDO: Esta es la pregunta */}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleAnswer(actividad, 'true')}
                disabled={progresoInicial[actividad.id]}
                className={getButtonClassName(actividad, 'true')}
              >
                Verdadero
              </button>
              <button
                onClick={() => handleAnswer(actividad, 'false')}
                disabled={progresoInicial[actividad.id]}
                className={getButtonClassName(actividad, 'false')}
              >
                Falso
              </button>
            </div>
            {progresoInicial[actividad.id] && (
                 <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-3">¡Completado!</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}