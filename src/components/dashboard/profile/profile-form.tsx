'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/src/components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { updateUser } from '@/src/lib/actions/user.action';
import { toast } from 'react-toastify';
import { UpdateProfileType } from '@/src/lib/schemas/user.schema';
import { useSession } from 'next-auth/react';

const profileFormSchema = z.object({
  idDocument: z.string().min(2, {
    message: 'El documento de identidad debe tener al menos 2 caracteres.',
  }),
  firstName: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  lastName: z.string().min(2, {
    message: 'El apellido debe tener al menos 2 caracteres.',
  }),
  address: z.string().min(2, {
    message: 'La dirección debe tener al menos 2 caracteres.',
  }),
  department: z.string().min(2, {
    message: 'El departamento debe tener al menos 2 caracteres.',
  }),
  city: z.string().min(2, {
    message: 'La ciudad debe tener al menos 2 caracteres.',
  }),
  phone: z.string().min(2, {
    message: 'El teléfono debe tener al menos 2 caracteres.',
  }),
  avatar: z.string().optional(),
});

interface ProfileFormProps {
  user: UpdateProfileType;
}

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ user }: ProfileFormProps) {
  const { data: session, update} = useSession();
  const [avatar, setAvatar] = useState(user.avatar || '');
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema), defaultValues: {
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

  async function onSubmit(data: ProfileFormValues) {
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
                  <Input placeholder="123456789" {...field} />
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
                  <Input placeholder="3001234567" {...field} />
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
                  <Input placeholder="John" {...field} />
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
                  <Input placeholder="Doe" {...field} />
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
                <Input placeholder="Calle 123 # 45 - 67" {...field} />
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
                  <Input placeholder="Antioquia" {...field} />
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
                  <Input placeholder="Medellín" {...field} />
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
