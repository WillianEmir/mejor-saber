'use client'

import React, { useEffect, useState } from 'react';
import { SchoolSede, User } from '@/src/generated/prisma';
import { getSchoolDegrees, getSchoolStudentReportsData, getSchoolStudents, getSedeStudents, StudentReport } from '../_lib/reports.data';
import ReportFilters from './filters/ReportFilters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Card } from '@/src/components/ui/card';

interface ReportListAreaProps {
  sedes: SchoolSede[];
  schoolId: string;
}

export default function ReportListArea({ sedes, schoolId }: ReportListAreaProps) {
  const [selectedSede, setSelectedSede] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [studentReports, setStudentReports] = useState<StudentReport[]>([]);
  const [studentList, setStudentList] = useState<Pick<User, 'id' | 'name' | 'lastName'>[]>([]);
  const [degrees, setDegrees] = useState<string[]>([]);
  const [areaNames, setAreaNames] = useState<string[]>([]);

  useEffect(() => {
    if (schoolId) {
      getSchoolDegrees(schoolId, selectedSede).then(setDegrees);
    }
  }, [schoolId, selectedSede]);

  useEffect(() => {
    if (schoolId) {
      getSchoolStudentReportsData(schoolId, selectedSede, selectedDegree, selectedStudent).then(reports => {
        setStudentReports(reports);
        if (reports.length > 0 && reports[0].areas.length > 0) {
          setAreaNames(reports[0].areas.map(a => a.name));
        }
      });
    }
  }, [schoolId, selectedSede, selectedDegree, selectedStudent]);

  useEffect(() => {
    if (selectedSede && selectedSede !== 'all') {
      getSedeStudents(selectedSede, selectedDegree).then(setStudentList);
      setSelectedStudent('all');
    } else if (selectedSede === 'all') {
      getSchoolStudents(schoolId, selectedDegree).then(setStudentList);
      setSelectedStudent('all');
    } else {
      setStudentList([]);
      setSelectedStudent('all');
    }
  }, [selectedSede, schoolId, selectedDegree]);

  const handleSedeChange = (sedeId: string) => {
    setSelectedSede(sedeId);
    setSelectedDegree('all');
    setSelectedStudent('all');
  };

  return (
    <Card>
      <ReportFilters
        sedes={sedes}
        degrees={degrees}
        studentList={studentList}
        areaNames={[]}
        selectedSede={selectedSede}
        selectedDegree={selectedDegree}
        selectedStudent={selectedStudent}
        selectedAreaName="all"
        onSedeChange={handleSedeChange}
        onDegreeChange={setSelectedDegree}
        onStudentChange={setSelectedStudent}
        onAreaChange={() => {}}
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
              <TableHead>General (1ro)</TableHead>
              <TableHead>General (Último)</TableHead>
              {areaNames.map(areaName => (
                <React.Fragment key={areaName}>
                  <TableHead>{areaName} (1ro)</TableHead>
                  <TableHead>{areaName} (Último)</TableHead>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentReports.map(report => (
              <TableRow key={report.id}>
                <TableCell>{report.idDocument || 'N/A'}</TableCell>
                <TableCell>{report.fullName}</TableCell>
                <TableCell>{report.sede || 'N/A'}</TableCell>
                <TableCell>{report.degree || 'N/A'}</TableCell>
                <TableCell>{report.overall.first?.toFixed(2) ?? 'N/A'}</TableCell>
                <TableCell>{report.overall.last?.toFixed(2) ?? 'N/A'}</TableCell>
                {areaNames.map(areaName => {
                  const areaReport = report.areas.find(a => a.name === areaName);
                  return (
                    <React.Fragment key={areaName}>
                      <TableCell>{areaReport?.first?.toFixed(2) ?? 'N/A'}</TableCell>
                      <TableCell>{areaReport?.last?.toFixed(2) ?? 'N/A'}</TableCell>
                    </React.Fragment>
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