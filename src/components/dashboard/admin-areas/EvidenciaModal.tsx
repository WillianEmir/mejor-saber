// EvidenciaModal.tsx

'use client'

import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// --- Tipos de Datos ---
type Afirmacion = { id: string; nombre: string };
type Evidencia = { id: string; nombre: string; afirmacionId: string };

interface EvidenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nombre: string; afirmacionId: string; id?: string }) => void;
  initialData?: Evidencia | null;
  // Lista de Afirmaciones para el <select>
  afirmaciones: Afirmacion[];
}

export const EvidenciaModal: React.FC<EvidenciaModalProps> = ({ isOpen, onClose, onSubmit, initialData, afirmaciones }) => {
  const [nombre, setNombre] = useState('');
  const [afirmacionId, setAfirmacionId] = useState('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setNombre(initialData.nombre);
        setAfirmacionId(initialData.afirmacionId);
      } else {
        setNombre('');
        setAfirmacionId(afirmaciones[0]?.id || '');
      }
    }
  }, [initialData, isEditMode, isOpen, afirmaciones]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !afirmacionId) {
      alert('Todos los campos son obligatorios.');
      return;
    }
    onSubmit({ nombre, afirmacionId, id: initialData?.id });
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
                {isEditMode ? 'Editar Evidencia' : 'Agregar Evidencia'}
              </Dialog.Title>
              <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="afirmacion-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Afirmación
                  </label>
                  <select
                    id="afirmacion-select"
                    value={afirmacionId}
                    onChange={(e) => setAfirmacionId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="" disabled>Seleccione una afirmación...</option>
                    {afirmaciones.map(afirm => (
                      <option key={afirm.id} value={afirm.id}>{afirm.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="evidencia-nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Texto de la Evidencia
                  </label>
                  <textarea
                    id="evidencia-nombre"
                    rows={3}
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