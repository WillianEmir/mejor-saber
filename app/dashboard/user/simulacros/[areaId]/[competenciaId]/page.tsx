import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { notFound, redirect } from "next/navigation";

import { getUserByEmail } from "@/src/lib/data/user.data";
import { getPreguntasByCompetencia } from "@/src/lib/data/preguntas.data";
import { getCompetenciaById } from "@/app/dashboard/admin/areas/_lib/competencia.data";

import SimulacroQuestions from "@/app/dashboard/user/simulacros/_components/SimulacroQuestions";

interface Props {
  params: Promise<{
    competenciaId: string;
  }>
}

export default async function SimulacroByCompetenciaPage({ params }: Props) {

  // Obtiene el Id del usuario
  const session = await getServerSession(authOptions);
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