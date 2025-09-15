import SimulacrumArea from '@/src/components/dashboard/simulacrum/SimulacrumArea';
import prisma from '@/src/lib/prisma';
import { notFound } from 'next/navigation';

async function getAreaById(id: string) {
  const area = await prisma.area.findUnique({
    where: {
      id: id,
    },
    include: {
      competencias: true,
    },
  }); 

  if (!area) {
    notFound();
  }

  return area;
}

interface pageProps {
  params: Promise<{
    areaId: string
  }>
}

export default async function Page({ params }: pageProps) {

  const {areaId} = await params;

  const area = await getAreaById(areaId);

  if(!area) notFound() 

  return (
    <>
      <SimulacrumArea area={area} />
    </>
  );
}
 