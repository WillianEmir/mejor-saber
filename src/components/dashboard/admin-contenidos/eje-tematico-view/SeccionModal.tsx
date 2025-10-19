'use client'

import { Fragment, useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { PencilIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import { Dialog, Transition } from '@headlessui/react'
import { TipoSeccion } from '@/src/generated/prisma'

import { SeccionType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.schema'
import { createOrUpdateSeccion } from '@/src/lib/actions/ejeTematico.action'

interface Props {
  isOpen: boolean
  onClose: () => void
  ejeTematicoId: string
  seccion: SeccionType | null
}

function SubmitButton({ editMode }: { editMode: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
    >
      {pending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Sección')}
    </button>
  )
}

export default function SeccionModal({ isOpen, onClose, ejeTematicoId, seccion }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const editMode = !!seccion?.id

  const initialState = { message: null, errors: {} }
  const [state, dispatch] = useActionState(createOrUpdateSeccion, initialState)

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
      Object.values(state.errors).forEach(errorArray => {
        errorArray?.forEach(error => toast.error(error))
      })
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
                  {editMode ? 'Editar Sección' : 'Agregar Nueva Sección'}
                </Dialog.Title>

                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                  aria-label="Cerrar modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <form ref={formRef} action={dispatch} className="mt-4 space-y-4">
                  {editMode && <input type="hidden" name="id" value={seccion.id} />}
                  <input type="hidden" name="ejeTematicoId" value={ejeTematicoId} />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                      <input id="nombre" name="nombre" type="text" defaultValue={seccion?.nombre || ''} required className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                      {state?.errors?.nombre && <p className="text-sm text-red-500 mt-1">{state.errors.nombre[0]}</p>}
                    </div>
                    <div>
                      <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Sección</label>
                      <select id="tipo" name="tipo" defaultValue={seccion?.tipo || ''} required className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                        <option value="" disabled>Seleccione un tipo</option>
                        {Object.values(TipoSeccion).map(tipo => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                      {state?.errors?.tipo && <p className="text-sm text-red-500 mt-1">{state.errors.tipo[0]}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                    <textarea id="descripcion" name="descripcion" rows={3} defaultValue={seccion?.descripcion || ''} className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                    {state?.errors?.descripcion && <p className="text-sm text-red-500 mt-1">{state.errors.descripcion[0]}</p>}
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
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
