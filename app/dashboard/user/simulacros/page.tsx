import Simulacrum from '@/src/components/dashboard/simulacrum/Simulacrum';
import SimulacrumArea from '@/src/components/dashboard/simulacrum/SimulacrumArea';
import SimulacrumResult from '@/src/components/dashboard/simulacrum/SimulacrumResult';
import { getSimulacroResult, getSimulacrosHistory } from '@/src/lib/data/simulacros.data';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getAreas, getAreaWithRelationsById } from '@/src/lib/data/areas.data';

export default async function Simulacros({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { view, id, areaId } = searchParams;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (view === 'result' && typeof id === 'string') {
    const simulacroPreguntas = await getSimulacroResult(id);
    return <SimulacrumResult simulacroPreguntas={simulacroPreguntas} />;
  }

  if (typeof areaId === 'string') {
    const area = await getAreaWithRelationsById(areaId);
    if (!area) {
      return <div>Área no encontrada</div>;
    }
    return <SimulacrumArea area={area} />;
  }

  if (!userId) {
    return <div>Inicia sesión para ver tu historial de simulacros.</div>;
  }

  const areas = await getAreas();
  const simulacros = await getSimulacrosHistory(userId);

  return <Simulacrum areas={areas} simulacros={simulacros} />;
}
