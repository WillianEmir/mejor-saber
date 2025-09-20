
import { getEjeTematicoWithPreguntas } from '@/src/lib/data/study-material.data';
import EjeTematicoViewer from '@/src/components/dashboard/user/study-material/EjeTematicoViewer';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    ejeTematicoId: string;
  };
}

export default async function EjeTematicoPage({ params }: PageProps) {
  const { ejeTematicoId } = params;

  if (!ejeTematicoId) {
    notFound();
  }

  const ejeTematico = await getEjeTematicoWithPreguntas(ejeTematicoId);

  if (!ejeTematico) {
    notFound();
  }

  return <EjeTematicoViewer ejeTematico={ejeTematico} />;
}

// Optional: Add metadata generation
export async function generateMetadata({ params }: PageProps) {
  const ejeTematico = await getEjeTematicoWithPreguntas(params.ejeTematicoId);
  if (!ejeTematico) {
    return { title: 'Tema no encontrado' };
  }
  return { title: `Estudiando: ${ejeTematico.nombre}` };
}
