import SimulacrumQuestions from '@/src/components/dashboard/simulacrum/SimulacrumQuestions';
import { getPreguntasByCompetencia } from '@/src/lib/data/preguntas.data';
import { notFound } from 'next/navigation';

interface pageProps {
  params: Promise<{
    id: string
  }>
} 

export default async function Page({ params }: pageProps) {
  
  const {id} = await params;

  const preguntas = await getPreguntasByCompetencia(id);
  console.log(preguntas);
  

  if (!preguntas || preguntas.length === 0) {
    notFound();
  }

  return (
    <>
      <SimulacrumQuestions preguntas={preguntas} />
    </>
  );
}
