import { notFound, redirect } from "next/navigation";
import SimulacrumQuestions from "@/src/components/dashboard/simulacrum/SimulacrumQuestions";
import { getPreguntasByCompetencia } from "@/src/lib/data/preguntas.data";
import { getCompetenciaById } from "@/src/lib/data/competencias.data";

interface Props {
  params: Promise<{
    id: string;
  }>
}

export default async function SimulacroPage({ params }: Props) {

  const {id} = await params;
  
  const competencia = await getCompetenciaById(id);
  if (!competencia) notFound();

  const preguntas = await getPreguntasByCompetencia(id);
  if (!preguntas || preguntas.length === 0) notFound();

  return (
    <SimulacrumQuestions
      preguntas={preguntas}
      competencia={competencia}
    />
  );
}