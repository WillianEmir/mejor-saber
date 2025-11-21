
'use client';

import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/src/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { SchoolSede } from '@/src/generated/prisma';
import { UserSchoolModal, UserSchoolSchema } from '../_lib/schema';
import { createOrUpdateUser } from '../_lib/actions';
import { UserSchoolType } from '../_lib/school.schema';

interface UserModalProps {
  user?: UserSchoolType;
  schoolId: string;
  sedes: SchoolSede[];
  isOpen: boolean;
  onClose: () => void;
} 

const gradeNumbers = ['9', '10', '11'];
const gradeLetters = Array.from({ length: 12 }, (_, i) => String.fromCharCode('a'.charCodeAt(0) + i));

export default function UserModal({ user, schoolId, sedes, isOpen, onClose }: UserModalProps) {
  const [isPending, startTransition] = useTransition();
  const editMode = !!user?.id;

  const form = useForm<UserSchoolModal>({
    defaultValues: {
      id: user?.id || undefined,
      name: user?.name || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      idDocument: user?.idDocument || '',
      schoolId: schoolId,
      role: user?.role as 'USER' | 'DOCENTE' || 'USER',
      schoolSedeId: user?.schoolSedeId || undefined,
      gradeNumber: user?.degree?.match(/\d+/)?.[0] || '',
      gradeLetter: user?.degree?.match(/[a-zA-Z]+/)?.[0] || '',
    },
  });

  const gradeNumber = form.watch('gradeNumber');
  const gradeLetter = form.watch('gradeLetter');

  useEffect(() => {
    if (gradeNumber && gradeLetter) {
      form.setValue('degree', `${gradeNumber}${gradeLetter}`);
    } else {
      form.setValue('degree', '');
    }
  }, [gradeNumber, gradeLetter, form]);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: user?.id || undefined,
        name: user?.name || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        idDocument: user?.idDocument || '',
        schoolId: schoolId,
        role: user?.role as 'USER' | 'DOCENTE' || 'USER',
        schoolSedeId: user?.schoolSedeId || undefined,
        gradeNumber: user?.degree?.match(/\d+/)?.[0] || '',
        gradeLetter: user?.degree?.match(/[a-zA-Z]+/)?.[0] || '',
      });
    }
  }, [isOpen, user, form, schoolId]);

  const onSubmit = (data: UserSchoolModal) => {
    
    const parsedData = UserSchoolSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData();
    if (data.id) formData.append('id', data.id);
    formData.append('name', data.name);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    if (data.idDocument) formData.append('idDocument', data.idDocument);
    formData.append('schoolId', data.schoolId);
    formData.append('role', data.role);
    if (data.gradeNumber && data.gradeLetter) formData.append('degree', `${data.gradeNumber} - ${data.gradeLetter}`);
    if (data.schoolSedeId) formData.append('schoolSedeId', data.schoolSedeId);

    startTransition(async () => {
      const result = await createOrUpdateUser(formData);
      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editMode ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
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
                    <Input type="email" {...field} />
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
                  <FormLabel>Número de Documento</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gradeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Número" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gradeNumbers.map(num => (
                          <SelectItem key={num} value={num}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gradeLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curso</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Letra" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gradeLetters.map(letter => (
                          <SelectItem key={letter} value={letter}>{letter.toUpperCase()}</SelectItem>
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
              name="schoolSedeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sede</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una sede" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sedes.map(sede => (
                        <SelectItem key={sede.id} value={sede.id}>{sede.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USER">Estudiante</SelectItem>
                      <SelectItem value="DOCENTE">Docente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Guardando...' : 'Guardar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
