import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";

import { getCompetenciaById } from "@/app/dashboard/admin/areas/_lib/competencia.data";
import SimulacroQuestions from "@/app/dashboard/user/simulacros/_components/SimulacroQuestions";
import { getPreguntasByCompetencia } from "../../_lib/pregunta.data";
import prisma from "@/src/lib/prisma";

interface Props {
  params: Promise<{
    competenciaId: string;
  }>
}
 
export default async function SimulacroByCompetenciaPage({ params }: Props) {

  // Obtiene el Id del usuario
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin"); 

  const userId = session.user.id;

  // Obtiene el Id de la competencia
  const { competenciaId } = await params;
  const competencia = await getCompetenciaById(competenciaId);

  if (!competencia) notFound();

  // Obtener datos del usuario
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true, freeSimulacrosCount: true },
  });

  if (!user) redirect("/auth/signin"); 

  if(!user.isActive && user.freeSimulacrosCount >= 2) {
    redirect('/precios');
  }

  const preguntas = await getPreguntasByCompetencia(competenciaId);
  if (!preguntas || preguntas.length === 0) notFound(); 

  return (
    <SimulacroQuestions
      preguntas={preguntas}
      competencia={competencia}
      area={competencia.area}
    />
  );
}