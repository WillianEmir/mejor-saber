'use client'

import { useState, useEffect, useRef } from 'react'

import { ActividadWithProgresoType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/actividadInteractiva.schema'

interface RelacionarActividadProps {
  actividadesRelacionar: ActividadWithProgresoType[]
  progresoInicial: { [key: string]: boolean }
  handleActividadToggle: (actividadId: string) => void
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

export default function ActividadesRelacionar({
  actividadesRelacionar,
  progresoInicial,
  handleActividadToggle,
}: RelacionarActividadProps) {
  const [hasMounted, setHasMounted] = useState(false)
  const [listA, setListA] = useState<ActividadWithProgresoType[]>([])
  const [listB, setListB] = useState<ActividadWithProgresoType[]>([])

  const [selectedItem, setSelectedItem] = useState<{ list: 'A' | 'B'; id: string } | null>(null)
  const [completedPairs, setCompletedPairs] = useState<Record<string, string>>({})
  const [mismatchedPair, setMismatchedPair] = useState<Array<{ list: 'A' | 'B'; id: string }> | null>(null)
  const [lines, setLines] = useState<Array<{ x1: number; y1: number; x2: number; y2: number }>>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    setHasMounted(true)
    setListA(shuffleArray(actividadesRelacionar))
    setListB(shuffleArray(actividadesRelacionar))
  }, [])

  useEffect(() => {
    const initialPairs: Record<string, string> = {}
    actividadesRelacionar.forEach(act => {
      if (progresoInicial[act.id]) {
        initialPairs[act.id] = act.id
      }
    })
    setCompletedPairs(initialPairs)
  }, [actividadesRelacionar, progresoInicial])

  const handleItemClick = (list: 'A' | 'B', id: string) => {
    if (completedPairs[id]) return

    if (!selectedItem) {
      setSelectedItem({ list, id })
      return
    }

    if (selectedItem.list === list) {
      setSelectedItem({ list, id })
      return
    }

    if (selectedItem.id === id) {
      setCompletedPairs(prev => ({ ...prev, [id]: id }))
      if (!progresoInicial[id]) {
        handleActividadToggle(id)
      }
    } else {
      setMismatchedPair([selectedItem, { list, id }])
      setTimeout(() => {
        setMismatchedPair(null)
      }, 500)
    }
    setSelectedItem(null)
  }

  useEffect(() => {
    if (!hasMounted) return

    const calculateLines = () => {
      if (!containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const newLines = Object.keys(completedPairs).map(id => {
        const refA = itemRefs.current[`A-${id}`]
        const refB = itemRefs.current[`B-${id}`]

        if (refA && refB) {
          const rectA = refA.getBoundingClientRect()
          const rectB = refB.getBoundingClientRect()

          return {
            x1: rectA.right - containerRect.left,
            y1: rectA.top + rectA.height / 2 - containerRect.top,
            x2: rectB.left - containerRect.left,
            y2: rectB.top + rectB.height / 2 - containerRect.top,
          }
        }
        return null
      }).filter(Boolean) as Array<{ x1: number; y1: number; x2: number; y2: number }>

      setLines(newLines)
    }

    calculateLines()
    const resizeObserver = new ResizeObserver(calculateLines)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current)
      }
    }
  }, [completedPairs, hasMounted])

  const getItemClassName = (list: 'A' | 'B', id: string) => {
    const isSelected = selectedItem?.list === list && selectedItem?.id === id
    const isCompleted = completedPairs[id]
    const isMismatched = mismatchedPair?.some(item => item.list === list && item.id === id)

    let base = 'p-4 border rounded-md cursor-pointer transition-colors duration-200 '
    if (isCompleted) return base + 'bg-green-100 dark:bg-green-900 border-green-300 cursor-not-allowed'
    if (isSelected) return base + 'bg-blue-100 dark:bg-blue-900 border-blue-400 ring-2 ring-blue-400'
    if (isMismatched) return base + 'bg-red-100 dark:bg-red-900 border-red-400'
    return base + 'bg-white dark:bg-gray-700'
  }

  if (!hasMounted) {
    return (
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <h4 className="font-semibold text-lg mb-4 text-center">Relaciona los Conceptos</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
              Selecciona un concepto de la izquierda y luego su definición correspondiente a la derecha.
            </p>
            <div className="relative grid grid-cols-2 gap-8">
                <div className="space-y-3">
                    {actividadesRelacionar.map(item => (
                        <div key={`A-${item.id}`} className="p-4 border rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse h-16 w-full"></div>
                    ))}
                </div>
                <div className="space-y-3">
                    {actividadesRelacionar.map(item => (
                        <div key={`B-${item.id}`} className="p-4 border rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse h-16 w-full"></div>
                    ))}
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <h4 className="font-semibold text-lg mb-4 text-center">Relaciona los Conceptos</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
          Selecciona un concepto de la izquierda y luego su definición correspondiente a la derecha.
        </p>
        <div ref={containerRef} className="relative grid grid-cols-2 gap-8">
            {/* Columna A */}
            <div className="space-y-3">
                {listA.map(item => (
                    <div
                        key={`A-${item.id}`}
                        ref={el => { itemRefs.current[`A-${item.id}`] = el }}
                        onClick={() => handleItemClick('A', item.id)}
                        className={getItemClassName('A', item.id)}
                    >
                        {item.retroalimentacion} 
                    </div>
                ))}
            </div>

            {/* Columna B */}
            <div className="space-y-3">
                {listB.map(item => (
                    <div
                        key={`B-${item.id}`}
                        ref={el => { itemRefs.current[`B-${item.id}`] = el }}
                        onClick={() => handleItemClick('B', item.id)}
                        className={getItemClassName('B', item.id)}
                    >
                        {item.match}
                    </div>
                ))}
            </div>

            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {lines.map((line, index) => (
                    <line
                        key={index}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="#4ade80" // green-400
                        strokeWidth="2"
                    />
                ))}
            </svg>
        </div>
    </div>
  )
}