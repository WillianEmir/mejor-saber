'use client';

import { getContenidoCurricularStats } from "@/app/dashboard/admin/_lib/admin.data";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Folder } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";

interface ContenidoCurricularStatsProps {
  areas: Awaited<ReturnType<typeof getContenidoCurricularStats>>;
}

export const ContenidoCurricularStats = ({ areas }: ContenidoCurricularStatsProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Contenidos Curriculares por Área</CardTitle>
    </CardHeader>
    <CardContent>
      <Accordion type="multiple" className="w-full">
        {areas.map((area) => (
          <AccordionItem key={area.id} value={area.id}>
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-brand-500" />
                <span>{area.nombre}</span>
              </div>
              <Badge variant="secondary">{area.contenidosCurriculares.reduce((sum, cc) => sum + cc._count.ejesTematicos, 0)} ejes temáticos</Badge>
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="multiple" className="w-full pl-4">
                {area.contenidosCurriculares.map((contenido) => (
                  <AccordionItem key={contenido.id} value={contenido.id}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Folder className="h-4 w-4 text-sky-500" />
                        <span>{contenido.nombre}</span>
                      </div>
                      <Badge variant="secondary">{contenido._count.ejesTematicos} ejes temáticos</Badge>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Total de ejes temáticos: {contenido._count.ejesTematicos}
                      </div>
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