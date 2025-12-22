'use client'

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { NivelDesempeno } from '@/src/generated/prisma';

interface NivelDesempenoProgressProps {
  nivelesDesempeno: (NivelDesempeno & { area: { nombre: string } })[];
  areaAverages: { name: string; average: number }[];
}

export default function NivelDesempenoProgress({ nivelesDesempeno, areaAverages }: NivelDesempenoProgressProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const handleAreaChange = (areaName: string) => {
    setSelectedArea(areaName);
  };

  const getDesempenoForArea = () => {
    if (!selectedArea) return null;

    const areaAverage = areaAverages.find(a => a.name === selectedArea)?.average || 0;
    const niveles = nivelesDesempeno.filter(nd => nd.area.nombre === selectedArea);

    if (niveles.length === 0) {
      return <p>No hay niveles de desempeño definidos para esta área.</p>;
    }

    const userNivel = niveles.find(n => areaAverage >= n.puntajeMin && areaAverage <= n.puntajeMax);

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Tu Desempeño en {selectedArea}</h3>
        <p>Tu puntaje promedio es: <strong>{areaAverage.toFixed(2)}</strong></p>
        {userNivel ? (
          <Card className="mt-2">
            <CardHeader>
              <CardTitle>Nivel: {userNivel.nivel}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{userNivel.descripcion}</p>
              <p className="text-sm text-muted-foreground">Rango de puntaje: {userNivel.puntajeMin} - {userNivel.puntajeMax}</p>
            </CardContent>
          </Card>
        ) : (
          <p className="mt-2">No se pudo determinar tu nivel de desempeño con el puntaje actual.</p>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nivel de Desempeño por Área</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={handleAreaChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un área para ver tu nivel de desempeño" />
          </SelectTrigger>
          <SelectContent>
            {areaAverages.map(area => (
              <SelectItem key={area.name} value={area.name}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {getDesempenoForArea()}
      </CardContent>
    </Card>
  );
}