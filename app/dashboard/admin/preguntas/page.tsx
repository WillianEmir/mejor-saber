import { notFound } from 'next/navigation';

import { getContenidosWithRelations } from '@/app/dashboard/admin/contenidos-curriculares/_lib/contenidoCurricular.data'
import { getAreasWithRelations, getPreguntasCount, getPreguntasWithRelations } from '@/app/dashboard/admin/preguntas/_lib/pregunta.data'

import PreguntasList from '@/app/dashboard/admin/preguntas/_components/PreguntasList'  

interface pageProps {
  searchParams: Promise<{
    page?: string;
    areaId?: string;
    competenciaId?: string;
    afirmacionId?: string;
    evidenciaId?: string;
  }>
}

export default async function PreguntasPage({ searchParams }: pageProps) {

  const { page, areaId, competenciaId, afirmacionId, evidenciaId } = await searchParams;

  const ITEMS_PER_PAGE = 10;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const filters = {
    areaId: areaId,
    competenciaId: competenciaId,
    afirmacionId: afirmacionId,
    evidenciaId: evidenciaId,
  };

  const [preguntas, preguntasCount] = await Promise.all([
    getPreguntasWithRelations(ITEMS_PER_PAGE, skip, filters),
    getPreguntasCount(filters),
  ]);

  const totalPages = Math.ceil(preguntasCount / ITEMS_PER_PAGE);
  
  const [areas, contenidosCurriculares] = await Promise.all([
    getAreasWithRelations(),
    getContenidosWithRelations(),
  ]);
  
  if(preguntas.length === 0 || areas.length === 0 || contenidosCurriculares.length === 0) notFound();

  return (
    <>
      <PreguntasList
        preguntas={preguntas}
        totalPages={totalPages}
        currentPage={currentPage}
        areas={areas}
        contenidosCurriculares={contenidosCurriculares}
      />
    </>
  )
}
