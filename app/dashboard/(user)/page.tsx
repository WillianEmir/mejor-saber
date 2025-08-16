import React from 'react'

export default function page() {
  return (
    <>
      <h2 className='text-2xl'>Punto de entrada personalizado para el usuario</h2>
      <br />
      <div>
        <ul className='list-disc'>
          <li>Resumen de progreso (puntaje global estimado, avance en temas)</li>
          <li>próxima recomendación de estudio</li>
          <li>acceso rápido a simulacros y material pendiente</li>
          <li>notificaciones</li>
        </ul>
      </div>
    </>
  )
}
