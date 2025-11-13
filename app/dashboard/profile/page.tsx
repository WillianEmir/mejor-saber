import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

import { ProfileForm } from '@/app/dashboard/profile/_components/ProfileForm';
import { getUserById } from './_lib/profile.data';
import { Separator } from '@/src/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import ChangePasswordPage from './_components/ChangePassword';

export default async function ProfilePage() {

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect('/auth/signin');
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    return redirect('/auth/signin');
  }

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
        <Tabs defaultValue='perfil'>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value='perfil'>Perfil</TabsTrigger>
            <TabsTrigger value='cambiar-contrasena'>Cambiar Contraseña</TabsTrigger>
          </TabsList>
          <TabsContent value='perfil'>
            <ProfileForm user={user} />
          </TabsContent>
          <TabsContent value='cambiar-contrasena'>
            <ChangePasswordPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}