import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

import GeneralMaterialRepaso from "./_components/GeneralMaterialRepaso";
import PersonalizadoMaterialRepaso from "./_components/PersonalizadoMaterialRepaso";

export default function MaterialRepasoPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Todo el Material de Repaso</TabsTrigger>
          <TabsTrigger value="personalizado">Material Personalizado</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralMaterialRepaso />
        </TabsContent>
        <TabsContent value="personalizado">
          <PersonalizadoMaterialRepaso />
        </TabsContent>
      </Tabs>
    </div>
  );
}