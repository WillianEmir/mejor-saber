import Simulacrum from '@/src/components/dashboard/simulacrum/Simulacrum';
import { getAreas, getAreasFull } from '@/src/lib/data/areas.data';
import { AreasFullType } from '@/src/lib/schemas/area.schema';

export default async function Simulacros() {

  const areas : AreasFullType[] = await getAreasFull();

  return (
    <>
      <Simulacrum areas={areas} />
    </>
  );
}
