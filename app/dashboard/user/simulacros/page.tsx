import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import { getAreas } from '@/app/dashboard/admin/areas/_lib/area.data';
import { getSimulacrosByUserId } from './_lib/simulacro.data';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import SimulacroAreasList from '@/app/dashboard/user/simulacros/_components/SimulacroAreasList';
import SimulacroAreasListHeader from './_components/SimulacroAreasListHeader';
import SimulacroHistory from './_components/SimulacroHistory';

export default async function SimulacrosPage() {

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect('/auth/signin')

  const [areas, simulacros] = await Promise.all([ getAreas(), getSimulacrosByUserId(userId) ]);
 
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <Tabs defaultValue="nuevo" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nuevo">Nuevo Simulacro</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>
        <TabsContent value="nuevo">
          <SimulacroAreasListHeader />
          <SimulacroAreasList areas={areas} />
        </TabsContent>
        <TabsContent value="historial">
          <SimulacroHistory simulacros={simulacros} />
        </TabsContent>
      </Tabs>
    </div>
  );
}