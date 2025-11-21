import React from 'react'
import { SedeList } from './_components/SedeList'
import { getSedesBySchool } from './_lib/sede.data'

export default async function SedesPage() {
  const sedes = await getSedesBySchool()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Sedes</h1>
      <SedeList sedes={sedes} />
    </div>
  )
}