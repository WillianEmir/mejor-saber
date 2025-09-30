'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';

import { Input } from '@/src/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { UpsertUserSchoolSchema, UpsertUserSchoolType, UserType } from '@/src/lib/schemas/user.schema';
import { upsertUserByAdminSchool } from '@/src/lib/actions/user.action';
import { useCurrentUser } from '@/src/hooks/use-current-user';
import { toast } from 'react-toastify';
import { Button } from '../../ui/Button';


interface UserSchoolModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user?: UserType | undefined;
}

export default function UserSchoolModal({ isOpen, setIsOpen, user }: UserSchoolModalProps) {
  
  const currentUser = useCurrentUser();

  const form = useForm<UpsertUserSchoolType>({
    resolver: zodResolver(UpsertUserSchoolSchema),
    defaultValues: {
      id: user?.id,
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      idDocument: user?.idDocument || '',
    },
  });

  const onSubmit = async (data: UpsertUserSchoolType) => {
    if (!currentUser?.schoolId) {
      toast.error('No se pudo obtener el ID de la escuela.');
      return;
    }

    const result = await upsertUserByAdminSchool(data, currentUser.schoolId );

    if (result.success) {
      toast.success(result.message);
      setIsOpen(false);
    } else {
      toast.error(result.message || 'Ocurrió un error inesperado.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        aria-describedby='modal-title'
        aria-description='modal-description'
      >
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {user && <input type="hidden" {...form.register('id')} />}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idDocument"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento de Identidad</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{user ? 'Guardar Cambios' : 'Crear Usuario'}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}