'use client'

import { Fragment, useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { PencilIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import { Dialog, Transition } from '@headlessui/react'
import { TipoActividadInteractiva } from '@/src/generated/prisma'

import { ActividadInteractivaType } from '@/src/lib/schemas/actividadInteractiva.schema'
import { createOrUpdateActividadInteractiva } from '@/src/lib/actions/actividadInteractiva.action'
import { CldUploadButton } from '@/src/components/ui/CldUploadButton'

interface Props {
  isOpen: boolean
  onClose: () => void
  seccionId: string
  ejeTematicoId: string
  actividad: ActividadInteractivaType | null
}

function SubmitButton({ editMode }: { editMode: boolean }) { 
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
    >
      {pending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Actividad')}
    </button>
  )
}

export default function ActividadInteractivaModal({ isOpen, onClose, seccionId, ejeTematicoId, actividad }: Props) { 
  const formRef = useRef<HTMLFormElement>(null)
  const editMode = !!actividad?.id
  const [imageUrl, setImageUrl] = useState(actividad?.imagen || '')

  const initialState = { message: null, errors: {} }
  const [state, dispatch] = useActionState(createOrUpdateActividadInteractiva, initialState) 

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
      setImageUrl(actividad?.imagen || '')
    } else {
      formRef.current?.reset()
      setImageUrl('')
      state.message = null
      state.errors = {}
    }
  }, [isOpen, actividad, state])

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
                  {editMode ? 'Editar Actividad Interactiva' : 'Agregar Nueva Actividad Interactiva'}
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
                {editMode && <input type="hidden" name="id" value={actividad.id} />}
                <input type="hidden" name="seccionId" value={seccionId} />
                <input type="hidden" name="ejeTematicoId" value={ejeTematicoId} />
                <input type="hidden" name="imagen" value={imageUrl} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nombre">Nombre</label>
                    <input id="nombre" name="nombre" type="text" defaultValue={actividad?.nombre || ''} className='border border-gray-300 rounded-md p-2 w-full' required />
                    {state?.errors?.nombre && <p>{state.errors.nombre[0]}</p>}
                  </div>
                  <div>
                    <label htmlFor="tipo">Tipo de Actividad</label>
                    <select id="tipo" name="tipo" defaultValue={actividad?.tipo || ''} required className='border border-gray-300 rounded-md p-2 w-full'>
                      {Object.values(TipoActividadInteractiva).map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                    {state?.errors?.tipo && <p>{state.errors.tipo[0]}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="match">Match (Contenido)</label>
                  <textarea id="match" name="match" rows={3} defaultValue={actividad?.match || ''} className='border border-gray-300 rounded-md p-2 w-full'/>
                  {state?.errors?.match && <p>{state.errors.match[0]}</p>}
                </div>

                <div>
                  <label htmlFor="retroalimentacion">Retroalimentación</label>
                  <textarea id="retroalimentacion" name="retroalimentacion" rows={3} defaultValue={actividad?.retroalimentacion || ''} className='border border-gray-300 rounded-md p-2 w-full'/>
                  {state?.errors?.retroalimentacion && <p>{state.errors.retroalimentacion[0]}</p>}
                </div>

                <div>
                  <label>Imagen</label>
                  <div className="mt-2 flex items-center gap-4">
                    <CldUploadButton onUpload={handleUpload}>Subir Imagen</CldUploadButton>
                    {imageUrl && <img src={imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded-md" />}
                  </div>
                  {state?.errors?.imagen && <p>{state.errors.imagen[0]}</p>}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={onClose}>Cancelar</button>
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
