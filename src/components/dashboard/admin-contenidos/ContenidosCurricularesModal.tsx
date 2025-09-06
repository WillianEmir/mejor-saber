'use client'

import { Fragment, useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

// Types
import { Dialog, Transition } from '@headlessui/react'
import { type ContenidoWithRelationsType } from '@/src/lib/schemas/contenidoCurricular.schema'
import { type Areatype } from '@/src/lib/schemas/area.schema'
import { createOrUpdateContenidoCurricular } from '@/src/lib/actions/contenidosCurricular.action'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  contenidoCurricular: ContenidoWithRelationsType | null;
  areas: Areatype[];
}

function SubmitButton({ editMode }: { editMode: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button 
      type="submit"
      disabled={pending}
      className="w-full inline-flex justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {pending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Contenido')}
    </button>
  )
}

export default function ContenidosCurricularesModal({ isOpen, onClose, contenidoCurricular, areas }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const editMode = !!contenidoCurricular?.id

  const initialState = { message: null, errors: {} }
  const [state, dispatch] = useActionState(createOrUpdateContenidoCurricular, initialState)

  useEffect(() => {
    if (!isOpen) return

    if (state.errors && Object.keys(state.errors).length > 0) {
      Object.values(state.errors).flat().forEach(error => toast.error(error))
    } else if (state.message) {
      if (state.message.includes('exitosamente')) {
        toast.success(state.message)
        onClose()
      } else {
        toast.error(state.message)
      }
    }
    // Reset state after handling
    state.message = null;
    state.errors = {};

  }, [state, isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset()
    }
  }, [isOpen])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 text-left align-middle shadow-2xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-gray-900 dark:text-white mb-4"
                >
                  {editMode ? 'Editar Contenido Curricular' : 'Agregar Nuevo Contenido'}
                </Dialog.Title>
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-5 right-5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                  aria-label="Cerrar modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <form ref={formRef} action={dispatch} className="space-y-6 mt-6">
                  {editMode && <input type="hidden" name="id" value={contenidoCurricular.id} />}

                  <div>
                    <label htmlFor="areaId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Área
                    </label>
                    <select
                      name="areaId"
                      id="areaId"
                      defaultValue={editMode ? contenidoCurricular.area.id : ''}
                      className='w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 p-2'
                      required
                    >
                      {!editMode && <option value="" disabled>Seleccione un Área</option>}                      
                      {!editMode && areas.map((area) => ( <option key={area.id} value={area.id}>{area.nombre}</option> ))}
                      {!!editMode && <option key={contenidoCurricular.area.id} value={contenidoCurricular.area.id}>{contenidoCurricular.area.nombre}</option>}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre del Contenido
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      defaultValue={editMode ? contenidoCurricular.nombre : ''}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 p-2"
                      required
                    />
                    {state?.errors?.nombre && (
                      <p className="text-red-500 text-sm mt-2">{state.errors.nombre[0]}</p>
                    )}
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
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
  )
}
