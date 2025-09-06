'use client'

import { Fragment, useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

import { createOrUpdateArea } from '@/src/lib/actions/area.actions'
import type { Areatype } from '@/src/lib/schemas/area.schema'

interface AreaModalProps {
  isOpen: boolean
  onClose: () => void 
  area: Areatype | null
}

function SubmitButton({ editMode }: { editMode: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
    >
      {pending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Área')}
    </button>
  )
}

export default function AreaModal({ isOpen, onClose, area }: AreaModalProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const editMode = !!area?.id

  const initialState = { message: null, errors: {} }
  const [state, dispatch] = useActionState(createOrUpdateArea, initialState)

  useEffect(() => {
    if (!isOpen) return

    if (state.message) {
      if (state.message.includes('exitosamente')) {
        toast.success(state.message)
        onClose()
      } else {
        toast.error(state.message)
      }
    } else if (state.errors && Object.keys(state.errors).length > 0) {
      Object.values(state.errors).flat().forEach(error => toast.error(error))
    }
  }, [state, isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset()
      state.message = null
      state.errors = {}
    }
  }, [isOpen, state])

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
          <div className="fixed inset-0 bg-black/60" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all dark:bg-gray-900">
                <Dialog.Title as="h3" className="flex items-center gap-2 text-xl font-bold leading-6 text-gray-900 dark:text-white">
                  {editMode ? <PencilIcon className="h-6 w-6" /> : <PlusCircleIcon className="h-6 w-6" />}
                  {editMode ? 'Editar Área' : 'Agregar Nueva Área'}
                </Dialog.Title>

                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                  aria-label="Cerrar modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <form ref={formRef} action={dispatch} className="mt-6 space-y-6">
                  {editMode && <input type="hidden" name="id" value={area.id} />}

                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre del Área
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      className="block w-full rounded-md border-gray-300 shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
                      placeholder="Ej: Ciencias Sociales"
                      aria-describedby="nombre-error"
                      defaultValue={area?.nombre || ''}
                      required
                    />
                  </div>

                  <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
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
