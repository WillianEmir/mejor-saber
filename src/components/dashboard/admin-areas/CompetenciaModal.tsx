// CompetenciaModal.tsx

'use client'

import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// --- Tipos de Datos ---
type Area = { id: string; nombre: string };
type Competencia = { id: string; nombre: string; areaId: string };

interface CompetenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nombre: string; areaId: string; id?: string }) => void;
  initialData?: Competencia | null;
  // Necesitamos una lista de Áreas para poblar el <select>
  areas: Area[];
}

export const CompetenciaModal: React.FC<CompetenciaModalProps> = ({ isOpen, onClose, onSubmit, initialData, areas }) => {
  const [nombre, setNombre] = useState('');
  const [areaId, setAreaId] = useState('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setNombre(initialData.nombre);
        setAreaId(initialData.areaId);
      } else {
        // Al agregar, reseteamos y seleccionamos la primera área por defecto si existe
        setNombre('');
        setAreaId(areas[0]?.id || '');
      }
    }
  }, [initialData, isEditMode, isOpen, areas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !areaId) {
      alert('Todos los campos son obligatorios.');
      return;
    }
    onSubmit({ nombre, areaId, id: initialData?.id });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {isEditMode ? 'Editar Competencia' : 'Agregar Competencia'}
              </Dialog.Title>
              <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Selector de Área (Elemento Padre) */}
                <div>
                  <label htmlFor="area-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Área
                  </label>
                  <select
                    id="area-select"
                    value={areaId}
                    onChange={(e) => setAreaId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="" disabled>Seleccione un área...</option>
                    {areas.map(area => (
                      <option key={area.id} value={area.id}>{area.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Nombre de la Competencia */}
                <div>
                  <label htmlFor="competencia-nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre de la Competencia
                  </label>
                  <input
                    type="text"
                    id="competencia-nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                {/* Botones de Acción */}
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={onClose} className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200">
                    Cancelar
                  </button>
                  <button type="submit" className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    {isEditMode ? 'Guardar Cambios' : 'Crear'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};