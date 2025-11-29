import { auth } from "@/auth"; // Updated import
import { notFound, redirect } from "next/navigation";

import { getUserByEmail } from "@/app/dashboard/admin/users/_lib/user.data";
import { getCompetenciaById } from "@/app/dashboard/admin/areas/_lib/competencia.data";

import SimulacroQuestions from "@/app/dashboard/user/simulacros/_components/SimulacroQuestions";
import { getPreguntasByCompetencia } from "../../_lib/pregunta.data";

interface Props {
  params: Promise<{
    competenciaId: string;
  }>
}  

export default async function SimulacroByCompetenciaPage({ params }: Props) {

  // Obtiene el Id del usuario
  const session = await auth(); // Updated call
  if (!session?.user?.email) redirect("/auth/signin");

  const user = await getUserByEmail(session.user.email);
  if (!user) redirect("/auth/signin");

  const LIMIT = user.isActive ? 10 : 5;
  
  // Obtiene el Id de la competencia
  const { competenciaId } = await params;
  const competencia = await getCompetenciaById(competenciaId);
  if (!competencia) notFound();

  const preguntas = await getPreguntasByCompetencia(competenciaId, LIMIT);
  if (!preguntas || preguntas.length === 0) notFound();

  return (
    <SimulacroQuestions
      preguntas={preguntas}
      competencia={competencia}
    />
  );

}