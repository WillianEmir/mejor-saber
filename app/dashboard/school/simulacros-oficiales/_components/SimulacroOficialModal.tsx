'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline'

import { createOrUpdateSimulacroOficial } from '../_lib/actions'
import { CreateSimulacroOficialSchema, SimulacroOficialValues } from '../_lib/schema'

import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'

// Define a type for the props, including the simulacro to edit
interface SimulacroOficialModalProps {
  isOpen: boolean
  onClose: () => void
  areas: { id: string; nombre: string }[]
  simulacro?: SimulacroOficialValues | null // Can be null or undefined
}

export function SimulacroOficialModal({ isOpen, onClose, areas, simulacro }: SimulacroOficialModalProps) {
  const [isPending, startTransition] = useTransition()
  const editMode = !!simulacro?.id

  const form = useForm<SimulacroOficialValues>({
    defaultValues: {
      id: simulacro?.id || undefined,
      nombre: simulacro?.nombre || '',
      areaId: simulacro?.areaId || '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: simulacro?.id || undefined,
        nombre: simulacro?.nombre || '',
        areaId: simulacro?.areaId || '',
      })
    }
  }, [isOpen, simulacro, form])

  const onSubmit = (data: SimulacroOficialValues) => {

    const parsedData = CreateSimulacroOficialSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData();

    if (editMode) formData.append('id', data.id!);
    formData.append('nombre', data.nombre);
    formData.append('areaId', data.areaId);

    startTransition(async () => {
      const result = await createOrUpdateSimulacroOficial(formData)
      if (result.success) {
        toast.success(result.message)
        onClose()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editMode ? <PencilIcon className="h-6 w-6" /> : <PlusCircleIcon className="h-6 w-6" />}
            {editMode ? 'Editar Simulacro Oficial' : 'Programar Nuevo Simulacro'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {editMode && <input type="hidden" {...form.register('id')} />}

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Simulacro</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Simulacro Oficial de Matemáticas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="areaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un área" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areas.map(area => (
                        <SelectItem key={area.id} value={area.id}>{area.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Simulacro')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
