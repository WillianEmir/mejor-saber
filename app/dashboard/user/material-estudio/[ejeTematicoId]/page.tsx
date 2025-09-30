import { EjeTematicoView } from "../../../../../src/components/dashboard/user-contenidos/eje-tematico-view";
import { getEjeTematicodwithRelations } from "@/src/lib/data/ejeTematico.data";

interface Props {
  params: Promise<{
    ejeTematicoId: string;
  }>;
}
export default async function EjeTematicoPage({ params }: Props) {

  const { ejeTematicoId } = await params;

  const ejeTematico = await getEjeTematicodwithRelations(ejeTematicoId);

  if (!ejeTematico) {
    return <p>Eje temático no encontrado</p>;
  }

  return (
    <EjeTematicoView
      ejeTematico={ejeTematico}
    />
  )

}
