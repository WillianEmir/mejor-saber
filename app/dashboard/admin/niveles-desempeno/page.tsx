import { getNivelesDesempeno,  } from './_lib/NivelesDesempeño.data'
import { getAreas } from '../areas/_lib/area.data';

import NivelesDesempeno from './_components/NivelesDesempeno'
import { notFound } from 'next/navigation';

export default async function page() {

  const [niveles, areas] = await Promise.all([getNivelesDesempeno(), getAreas()]);

  if(!niveles || !areas) notFound();

  return (
    <NivelesDesempeno niveles={niveles} areas={areas} />
  )
} 
