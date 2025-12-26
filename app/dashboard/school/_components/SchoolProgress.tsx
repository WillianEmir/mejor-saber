
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"; 
import SchoolAreaProgress from "./SchoolAreaProgress";
import SchoolEvidenciaProgress from "./SchoolEvidenciaProgress";
import SchoolNivelDesempenoProgress from "./SchoolNivelesDesempeno";
import SchoolCompetenciaProgress from "./SchoolCompetenciaProgress";
import SchoolDashboard from "./SchoolDashboard";
import { type SchoolProgressData } from "../_lib/school.schema";

interface SchoolProgressProps {
  data: SchoolProgressData;
}

const SchoolProgress = ({ data }: SchoolProgressProps) => { 

  return (
    <div className="p-4 sm:p-6 lg:p-8">
    <Tabs defaultValue="Dashboard">
      <TabsList className="grid w-full grid-cols-5 mb-4">
        <TabsTrigger value="Dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="areas">Áreas</TabsTrigger>
        <TabsTrigger value="competencias">Competencias</TabsTrigger>
        <TabsTrigger value="evidence">Evidencias</TabsTrigger>
        <TabsTrigger value="performance">Niveles de Desempeño</TabsTrigger>
      </TabsList>      
      <TabsContent value="Dashboard">
        <SchoolDashboard data={data} />
      </TabsContent>
      <TabsContent value="areas">
        <SchoolAreaProgress data={data.areaProgressData} studentData={data.studentExportData}/>
      </TabsContent>
      <TabsContent value="competencias">
        <SchoolCompetenciaProgress data={data.competenciaAverages} studentData={data.studentExportData} />
      </TabsContent>
      <TabsContent value="evidence">
        <SchoolEvidenciaProgress data={data.evidenciaAverages} studentData={data.studentExportData} />
      </TabsContent>
      <TabsContent value="performance">
        <SchoolNivelDesempenoProgress data={data} studentData={data.studentExportData} />
      </TabsContent>
    </Tabs>
    </div>
  );
};

export default SchoolProgress;