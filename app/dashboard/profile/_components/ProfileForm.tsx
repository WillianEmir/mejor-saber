'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form'; 
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { toast } from 'sonner';

import { UpdateProfileSchema, UpdateProfileType } from '../_lib/profile.schema';
import { updateUser } from '../_lib/profile.actions';

import { Button } from '@/src/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';

interface ProfileFormProps {
  user: UpdateProfileType;
}

export function ProfileForm({ user }: ProfileFormProps) {

  const [image, setimage] = useState(user.image || '');

  const form = useForm<UpdateProfileType>({
    defaultValues: {
      idDocument: user.idDocument || '',
      name: user.name || '',
      lastName: user.lastName || '',
      address: user.address || '',
      department: user.department || '',
      city: user.city || '',
      phone: user.phone || '',
      image: user.image || '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data: UpdateProfileType) {

    const parsedData = UpdateProfileSchema.omit({ id: true }).safeParse(data);

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        if (issue.path && issue.path.length > 0) {
            form.setError(issue.path[0] as any, { message: issue.message });
        }
        toast.error(issue.message);
      });
      return;
    }

    try {
      const response = await updateUser({ ...data, id: user.id, image });
      if (response.success) {
        toast.success('Perfil actualizado correctamente');
      } else {
        toast.error('Error al actualizar el perfil');
      }
    } catch (error) {
      toast.error(`Error al actualizar el perfil: ${error}'`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={image} alt="User image" />
            <AvatarFallback>
              {user.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={(results: CloudinaryUploadWidgetResults) => {
              if (results.event === 'success' && typeof results.info !== 'string' && results.info) {
                setimage(results.info.secure_url);
              }
            }}
          >
            {({ open }) => {
              return (
                <Button type="button" variant="outline" onClick={() => open()}>
                  Cambiar imagen
                </Button>
              );
            }}
          </CldUploadWidget>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="idDocument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documento de identidad</FormLabel>
                <FormControl>
                  <Input placeholder="123456789" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="3001234567" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} value={field.value ?? ''} />
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
                  <Input placeholder="Doe" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Calle 123 # 45 - 67" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <Input placeholder="Antioquia" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input placeholder="Medellín" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Actualizar perfil</Button>
      </form>
    </Form>
  );
}
