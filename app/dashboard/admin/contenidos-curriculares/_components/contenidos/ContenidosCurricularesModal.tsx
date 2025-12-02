'use client'

import { useEffect, useTransition } from 'react' 
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline'

import { createOrUpdateContenidoCurricular } from '@/app/dashboard/admin/contenidos-curriculares/_lib/contenidoCurricular.actions'
import { ContenidoCurricularSchema, ContenidoWithRelationsType, ContenidoCurricularType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/contenidoCurricular.schema'
import { Areatype } from '@/app/dashboard/admin/areas/_lib/area.schema'

import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'

interface ContenidoCurricularModalProps {
  isOpen: boolean
  onClose: () => void
  contenidoCurricular: ContenidoWithRelationsType | null
  areas: Areatype[] 
}

export default function ContenidosCurricularesModal({ isOpen, onClose, contenidoCurricular, areas }: ContenidoCurricularModalProps) {

  const [isPending, startTransition] = useTransition()

  const editMode = !!contenidoCurricular?.id

  const form = useForm<ContenidoCurricularType>({
    defaultValues: {
      id: contenidoCurricular?.id || undefined,
      nombre: contenidoCurricular?.nombre || '',
      areaId: contenidoCurricular?.areaId || '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: contenidoCurricular?.id || undefined,
        nombre: contenidoCurricular?.nombre || '',
        areaId: contenidoCurricular?.areaId || '',
      })
    }
  }, [isOpen, contenidoCurricular, form])

  const onSubmit = (data: ContenidoCurricularType) => {

    const parsedData = ContenidoCurricularSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData()
    
    if (data.id) formData.append('id', data.id)
    formData.append('nombre', data.nombre)
    formData.append('areaId', data.areaId)

    startTransition(async () => {
      const result = await createOrUpdateContenidoCurricular(formData)
      if (result.success) {
        toast.success(result.message)
        onClose()
      } else {
        toast.error(result.message)
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            form.setError(key as keyof ContenidoCurricularType, {
              type: 'manual',
              message: value!.join(', '),
            })
          })
        }
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editMode ? <PencilIcon className="h-6 w-6" /> : <PlusCircleIcon className="h-6 w-6" />}
            {editMode ? 'Editar Contenido Curricular' : 'Agregar Nuevo Contenido'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
            {editMode && <input type="hidden" {...form.register('id')} />}

            <FormField
              control={form.control}
              name="areaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={editMode}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un Área" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Contenido</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ecuaciones lineales" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Contenido')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}