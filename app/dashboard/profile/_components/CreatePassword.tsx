'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';

import { createPassword } from '../_lib/createPassword.action';
import { CreatePasswordSchema, CreatePasswordType } from '../_lib/createPassword.schema';

import { Button } from '@/src/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';

export default function CreatePasswordPage() {

  const [loading, setLoading] = useState(false);

  const form = useForm<CreatePasswordType>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: CreatePasswordType) => {

    const parsedData = CreatePasswordSchema.safeParse(values);

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        if (issue.path && issue.path.length > 0 && (issue.path[0] === 'newPassword' || issue.path[0] === 'confirmPassword')) {
          form.setError(issue.path[0], { message: issue.message });
        }
        toast.error(issue.message);
      });
      return;
    }

    setLoading(true);

    try {
      const result = await createPassword(values);

      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else if (!result.success) {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Ocurrió un error inesperado: ${error}`);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="space-y-6">
      <div className='dark:text-neutral-light'>
        <h3 className="text-lg font-medium">Crear Contraseña</h3>
        <p className="text-sm text-muted-foreground">
          Crea una contraseña para tu cuenta.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-md">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nueva Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Contraseña'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
