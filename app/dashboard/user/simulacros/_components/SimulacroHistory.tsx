'use client';

import Link from "next/link";
import { useState, useMemo } from "react";
import { SimulacroWithRelationsType } from "../_lib/simulacro.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

interface SimulacroHistoryProps { 
  simulacros: SimulacroWithRelationsType[]; 
}

export default function SimulacroHistory({ simulacros }: SimulacroHistoryProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCompetencia, setSelectedCompetencia] = useState<string | null>(null);

  const areas = useMemo(() => {
    const uniqueAreas = new Map<string, { id: string; nombre: string }>();
    simulacros.forEach(s => {
      uniqueAreas.set(s.competencia.area.id, s.competencia.area);
    });
    return Array.from(uniqueAreas.values());
  }, [simulacros]);

  const competencias = useMemo(() => {
    const uniqueCompetencias = new Map<string, { id: string; nombre: string, areaId: string }>();
    simulacros.forEach(s => {
      uniqueCompetencias.set(s.competencia.id, { ...s.competencia, areaId: s.competencia.area.id });
    });
    return Array.from(uniqueCompetencias.values());
  }, [simulacros]);

  const filteredSimulacros = useMemo(() => {
    let filtered = simulacros;

    if (selectedArea) {
      filtered = filtered.filter(simulacro => simulacro.competencia.area.id === selectedArea);
    }

    if (selectedCompetencia) {
      filtered = filtered.filter(simulacro => simulacro.competencia.id === selectedCompetencia);
    }

    return filtered;
  }, [simulacros, selectedArea, selectedCompetencia]);
  
  const competenciasInArea = useMemo(() => {
    if (!selectedArea) return competencias;
    return competencias.filter(c => c.areaId === selectedArea);
  }, [competencias, selectedArea]);

  const handleAreaChange = (value: string) => {
    const newArea = value === 'all' ? null : value;
    setSelectedArea(newArea);
    setSelectedCompetencia(null);
  };

  const handleCompetenciaChange = (value: string) => {
    const newCompetencia = value === 'all' ? null : value;
    setSelectedCompetencia(newCompetencia);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Simulacros</h2>
      
      <div className="flex gap-4 my-4">
        <Select onValueChange={handleAreaChange} value={selectedArea || ''}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por Área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las áreas</SelectItem>
            {areas.map(area => (
              <SelectItem key={area.id} value={area.id}>{area.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleCompetenciaChange} value={selectedCompetencia || ''} disabled={!selectedArea}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por Competencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las competencias</SelectItem>
            {competenciasInArea.map(competencia => (
              <SelectItem key={competencia.id} value={competencia.id}>{competencia.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 space-y-4">
        {filteredSimulacros.map((simulacro) => (
          <div key={simulacro.id} className="rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{simulacro.competencia.area.nombre} - {simulacro.competencia.nombre}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Realizado el: {new Date(simulacro.createdAt).toLocaleDateString()}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Puntaje: {simulacro.score?.toFixed(2)}</p>
            </div>
            <Link
              href={`/dashboard/user/simulacros/resultados/${simulacro.id}`}
              className="inline-block rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-primary focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Ver Resultados
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}