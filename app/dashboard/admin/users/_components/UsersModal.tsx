'use client';

import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

import { upsertUser } from '@/app/dashboard/admin/users/_lib/user.action';
import { UpsertUserSchema, UpsertUserType, UserType } from '@/app/dashboard/admin/users/_lib/user.schema';
import { Role } from '@/src/generated/prisma';

import { Button } from '@/src/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Switch } from '@/src/components/ui/switch';

interface UsersModalProps { 
  user?: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  schools: { id: string; nombre: string }[];
}

export default function UsersModal({ user, isOpen, onClose, schools }: UsersModalProps) {
  const [isPending, startTransition] = useTransition();
  const editMode = !!user?.id;

  const form = useForm<UpsertUserType>({ 
    defaultValues: {
      id: user?.id || undefined,
      name: user?.name || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      role: user?.role || Role.USER,
      isActive: user?.isActive ?? true,
      schoolId: user?.schoolId || undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: user?.id || undefined,
        name: user?.name || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        role: user?.role || Role.USER,
        isActive: user?.isActive ?? true,
        schoolId: user?.schoolId || undefined,
      });
    }
  }, [isOpen, user, form]);

  const onSubmit = (data: UpsertUserType) => {
    const parsedData = UpsertUserSchema.safeParse(data);

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message);
      });
      return;
    }

    const formData = new FormData();
    if (parsedData.data.id) formData.append('id', parsedData.data.id);
    formData.append('name', parsedData.data.name);
    formData.append('lastName', parsedData.data.lastName);
    formData.append('email', parsedData.data.email);
    formData.append('role', parsedData.data.role);
    formData.append('isActive', String(parsedData.data.isActive));
    if (parsedData.data.schoolId) formData.append('schoolId', parsedData.data.schoolId);

    startTransition(async () => {
      const result = await upsertUser(formData);
      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            form.setError(key as keyof UpsertUserType, {
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
            {editMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <input type="hidden" {...form.register('id')} />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del usuario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Apellido del usuario" {...field} />
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
                    <Input type="email" placeholder="Email del usuario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Role).map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schoolId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escuela</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una escuela" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {schools.map(school => (
                        <SelectItem key={school.id} value={school.id}>{school.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-md border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Activo</FormLabel>
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
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Usuario')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}