'use client'

import React, { useEffect, Fragment, useRef, useActionState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// React DOM hooks para Server Actions
import { useFormStatus } from 'react-dom';

// Action y Schema
import { createOrUpdateArea } from '@/src/lib/actions/area.actions';
import { AreaFormState, Areatype } from '@/src/lib/schemas/area.schema';

// Props que el componente modal aceptará
interface AreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Si initialData existe, el modal estará en modo "Editar"
  initialData?: Areatype | null;
}

// Componente dedicado para el botón de envío para poder usar el hook useFormStatus
function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
    >
      {pending ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Área')}
    </button>
  );
}

export const AreaModal: React.FC<AreaModalProps> = ({ isOpen, onClose, initialData }) => {

  // Determina si estamos en modo de edición basado en initialData
  const isEditMode = Boolean(initialData);
  const formRef = useRef<HTMLFormElement>(null);

  // Inicializa useFormState para manejar el estado del formulario con la Server Action
  const initialState: AreaFormState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(createOrUpdateArea, initialState);

  // Efecto para manejar el cierre del modal tras una operación exitosa
  useEffect(() => {
    if (state.message?.includes('exitosamente')) {
      onClose();
    }
  }, [state.message, onClose]);

  // Efecto para resetear el formulario cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset();
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* El fondo oscuro (backdrop) */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  {isEditMode ? 'Editar Área' : 'Agregar Nueva Área'}
                </Dialog.Title>
                
                {/* Botón para cerrar en la esquina */}
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <form ref={formRef} action={dispatch} className="mt-4 space-y-4">
                  {/* Campo oculto para el ID en modo edición */}
                  {isEditMode && initialData && (
                    <input type="hidden" name="id" value={initialData.id} />
                  )}

                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nombre del Área
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="nombre"
                        name="nombre" // El atributo name es crucial para FormData
                        defaultValue={initialData?.nombre || ''}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                        placeholder="Ej: Ciencias Sociales"
                        aria-describedby="nombre-error"
                      />
                    </div>
                    {/* Contenedor para mostrar errores de validación */}
                    <div id="nombre-error" aria-live="polite" aria-atomic="true">
                      {state.errors?.nombre &&
                        state.errors.nombre.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                          </p>
                        ))}
                    </div>
                  </div>

                  {/* Mensaje de error general del formulario */}
                  {state.message && !state.message.includes('exitosamente') && (
                     <div aria-live="polite" aria-atomic="true">
                        <p className="text-sm text-red-500">{state.message}</p>
                     </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
                    >
                      Cancelar
                    </button>

                    <SubmitButton isEditMode={isEditMode} />
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};