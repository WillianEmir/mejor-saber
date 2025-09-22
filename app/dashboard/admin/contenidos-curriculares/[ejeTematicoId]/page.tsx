'use client'

import { Button } from '@/src/components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'
import { CheckCircle, Edit, PlusCircle, Trash2 } from 'lucide-react'

// --- DUMMY DATA ---
const ejeTematico = {
  nombre: 'Células y sus organelos',
  descripcion:
    'Este eje temático se centra en el estudio de la célula como unidad fundamental de la vida, explorando sus estructuras, organelos y las funciones vitales que desempeñan.',
  preguntaTematica:
    '¿Cómo las diferentes estructuras de una célula eucariota trabajan en conjunto para mantener la vida?',
  relevanciaICFES:
    'Comprender la estructura y función celular es crucial para el componente de Biología en la prueba Saber 11, ya que constituye la base para entender procesos más complejos como la genética, el metabolismo y la homeostasis.',
  contenidoCurricular: {
    nombre: 'Biología Celular',
    area: {
      nombre: 'Ciencias Naturales',
    },
  },
  objetivos: [
    {
      id: 'obj1',
      descripcion:
        'Identificar los principales organelos de una célula eucariota y describir su función.',
    },
    {
      id: 'obj2',
      descripcion:
        'Diferenciar entre células procariotas y eucariotas, y entre células animales y vegetales.',
    },
    {
      id: 'obj3',
      descripcion:
        'Explicar el proceso de transporte celular a través de la membrana plasmática.',
    },
  ],
  subtemas: [
    { id: 'sub1', nombre: 'Membrana Plasmática y Transporte' },
    { id: 'sub2', nombre: 'Citoplasma y Citoesqueleto' },
    { id: 'sub3', nombre: 'Núcleo y Material Genético' },
    { id: 'sub4', nombre: 'Organelos Energéticos: Mitocondrias y Cloroplastos' },
  ],
  actividades: [
    {
      id: 'act1',
      nombre: 'Crucigrama de Organelos Celulares',
      tipo: 'RELACIONAR',
    },
    {
      id: 'act2',
      nombre: 'Identifica las partes de la célula',
      tipo: 'IDENTIFICAR',
    },
  ],
}

// --- COMPONENT ---

export default function EjeTematicoDetailPage() {
  // TODO: Implementar modals y su lógica de estado

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-bold">
              {ejeTematico.nombre}
            </CardTitle>
            <CardDescription>
              Administra los detalles y recursos de este eje temático.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar Eje Temático</span>
            </Button>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar Eje Temático</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Detalles del Eje Temático */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Eje Temático</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Área
              </span>
              <span className="text-gray-900 dark:text-white">
                {ejeTematico.contenidoCurricular.area.nombre}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Contenido Curricular
              </span>
              <span className="text-gray-900 dark:text-white">
                {ejeTematico.contenidoCurricular.nombre}
              </span>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-semibold">Descripción</h4>
            <p className="text-gray-700 dark:text-gray-300">
              {ejeTematico.descripcion}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Pregunta Temática Clave</h4>
            <p className="italic text-gray-700 dark:text-gray-300">
              &ldquo;{ejeTematico.preguntaTematica}&rdquo;
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Relevancia para Pruebas ICFES</h4>
            <p className="text-gray-700 dark:text-gray-300">
              {ejeTematico.relevanciaICFES}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Objetivos de Aprendizaje */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Objetivos de Aprendizaje</CardTitle>
            <CardDescription>
              Define qué deben saber los estudiantes al completar este eje.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Objetivo
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {ejeTematico.objetivos.map((objetivo) => (
              <li
                key={objetivo.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {objetivo.descripcion}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Subtemas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Subtemas</CardTitle>
            <CardDescription>
              Organiza el contenido en lecciones o temas más pequeños.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Subtema
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {ejeTematico.subtemas.map((subtema) => (
              <li
                key={subtema.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {subtema.nombre}
                </p>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Actividades Interactivas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Actividades Interactivas</CardTitle>
            <CardDescription>
              Crea ejercicios prácticos para reforzar el aprendizaje.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Actividad
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {ejeTematico.actividades.map((actividad) => (
              <li
                key={actividad.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {actividad.nombre}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    {actividad.tipo}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}