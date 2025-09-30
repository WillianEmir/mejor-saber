import EjeTematicoView from '@/src/components/dashboard/admin-contenidos/eje-tematico-view/EjeTematicoView'
import { getEjeTematicodwithRelations } from '@/src/lib/data/ejeTematico.data'
import { notFound } from 'next/navigation'
import React from 'react'

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
