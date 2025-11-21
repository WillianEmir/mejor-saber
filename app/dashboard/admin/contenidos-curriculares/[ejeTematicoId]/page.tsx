import { notFound } from 'next/navigation'

import { getEjeTematicodwithRelations } from '@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.data'

import EjeTematicoView from '@/app/dashboard/admin/contenidos-curriculares/_components/ejes/EjeTematicoView'

interface pageProps {
  params: Promise<{
    ejeTematicoId: string
  }>
}

export default async function page({params} : pageProps) {

  const {ejeTematicoId} = await params

  const ejeTematico = await getEjeTematicodwithRelations(ejeTematicoId)
  
  if(!ejeTematico) notFound()

  return (
    <>
      <EjeTematicoView
        ejeTematico={ejeTematico}
      />
    </>
  )
}
