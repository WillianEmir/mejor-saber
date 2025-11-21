import { getSchoolAreaProgress, getSchoolCompetenciaProgress, getSchoolEvidenciaProgress, getSchoolNivelesDesempeno } from "../_lib/schoolProgress.data";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"; 
import SchoolAreaProgress from "./SchoolAreaProgress";
import SchoolEvidenciaProgress from "./SchoolEvidenciaProgress";
import SchoolNivelDesempenoProgress from "./SchoolNivelesDesempeno";
import SchoolCompetenciaProgress from "./SchoolCompetenciaProgress";

const SchoolTabs = async () => { 
  const schoolAreaProgressData = await getSchoolAreaProgress();
  const { competenciaProgress, areaAverages } = await getSchoolCompetenciaProgress();
  const { evidenciaProgress } = await getSchoolEvidenciaProgress();
  const { nivelesDesempenoData, areaAverages: nivelesAreaAverages } = await getSchoolNivelesDesempeno();
  return (
    <Tabs defaultValue="areas">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="areas">Áreas</TabsTrigger>
        <TabsTrigger value="competencias">Competencias</TabsTrigger>
        <TabsTrigger value="evidence">Evidencias</TabsTrigger>
        <TabsTrigger value="performance">Niveles de Desempeño</TabsTrigger>
      </TabsList>      
      <TabsContent value="areas">
        <SchoolAreaProgress chartData={schoolAreaProgressData}/>
      </TabsContent>
      <TabsContent value="competencias">
        <SchoolCompetenciaProgress competenciaProgress={competenciaProgress} areaAverages={areaAverages} />
      </TabsContent>
      <TabsContent value="evidence">
        <SchoolEvidenciaProgress evidenciaProgress={evidenciaProgress} areaAverages={areaAverages} competenciaProgress={competenciaProgress} />
      </TabsContent>
      <TabsContent value="performance">
        <SchoolNivelDesempenoProgress nivelesDesempenoData={nivelesDesempenoData} areaAverages={nivelesAreaAverages} />
      </TabsContent>
    </Tabs>
  );
};

export default SchoolTabs;