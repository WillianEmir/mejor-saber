'use client';

import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form'; 
import { toast } from 'sonner';
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

import { createOrUpdateTestimonio } from '../_lib/testimonio.actions';
import { TestimonioSchema, TestimonioType, UserForSelect, TestimonioFormType } from '../_lib/testimonio.schema';

import { Button } from '@/src/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";

interface TestimonioModalProps {
  testimonio?: TestimonioType | null;
  users: UserForSelect[];
  isOpen: boolean;
  onClose: () => void;
}

export default function TestimonioModal({ testimonio, users, isOpen, onClose }: TestimonioModalProps) {
  const [isPending, startTransition] = useTransition();
  const editMode = !!testimonio?.id;

  const form = useForm<TestimonioFormType>({
    defaultValues: {
      id: testimonio?.id || undefined,
      rating: testimonio?.rating || 5,
      comentario: testimonio?.comentario || "",
      publicado: testimonio?.publicado || false,
      userId: testimonio?.userId || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: testimonio?.id || undefined,
        rating: testimonio?.rating || 5,
        comentario: testimonio?.comentario || "",
        publicado: testimonio?.publicado || false,
        userId: testimonio?.userId || "",
      });
    }
  }, [isOpen, testimonio, form]);

  const onSubmit = (data: TestimonioFormType) => {
    const parsedData = TestimonioSchema.safeParse(data);

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message);
      });
      return;
    }

    const formData = new FormData();
    
    const { id, ...rest } = parsedData.data;

    if (id) {
      formData.append('id', id);
    }

    Object.entries(rest).forEach(([key, value]) => {
        formData.append(key, String(value));
    });

    startTransition(async () => {
      const result = await createOrUpdateTestimonio(formData);
      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            if (key === '_form') {
                toast.error((value as string[]).join(', '));
                return;
            }
            form.setError(key as keyof TestimonioFormType, {
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
      <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editMode ? <PencilIcon className="h-6 w-6" /> : <PlusCircleIcon className="h-6 w-6" />}
            {editMode ? 'Editar Testimonio' : 'Crear Nuevo Testimonio'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={editMode}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un usuario" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {`${user.name} ${user.lastName || ''}`}
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
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calificación (1-5)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comentario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentario</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publicado"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-md border border-neutral-light p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Publicado</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Testimonio')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
