import { Fragment, useActionState, useEffect, useRef, useCallback, useState, ChangeEvent } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { Dialog, Transition } from '@headlessui/react'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AreaWithRelationsType } from '@/src/lib/schemas/area.schema'
import { toast } from 'react-toastify'
import { createOrUpdatePregunta } from '@/src/lib/actions/pregunta.action'
import { PreguntaWithRelationsType } from '@/src/lib/schemas/pregunta.schema'
import { CldUploadWidget } from 'next-cloudinary'
import { ContenidoWithRelationsType } from '@/src/lib/schemas/contenidoCurricular.schema'

interface AdminAddPreguntasProps {
  areas: AreaWithRelationsType[]
  pregunta?: PreguntaWithRelationsType | null;
  isViewMode?: boolean;
  contenidosCurriculares: ContenidoWithRelationsType[];
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
          : 'Crear Pregunta'}
    </button> 
  ) 
}

export default function PreguntaModal({ areas, pregunta, isViewMode, contenidosCurriculares }: AdminAddPreguntasProps) {

  const [state, formAction] = useActionState(createOrUpdatePregunta, { message: null, errors: {} });

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const formRef = useRef<HTMLFormElement>(null)

  const addMode = searchParams.get('add-question') === 'true'
  const editMode = searchParams.get('edit-question') === 'true'
  const viewMode = searchParams.get('view-question') === 'true'
  const showModal = addMode || editMode || viewMode;

  const [selectedAreaId, setSelectedAreaId] = useState<string | undefined>('');
  const [selectedCompetenciaId, setSelectedCompetenciaId] = useState<string | undefined>('');
  const [selectedAfirmacionId, setSelectedAfirmacionId] = useState<string | undefined>('');
  const [selectedEvidenciaId, setSelectedEvidenciaId] = useState<string | undefined>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(pregunta?.imagen || null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(pregunta?.imagen || '');

  const onClose = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete('add-question')
    newSearchParams.delete('edit-question')
    newSearchParams.delete('view-question')
    const newPath = `${pathname}?${newSearchParams.toString()}`
    router.replace(newPath)
  }, [pathname, router, searchParams])

  useEffect(() => {
    if ((editMode || viewMode) && pregunta && areas.length > 0) {
      for (const area of areas) {
        for (const competencia of area!.competencias) {
          for (const afirmacion of competencia.afirmaciones) {
            if (afirmacion.evidencias.some(ev => ev.id === pregunta.evidenciaId)) {
              setSelectedAreaId(area!.id);
              setSelectedCompetenciaId(competencia.id);
              setSelectedAfirmacionId(afirmacion.id);
              setSelectedEvidenciaId(pregunta.evidenciaId);
              return;
            }
          }
        }
      }
    }
  }, [editMode, viewMode, pregunta, areas]);

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


  const [numOpciones, setNumOpciones] = useState(pregunta?.opciones && pregunta.opciones.length > 0 ? pregunta.opciones.length : 4);

  const getInitialCorrectOption = () => {
    if (!pregunta) return null;
    const correctIndex = pregunta.opciones.findIndex(opt => opt.correcta);
    return correctIndex !== -1 ? String.fromCharCode(97 + correctIndex) : null;
  };
  const [correctOption, setCorrectOption] = useState<string | null>(getInitialCorrectOption());

  const [optionTypes, setOptionTypes] = useState<{ [key: string]: 'text' | 'image' }>({});
  const [opcionImageUrls, setOpcionImageUrls] = useState<{ [key: string]: string | undefined }>({});

  useEffect(() => {
    if (pregunta?.opciones) {
      const initialTypes: { [key: string]: 'text' | 'image' } = {};
      const initialImageUrls: { [key: string]: string } = {};
      pregunta.opciones.forEach((opcion, index) => {
        const key = String.fromCharCode(97 + index);
        if (opcion.respuesta?.startsWith('http')) {
          initialTypes[key] = 'image';
          initialImageUrls[key] = opcion.respuesta;
        } else {
          initialTypes[key] = 'text';
        }
      });
      setOptionTypes(initialTypes);
      setOpcionImageUrls(initialImageUrls);
    }
  }, [pregunta]);

  const handleOptionTypeChange = (key: string, type: 'text' | 'image') => {
    if (isViewMode) return;
    setOptionTypes(prev => ({ ...prev, [key]: type }));
  };

  // Efecto para resetear el formulario cuando el modal se cierra
  useEffect(() => {
    if (!showModal) {
      formRef.current?.reset()
    }
  }, [showModal])

  useEffect(() => {
    if (state.message) {
      if (state.errors && Object.keys(state.errors).length > 0) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
        router.push('/dashboard/preguntas');
      }
    }
  }, [state, router]);

  const handleAreaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAreaId(e.target.value);
    setSelectedCompetenciaId('');
    setSelectedAfirmacionId('');
    setSelectedEvidenciaId('');
  };

  const handleCompetenciaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompetenciaId(e.target.value);
    setSelectedAfirmacionId('');
    setSelectedEvidenciaId('');
  };

  const handleAfirmacionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAfirmacionId(e.target.value);
    setSelectedEvidenciaId('');
  };

  const handleEvidenciaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedEvidenciaId(e.target.value);
  };

  const selectedArea = areas.find(area => area!.id === selectedAreaId);
  const competencias = selectedArea?.competencias || [];
  const selectedCompetencia = competencias.find(c => c.id === selectedCompetenciaId);
  const afirmaciones = selectedCompetencia?.afirmaciones || [];
  const selectedAfirmacion = afirmaciones.find(a => a.id === selectedAfirmacionId);
  const evidencias = selectedAfirmacion?.evidencias || [];

  const [selectedContenidoId, setSelectedContenidoId] = useState<string | undefined>('');

  const handleContenidoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedContenidoId(e.target.value);
  };

  const filteredContenidos = selectedAreaId
    ? contenidosCurriculares.filter(c => c.areaId === selectedAreaId)
    : [];

  const selectedContenido = filteredContenidos.find(c => c.id === selectedContenidoId);
  const ejesTematicos = selectedContenido?.ejesTematicos || pregunta?.ejesTematicos || [];


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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">

                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Cerrar modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <form action={formAction} ref={formRef} className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 rounded-lg shadow">

                  {editMode && <input type="hidden" name="id" value={pregunta?.id} />}
                  <input type="hidden" name="imagen" value={imageUrl} />

                  <div className="space-y-12">
                    <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
                      <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white">
                        {isViewMode ? 'Ver Pregunta' : editMode ? 'Editar Pregunta' : 'Crear Nueva Pregunta'}
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                        {isViewMode ? 'Información detallada de la pregunta.' : editMode ? 'Modifica los campos para actualizar la pregunta.' : 'Completa los campos para agregar una nueva pregunta a la base de datos.'}
                      </p>

                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                          <label htmlFor="contexto" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Contexto</label>
                          <div className="mt-2">
                            <textarea id="contexto" name="contexto" rows={3} defaultValue={pregunta?.contexto} required disabled={isViewMode} className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 field-sizing-content" />
                          </div>
                          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">Describe la situación o información base para la pregunta.</p>
                        </div>

                        <div className="col-span-full">
                          <label htmlFor="enunciado" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Enunciado</label>
                          <div className="mt-2">
                            <textarea id="enunciado" name="enunciado" rows={3} defaultValue={pregunta?.enunciado} required disabled={isViewMode} className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 field-sizing-content" />
                          </div>
                          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">La pregunta específica que el estudiante debe responder.</p>
                        </div>

                        <div className="col-span-full">
                          <label htmlFor="imagen" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Imagen de Apoyo</label>
                          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-600 px-6 py-10">
                            <div className="text-center">
                              {previewUrl ? (
                                <div>
                                  <img src={previewUrl} alt="Vista previa de la imagen" className="mx-auto h-48 w-auto rounded-md" />
                                  {!isViewMode && (
                                    <button type="button" onClick={() => { setPreviewUrl(null); setImageUrl(''); }} className="mt-4 rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100">
                                      Quitar imagen
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <CldUploadWidget
                                  uploadPreset="app-saber-ya"
                                  onSuccess={(result: any) => {
                                    if (!isViewMode) {
                                      setImageUrl(result.info.secure_url);
                                      setPreviewUrl(result.info.secure_url);
                                    }
                                  }}
                                >
                                  {({ open }) => {
                                    return (
                                      <button type="button" onClick={() => !isViewMode && open()} disabled={isViewMode} className="relative cursor-pointer rounded-md bg-white dark:bg-gray-900 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 dark:text-indigo-400 dark:focus-within:ring-offset-gray-900 disabled:cursor-not-allowed">
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-500" aria-hidden="true" />
                                        <span>Sube un archivo</span>
                                      </button>
                                    );
                                  }}
                                </CldUploadWidget>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12 mt-12">
                      <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Opciones de Respuesta</h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Define las opciones de respuesta y marca cuál es la correcta.</p>

                      <div className="mt-6 sm:col-span-2">
                        <label htmlFor="numOpciones" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Número de Opciones</label>
                        <div className="mt-2">
                          <select
                            id="numOpciones"
                            value={numOpciones}
                            onChange={(e) => setNumOpciones(Number(e.target.value))}
                            disabled={isViewMode}
                            className="block w-full max-w-xs rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-700"
                          >
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={7}>7</option>
                          </select>
                        </div>
                      </div>

                      {/* Opciones de Respuesta */}
                      <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-2">
                        {Array.from({ length: numOpciones }, (_, i) => String.fromCharCode(97 + i)).map((key, index) => (
                          <div key={key} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 shadow-sm">
                            <strong className="text-lg font-medium text-gray-900 dark:text-white">Opción {key.toUpperCase()}</strong>
                            <div className="mt-4 space-y-4">
                              {!isViewMode && (
                                <div className="flex items-center gap-4 rounded-lg p-1">
                                  <button type="button" onClick={() => handleOptionTypeChange(key, 'text')} className={`flex-1 rounded-md px-3 py-1 text-sm font-medium transition-colors ${optionTypes[key] === 'text' || !optionTypes[key] ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}>
                                    Texto
                                  </button>
                                  <button type="button" onClick={() => handleOptionTypeChange(key, 'image')} className={`flex-1 rounded-md px-3 py-1 text-sm font-medium transition-colors ${optionTypes[key] === 'image' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}>
                                    Imagen
                                  </button>
                                </div>
                              )}

                              <div>
                                <label htmlFor={`opcion-texto-${key}`} className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                  {optionTypes[key] === 'image' ? 'Imagen de la opción' : 'Texto de la opción'}
                                </label>
                                <div className="mt-1">
                                  {optionTypes[key] === 'image' ? (
                                    <div className="w-full">
                                      <input type="hidden" name={`respuesta_${key}`} value={opcionImageUrls[key] || ''} />
                                      {opcionImageUrls[key] || (pregunta?.opciones[index]?.respuesta?.startsWith('http')) ? (
                                        <div className="mt-2 text-center">
                                          <img src={opcionImageUrls[key] || pregunta?.opciones[index]?.respuesta} alt={`Opción ${key.toUpperCase()}`} className="mx-auto h-40 w-auto rounded-md object-contain" />
                                          {!isViewMode && (
                                            <button type="button" onClick={() => setOpcionImageUrls(prev => ({ ...prev, [key]: undefined }))} className="mt-4 rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100">
                                              Quitar imagen
                                            </button>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-600 px-6 py-10">
                                          <CldUploadWidget
                                            uploadPreset="app-saber-ya"
                                            onSuccess={(result: any) => {
                                              if (!isViewMode) {
                                                setOpcionImageUrls(prev => ({ ...prev, [key]: result.info.secure_url }));
                                              }
                                            }}
                                          >
                                            {({ open }) => (
                                              <button type="button" onClick={() => !isViewMode && open()} disabled={isViewMode} className="relative cursor-pointer rounded-md bg-white dark:bg-gray-900 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 dark:text-indigo-400 dark:focus-within:ring-offset-gray-900 disabled:cursor-not-allowed">
                                                <PhotoIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-500" aria-hidden="true" />
                                                <span>Sube un archivo</span>
                                              </button>
                                            )}
                                          </CldUploadWidget>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <textarea name={`respuesta_${key}`} id={`opcion-texto-${key}`} defaultValue={pregunta?.opciones[index]?.respuesta?.startsWith('http') ? '' : pregunta?.opciones[index]?.respuesta} required disabled={isViewMode} className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 field-sizing-content" />
                                  )}
                                </div>
                              </div>

                              <div>
                                <label htmlFor={`opcion-retro-${key}`} className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Retroalimentación</label>
                                <div className="mt-1">
                                  <textarea name={`retroalimentacion_${key}`} id={`opcion-retro-${key}`} defaultValue={pregunta?.opciones[index]?.retroalimentacion ?? ''} disabled={isViewMode} className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 field-sizing-content" />
                                </div>
                              </div>
                              <div className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                  <input
                                    name={`correcta_${key}`}
                                    id={`opcion-correcta-${key}`}
                                    type="radio"
                                    value={key}
                                    checked={correctOption === key}
                                    onChange={() => setCorrectOption(key)}
                                    disabled={isViewMode}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:bg-gray-700 dark:border-gray-600"
                                  />
                                </div>
                                <div className="ml-3 text-sm leading-6">
                                  <label htmlFor={`opcion-correcta-${key}`} className="font-medium text-gray-900 dark:text-gray-300">Marcar como respuesta correcta</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12 mt-12">
                      <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Metadatos</h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Información adicional para clasificar y organizar la pregunta.</p>
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                          <label htmlFor="areaId" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Áreas</label>
                          <div className="mt-2">
                            <select id="areaId" name="areaId" value={selectedAreaId} onChange={handleAreaChange} required disabled={isViewMode} className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-700">
                              <option value="">Seleccione un área</option>
                              {areas.map(area => <option key={area!.id} value={area!.id}>{area!.nombre}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="competenciaId" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Competencias</label>
                          <div className="mt-2">
                            <select key={`competencia-${selectedAreaId}`} id="competenciaId" name="competenciaId" value={selectedCompetenciaId} onChange={handleCompetenciaChange} disabled={!selectedAreaId || isViewMode} required className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 dark:disabled:bg-gray-700">
                              <option value="">Seleccione una Competencia</option>
                              {competencias.map(comp => <option key={comp.id} value={comp.id}>{comp.nombre}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="afirmacionId" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Afirmaciones</label>
                          <div className="mt-2">
                            <select key={`afirmacion-${selectedCompetenciaId}`} id="afirmacionId" name="afirmacionId" value={selectedAfirmacionId} onChange={handleAfirmacionChange} disabled={!selectedCompetenciaId || isViewMode} required className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 dark:disabled:bg-gray-700">
                              <option value="">Seleccione una afirmación</option>
                              {afirmaciones.map(af => <option key={af.id} value={af.id}>{af.nombre}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="evidenciaId" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Evidencias</label>
                          <div className="mt-2">
                            <select key={`evidencia-${selectedAfirmacionId}`} id="evidenciaId" name="evidenciaId" value={selectedEvidenciaId} onChange={handleEvidenciaChange} disabled={!selectedAfirmacionId || isViewMode} required className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 dark:disabled:bg-gray-700">
                              <option value="">Seleccione una evidencia</option>
                              {evidencias.map(ev => <option key={ev.id} value={ev.id}>{ev.nombre}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="contenidoId" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Contenido Curricular</label>
                          <div className="mt-2">
                            <select id="contenidoId" name="contenidoId" value={selectedContenidoId} onChange={handleContenidoChange} disabled={!selectedAreaId || isViewMode} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-700">
                              {!!addMode && <option value="">Seleccione un contenido</option>}
                              {!viewMode && filteredContenidos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                              {!!viewMode && <option value='' disabled>{contenidosCurriculares.find(c => c.id === pregunta?.ejesTematicos[0].contenidoCurricularId)?.nombre}</option>}
                            </select>
                          </div>
                        </div>

                        <div className="col-span-full mt-6">
                          <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Ejes Temáticos</h3>
                          <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {ejesTematicos.length > 0 ? (
                              ejesTematicos.map(eje => (
                                <div key={eje.id} className="relative flex items-start">
                                  <div className="flex h-6 items-center">
                                    <input
                                      id={`eje-${eje.id}`}
                                      name='ejeTematico'
                                      type="checkbox"
                                      value={eje.id}
                                      defaultChecked={pregunta?.ejesTematicos.some(et => et.id === eje.id)}
                                      disabled={isViewMode}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm leading-6">
                                    <label htmlFor={`eje-${eje.id}`} className="font-medium text-gray-900 dark:text-gray-300">
                                      {eje.nombre}
                                    </label>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full">
                                {selectedContenidoId ? 'No hay ejes temáticos para este contenido.' : 'Seleccione un contenido curricular para ver los ejes temáticos.'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-col mt-6'>
                        <label htmlFor="groupFlag" className='font-medium text-gray-900 dark:text-gray-300'>Bandera</label>
                        <input 
                        type="text" 
                        className={`w-100 p-2 mt-4 rounded border border-gray-400 text-indigo-600 focus:ring-indigo-600 dark:bg-gray-700 dark:border-gray-600`}
                        id='groupFlag'
                        name='groupFlag'
                        defaultValue={pregunta?.groupFlag || ''}
                        disabled={isViewMode}
                      />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                    >
                      {isViewMode ? 'Cerrar' : 'Cancelar'}
                    </button>
                    {!isViewMode && <SubmitButton editMode={editMode} />}
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
