'use client'

import React from 'react'
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

// Types based on Prisma Schema
type Area = {
  id: string;
  nombre: string;
};

type Competencia = {
  id: string;
  nombre: string;
  areaId: string;
};

type Afirmacion = {
  id: string;
  nombre: string;
  competenciaId: string;
};

type Evidencia = {
  id: string;
  nombre: string;
  afirmacionId: string;
};

// --- Mock Data ---
const areas: Area[] = [
  { id: 'area-1', nombre: 'Matemáticas' },
  { id: 'area-2', nombre: 'Lectura Crítica' },
  { id: 'area-3', nombre: 'Ciencias Naturales' },
];

const competencias: Competencia[] = [
  { id: 'comp-1', nombre: 'Interpretación y representación', areaId: 'area-1' },
  { id: 'comp-2', nombre: 'Formulación y ejecución', areaId: 'area-1' },
  { id: 'comp-3', nombre: 'Identificar y entender los contenidos locales que conforman un texto', areaId: 'area-2' },
];

const afirmaciones: Afirmacion[] = [
  { id: 'afir-1', nombre: 'Comprende y transforma la información cuantitativa y esquemática presentada en distintos formatos.', competenciaId: 'comp-1' },
  { id: 'afir-2', nombre: 'Frente a un problema que involucre información cuantitativa, plantea e implementa estrategias que lleven a soluciones adecuadas.', competenciaId: 'comp-2' },
];

const evidencias: Evidencia[] = [
  { id: 'evid-1', nombre: 'Da cuenta de las características básicas de la información presentada en diferentes formatos como series, gráficos, tablas y esquemas.', afirmacionId: 'afir-1' },
  { id: 'evid-2', nombre: 'Transforma la representación de una o más piezas de información.', afirmacionId: 'afir-1' },
];
// --- End Mock Data ---

// Generic type for items to be displayed in the list
type DisplayItem = {
  id: string;
  nombre: string;
  parentInfo?: string;
};

// Reusable CRUD Section Component
const CrudSection: React.FC<{
  title: string;
  description: string;
  items: DisplayItem[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ title, description, items, onAdd, onEdit, onDelete }) => {
  return (
    <div className="pb-8 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">{title}</h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{description}</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
            Agregar {title.slice(0, -1)}
          </button>
        </div>
      </div>
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-x-6 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">{item.nombre}</p>
                    {item.parentInfo && <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-gray-400">{item.parentInfo}</p>}
                  </div>
                  <div className="flex flex-none items-center gap-x-4">
                    <button onClick={() => onEdit(item.id)} className="text-sm font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                      Editar<span className="sr-only">, {item.nombre}</span>
                    </button>
                    <button onClick={() => onDelete(item.id)} className="text-sm font-medium text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Eliminar<span className="sr-only">, {item.nombre}</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminAreas() {
  // Handlers for Areas
  const handleAddArea = () => console.log('Agregar nueva Área');
  const handleEditArea = (id: string) => console.log(`Editar Área: ${id}`);
  const handleDeleteArea = (id: string) => console.log(`Eliminar Área: ${id}`);

  // Handlers for Competencias
  const handleAddCompetencia = () => console.log('Agregar nueva Competencia');
  const handleEditCompetencia = (id: string) => console.log(`Editar Competencia: ${id}`);
  const handleDeleteCompetencia = (id: string) => console.log(`Eliminar Competencia: ${id}`);

  // Handlers for Afirmaciones
  const handleAddAfirmacion = () => console.log('Agregar nueva Afirmación');
  const handleEditAfirmacion = (id: string) => console.log(`Editar Afirmación: ${id}`);
  const handleDeleteAfirmacion = (id: string) => console.log(`Eliminar Afirmación: ${id}`);

  // Handlers for Evidencias
  const handleAddEvidencia = () => console.log('Agregar nueva Evidencia');
  const handleEditEvidencia = (id: string) => console.log(`Editar Evidencia: ${id}`);
  const handleDeleteEvidencia = (id: string) => console.log(`Eliminar Evidencia: ${id}`);

  // Prepare data for display with parent context
  const competenciaItems: DisplayItem[] = competencias.map(c => ({
    ...c,
    parentInfo: `Área: ${areas.find(a => a.id === c.areaId)?.nombre || 'N/A'}`
  }));

  const afirmacionItems: DisplayItem[] = afirmaciones.map(af => ({
    ...af,
    parentInfo: `Competencia: ${competencias.find(c => c.id === af.competenciaId)?.nombre || 'N/A'}`
  }));

  const evidenciaItems: DisplayItem[] = evidencias.map(e => ({
    ...e,
    parentInfo: `Afirmación: ${afirmaciones.find(af => af.id === e.afirmacionId)?.nombre || 'N/A'}`
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
            Administración de Estructura Académica
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Gestiona las áreas, competencias, afirmaciones y evidencias que componen las pruebas.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-12">
        <CrudSection
          title="Áreas"
          description="Categorías principales de conocimiento evaluadas en la prueba (ej. Matemáticas)."
          items={areas}
          onAdd={handleAddArea}
          onEdit={handleEditArea}
          onDelete={handleDeleteArea}
        />
        <CrudSection
          title="Competencias"
          description="Habilidades específicas que se evalúan dentro de cada área."
          items={competenciaItems}
          onAdd={handleAddCompetencia}
          onEdit={handleEditCompetencia}
          onDelete={handleDeleteCompetencia}
        />
        <CrudSection
          title="Afirmaciones"
          description="Declaraciones que describen lo que un estudiante sabe o es capaz de hacer en una competencia."
          items={afirmacionItems}
          onAdd={handleAddAfirmacion}
          onEdit={handleEditAfirmacion}
          onDelete={handleDeleteAfirmacion}
        />
        <CrudSection
          title="Evidencias"
          description="Acciones o desempeños observables que demuestran el dominio de una afirmación."
          items={evidenciaItems}
          onAdd={handleAddEvidencia}
          onEdit={handleEditEvidencia}
          onDelete={handleDeleteEvidencia}
        />
      </div>
    </div>
  );
}
