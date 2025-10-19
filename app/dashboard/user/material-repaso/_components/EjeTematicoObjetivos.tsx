import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";
import { ObjetivoAprendizaje } from "@/src/generated/prisma";

interface EjeTematicoObjetivosProps {
  objetivosAprendizaje: ObjetivoAprendizaje[];
}

export default function EjeTematicoObjetivos({objetivosAprendizaje} : EjeTematicoObjetivosProps) {
  return (
    <Accordion type="single" collapsible defaultValue="objetivos" className="mb-8 w-full ">
      <AccordionItem value="objetivos" className='border rounded-md border-neutral-light hover:border-primary bg-white shadow dark:bg-neutral-dark transition-colors duration-300'>
          <AccordionTrigger className="text-xl pl-2 font-semibold hover:no-underline bg-primary/20 rounded-md">
            Objetivos de Aprendizaje
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-inside list-disc space-y-2 pl-4">
              {objetivosAprendizaje.map(objetivo => (
                <li key={objetivo.id}>{objetivo.descripcion}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
    </Accordion>
  )
}
