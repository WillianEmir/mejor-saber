import { useState, useEffect, useMemo } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, useDroppable, useDraggable } from '@dnd-kit/core'

// Types
import { ActividadWithProgresoType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/actividadInteractiva.schema'

interface RelacionarActividadProps {
  actividadesIdentificar: ActividadWithProgresoType[]; 
  progresoInicial: { [key: string]: boolean };
  handleActividadToggle: (actividadId: string) => void;
}

// Función para barajar un array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export default function ActividadesIdentificar({ actividadesIdentificar, progresoInicial, handleActividadToggle }: RelacionarActividadProps) {
  
  // Estado para las columnas de retroalimentación (desordenadas) y match (ordenadas)
  const [retroalimentacionItems, setRetroalimentacionItems] = useState<ActividadWithProgresoType[]>([])
  const matchItems = useMemo(() => actividadesIdentificar, [actividadesIdentificar])

  // Estado para los emparejamientos correctos
  const [completedPairs, setCompletedPairs] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    // Barajar las actividades solo una vez al montar el componente
    setRetroalimentacionItems(shuffleArray(actividadesIdentificar))

    // Inicializar los pares completados desde el progreso
    const initialPairs: { [key: string]: string } = {}
    actividadesIdentificar.forEach(act => {
      if (progresoInicial[act.id]) {
        initialPairs[act.id] = act.id
      }
    })
    setCompletedPairs(initialPairs)
  }, [actividadesIdentificar, progresoInicial])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id === over.id) {
      const actividadId = active.id as string

      if (!completedPairs[actividadId]) {
        setCompletedPairs(prev => ({ ...prev, [actividadId]: actividadId }))
        handleActividadToggle(actividadId)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <h4 className="font-semibold text-lg mb-4 text-center">
          Relaciona los conceptos
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
          Arrastra la retroalimentación de la columna izquierda a su concepto correspondiente en la columna derecha.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Columna de Retroalimentaciones (Draggables) */}
          <div>
            <h5 className="font-bold mb-4 text-center text-gray-700 dark:text-gray-200">Conceptos</h5>
            <div className="space-y-3">
              {retroalimentacionItems.map(item => {
                if (completedPairs[item.id]) {
                  return null // O un placeholder que indique que ya fue completado
                }
                return <DraggableItem key={item.id} id={item.id} content={item.retroalimentacion} />
              })}
            </div>
          </div>

          {/* Columna de Matches (Droppables) */}
          <div>
            <h5 className="font-bold mb-4 text-center text-gray-700 dark:text-gray-200">Definiciones</h5>
            <div className="space-y-3">
              {matchItems.map(item => (
                <DroppableItem
                  key={item.id}
                  id={item.id}
                  content={item.match}
                  isCompleted={!!completedPairs[item.id]}
                  completedBy={completedPairs[item.id]}
                  items={actividadesIdentificar}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  )
}

// --- Componentes Draggable y Droppable ---

function DraggableItem({ id, content }: { id: string; content: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 100 : 'auto',
    cursor: 'grab',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-4 border rounded-md shadow-sm bg-white dark:bg-gray-700'}`}
    >
      {content}
    </div>
  )
}

function DroppableItem({ id, content, isCompleted, completedBy, items }: { id: string; content: string; isCompleted: boolean; completedBy: string | null; items: ActividadWithProgresoType[] }) {

  const { setNodeRef, isOver } = useDroppable({ id })

  const completedItem = completedBy ? items.find(item => item.id === completedBy) : null

  return (
    <div
      ref={setNodeRef}
      className={`p-4 border rounded-md min-h-[60px] flex items-center justify-center text-center
        ${isOver ? 'border-primary ring-2 ring-primary' : 'border-dashed'}
        ${isCompleted ? 'border-solid bg-green-100 dark:bg-green-900 border-green-300' : 'bg-gray-100 dark:bg-gray-900'}`}
    >
      {isCompleted && completedItem ? (
        <span className="text-green-800 dark:text-green-200">{completedItem.retroalimentacion}</span>
      ) : (
        <span>{content}</span>
      )}
    </div>
  )
}
