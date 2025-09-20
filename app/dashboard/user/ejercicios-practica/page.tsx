'use client';

import { useState } from 'react';
import { BookCopy, Brain, MessageSquareQuote, X, CheckSquare, Settings } from 'lucide-react';
import Link from 'next/link';

// En una aplicación real, estos datos vendrían de la base de datos.
// import { getActiveAreas } from '@/src/lib/data/practice.data'; 

// --- Mock de Datos para el ejemplo ---
const practiceAreas = [
  { id: 'area-1', nombre: 'Matemáticas', icon: Brain, description: 'Ejercita tu razonamiento cuantitativo y resolución de problemas.' },
  { id: 'area-2', nombre: 'Lectura Crítica', icon: MessageSquareQuote, description: 'Analiza, comprende y evalúa diferentes tipos de textos.' },
  { id: 'area-3', nombre: 'Ciencias Sociales', icon: BookCopy, description: 'Comprende eventos históricos y estructuras sociales.' },
  { id: 'area-4', nombre: 'Ciencias Naturales', icon: Brain, description: 'Aplica conceptos de física, química y biología.' },
  { id: 'area-5', nombre: 'Inglés', icon: MessageSquareQuote, description: 'Mide tu comprensión de lectura en inglés.' },
];

const topicsForArea: Record<string, { id: string; nombre: string }[]> = {
  'area-1': [{ id: 'cont-1', nombre: 'Álgebra' }, { id: 'cont-2', nombre: 'Geometría' }, { id: 'cont-3', nombre: 'Estadística' }],
  'area-2': [{ id: 'cont-4', nombre: 'Análisis de Textos Argumentativos' }, { id: 'cont-5', nombre: 'Identificación de Tipos de Falacias' }],
  'area-3': [{ id: 'cont-6', nombre: 'Historia de Colombia Siglo XX' }, { id: 'cont-7', nombre: 'Mecanismos de Participación Ciudadana' }],
  'area-4': [{ id: 'cont-8', nombre: 'Cinemática' }, { id: 'cont-9', nombre: 'Leyes de Newton' }],
  'area-5': [{ id: 'cont-10', nombre: 'Reading Comprehension' }, { id: 'cont-11', nombre: 'Grammar Usage' }],
};
// --- Fin del Mock ---

export default function EjerciciosPracticaPage() {
  const [modalArea, setModalArea] = useState<(typeof practiceAreas)[0] | null>(null);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Centro de Práctica</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-1">Selecciona un área, personaliza tu sesión y ¡a practicar!</p>

      {/* Tarjetas de Selección de Área */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {practiceAreas.map(area => (
          <div key={area.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <area.icon className="h-10 w-10 text-brand-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{area.nombre}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 flex-grow">{area.description}</p>
            <button 
              onClick={() => setModalArea(area)} 
              className="w-full mt-auto font-semibold py-2.5 px-4 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              Configurar Práctica
            </button>
          </div>
        ))}
      </div>

      {/* Modal de Configuración */}
      {modalArea && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in" onClick={() => setModalArea(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 md:p-8 m-4 transform transition-transform duration-300 scale-100 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Práctica de {modalArea.nombre}</h3>
              <button onClick={() => setModalArea(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="h-6 w-6" /></button>
            </div>
            
            {/* Selección de Temas */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300"><CheckSquare className="h-5 w-5 text-brand-500" /> Elige los temas a practicar:</h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {topicsForArea[modalArea.id].map(topic => (
                  <label key={topic.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{topic.nombre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Configuración de la Sesión */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300"><Settings className="h-5 w-5 text-brand-500" /> Configuración:</h4>
              <div className="flex items-center gap-4">
                <label className="w-full">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Número de preguntas:</span>
                  <select className="w-full mt-1 h-10 pl-3 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:ring-2 focus:ring-brand-500 outline-none">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                </label>
              </div>
            </div>

            <Link href={`/dashboard/user/ejercicios-practica/session`}>
              <button className="w-full mt-8 py-3 font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-transform hover:scale-105">
                ¡Empezar a Practicar!
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}