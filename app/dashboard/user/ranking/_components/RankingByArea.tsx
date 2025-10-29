import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { User } from 'lucide-react';
import { getRankingByArea } from '../_lib/ranking.data';
import { Areatype } from '@/app/dashboard/admin/areas/_lib/area.schema';

interface RankingByAreaProps {
  areas: Areatype[];
  schoolId: string;
}

export default async function RankingByArea({areas, schoolId}: RankingByAreaProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {areas.map(async (area) => {
        const areaRanking = await getRankingByArea(schoolId, area.id);
        return (
          <Card key={area.id}>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">{area.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {areaRanking.slice(0, 5).map((user, index) => (
                  <li key={user.id} className="flex items-center space-x-3">
                    <span className="text-lg font-semibold">{index + 1}.</span>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.name || ""} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                    <span className="ml-auto font-semibold text-primary">{user.score.toFixed(1)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  )
}
