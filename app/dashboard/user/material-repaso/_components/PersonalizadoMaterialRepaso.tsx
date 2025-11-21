import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

import { getMaterialPersonalizadoByUserId } from '../_lib/progreso.data';

import MaterialRepaso from './MaterialRepaso';

export default async function PersonalizadoMaterialRepaso() {

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/signin')

  const areasWithProgress = await getMaterialPersonalizadoByUserId(session.user.id);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
        Material de Repaso Personalizado
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-1">
        Aquí encontrarás material de repaso personalizado, basado en los temas de las preguntas que has respondido incorrectamente en los simulacros. ¡Refuerza tus conocimientos y sigue mejorando!
      </p>
      {areasWithProgress.length > 0 ? (
        <MaterialRepaso areas={areasWithProgress} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
          <div className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">
            ¡Aún no hay material personalizado para ti!
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Realiza algunos simulacros para que podamos identificar las áreas en las que necesitas un poco más de ayuda.
          </p>
        </div>
      )}
    </div>
  );
}
