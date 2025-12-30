import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";

import SimulacrumQuestions from "@/app/dashboard/user/simulacros/_components/SimulacroQuestions";
import { getUserByEmail } from "@/app/dashboard/admin/users/_lib/user.data";
import { getAreaById } from "../../_lib/simulacro.data";
import { getPreguntasByArea } from "../../_lib/pregunta.data"; 

interface Props {
  params: Promise<{ 
    areaId: string; 
  }>,
  searchParams?: Promise<{ 
    officialSimulacroId?: string; 
  }>;
} 

export default async function SimulacroByAreaPage({ params, searchParams }: Props) {

  const session = await auth();
  
  if (!session?.user?.email) redirect("/auth/signin");
  
  const user = await getUserByEmail(session.user.email);
  
  if (!user) redirect("/auth/signin");
  if(!user.isActive) redirect("/precios");
  
  const { areaId } = await params;
  const { officialSimulacroId } = await searchParams || {};

  const area = await getAreaById(areaId);

  if (area === null) notFound();
  
  const preguntas = await getPreguntasByArea(areaId);
  
  if (!preguntas || preguntas.length === 0) notFound();

  return (
    <SimulacrumQuestions
      preguntas={preguntas}
      area={area}
      officialSimulacroId={officialSimulacroId}
    />
  );

}