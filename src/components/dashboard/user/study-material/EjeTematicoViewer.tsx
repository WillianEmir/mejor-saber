'use client';

import { useState } from 'react';
import { EjeTematico, Pregunta, OpcionPregunta, ContenidoCurricular, Area } from '@/src/generated/prisma';
import PreguntaCard from './PreguntaCard';
import { Button } from '@/src/components/ui/Button';
import { ArrowLeft, ArrowRight, Check, Home } from 'lucide-react'; 
import Link from 'next/link';

interface EjeTematicoWithDetails extends EjeTematico {
  preguntas: (Pregunta & { opciones: OpcionPregunta[] })[];
  contenidoCurricular: ContenidoCurricular & { area: Area };
}

interface EjeTematicoViewerProps {
  ejeTematico: EjeTematicoWithDetails;
}

export default function EjeTematicoViewer({ ejeTematico }: EjeTematicoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalPreguntas = ejeTematico.preguntas.length;
  const currentPregunta = ejeTematico.preguntas[currentIndex];

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % totalPreguntas);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + totalPreguntas) % totalPreguntas);
  };

  const progress = ((currentIndex + 1) / totalPreguntas) * 100;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/dashboard/user/material-estudio" className="hover:underline flex items-center gap-1"><Home className="h-4 w-4"/> Material de Estudio</Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span>{ejeTematico.contenidoCurricular.area.nombre}</span>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span>{ejeTematico.contenidoCurricular.nombre}</span>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">{ejeTematico.nombre}</h2>
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div className="bg-brand-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-right text-sm font-medium text-gray-600 dark:text-gray-400">Pregunta {currentIndex + 1} de {totalPreguntas}</p>
      </div>

      {/* Pregunta Card */}
      {currentPregunta ? (
        <PreguntaCard pregunta={currentPregunta} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay preguntas disponibles para este tema.</p>
        </div>
      )}

      {/* Navigation */}
      {totalPreguntas > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button onClick={goToPrevious} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          <Button onClick={goToNext}>
            Siguiente <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Completion Message */}
      {currentIndex === totalPreguntas - 1 && (
         <div className="mt-8 text-center p-6 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
            <Check className="h-12 w-12 mx-auto text-green-500"/>
            <h3 className="mt-4 text-xl font-semibold text-green-800 dark:text-green-200">¡Has completado el tema!</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Puedes volver a repasar o explorar otros materiales de estudio.</p>
            <Link href="/dashboard/user/material-estudio" className="mt-4 inline-block">
              <Button>Volver al Material de Estudio</Button>
            </Link>
         </div>
      )}
    </div>
  );
}
