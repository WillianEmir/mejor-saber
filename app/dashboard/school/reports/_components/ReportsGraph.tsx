'use client'

import { useEffect, useState } from 'react';

import { Card, CardHeader } from '@/src/components/ui/card';
import { SchoolSede, User } from '@/src/generated/prisma';
import { getSchoolReportsChartData, getSedeStudents, getSchoolStudents, getSchoolDegrees, getSchoolCompetencyReportsChartData, CompetencyBarChartDataType, BarChartDataType, getSchoolEvidenceReportsChartData, EvidenceBarChartDataType } from '../_lib/reports.data';
import ReportFilters from './filters/ReportFilters'; 
import AreaChart from './charts/AreaChart';
import CompetencyCharts from './charts/CompetencyCharts';
import EvidenceCharts from './charts/EvidenceCharts';

interface ReportsGraphProps {
  sedes: SchoolSede[];
  schoolId: string;
}

export default function ReportsGraph({ sedes, schoolId }: ReportsGraphProps) {

  const [selectedSede, setSelectedSede] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [chartData, setChartData] = useState<BarChartDataType | undefined>(undefined);
  const [competencyChartData, setCompetencyChartData] = useState<CompetencyBarChartDataType[]>([]);
  const [evidenceChartData, setEvidenceChartData] = useState<EvidenceBarChartDataType[]>([]);
  const [selectedAreaName, setSelectedAreaName] = useState('all');
  const [studentList, setStudentList] = useState<Pick<User, 'id' | 'name' | 'lastName'>[]>([]);
  const [degrees, setDegrees] = useState<string[]>([]);

  useEffect(() => {
    if (schoolId) {
      getSchoolDegrees(schoolId, selectedSede).then(setDegrees);
    }
  }, [schoolId, selectedSede]);

  useEffect(() => {
    if (schoolId && selectedSede) {
      getSchoolReportsChartData(schoolId, selectedSede, selectedStudent, selectedDegree).then(setChartData)
      getSchoolCompetencyReportsChartData(schoolId, selectedSede, selectedDegree, selectedStudent).then(setCompetencyChartData)
      getSchoolEvidenceReportsChartData(schoolId, selectedSede, selectedDegree, selectedStudent).then(setEvidenceChartData)
    }
  }, [schoolId, selectedSede, selectedStudent, selectedDegree]);

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

  const handleAreaChange = (areaName: string) => {
    setSelectedAreaName(areaName);
  };
  
  const areaNames = chartData?.labels ?? [];

  let displayChartData = chartData;

  if (selectedAreaName !== 'all') {
    const areaIndex = chartData!.labels.indexOf(selectedAreaName);
    if (areaIndex !== -1 && chartData) {
      displayChartData = {
        labels: ['Primer Simulacro', 'Último Simulacro'],
        datasets: [
          {
            label: `Rendimiento en ${selectedAreaName}`,
            data: [
              chartData.datasets[0].data[areaIndex], // First
              chartData.datasets[1].data[areaIndex], // Last
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
            ],
          },
        ],
      };
    }
  }

  const filteredCompetencyChartData = selectedAreaName === 'all' 
    ? competencyChartData 
    : competencyChartData.filter(d => d.area === selectedAreaName);

  return (
    <>
      <Card>
        <CardHeader className="sticky top-0 z-10 bg-white dark:bg-gray-950">
          <ReportFilters 
            sedes={sedes}
            degrees={degrees}
            studentList={studentList}
            areaNames={areaNames}
            selectedSede={selectedSede}
            selectedDegree={selectedDegree}
            selectedStudent={selectedStudent}
            selectedAreaName={selectedAreaName}
            onSedeChange={handleSedeChange}
            onDegreeChange={setSelectedDegree}
            onStudentChange={setSelectedStudent}
            onAreaChange={handleAreaChange}
          />
        </CardHeader>
        <AreaChart displayChartData={displayChartData} />
      </Card>

      <CompetencyCharts filteredCompetencyChartData={filteredCompetencyChartData} />

      <EvidenceCharts evidenceChartData={evidenceChartData} selectedAreaName={selectedAreaName} />
    </>
  );
}
