'use client'

import React, { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

// Basado en el modelo de Prisma
type Opciones = {
  [key: string]: string
} & {
  correcta: string
}

type Pregunta = {
  id: string
  contexto: string
  imagen?: string | null
  enunciado: string
  opciones: Opciones
}

// Datos de ejemplo para el simulacro
const simulacroPreguntas: Pregunta[] = [
  {
    id: 'q-1',
    contexto:
      'Un estudiante quiere saber cuánta agua cabe en una botella cilíndrica. Mide el radio de la base (5 cm) y la altura (20 cm).',
    imagen:
      'https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?q=80&w=800&auto=format&fit=crop',
    enunciado:
      '¿Cuál es el volumen de la botella si se utiliza la fórmula V = π * r^2 * h?',
    opciones: {
      a: '1570.8 cm³',
      b: '314.16 cm³',
      c: '500 cm³',
      d: '100 cm³',
      correcta: 'a',
    },
  },
  {
    id: 'q-2',
    contexto:
      'Fragmento de "El coronel no tiene quien le escriba" de Gabriel García Márquez: "El coronel destapó el tarro del café y comprobó que no había más de una cucharadita. Retiró la olla del fogón, vertió la mitad del agua en el piso de tierra, y con un cuchillo raspó el interior del tarro sobre la olla hasta cuando se desprendieron las últimas raspaduras del polvo de café revueltas con óxido de lata."',
    enunciado: '¿Qué sentimiento predomina en el coronel al inicio del fragmento?',
    opciones: {
      a: 'La alegría',
      b: 'La resignación',
      c: 'La ira',
      d: 'La indiferencia',
      correcta: 'b',
    },
  },
  {
    id: 'q-3',
    contexto:
      'Un circuito eléctrico simple consta de una batería de 9V y una resistencia de 3Ω.',
    enunciado:
      'Según la Ley de Ohm (I = V/R), ¿cuál es la corriente que fluye por el circuito?',
    opciones: {
      a: '27 A',
      b: '3 A',
      c: '0.33 A',
      d: '6 A',
      correcta: 'b',
    },
  },
]

interface PreguntaAccordionProps {
  pregunta: Pregunta
  index: number
  isOpen: boolean
  onToggle: () => void
}

const PreguntaAccordion: React.FC<PreguntaAccordionProps> = ({ pregunta, index, isOpen, onToggle }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <h3>
        <button
          type="button"
          className="flex w-full items-center justify-between p-5 font-medium text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          <span>Pregunta {index + 1}</span>
          <ChevronDownIcon
            className={`size-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="p-5 border-t border-gray-200 dark:border-gray-700">
            {pregunta.contexto && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Contexto</h4>
                <p className="text-gray-600 dark:text-gray-400">{pregunta.contexto}</p>
              </div>
            )}

            {pregunta.imagen && (
              <div className="my-4 relative h-64 w-full">
                <Image
                  src={pregunta.imagen}
                  alt={`Imagen para la pregunta ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-lg object-contain"
                />
              </div>
            )}

            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Pregunta</h4>
              <p className="text-gray-700 dark:text-gray-300">{pregunta.enunciado}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Opciones</h4>
              <fieldset>
                <legend className="sr-only">Opciones de respuesta</legend>
                <div className="space-y-4">
                  {Object.entries(pregunta.opciones).map(([key, value]) => {
                    if (key === 'correcta') return null
                    return (
                      <div key={key} className="flex items-center">
                        <input
                          id={`${pregunta.id}-${key}`}
                          name={`pregunta-${pregunta.id}`}
                          type="radio"
                          checked={selectedOption === key}
                          onChange={() => setSelectedOption(key)}
                          className="size-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor={`${pregunta.id}-${key}`} className="ml-3 block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                          <span className="font-bold uppercase">{key}.</span> {value}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SimulacrumQuestions() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(simulacroPreguntas[0]?.id || null)

  const handleToggle = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  return (
    <section className="bg-white dark:bg-gray-900 py-8 md:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Simulacro de Competencia
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Responde cada una de las siguientes preguntas.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          {simulacroPreguntas.map((pregunta, index) => (
            <PreguntaAccordion
              key={pregunta.id}
              pregunta={pregunta}
              index={index}
              isOpen={openAccordion === pregunta.id}
              onToggle={() => handleToggle(pregunta.id)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Finalizar y Calificar
          </button>
        </div>
      </div>
    </section>
  )
}
