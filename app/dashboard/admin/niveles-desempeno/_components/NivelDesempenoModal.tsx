'use client';

import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Nivel } from '@/src/generated/prisma';
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

import { createOrUpdateNivelDesempeno } from '../_lib/NivelesDesempeño.actions';
import { NivelDesempenoSchema, NivelDesempenoType } from '../_lib/NivelesDesempeño.schema';
import { Areatype } from '../../areas/_lib/area.schema';

import { Button } from '@/src/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';

interface NivelDesempenoModalProps { 
  isOpen: boolean;
  onClose: () => void;
  nivel: NivelDesempenoType | null;
  areas: Areatype[];
}

const nivelesEnum = Object.values(Nivel);

export default function NivelDesempenoModal({ isOpen, onClose, nivel, areas }: NivelDesempenoModalProps) {

  const [isPending, startTransition] = useTransition();

  const editMode = !!nivel?.id;

  const form = useForm<NivelDesempenoType>({
    defaultValues: {
      id: nivel?.id || undefined,
      nivel: nivel?.nivel || undefined,
      descripcion: nivel?.descripcion || '',
      puntajeMin: nivel?.puntajeMin || 0,
      puntajeMax: nivel?.puntajeMax || 0,
      areaId: nivel?.areaId || undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: nivel?.id || undefined,
        nivel: nivel?.nivel || undefined,
        descripcion: nivel?.descripcion || '',
        puntajeMin: nivel?.puntajeMin || 0,
        puntajeMax: nivel?.puntajeMax || 0,
        areaId: nivel?.areaId || undefined,
      });
    }
  }, [isOpen, nivel, form]);

  const onSubmit = (data: NivelDesempenoType) => {

    const parsedData = NivelDesempenoSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData();
    if (data.id) formData.append('id', data.id);
    formData.append('nivel', data.nivel);
    formData.append('descripcion', data.descripcion);
    formData.append('puntajeMin', String(data.puntajeMin));
    formData.append('puntajeMax', String(data.puntajeMax));
    formData.append('areaId', data.areaId);

    startTransition(async () => {
      const result = await createOrUpdateNivelDesempeno(formData);
      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            form.setError(key as keyof NivelDesempenoType, {
              type: 'manual',
              message: (value as string[]).join(', '),
            });
          });
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editMode ? <PencilIcon className="h-6 w-6" /> : <PlusCircleIcon className="h-6 w-6" />}
            {editMode ? 'Editar Nivel de Desempeño' : 'Agregar Nuevo Nivel'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {editMode && <input type="hidden" {...form.register('id')} />}

            <div className='flex gap-3'>
              <FormField
                control={form.control}
                name="nivel"
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Nivel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un nivel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nivelesEnum.map((nivel) => (
                          <SelectItem key={nivel} value={nivel}>
                            {nivel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="areaId"
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Área</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un área" />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe el nivel de desempeño..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-3'>
              <FormField
                control={form.control}
                name="puntajeMin"
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Puntaje Mínimo</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="puntajeMax"
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Puntaje Máximo</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Nivel')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
