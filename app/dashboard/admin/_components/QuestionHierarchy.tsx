
'use client';

import { getQuestionCountHierarchy } from "@/app/dashboard/admin/_lib/admin.data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { File, Folder } from "lucide-react";

interface QuestionHierarchyProps {
  hierarchy: Awaited<ReturnType<typeof getQuestionCountHierarchy>>;
}

export const QuestionHierarchy = ({ hierarchy }: QuestionHierarchyProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Distribución de Preguntas</CardTitle>
    </CardHeader>
    <CardContent>
      <Accordion type="multiple" className="w-full">
        {hierarchy.map((area) => (
          <AccordionItem key={area.id} value={area.id}>
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-brand-500" />
                <span>{area.nombre}</span>
              </div>
              <Badge variant="secondary">{area.preguntaCount} preguntas</Badge>
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="multiple" className="w-full">
                {area.competencias.map((competencia) => (
                  <AccordionItem key={competencia.id} value={competencia.id}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Folder className="h-4 w-4 text-sky-500" />
                        <span>{competencia.nombre}</span>
                      </div>
                      <Badge variant="secondary">{competencia.preguntaCount}</Badge>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Accordion type="multiple" className="w-full">
                        {competencia.afirmaciones.map((afirmacion) => (
                          <AccordionItem key={afirmacion.id} value={afirmacion.id}>
                            <AccordionTrigger>
                              <div className="flex items-center gap-3">
                                <Folder className="h-4 w-4 text-amber-500" />
                                <span>{afirmacion.nombre}</span>
                              </div>
                              <Badge variant="secondary">{afirmacion.preguntaCount}</Badge>
                            </AccordionTrigger>
                            <AccordionContent>
                              {afirmacion.evidencias.map((evidencia) => (
                                <div key={evidencia.id} className="p-1.5 flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-3">
                                    <File className="h-3 w-3" />
                                    <span>{evidencia.nombre}</span>
                                  </div>
                                  <Badge variant="outline">{evidencia.preguntaCount}</Badge>
                                </div>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </CardContent>
  </Card>
);
