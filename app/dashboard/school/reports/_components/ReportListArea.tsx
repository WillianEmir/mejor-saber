'use client'

import React, { useMemo, useState } from 'react';
import ReportFilters from './filters/ReportFilters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Card } from '@/src/components/ui/card';
import { StudentExportDataType } from '../../_lib/school.data';

interface ReportListAreaProps {
  sedes: {
    id: string;
    nombre: string;
  }[];
  schoolId: string;
  initialStudentReports: StudentExportDataType[];
}

export default function ReportListArea({ sedes, schoolId, initialStudentReports }: ReportListAreaProps) {
  const [selectedSede, setSelectedSede] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');

  const handleSedeChange = (sedeId: string) => {
    setSelectedSede(sedeId);
    setSelectedDegree('all');
    setSelectedStudent('all');
  };
  
  const handleDegreeChange = (degree: string) => {
    setSelectedDegree(degree);
    setSelectedStudent('all');
  };

  const filteredStudentReports = useMemo(() => {
    let filteredData = initialStudentReports;

    if (selectedSede !== 'all') {
      const sedeName = sedes.find(s => s.id === selectedSede)?.nombre;
      if (sedeName) {
        filteredData = filteredData.filter(report => report.sede === sedeName);
      } else {
        filteredData = [];
      }
    }
    if (selectedDegree !== 'all') {
      filteredData = filteredData.filter(report => report.degree === selectedDegree);
    }
    if (selectedStudent !== 'all') {
      filteredData = filteredData.filter(report => report.id === selectedStudent);
    }
    return filteredData;
  }, [initialStudentReports, selectedSede, selectedDegree, selectedStudent, sedes]);

  const studentList = useMemo(() => {
    let relevantStudents = initialStudentReports;
    if (selectedSede !== 'all') {
      const sedeName = sedes.find(s => s.id === selectedSede)?.nombre;
      if (sedeName) {
        relevantStudents = relevantStudents.filter(student => student.sede === sedeName);
      } else {
        relevantStudents = [];
      }
    }
     if (selectedDegree !== 'all') {
      relevantStudents = relevantStudents.filter(student => student.degree === selectedDegree);
    }
    
    const students = relevantStudents.map(s => ({
      id: s.id,
      name: s.name,
      lastName: s.lastName,
    }));
    const uniqueStudents = Array.from(new Map(students.map(item => [item['id'], item])).values());
    return uniqueStudents;
  }, [initialStudentReports, selectedSede, selectedDegree, sedes]);

  const degrees = useMemo(() => {
    let relevantStudents = initialStudentReports;
    if (selectedSede !== 'all') {
      const sedeName = sedes.find(s => s.id === selectedSede)?.nombre;
      if (sedeName) {
        relevantStudents = relevantStudents.filter(student => student.sede === sedeName);
      } else {
        relevantStudents = [];
      }
    }
    const allDegrees = relevantStudents.map(s => s.degree).filter(Boolean);
    const uniqueDegrees = [...new Set(allDegrees)].sort();
    return uniqueDegrees;
  }, [initialStudentReports, selectedSede, sedes]);

  const areaNames = useMemo(() => {
    if (initialStudentReports.length > 0 && initialStudentReports[0].areaAverages.length > 0) {
      return initialStudentReports[0].areaAverages.map(a => a.name).sort();
    }
    return [];
  }, [initialStudentReports]);

  return (
    <Card>
      <ReportFilters
        sedes={sedes}
        degrees={degrees}
        studentList={studentList}
        areaNames={[]} // No se usa en este componente
        selectedSede={selectedSede}
        selectedDegree={selectedDegree}
        selectedStudent={selectedStudent}
        selectedAreaName="all"
        onSedeChange={handleSedeChange}
        onDegreeChange={handleDegreeChange}
        onStudentChange={setSelectedStudent}
        onAreaChange={() => { }}
        showAreaFilter={false}
      />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Documento</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Sede</TableHead>
              <TableHead>Grado</TableHead>
              <TableHead>Prom. General</TableHead>
              {areaNames.map(areaName => (
                <TableHead key={areaName}>Prom. {areaName}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudentReports.map(report => (
              <TableRow key={report.id}>
                <TableCell>{report.idDocument || 'N/A'}</TableCell>
                <TableCell>{`${report.name} ${report.lastName}`}</TableCell>
                <TableCell>{report.sede || 'N/A'}</TableCell>
                <TableCell>{report.degree || 'N/A'}</TableCell>
                <TableCell>{report.generalAverage?.toFixed(2) ?? 'N/A'}</TableCell>
                {areaNames.map(areaName => {
                  const areaReport = report.areaAverages.find(a => a.name === areaName);
                  return (
                    <TableCell key={areaName}>
                      {areaReport?.average?.toFixed(2) ?? 'N/A'}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}