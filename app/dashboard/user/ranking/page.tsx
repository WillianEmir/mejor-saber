import { auth } from "@/auth"; // Updated import

import { getRankingBySchool } from "./_lib/ranking.data";
import { getAreas } from "@/app/dashboard/admin/areas/_lib/area.data";

import RankingBySchool from "./_components/RankingBySchool";
import RankingByArea from "./_components/RankingByArea";

export default async function RankingPage() { 

  const session = await auth(); // Updated call
  const schoolId = session?.user?.schoolId; 

  if (!schoolId) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Ranking de Estudiantes</h1>
        <p className="text-center">No se pudo obtener el ranking. El usuario no está asociado a ninguna escuela.</p>
      </div>
    );
  }

  const generalRanking = await getRankingBySchool(schoolId);
  const areas = await getAreas();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Ranking de Estudiantes</h1>

      <RankingBySchool 
        generalRanking={generalRanking}
      />

      <RankingByArea
        areas={areas}
        schoolId={schoolId}
      />
    </div>
  );
}