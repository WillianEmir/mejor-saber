import { notFound } from "next/navigation";

import { getEjeTematicodwithRelations } from "@/src/lib/data/ejeTematico.data";

import { EjeTematicoView } from "../_components/EjeTematicoView";

interface Props {
  params: Promise<{
    ejeTematicoId: string;
  }>;
}
export default async function EjeTematicoPage({ params }: Props) {

  const { ejeTematicoId } = await params;

  const ejeTematico = await getEjeTematicodwithRelations(ejeTematicoId);

  if (!ejeTematico) notFound()

  return ( 
    <EjeTematicoView
      ejeTematico={ejeTematico}
    />
  )

}
