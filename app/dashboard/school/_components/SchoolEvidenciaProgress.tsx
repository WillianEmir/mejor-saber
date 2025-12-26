'use client'

import { useState, useMemo } from 'react';

import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { EvidenciaProgressType } from '../../user/_lib/progress.schema';
import { StudentExportDataType } from '../_lib/school.data';

interface SchoolEvidenciaProgressProps {
  data: EvidenciaProgressType[];
  studentData: StudentExportDataType[];
}

const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((acc, v) => acc + v, 0) / arr.length : 0);

export default function SchoolEvidenciaProgress({ data: initialData, studentData }: SchoolEvidenciaProgressProps) {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedCompetencia, setSelectedCompetencia] = useState<string>('all');
  const [selectedSede, setSelectedSede] = useState<string>('all');
  const [selectedGrado, setSelectedGrado] = useState<string>('all');

  const areas = useMemo(() => {
    const allAreas = initialData.map(c => c.areaName).filter(Boolean);
    return [...new Set(allAreas)];
  }, [initialData]);

  const competencias = useMemo(() => {
    const allCompetencias = initialData
      .filter(item => selectedArea === 'all' || item.areaName === selectedArea)
      .map(c => c.competenciaName)
      .filter(Boolean);
    return [...new Set(allCompetencias)];
  }, [initialData, selectedArea]);

  const sedes = useMemo(() => {
    const allSedes = studentData.map(s => s.sede).filter(Boolean);
    return [...new Set(allSedes)];
  }, [studentData]);

  const grados = useMemo(() => {
    const filteredBySede = selectedSede === 'all' ? studentData : studentData.filter(s => s.sede === selectedSede);
    const allGrados = filteredBySede.map(s => s.degree).filter(Boolean);
    return [...new Set(allGrados)].sort();
  }, [studentData, selectedSede]);

  if (selectedGrado !== 'all' && !grados.includes(selectedGrado)) {
    setSelectedGrado('all');
  }
  if (selectedCompetencia !== 'all' && !competencias.includes(selectedCompetencia)) {
    setSelectedCompetencia('all');
  }

  const filteredData = useMemo(() => {
    let dataToDisplay = initialData;

    if (selectedSede !== 'all' || selectedGrado !== 'all') {
      const filteredStudents = studentData.filter(student => {
        const sedeMatch = selectedSede === 'all' || student.sede === selectedSede;
        const gradoMatch = selectedGrado === 'all' || student.degree === selectedGrado;
        return sedeMatch && gradoMatch;
      });

      if (filteredStudents.length === 0) return [];

      const evidenciaMetrics = new Map<string, { name: string; competenciaName: string; areaName: string; firstScores: number[], lastScores: number[], allScores: number[] }>();

      for (const student of filteredStudents) {
        for (const evidencia of student.evidenciaAverages) {
          if (!evidenciaMetrics.has(evidencia.name)) {
            evidenciaMetrics.set(evidencia.name, {
              name: evidencia.name,
              competenciaName: evidencia.competenciaName,
              areaName: evidencia.areaName,
              firstScores: [],
              lastScores: [],
              allScores: []
            });
          }
          const metric = evidenciaMetrics.get(evidencia.name)!;
          metric.firstScores.push(evidencia.first);
          metric.lastScores.push(evidencia.last);
          metric.allScores.push(evidencia.average);
        }
      }

      dataToDisplay = Array.from(evidenciaMetrics.values()).map(metric => ({
        name: metric.name,
        competenciaName: metric.competenciaName,
        areaName: metric.areaName,
        first: avg(metric.firstScores),
        last: avg(metric.lastScores),
        average: avg(metric.allScores),
      }));
    }
    
    return dataToDisplay.filter(item => {
      const areaMatch = selectedArea === 'all' || item.areaName === selectedArea;
      const competenciaMatch = selectedCompetencia === 'all' || item.competenciaName === selectedCompetencia;
      return areaMatch && competenciaMatch;
    });

  }, [initialData, studentData, selectedSede, selectedGrado, selectedArea, selectedCompetencia]);

  const formatValue = (value: number) => {
    const roundedValue = Math.round(value);
    let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
    if (roundedValue >= 80) {
      badgeVariant = 'default';
    } else if (roundedValue < 60) {
      badgeVariant = 'destructive';
    }
    return <Badge variant={badgeVariant}>{roundedValue}</Badge>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select onValueChange={setSelectedSede} defaultValue="all">
            <SelectTrigger><SelectValue placeholder="Filtrar por Sede" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las sedes</SelectItem>
              {sedes.map((name: string) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedGrado} value={selectedGrado} defaultValue="all">
            <SelectTrigger><SelectValue placeholder="Filtrar por Grado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los grados</SelectItem>
              {grados.map((name: string) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedArea} defaultValue="all">
            <SelectTrigger><SelectValue placeholder="Filtrar por Área" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Áreas</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedCompetencia} value={selectedCompetencia} defaultValue="all" disabled={selectedArea === 'all'}>
            <SelectTrigger><SelectValue placeholder="Filtrar por Competencia" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Competencias</SelectItem>
              {competencias.map((competencia) => (
                <SelectItem key={competencia} value={competencia}>{competencia}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {initialData.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[400px]"><p>No hay datos de evidencias para mostrar.</p></div>
        ) : filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[400px]"><p>No hay datos con los filtros seleccionados.</p></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evidencia</TableHead>
                <TableHead>Competencia</TableHead>
                <TableHead>Área</TableHead>
                <TableHead className="text-center">Primer Resultado</TableHead>
                <TableHead className="text-center">Promedio</TableHead>
                <TableHead className="text-center">Último Resultado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="max-w-xs truncate">{item.name}</TableCell>
                  <TableCell>{item.competenciaName}</TableCell>
                  <TableCell>{item.areaName}</TableCell>
                  <TableCell className="text-center">{formatValue(item.first)}</TableCell>
                  <TableCell className="text-center">{formatValue(item.average)}</TableCell>
                  <TableCell className="text-center">{formatValue(item.last)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}