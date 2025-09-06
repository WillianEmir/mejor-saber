import AreaView from '@/src/components/dashboard/admin-areas/area-view/AreaView'
import { getAreaById } from '@/src/lib/data/areas.data';
import { notFound } from 'next/navigation';
import { ToastContainer } from 'react-toastify';

interface pageProps {
  params: Promise<{
    id: string 
  }>
}

export default async function page({ params }: pageProps) {

  const { id } = await params;

  const area = await getAreaById(id)

  if(!area) notFound();
  
  return (
    <>
      <AreaView
        area={area}
      />
      <ToastContainer />
    </>
  )
}
