import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { notFound, redirect } from "next/navigation";

import SimulacrumQuestions from "@/app/dashboard/user/simulacros/_components/SimulacroQuestions";
import { getPreguntasByArea } from "@/app/dashboard/admin/preguntas/_lib/pregunta.data";
import { getAreaById } from "@/app/dashboard/admin/areas/_lib/area.data";
import { getUserByEmail } from "@/app/dashboard/admin/users/_lib/user.data";

interface Props {
  params: Promise<{
    areaId: string;
  }>
}

export default async function SimulacroByAreaPage({ params }: Props) {

  const session = await getServerSession(authOptions);
  
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