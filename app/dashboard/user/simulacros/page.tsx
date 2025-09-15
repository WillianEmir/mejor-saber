import Simulacrum from '@/src/components/dashboard/simulacrum/Simulacrum';
import { getAreasWithRelations } from '@/src/lib/data/areas.data';

export default async function Simulacros() {

  const areas = await getAreasWithRelations(); 

  return (
    <>
      <Simulacrum areas={areas} />
    </>
  );
}
