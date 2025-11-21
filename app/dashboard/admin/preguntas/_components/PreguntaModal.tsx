'use client'

import { useEffect, useTransition, useState, Fragment } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { UploadCloud } from 'lucide-react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { z } from 'zod'

import { createOrUpdatePregunta } from '@/app/dashboard/admin/preguntas/_lib/pregunta.actions'
import { PreguntaWithRelationsType, PreguntaSchema } from '@/app/dashboard/admin/preguntas/_lib/pregunta.schema'
import { ContenidoWithRelationsType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/contenidoCurricular.schema'
import { AreaWithRelationsType } from '@/app/dashboard/admin/areas/_lib/area.schema'

import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Label } from '@/src/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Checkbox } from '@/src/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import Image from 'next/image'

type PreguntaFormType = Omit<z.infer<typeof PreguntaSchema>, 'ejesTematicos'> & {
  areaId: string;
  competenciaId: string;
  afirmacionId: string;
  contenidoId: string;
  ejesTematicos: string[];
}

interface PreguntaModalProps {
  isOpen: boolean
  onClose: () => void
  areas: AreaWithRelationsType[]
  pregunta?: PreguntaWithRelationsType | null
  isViewMode?: boolean
  contenidosCurriculares: ContenidoWithRelationsType[]
}

