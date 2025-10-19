import ReactPlayer from 'react-player'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";
import { Card, CardContent } from "@/src/components/ui/card";

// Types
import { EjeTematico } from "@/src/generated/prisma"; 

interface EjeTematicoIntroduccionProps {
  ejeTematico: EjeTematico;
}

export default function EjeTematicoIntroduccion({ ejeTematico }: EjeTematicoIntroduccionProps) {
  return (
    <Accordion type="single" collapsible defaultValue="introduccion" className="mb-8 w-full ">
      <AccordionItem value="introduccion" className='border rounded-md border-neutral-light hover:border-primary bg-white shadow dark:bg-neutral-dark transition-colors duration-300'>
        <AccordionTrigger className="text-xl pl-2 font-semibold hover:no-underline bg-primary/20 rounded-md">
          Introducción
        </AccordionTrigger>
        <AccordionContent>
          <Card className='border-none shadow-none'>
            <CardContent className="space-y-6 pt-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-center">Descripción</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {ejeTematico.descripcionCorta}
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                  Pregunta Temática
                </h3>
                <p className="mt-1 text-blue-700 dark:text-blue-300">
                  {ejeTematico.preguntaTematica}
                </p>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                  Relevancia para el ICFES
                </h3>
                <p className="mt-1 text-amber-700 dark:text-amber-300">
                  {ejeTematico.relevanciaICFES}
                </p>
              </div>

              {(ejeTematico.imagen || ejeTematico.video) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ejeTematico.imagen && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Imagen de Referencia</h3>
                      <img
                        src={ejeTematico.imagen}
                        alt={`Imagen para ${ejeTematico.nombre}`}
                        className="rounded-lg object-cover w-full"
                      />
                    </div>
                  )}
                  {ejeTematico.video && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Video Explicativo</h3>
                      <div className="player-wrapper rounded-lg">
                        <ReactPlayer
                          className="react-player"
                          src={ejeTematico.video}
                          width="100%"
                          height="100%"
                          controls={true}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
