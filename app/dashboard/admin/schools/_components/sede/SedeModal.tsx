'use client';

import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

import { createOrUpdateSchoolSede } from '@/app/dashboard/admin/schools/_lib/sede.actions';
import { SchoolSedeSchema, SchoolSedeType } from '@/app/dashboard/admin/schools/_lib/sede.schema';

import { Button } from '@/src/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';

interface SedeModalProps { 
  schoolId: string | undefined;
  sede?: SchoolSedeType;
  isOpen: boolean;
  onClose: () => void;
}

export default function SedeModal({ schoolId, sede, isOpen, onClose }: SedeModalProps) {
  const [isPending, startTransition] = useTransition();
  const editMode = !!sede?.id;

  const form = useForm<SchoolSedeType>({
    defaultValues: {
      id: sede?.id || undefined,
      nombre: sede?.nombre || '',
      DANE: sede?.DANE || '',
      schoolId: schoolId,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: sede?.id || undefined,
        nombre: sede?.nombre || '',
        DANE: sede?.DANE || '',
        schoolId: schoolId,
      });
    }
  }, [isOpen, sede, schoolId, form]);

  const onSubmit = (data: SchoolSedeType) => {

    const parsedData = SchoolSedeSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData();
    if (data.id) formData.append('id', data.id);
    formData.append('nombre', data.nombre);
    formData.append('DANE', data.DANE);
    formData.append('schoolId', data.schoolId);

    startTransition(async () => {
      const result = await createOrUpdateSchoolSede(formData);
      if (result.success) {
        toast.success(result.message);
        form.reset();
        onClose();
      } else {
        toast.error(result.message);
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            form.setError(key as keyof SchoolSedeType, {
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
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editMode ? <PencilIcon className="h-6 w-6" /> : <PlusCircleIcon className="h-6 w-6" />}
            {editMode ? 'Editar Sede' : 'Crear Nueva Sede'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <input type="hidden" {...form.register('schoolId')} />
            {editMode && <input type="hidden" {...form.register('id')} />}

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la sede" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="DANE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código DANE</FormLabel>
                  <FormControl>
                    <Input placeholder="Código DANE de la sede" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Sede')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}