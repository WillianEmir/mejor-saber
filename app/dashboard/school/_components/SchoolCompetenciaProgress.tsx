'use client'

import { useState, useMemo } from 'react';

import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { CompetenciaProgressType } from '../../user/_lib/progress.schema';
import { StudentExportDataType } from '../_lib/school.data';

interface SchoolCompetenciaProgressProps {
  data: CompetenciaProgressType[];
  studentData: StudentExportDataType[];
}

const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((acc, v) => acc + v, 0) / arr.length : 0);

export default function SchoolCompetenciaProgress({ data: initialData, studentData }: SchoolCompetenciaProgressProps) {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedSede, setSelectedSede] = useState<string>('all');
  const [selectedGrado, setSelectedGrado] = useState<string>('all');
  
  const areas = useMemo(() => {
    const allAreas = initialData.map(c => c.areaName).filter(Boolean);
    return [...new Set(allAreas)];
  }, [initialData]);

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

  const filteredData = useMemo(() => {
    let dataToDisplay = initialData;

    if (selectedSede !== 'all' || selectedGrado !== 'all') {
      const filteredStudents = studentData.filter(student => {
        const sedeMatch = selectedSede === 'all' || student.sede === selectedSede;
        const gradoMatch = selectedGrado === 'all' || student.degree === selectedGrado;
        return sedeMatch && gradoMatch;
      });

      if (filteredStudents.length === 0) {
        return [];
      }

      const competencyMetrics = new Map<string, { name: string; areaName: string; firstScores: number[], lastScores: number[], allScores: number[] }>();

      for (const student of filteredStudents) {
        for (const competencia of student.competenciaAverages) {
          if (!competencyMetrics.has(competencia.name)) {
            competencyMetrics.set(competencia.name, {
              name: competencia.name,
              areaName: competencia.areaName,
              firstScores: [],
              lastScores: [],
              allScores: []
            });
          }
          const metric = competencyMetrics.get(competencia.name)!;
          metric.firstScores.push(competencia.first);
          metric.lastScores.push(competencia.last);
          metric.allScores.push(competencia.average);
        }
      }

      dataToDisplay = Array.from(competencyMetrics.values()).map(metric => ({
        name: metric.name,
        areaName: metric.areaName,
        first: avg(metric.firstScores),
        last: avg(metric.lastScores),
        average: avg(metric.allScores),
      }));
    }

    return selectedArea === 'all'
      ? dataToDisplay
      : dataToDisplay.filter(item => item.areaName === selectedArea);
      
  }, [initialData, studentData, selectedArea, selectedSede, selectedGrado]);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <SelectTrigger><SelectValue placeholder="Filtrar por área" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las áreas</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {initialData.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[400px]"><p>No hay datos de competencias para mostrar.</p></div>
        ) : filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[400px]"><p>No hay datos con los filtros seleccionados.</p></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
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
                  <TableCell>{item.name}</TableCell>
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
