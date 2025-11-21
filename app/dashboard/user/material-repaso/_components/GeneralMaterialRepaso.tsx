import { getServerSession } from 'next-auth'; 
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

import { getMaterialRepasoByUserId } from '../_lib/progreso.data'; 

import MaterialRepaso from './MaterialRepaso';

export default async function GeneralMaterialRepaso() {

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/signin');

  const areasWithProgress = await getMaterialRepasoByUserId(session.user.id);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
        Material de Repaso
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-1">
        Explora los temas, revisa el contenido y prepárate para tus pruebas.
      </p>
      <MaterialRepaso areas={areasWithProgress} />
    </div> 
  );
}
