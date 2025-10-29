import { CheckCircle2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";

import ConceptosClave from "./ConceptosClave";
import ActividadesRelacionar from "./ActividadesRelacionar";
import ActividadesGrafico from "./ActividadesGrafico";
import ActividadesIdentificar from "./ActividadesIdentificar";

import { SeccionWithRelationsType } from "@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.schema";

interface EjeTematicoSeccionesProps {  
  seccion: SeccionWithRelationsType; 
  progreso: { [key: string]: boolean };
  handleSubTemaToggle: (subTemaId: string) => void;
  handleActividadToggle: (actividadId: string) => void; 
  isPending: boolean;
}

export default function EjeTematicoSecciones({ seccion, progreso, handleSubTemaToggle, handleActividadToggle, isPending }: EjeTematicoSeccionesProps) {

  const isCompleted = seccion.progresos.length > 0 && seccion.progresos[0].completada

  return (

    <Accordion type="single" collapsible defaultValue={`${seccion.nombre}`} className="mb-8 w-full">
      <AccordionItem
        value={`${seccion.nombre}`}
        className='border rounded-md border-neutral-light hover:border-primary bg-white shadow dark:bg-neutral-dark transition-colors duration-300'
      >
        <AccordionTrigger className="text-xl pl-2 font-semibold hover:no-underline bg-primary/20 rounded-md">
          <div className="flex items-center gap-x-2">
            {isCompleted && <CheckCircle2 className="h-6 w-6 text-green-500" />}
            <span>{seccion.nombre}</span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="p-4 space-y-3">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            {seccion.descripcion}
          </p>

          {seccion.subTemas.length > 0 && seccion.subTemas.map(subtema => (
            <ConceptosClave
              progreso={progreso}
              handleSubTemaToggle={handleSubTemaToggle}
              isPending={isPending}
              subtema={subtema}
              key={subtema.id}
            />
          ))}

          {seccion.actividades.length > 0 && (() => {
            const actividadesIdentificar = seccion.actividades.filter(a => a.tipo === 'IDENTIFICAR');
            
            return (
              <div className="mt-6 space-y-4">
                {actividadesIdentificar.length > 0 && (
                  <ActividadesIdentificar
                    actividadesIdentificar={actividadesIdentificar}
                    progresoInicial={progreso}
                    handleActividadToggle={handleActividadToggle}
                  />
                )}
              </div>
            );
          })()}

          {seccion.actividades.length > 0 && (() => {
            const actividadesRelacionar = seccion.actividades.filter(a => a.tipo === 'RELACIONAR');

            return (
              <div className="mt-6 space-y-4">
                {actividadesRelacionar.length > 0 && (
                  <ActividadesRelacionar
                    actividadesRelacionar={actividadesRelacionar}
                    progresoInicial={progreso}
                    handleActividadToggle={handleActividadToggle}
                  />
                )}
              </div>
            )
          })()}

          {seccion.actividades.length > 0 && (() => {
            const actividadesGrafico = seccion.actividades.filter(a => a.tipo === 'GRAFICO');

            return (
              <div className="mt-6 space-y-4">
                {actividadesGrafico.length > 0 && (
                  <ActividadesGrafico
                    actividadesGrafico={actividadesGrafico}
                    progresoInicial={progreso}
                    handleActividadToggle={handleActividadToggle}
                  />
                )}
              </div>
            )
          })()}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}