'use client'

import { Fragment, useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import { Dialog, Transition } from '@headlessui/react'

import { EjeTematicoType } from '@/src/lib/schemas/ejeTematico.schema'
import { createOrUpdateEjeTematico } from '@/src/lib/actions/ejeTematico.action'
import { CldUploadButton } from '@/src/components/ui/CldUploadButton'

interface Props {
  isOpen: boolean
  onClose: () => void
  contenidoCurricularId: string
  ejeTematico: EjeTematicoType | null
}

function SubmitButton({ editMode }: { editMode: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
    >
      {pending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Eje Temático')}
    </button>
  )
}

export default function EjeTematicoModal({ isOpen, onClose, contenidoCurricularId, ejeTematico }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const editMode = !!ejeTematico?.id
  const [imageUrl, setImageUrl] = useState(ejeTematico?.imagen || '')

  const initialState = { message: null, errors: {} }
  const [state, dispatch] = useActionState(createOrUpdateEjeTematico, initialState)

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
    if (isOpen) {
      setImageUrl(ejeTematico?.imagen || '')
    } else {
      formRef.current?.reset()
      setImageUrl('')
      state.message = null
      state.errors = {}
    }
  }, [isOpen, ejeTematico, state])

  const handleUpload = (result: any) => {
    setImageUrl(result.info.secure_url)
  }

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  {editMode ? 'Editar Eje Temático' : 'Agregar Nuevo Eje Temático'}
                </Dialog.Title>
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Cerrar modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <form ref={formRef} action={dispatch} className="mt-4 space-y-4">
                  {editMode && <input type="hidden" name="id" value={ejeTematico.id} />}
                  <input type="hidden" name="contenidoCurricularId" value={contenidoCurricularId} />
                  <input type="hidden" name="imagen" value={imageUrl} />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        defaultValue={ejeTematico?.nombre || ''}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                      {state?.errors?.nombre && (
                        <p className="text-red-500 text-sm mt-1">{state.errors.nombre[0]}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="orden" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Orden
                      </label>
                      <input
                        type="number"
                        id="orden"
                        name="orden"
                        defaultValue={ejeTematico?.orden || ''}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      {state?.errors?.orden && (
                        <p className="text-red-500 text-sm mt-1">{state.errors.orden[0]}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="descripcionCorta" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Descripción Corta
                    </label>
                    <textarea
                      id="descripcionCorta"
                      name="descripcionCorta"
                      rows={2}
                      defaultValue={ejeTematico?.descripcionCorta || ''}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {state?.errors?.descripcionCorta && (
                      <p className="text-red-500 text-sm mt-1">{state.errors.descripcionCorta[0]}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="descripcionLarga" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Descripción Larga
                    </label>
                    <textarea
                      id="descripcionLarga"
                      name="descripcionLarga"
                      rows={4}
                      defaultValue={ejeTematico?.descripcionLarga || ''}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {state?.errors?.descripcionLarga && (
                      <p className="text-red-500 text-sm mt-1">{state.errors.descripcionLarga[0]}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="preguntaTematica" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Pregunta Temática
                    </label>
                    <textarea
                      id="preguntaTematica"
                      name="preguntaTematica"
                      rows={2}
                      defaultValue={ejeTematico?.preguntaTematica || ''}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {state?.errors?.preguntaTematica && (
                      <p className="text-red-500 text-sm mt-1">{state.errors.preguntaTematica[0]}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="relevanciaICFES" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Relevancia ICFES
                      </label>
                      <input
                        type="text"
                        id="relevanciaICFES"
                        name="relevanciaICFES"
                        defaultValue={ejeTematico?.relevanciaICFES || ''}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      {state?.errors?.relevanciaICFES && (
                        <p className="text-red-500 text-sm mt-1">{state.errors.relevanciaICFES[0]}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="video" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        URL del Video
                      </label>
                      <input
                        type="text"
                        id="video"
                        name="video"
                        defaultValue={ejeTematico?.video || ''}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      {state?.errors?.video && (
                        <p className="text-red-500 text-sm mt-1">{state.errors.video[0]}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Imagen</label>
                    <div className="mt-2 flex items-center gap-4">
                      <CldUploadButton onUpload={handleUpload}>
                        Subir Imagen
                      </CldUploadButton>
                      {imageUrl && (
                        <div className="relative h-20 w-20">
                          <img src={imageUrl} alt="Imagen del Eje Temático" className="h-full w-full object-cover rounded-md" />
                          <button
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    {state?.errors?.imagen && (
                      <p className="text-red-500 text-sm mt-1">{state.errors.imagen[0]}</p>
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
