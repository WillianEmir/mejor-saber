import ReactPlayer from 'react-player'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/src/components/ui/accordion'
import { Checkbox } from '@/src/components/ui/checkbox';

import { SubTemaType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/subTema.schema'; 

interface ConceptosClaveProps {
  subtema: SubTemaType;
  progreso: { [key: string]: boolean };
  handleSubTemaToggle: (subTemaId: string) => void;
  isPending: boolean;
}

export default function ConceptosClave({ subtema, progreso, handleSubTemaToggle, isPending}: ConceptosClaveProps) {
  return (
    <Accordion type="single" collapsible defaultValue={`${subtema.id}`} className="w-full">
      <AccordionItem value={`subtema-${subtema.id}`} className="rounded-md border bg-white dark:bg-gray-800 p-3">
        <div className="flex items-center">
          <div onClick={(e) => e.stopPropagation()} className="mr-3">
            <Checkbox
              checked={progreso[subtema.id] || false}
              onCheckedChange={() => handleSubTemaToggle(subtema.id)}
              disabled={isPending}
              className="h-5 w-5"
            />
          </div>
          <AccordionTrigger className="text-left font-semibold hover:no-underline">
            {subtema.nombre}
          </AccordionTrigger>
        </div>

        <AccordionContent className="p-4 pt-0">
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold mb-1">Descripción</h5>
              <p className="text-gray-600 dark:text-gray-300">{subtema.descripcion}</p>
            </div>
            {subtema.ejemplo && (
              <div>
                <h5 className="font-semibold mb-1">Ejemplo</h5>
                <p className="text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">{subtema.ejemplo}</p>
              </div>
            )}
            {(subtema.imagen || subtema.video) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subtema.imagen && (
                  <div className="space-y-2">
                    <h5 className="font-semibold">Imagen</h5>
                    <img src={subtema.imagen} alt={`Imagen para ${subtema.nombre}`} className="rounded-md object-cover w-full" />
                  </div>
                )}
                {subtema.video && (
                  <div className="space-y-2">
                    <h5 className="font-semibold">Video</h5>
                    <div className="player-wrapper rounded-md overflow-hidden">
                      <ReactPlayer
                        className="react-player"
                        src={subtema.video}
                        width="100%"
                        height="100%"
                        controls={true}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
