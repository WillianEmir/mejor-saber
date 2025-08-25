'use client'

// import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
// import Link from 'next/link';

// // Basado en el modelo de Prisma
// type OpcionRespuesta = {
//   estado: boolean;
//   retroalimentacion: string;
//   [key: string]: any; //TODO: Para permitir claves dinámicas como 'a', 'b', etc.
// }

// type Pregunta = {
//   id: string;
//   contexto: string;
//   imagen?: string | null;
//   enunciado: string;
//   opciones: OpcionRespuesta[];
//   area: string;
//   evidenciaId: string;
// };

// // Datos de ejemplo para simular la información de la base de datos
// const preguntas: Pregunta[] = [
//   {
//     id: 'uuid-1',
//     contexto: 'Un estudiante quiere saber cuánta agua cabe en una botella cilíndrica. Mide el radio de la base (5 cm) y la altura (20 cm).',
//     enunciado: '¿Cuál es el volumen de la botella si se utiliza la fórmula V = π * r^2 * h?',
//     opciones: [
//         { a: '', estado: false, retroalimentacion: '' },
//         { b: '', estado: false, retroalimentacion: '' },
//         { c: '', estado: true, retroalimentacion: '' },
//         { d: '', estado: false, retroalimentacion: '' }
//       ],
//     area: 'Matemáticas',
//     evidenciaId: 'ev-mat-01',
//   },
//   {
//     id: 'uuid-2',
//     contexto: 'Fragmento de "El coronel no tiene quien le escriba" de Gabriel García Márquez.',
//     enunciado: '¿Cuál es el tema principal que se explora en el fragmento presentado?',
//     opciones: [
//         { a: '', estado: false, retroalimentacion: '' },
//         { b: '', estado: false, retroalimentacion: '' },
//         { c: '', estado: true, retroalimentacion: '' },
//         { d: '', estado: false, retroalimentacion: '' }
//       ],
//     area: 'Lectura Crítica',
//     evidenciaId: 'ev-lc-01',
//   },
//   {
//     id: 'uuid-3',
//     contexto: 'Un circuito eléctrico simple consta de una batería de 9V y una resistencia de 3Ω.',
//     enunciado: 'Según la Ley de Ohm (I = V/R), ¿cuál es la corriente que fluye por el circuito?',
//     opciones: [
//         { a: '', estado: false, retroalimentacion: '' },
//         { b: '', estado: false, retroalimentacion: '' },
//         { c: '', estado: true, retroalimentacion: '' },
//         { d: '', estado: false, retroalimentacion: '' }
//       ],
//     area: 'Ciencias Naturales',
//     evidenciaId: 'ev-cn-01',
//   },
// ];

// export default function AdminPreguntas() {
//   const handleEdit = (id: string) => {
//     console.log(`Editar pregunta con ID: ${id}`);
//     // Aquí iría la lógica para abrir un modal de edición o navegar a una página de edición
//   };

//   const handleDelete = (id: string) => {
//     console.log(`Eliminar pregunta con ID: ${id}`);
//     // Aquí iría la lógica para mostrar una confirmación y luego eliminar la pregunta
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <div className="sm:flex sm:items-center">
//         <div className="sm:flex-auto">
//           <h1 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">Administración de Preguntas</h1>
//           <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
//             Una lista de todas las preguntas en la base de datos, incluyendo su enunciado y campo de evaluación.
//           </p>
//         </div>
//         <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
//           <Link
//             href='/dashboard/admin/preguntas/crear'
//             type="button"
//             className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//           >
//             Agregar Pregunta
//           </Link>
//         </div>
//       </div>
//       <div className="mt-8 flow-root">
//         <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//           <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//             <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
//               <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
//                 <thead className="bg-gray-50 dark:bg-gray-800">
//                   <tr>
//                     <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
//                       Contexto y Enunciado
//                     </th>
//                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
//                       Área
//                     </th>
//                     <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
//                       <span className="sr-only">Acciones</span>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-900">
//                   {preguntas.map((pregunta) => (
//                     <tr key={pregunta.id}>
//                       <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
//                         <div className="font-medium text-gray-900 dark:text-white">{pregunta.contexto}</div>
//                         <div className="mt-1 text-gray-500 dark:text-gray-400">{pregunta.enunciado}</div>
//                       </td>
//                       <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
//                         <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/10 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">
//                           {pregunta.area}
//                         </span>
//                       </td>
//                       <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
//                         <div className="flex justify-end gap-x-4">
//                           <button
//                             onClick={() => handleEdit(pregunta.id)}
//                             className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
//                           >
//                             <PencilIcon className="h-5 w-5 mr-1" />
//                             Editar<span className="sr-only">, {pregunta.id}</span>
//                           </button>
//                           <button
//                             onClick={() => handleDelete(pregunta.id)}
//                             className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
//                           >
//                             <TrashIcon className="h-5 w-5 mr-1" />
//                             Eliminar<span className="sr-only">, {pregunta.id}</span>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react'

export default function AdminPreguntas() {
  return (
    <div>AdminPreguntas</div>
  )
}
