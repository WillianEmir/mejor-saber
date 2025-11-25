import { auth } from '@/auth';
import { notFound, redirect } from 'next/navigation';

import { getUserProfileById, isUserPassword } from './_lib/profile.data';

import { ProfileForm } from '@/app/dashboard/profile/_components/ProfileForm';
import { Separator } from '@/src/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import ChangePasswordPage from './_components/ChangePassword';
import CreatePasswordPage from './_components/CreatePassword';

export default async function ProfilePage() { 
  
  const session = await auth();

  if (!session?.user) {
    return redirect('/auth/signin');
  }

  const user = await getUserProfileById(session.user.id);

  if(!user) {
    return redirect('/auth/signin');
  }

  const hasPassword = await isUserPassword(session.user.id);

  return (
    <div className="space-y-6 p-4 md:p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight dark:text-neutral-light">Configuración</h2>
        <p className="dark:text-neutral-light">
          Gestiona la configuración de tu cuenta.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8">
        <Tabs defaultValue="perfil">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            {hasPassword ? (
              <TabsTrigger value="cambiar-contrasena">Cambiar Contraseña</TabsTrigger>
            ) : (
              <TabsTrigger value="crear-contrasena">Crear Contraseña</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="perfil">
            <ProfileForm user={user} />
          </TabsContent>
          {hasPassword ? (
            <TabsContent value="cambiar-contrasena">
              <ChangePasswordPage />
            </TabsContent>
          ) : (
            <TabsContent value="crear-contrasena">
              <CreatePasswordPage />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}