'use client'; 

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, BookCheck, ChevronRight, CheckCircle, Circle } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/src/components/ui/accordion';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';

import { MaterialRepasoType } from '@/app/dashboard/admin/areas/_lib/area.schema';

interface MaterialRepasoClientProps { 
  areas: MaterialRepasoType[];
}

export default function MaterialRepaso({ areas }: MaterialRepasoClientProps) {
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAreas = useMemo(() => {
    if (!searchTerm) return areas;

    const lowercasedFilter = searchTerm.toLowerCase();

    return areas
      .map(area => ({
        ...area,
        contenidosCurriculares: area.contenidosCurriculares
          .map(contenido => ({
            ...contenido,
            ejesTematicos: contenido.ejesTematicos.filter(eje =>
              eje.nombre.toLowerCase().includes(lowercasedFilter)
            ),
          }))
          .filter(contenido => contenido.ejesTematicos.length > 0),
      }))
      .filter(area => area.contenidosCurriculares.length > 0);
  }, [searchTerm, areas]);

  return (
    <div className="space-y-6">
      {/* Barra de Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar un eje temático..."
          className="w-full h-11 pl-10 pr-4 rounded-lg border-border bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Acordeón de Contenidos */}
      <Accordion type="multiple" className="w-full space-y-4">
        {filteredAreas.map(area => (
          <AccordionItem key={area.id} value={area.id} className="border-none">
             <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
                <AccordionTrigger className="p-3 text-lg font-semibold hover:no-underline hover:bg-primary/60">
                  <div className="flex items-center gap-3">
                    <BookCheck className="h-6 w-6 text-primary"/>
                    <span>{area.nombre}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-t border-border p-0">
                  <Accordion type="multiple" className="w-full">
                    {area.contenidosCurriculares.map(contenido => (
                      <AccordionItem key={contenido.id} value={contenido.id} className="border-b last:border-none">
                        <AccordionTrigger className="px-6 py-3 text-md font-medium hover:no-underline hover:bg-primary/30">
                          {contenido.nombre}
                        </AccordionTrigger>
                        <AccordionContent className="px-2 pb-2 sm:px-4 sm:pb-4">
                          <div className="space-y-2 pt-2">
                            {contenido.ejesTematicos.length > 0 ? (
                              contenido.ejesTematicos.map(eje => (
                                <Link key={eje.id} href={`/dashboard/user/material-repaso/${eje.id}`} passHref>
                                  <div className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-primary/30 hover:text-primary">
                                    <div className="flex items-center gap-3">
                                       {eje.progress === 100 ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      ) : (
                                        <Circle className="h-5 w-5 text-muted-foreground/50" />
                                      )}
                                      <span className="font-medium text-sm text-foreground">
                                        {eje.nombre}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="w-28 flex items-center gap-2">
                                        <Progress value={eje.progress} className="h-2" />
                                        <span className="text-xs font-bold w-10 text-right text-muted-foreground">
                                          {eje.progress}%
                                        </span>
                                      </div>
                                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  </div>
                                </Link>
                              ))
                            ) : (
                              <p className="text-center text-sm text-muted-foreground py-4">
                                No hay ejes temáticos para este contenido.
                              </p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </Card>
          </AccordionItem>
        ))}
      </Accordion>

      {filteredAreas.length === 0 && (
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold">No se encontraron resultados</h3>
            <p className="text-muted-foreground mt-2">
              Intenta con otro término de búsqueda o explora las áreas manualmente.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
