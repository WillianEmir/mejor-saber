
'use client';

import { useFormStatus } from 'react-dom';
import { Fragment, useActionState, useEffect, useRef } from 'react';
import { createOrUpdateSchool } from '@/src/lib/actions/school.action';
import { SchoolFormState, SchoolType } from '@/src/lib/schemas/school.schema';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

interface SchoolModalProps {
  school?: SchoolType;
  isOpen: boolean;
  onClose: () => void;
}

function SubmitButton({ editMode }: { editMode: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
    >
      {pending ? (editMode ? 'Actualizando...' : 'Creando...') : (editMode ? 'Actualizar' : 'Crear')}
    </button>
  );
}

export default function SchoolModal({ school, isOpen, onClose }: SchoolModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const editMode = !!school?.id;
  const initialState: SchoolFormState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(createOrUpdateSchool, initialState);

  useEffect(() => {
    if (!isOpen) return;

    if (state.message) {
      if (state.message.includes('exitosamente')) {
        toast.success(state.message);
        onClose();
      } else {
        toast.error(state.message);
      }
    } else if (state.errors && Object.keys(state.errors).length > 0) {
      Object.values(state.errors).flat().forEach(error => toast.error(error));
    }
  }, [state, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) formRef.current?.reset();
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100">
                  {editMode ? 'Editar Institución' : 'Crear Nueva Institución'}
                </Dialog.Title>
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                  aria-label="Cerrar modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <form ref={formRef} action={dispatch} className="space-y-4 mt-6">
                  <input type="hidden" name="id" defaultValue={school?.id} />

                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      defaultValue={school?.nombre}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {state.errors?.nombre && <p className="text-red-500 text-xs mt-1">{state.errors.nombre}</p>}
                  </div>

                  <div>
                    <label htmlFor="DANE" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Código DANE
                    </label>
                    <input
                      type="text"
                      id="DANE"
                      name="DANE"
                      defaultValue={school?.DANE}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {state.errors?.DANE && <p className="text-red-500 text-xs mt-1">{state.errors.DANE}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      defaultValue={school?.email || ''}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {state.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      defaultValue={school?.address || ''}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Departamento
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      defaultValue={school?.department || ''}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      defaultValue={school?.city || ''}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                    <SubmitButton editMode={editMode} />
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
