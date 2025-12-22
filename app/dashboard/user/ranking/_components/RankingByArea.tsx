import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { User } from 'lucide-react';
import { getRankingByArea } from '../_lib/ranking.data';
import { Areatype } from '@/app/dashboard/admin/areas/_lib/area.schema';

interface RankingByAreaProps {
  areas: Areatype[];
  schoolId: string;  
}

async function AreaRankingCard({ area, schoolId }: { area: Areatype, schoolId: string }) {
  const areaRanking = await getRankingByArea(schoolId, area.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">{area.nombre}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {areaRanking.slice(0, 5).map((user, index) => (
            <li key={user.id} className="flex items-center space-x-3">
              <span className="text-lg font-semibold">{index + 1}.</span>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.image || undefined} alt={user.name || ""} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{user.name}</span>
              <span className="ml-auto font-semibold text-primary">{user.score.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function RankingByArea({areas, schoolId}: RankingByAreaProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {areas.map((area) => (
        <AreaRankingCard key={area.id} area={area} schoolId={schoolId} />
      ))}
    </div>
  )
}