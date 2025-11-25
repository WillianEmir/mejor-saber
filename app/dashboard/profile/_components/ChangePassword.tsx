'use client';

import { useForm } from 'react-hook-form'; 
import { useState } from 'react';
import { toast } from 'sonner';

import { changePassword } from '../_lib/changePassword.action';
import { ChangePasswordSchema, ChangePasswordType } from '../_lib/changePassword.schema';

import { Button } from '@/src/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';

export default function ChangePassword() {

  const [loading, setLoading] = useState(false);

  const form = useForm<ChangePasswordType>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '', 
    },
  });

  const onSubmit = async (values: ChangePasswordType) => {

    const parsedData = ChangePasswordSchema.safeParse(values);

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        if (issue.path && issue.path.length > 0) {
            form.setError(issue.path[0] as any, { message: issue.message });
        }
        toast.error(issue.message);
      });
      return;
    }

    setLoading(true);    
 
    try {
      const result = await changePassword(values);

      if (result.success) {
        
        toast.success(result.success);
        form.reset();
        
      } else if (result.error) {
        toast.error(result.error);
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
        <h3 className="text-lg font-medium">Cambiar Contraseña</h3>
        <p className="text-sm text-muted-foreground">
          Actualiza tu contraseña aquí.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-md">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña Actual</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