export default function PreguntaModal({ isOpen, onClose, areas, pregunta, isViewMode, contenidosCurriculares }: PreguntaModalProps) {

  const [isPending, startTransition] = useTransition()

  const editMode = !!pregunta?.id

  const form = useForm<PreguntaFormType>({
    defaultValues: {
      id: pregunta?.id || undefined,
      contexto: pregunta?.contexto || '',
      enunciado: pregunta?.enunciado || '',
      imagen: pregunta?.imagen || '',
      groupFlag: pregunta?.groupFlag || '',
      evidenciaId: pregunta?.evidenciaId || '',
      ejesTematicos: pregunta?.ejesTematicos.map(e => e.id) || [],
      opciones: pregunta?.opciones && pregunta.opciones.length > 0
        ? pregunta.opciones.map(op => ({
          ...op,
          correcta: op.correcta || false,
          isImage: op.respuesta?.startsWith('http') || false,
          imageUrl: op.respuesta?.startsWith('http') ? op.respuesta : undefined,
          respuesta: op.respuesta?.startsWith('http') ? '' : op.respuesta,
        }))
        : Array(4).fill({ respuesta: '', correcta: false, retroalimentacion: '', isImage: false, imageUrl: undefined }),
      areaId: '',
      competenciaId: '',
      afirmacionId: '',
      contenidoId: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "opciones",
  });

  const [numOpciones, setNumOpciones] = useState(pregunta?.opciones?.length || 4)

  useEffect(() => {
    const difference = numOpciones - fields.length;
    if (difference > 0) {
      for (let i = 0; i < difference; i++) {
        append({ respuesta: '', correcta: false, retroalimentacion: '', isImage: false, imageUrl: undefined });
      }
    } else if (difference < 0) {
      for (let i = 0; i < -difference; i++) {
        remove(fields.length - 1 - i);
      }
    }
  }, [numOpciones, fields.length, append, remove]);

  const watchedAreaId = form.watch('areaId')
  const watchedCompetenciaId = form.watch('competenciaId')
  const watchedAfirmacionId = form.watch('afirmacionId')
  const watchedContenidoId = form.watch('contenidoId')

  useEffect(() => {
    if (isOpen) {
      let initialAreaId = '';
      let initialCompetenciaId = '';
      let initialAfirmacionId = '';
      let initialContenidoId = '';

      if (pregunta && areas.length > 0) {
        for (const area of areas) {
          for (const competencia of area!.competencias) {
            for (const afirmacion of competencia.afirmaciones) {
              if (afirmacion.evidencias.some(ev => ev.id === pregunta.evidenciaId)) {
                initialAreaId = area!.id;
                initialCompetenciaId = competencia.id;
                initialAfirmacionId = afirmacion.id;
                break;
              }
            }
            if (initialAfirmacionId) break;
          }
          if (initialCompetenciaId) break;
        }
      }

      if (pregunta?.ejesTematicos && pregunta.ejesTematicos.length > 0) {
        initialContenidoId = pregunta.ejesTematicos[0].contenidoCurricularId;
      }

      form.reset({
        id: pregunta?.id || undefined,
        contexto: pregunta?.contexto || '',
        enunciado: pregunta?.enunciado || '',
        imagen: pregunta?.imagen || '',
        groupFlag: pregunta?.groupFlag || '',
        evidenciaId: pregunta?.evidenciaId || '',
        ejesTematicos: pregunta?.ejesTematicos.map(e => e.id) || [],
        opciones: pregunta?.opciones && pregunta.opciones.length > 0
          ? pregunta.opciones.map(op => ({
            ...op,
            correcta: op.correcta || false,
            isImage: op.respuesta?.startsWith('http') || false,
            imageUrl: op.respuesta?.startsWith('http') ? op.respuesta : undefined,
            respuesta: op.respuesta?.startsWith('http') ? '' : op.respuesta,
          }))
          : Array(numOpciones).fill({ respuesta: '', correcta: false, retroalimentacion: '', isImage: false, imageUrl: undefined }),
        areaId: initialAreaId,
        competenciaId: initialCompetenciaId,
        afirmacionId: initialAfirmacionId,
        contenidoId: initialContenidoId,
      });
    }
  }, [isOpen, pregunta, areas, form, numOpciones]);

  const onSubmit = (data: PreguntaFormType) => {

    const parsedData = PreguntaSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    startTransition(async () => {

      const rest = {
        id: data.id,
        contexto: data.contexto,
        imagen: data.imagen,
        enunciado: data.enunciado,
        groupFlag: data.groupFlag,
        opciones: data.opciones,
        evidenciaId: data.evidenciaId,
        ejesTematicos: data.ejesTematicos
      }

      // Filter out empty image URLs if isImage is false
      const processedOpciones = rest.opciones.map(op => ({
        ...op,
        respuesta: op.isImage ? op.imageUrl : op.respuesta,
        imageUrl: undefined, // Clear imageUrl if not an image option or if it's already merged into respuesta
        isImage: undefined, // Clear isImage as it's for client-side logic
      }));

      const finalData = { ...rest, opciones: processedOpciones };

      const formData = new FormData();

      Object.entries(finalData).forEach(([key, value]) => {
        if (key === 'opciones') {
          formData.append(key, JSON.stringify(value)); // Stringify array of objects
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });


      const result = await createOrUpdatePregunta(formData);
      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
        if (result.errors) {
          for (const [key, value] of Object.entries(result.errors)) {
            form.setError(key as keyof PreguntaFormType, {
              type: 'manual',
              message: (value as string[]).join(', '),
            });
          }
        }
      }
    });
  };

  const selectedArea = areas.find(area => area!.id === watchedAreaId);
  const competencias = selectedArea?.competencias || [];
  const selectedCompetencia = competencias.find(c => c.id === watchedCompetenciaId);
  const afirmaciones = selectedCompetencia?.afirmaciones || [];
  const selectedAfirmacion = afirmaciones.find(a => a.id === watchedAfirmacionId);
  const evidencias = selectedAfirmacion?.evidencias || [];

  const filteredContenidos = watchedAreaId
    ? contenidosCurriculares.filter(c => c.areaId === watchedAreaId)
    : [];
  const selectedContenido = filteredContenidos.find(c => c.id === watchedContenidoId);
  const ejesTematicos = selectedContenido?.ejesTematicos || [];

  const getCorrectOptionIndex = () => {
    const correctOption = form.getValues('opciones').findIndex(op => op.correcta);
    return correctOption !== -1 ? String(correctOption) : '';
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-modal" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        {isViewMode ? 'Ver Pregunta' : editMode ? 'Editar Pregunta' : 'Crear Nueva Pregunta'}
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {isViewMode ? 'Información detallada de la pregunta.' : editMode ? 'Modifica los campos para actualizar la pregunta.' : 'Completa los campos para agregar una nueva pregunta a la base de datos.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                    {editMode && <input type="hidden" {...form.register('id')} />}

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="contexto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contexto</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} disabled={isViewMode} placeholder="Describe la situación o información base para la pregunta." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="enunciado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Enunciado</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} disabled={isViewMode} placeholder="La pregunta específica que el estudiante debe responder." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="imagen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Imagen de Apoyo</FormLabel>
                            <FormControl>
                              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-10">
                                <div className="text-center">
                                  {field.value ? (
                                    <div>
                                      <Image src={field.value} alt="Vista previa de la imagen" className="mx-auto h-48 w-auto rounded-md" width={192} height={192} />
                                      {!isViewMode && (
                                        <Button type="button" variant="destructive" size="sm" className="mt-4" onClick={() => field.onChange('')}>
                                          Quitar imagen
                                        </Button>
                                      )}
                                    </div>
                                  ) : (
                                    <CldUploadWidget
                                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                      onSuccess={(results: CloudinaryUploadWidgetResults) => {
                                        if (!isViewMode && results.event === 'success' && typeof results.info !== 'string' && results.info) field.onChange(results.info.secure_url)
                                      }}
                                    >
                                      {({ open }) => (
                                        <Button type="button" variant="ghost" onClick={() => !isViewMode && open()} disabled={isViewMode}>
                                          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                          <span className="mt-2 block text-sm font-semibold">Sube un archivo</span>
                                        </Button>
                                      )}
                                    </CldUploadWidget>
                                  )}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Card>
                      <CardHeader><CardTitle>Opciones de Respuesta</CardTitle></CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label>Número de Opciones</Label>
                          <Select
                            value={String(numOpciones)}
                            onValueChange={(value) => setNumOpciones(Number(value))}
                            disabled={isViewMode}
                          >
                            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Controller
                          control={form.control}
                          name="opciones"
                          render={({ field }) => (
                            <RadioGroup
                              onValueChange={(value) => {
                                const index = parseInt(value, 10);
                                const updatedOpciones = form.getValues('opciones').map((opcion, i) => ({
                                  ...opcion,
                                  correcta: i === index,
                                }));
                                field.onChange(updatedOpciones);
                              }}
                              value={getCorrectOptionIndex()}
                              disabled={isViewMode}
                            >
                              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {fields.map((item, index) => (
                                  <Card key={item.id}>
                                    <CardHeader><CardTitle>Opción {String.fromCharCode(65 + index)}</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                      {!isViewMode && (
                                        <div className="flex items-center gap-4 rounded-lg p-1 bg-muted">
                                          <Button
                                            type="button"
                                            variant={form.watch(`opciones.${index}.isImage`) === false ? 'default' : 'ghost'}
                                            className="flex-1"
                                            onClick={() => {
                                              form.setValue(`opciones.${index}.isImage`, false);
                                              form.setValue(`opciones.${index}.imageUrl`, undefined);
                                            }}
                                          >
                                            Texto
                                          </Button>
                                          <Button
                                            type="button"
                                            variant={form.watch(`opciones.${index}.isImage`) === true ? 'default' : 'ghost'}
                                            className="flex-1"
                                            onClick={() => {
                                              form.setValue(`opciones.${index}.isImage`, true);
                                              form.setValue(`opciones.${index}.respuesta`, '');
                                            }}
                                          >
                                            Imagen
                                          </Button>
                                        </div>
                                      )}

                                      {form.watch(`opciones.${index}.isImage`) ? (
                                        <FormField
                                          control={form.control}
                                          name={`opciones.${index}.imageUrl`}
                                          render={({ field: imageField }) => (
                                            <FormItem>
                                              <FormLabel>Imagen de la opción</FormLabel>
                                              <FormControl>
                                                <div className="w-full">
                                                  {imageField.value ? (
                                                    <div className="mt-2 text-center">
                                                      <Image src={imageField.value} alt={`Opción ${String.fromCharCode(65 + index)}`} className="mx-auto h-40 w-auto rounded-md object-contain" width={160} height={160} />
                                                      {!isViewMode && (
                                                        <Button type="button" variant="destructive" size="sm" className="mt-2" onClick={() => imageField.onChange(undefined)}>
                                                          Quitar imagen
                                                        </Button>
                                                      )}
                                                    </div>
                                                  ) : (
                                                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-10">
                                                      <CldUploadWidget
                                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                                        onSuccess={(results: CloudinaryUploadWidgetResults) => {
                                                          if (!isViewMode && results.event === 'success' && typeof results.info !== 'string' && results.info) imageField.onChange(results.info.secure_url)
                                                        }}
                                                      >
                                                        {({ open }) => (
                                                          <Button type="button" variant="ghost" onClick={() => !isViewMode && open()} disabled={isViewMode}>
                                                            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                                            <span className="mt-2 block text-sm font-semibold">Sube un archivo</span>
                                                          </Button>
                                                        )}
                                                      </CldUploadWidget>
                                                    </div>
                                                  )}
                                                </div>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      ) : (
                                        <FormField
                                          control={form.control}
                                          name={`opciones.${index}.respuesta`}
                                          render={({ field: itemField }) => (
                                            <FormItem>
                                              <FormLabel>Texto de la opción</FormLabel>
                                              <FormControl>
                                                <Textarea {...itemField} required disabled={isViewMode} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      )}

                                      <FormField
                                        control={form.control}
                                        name={`opciones.${index}.retroalimentacion`}
                                        render={({ field: itemField }) => (
                                          <FormItem>
                                            <FormLabel>Retroalimentación</FormLabel>
                                            <FormControl>
                                              <Textarea {...itemField} value={itemField.value ?? ''} disabled={isViewMode} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                          <RadioGroupItem value={String(index)} id={`opcion-correcta-${index}`} />
                                        </FormControl>
                                        <Label htmlFor={`opcion-correcta-${index}`}>Respuesta correcta</Label>
                                      </FormItem>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </RadioGroup>
                          )}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader><CardTitle>Metadatos</CardTitle></CardHeader>
                      <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="areaId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Área</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} disabled={isViewMode}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un área" /></SelectTrigger></FormControl>
                                <SelectContent>{areas.map(area => <SelectItem key={area!.id} value={area!.id}>{area!.nombre}</SelectItem>)}</SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="competenciaId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Competencia</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} disabled={!watchedAreaId || isViewMode}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una competencia" /></SelectTrigger></FormControl>
                                <SelectContent>{competencias.map(c => <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>)}</SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="afirmacionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Afirmación</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} disabled={!watchedCompetenciaId || isViewMode}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una afirmación" /></SelectTrigger></FormControl>
                                <SelectContent>{afirmaciones.map(a => <SelectItem key={a.id} value={a.id}>{a.nombre}</SelectItem>)}</SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="evidenciaId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Evidencia</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} disabled={!watchedAfirmacionId || isViewMode}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una evidencia" /></SelectTrigger></FormControl>
                                <SelectContent>{evidencias.map(e => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}</SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="contenidoId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contenido Curricular</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} disabled={!watchedAreaId || isViewMode}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un contenido" /></SelectTrigger></FormControl>
                                <SelectContent>{filteredContenidos.map(c => <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>)}</SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="col-span-full">
                          <h3 className="text-base font-semibold">Ejes Temáticos</h3>
                          <FormField
                            control={form.control}
                            name="ejesTematicos"
                            render={() => (
                              <FormItem className='mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {ejesTematicos.length > 0 ? (
                                  ejesTematicos.map(eje => (
                                    <FormField
                                      key={eje.id}
                                      control={form.control}
                                      name="ejesTematicos"
                                      render={({ field }) => (
                                        <FormItem key={eje.id} className="flex flex-row items-start space-x-3 space-y-0">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(eje.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, eje.id])
                                                  : field.onChange(field.value?.filter((value) => value !== eje.id))
                                              }}
                                              disabled={isViewMode}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">{eje.nombre}</FormLabel>
                                        </FormItem>
                                      )}
                                    />
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground col-span-full">
                                    {watchedContenidoId ? 'No hay ejes temáticos para este contenido.' : 'Seleccione un contenido curricular para ver los ejes temáticos.'}
                                  </p>
                                )}
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="groupFlag"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bandera</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isViewMode} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                        {isViewMode ? 'Cerrar' : 'Cancelar'}
                      </Button>
                      {!isViewMode && (
                        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                          {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Pregunta')}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}