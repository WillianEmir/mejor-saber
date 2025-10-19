'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/src/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { UpdateProfileSchema, UpdateProfileType } from '../lib/profile.schema';
import { toast } from 'sonner';
import { updateUser } from '../lib/profile.actions';

interface ProfileFormProps {
  user: UpdateProfileType;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { data: session, update } = useSession();
  const [avatar, setAvatar] = useState(user.avatar || '');

  const form = useForm<UpdateProfileType>({
    defaultValues: {
      idDocument: user.idDocument || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      address: user.address || '',
      department: user.department || '',
      city: user.city || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data: UpdateProfileType) {

    const parsedData = UpdateProfileSchema.omit({ id: true }).safeParse(data);

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message);
      });
      return;
    }

    try {
      const response = await updateUser({ ...data, id: user.id, avatar });
      if (response.success && response.user) {
        await update({
          ...response.user,
        });
        toast.success('Perfil actualizado correctamente');
      } else {
        toast.error('Error al actualizar el perfil');
      }
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatar} alt="User avatar" />
            <AvatarFallback>
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={(result: any) => {
              setAvatar(result.info.secure_url);
            }}
          >
            {({ open }) => {
              return (
                <Button type="button" variant="outline" onClick={() => open()}>
                  Subir imagen
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
            name="firstName"
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
