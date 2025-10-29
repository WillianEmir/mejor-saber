import { getAreasWithRelations } from '@/app/dashboard/admin/areas/_lib/area.data'
import { getContenidosWithRelations } from '@/app/dashboard/admin/contenidos-curriculares/_lib/contenidoCurricular.data'
import { getPreguntasCount, getPreguntasWithRelations } from '@/src/lib/data/preguntas.data'

import AdminPreguntas from '@/src/components/dashboard/admin-preguntas/AdminPreguntas' 

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

  return (
    <>
      <AdminPreguntas
        preguntas={preguntas}
        totalPages={totalPages}
        currentPage={currentPage}
        areas={areas}
        contenidosCurriculares={contenidosCurriculares}
      />
    </>
  )
}
