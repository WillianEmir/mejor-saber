
'use client'; 

import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form'; 
import { toast } from 'sonner';
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

import { createOrUpdateSchool } from '@/app/dashboard/admin/schools/_lib/school.actions';
import { SchoolSchema, SchoolType } from '@/app/dashboard/admin/schools/_lib/school.schema';

import { Button } from '@/src/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';

interface SchoolModalProps { 
  school?: SchoolType;
  isOpen: boolean;
  onClose: () => void;
}

export default function SchoolModal({ school, isOpen, onClose }: SchoolModalProps) {
  const [isPending, startTransition] = useTransition();
  const editMode = !!school?.id;

  const form = useForm<SchoolType>({
    defaultValues: {
      id: school?.id || undefined,
      nombre: school?.nombre || '',
      DANE: school?.DANE || '',
      email: school?.email || '',
      address: school?.address || '',
      department: school?.department || '',
      city: school?.city || '',
      maxUsers: school?.maxUsers || 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: school?.id || undefined,
        nombre: school?.nombre || '',
        DANE: school?.DANE || '',
        email: school?.email || '',
        address: school?.address || '',
        department: school?.department || '',
        city: school?.city || '',
        maxUsers: school?.maxUsers || 0,
      });
    } 
  }, [isOpen, school, form]);

  const onSubmit = (data: SchoolType) => {

    const parsedData = SchoolSchema.safeParse(data)

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
    formData.append('email', data.email || '');
    if (data.address) formData.append('address', data.address);
    if (data.department) formData.append('department', data.department);
    if (data.city) formData.append('city', data.city);
    if (data.maxUsers) formData.append('maxUsers', data.maxUsers.toString());

    startTransition(async () => {
      const result = await createOrUpdateSchool(formData);
      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            form.setError(key as keyof SchoolType, {
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
            {editMode ? 'Editar Institución' : 'Crear Nueva Institución'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {editMode && <input type="hidden" {...form.register('id')} />}

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la institución" {...field} />
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
                    <Input placeholder="Código DANE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email de la institución" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-3'>
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <Input placeholder="Departamento" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ciudad" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maxUsers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máximo de Usuarios</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Número máximo de usuarios" {...field} value={field.value ?? 0} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
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
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Institución')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
