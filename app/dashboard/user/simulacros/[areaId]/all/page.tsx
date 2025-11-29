import { auth } from "@/auth"; // Updated import
import { notFound, redirect } from "next/navigation";

import SimulacrumQuestions from "@/app/dashboard/user/simulacros/_components/SimulacroQuestions";
import { getUserByEmail } from "@/app/dashboard/admin/users/_lib/user.data";
import { getAreaById } from "../../_lib/simulacro.data";
import { getPreguntasByArea } from "../../_lib/pregunta.data";

interface Props {
  params: Promise<{ 
    areaId: string;
  }>
}

export default async function SimulacroByAreaPage({ params }: Props) {

  const session = await auth(); // Updated call
  
  if (!session?.user?.email) redirect("/auth/signin");
  
  const user = await getUserByEmail(session.user.email);
  
  if (!user) redirect("/auth/signin");
  
  const { areaId } = await params;

  const limit = user.isActive ? 25 : 0;

  const area = await getAreaById(areaId);

  if (!area) notFound();

  const preguntas = await getPreguntasByArea(areaId, limit);

  if (!preguntas || preguntas.length === 0) notFound();

  return (
    <SimulacrumQuestions
      preguntas={preguntas}
      area={area}
    />
  );

}