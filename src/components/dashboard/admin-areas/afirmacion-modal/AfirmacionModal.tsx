'use client'

import { Fragment, useActionState, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

// Types
import { type CompetenciaType } from '@/src/lib/schemas/competencia.schema'
import { Dialog, Transition } from '@headlessui/react'
import { AfirmacionType } from '@/src/lib/schemas/afirmacion.schema'
import { createOrUpdateAfirmacion } from '@/src/lib/actions/afirmacion.actions'

interface Props {
  competenciaId: CompetenciaType['id']
  afirmacion: AfirmacionType
}

// Componente para el botón de envío, para usar el hook useFormStatus
function SubmitButton({ editMode }: { editMode: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
    >
      {pending
        ? editMode
          ? 'Guardando...'
          : 'Creando...'
        : editMode
          ? 'Guardar Cambios'
          : 'Crear Afirmación'}
    </button> 
  )
}

export default function AfirmacionModal({ competenciaId, afirmacion }: Props) {

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const formRef = useRef<HTMLFormElement>(null)

  const addMode = searchParams.get('add-afirmacion') === 'true'
  const editAfirmacionQuery = searchParams.get('edit-afirmacion')
  const showModal = addMode || !!editAfirmacionQuery

  const onClose = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete('add-afirmacion')
    newSearchParams.delete('edit-afirmacion')
    const newPath = `${pathname}?${newSearchParams.toString()}`
    router.replace(newPath)
  }, [pathname, router, searchParams])

  const initialState = { message: null, errors: {} }
  const [state, dispatch] = useActionState(createOrUpdateAfirmacion, initialState)

  // Efecto para manejar el cierre del modal y reseteo del formulario tras una operación exitosa
  useEffect(() => {
    if (!showModal) return

    const hasFieldErrors = state.errors && Object.keys(state.errors).length > 0

    if (hasFieldErrors) {
      Object.values(state.errors || {}).forEach(errorArray => {
        errorArray?.forEach(error => toast.error(error))
      })

    } else if (state.message) {
      if (state.message.includes('exitosamente')) {
        toast.success(state.message)
        onClose()
      } else {
        toast.error(state.message)
      }
    }
    state.message = null
    state.errors = {}
  }, [state, showModal, onClose])

  // Efecto para resetear el formulario cuando el modal se cierra
  useEffect(() => {
    if (!showModal) {
      formRef.current?.reset()
    }
  }, [showModal])

  return (
    <Transition appear show={showModal} as={Fragment}>
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
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  {editAfirmacionQuery ? 'Editar Afirmación' : 'Agregar Nueva Afirmación'}
                </Dialog.Title>
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Cerrar modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <form ref={formRef} action={dispatch} className="space-y-4">

                  {!!editAfirmacionQuery && <input type="hidden" name="id" value={afirmacion.id} />}

                  <input type="hidden" name="competenciaId" value={competenciaId} />

                  <div>
                    <label
                      htmlFor="nombre-competencia"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Nombre de la Afirmación
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      defaultValue={!!editAfirmacionQuery ? afirmacion.nombre : ''}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                    {state?.errors?.nombre && (
                      <p className="text-red-500 text-sm mt-1">{state.errors.nombre[0]}</p>
                    )}
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                    <SubmitButton editMode={!!editAfirmacionQuery} />
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
