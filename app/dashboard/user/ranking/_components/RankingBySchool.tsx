import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { Medal, User } from 'lucide-react'
import { RankingBySchoolType } from '../_lib/ranking.schema'

interface RankingBySchoolProps {
  generalRanking: RankingBySchoolType[]
}

export default function RankingBySchool({generalRanking}: RankingBySchoolProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Top 5 Estudiantes - Puntaje General</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {generalRanking.slice(0, 5).map((user, index) => (
            <li key={user.id} className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                {index < 3 && (
                  <Medal
                    className={`w-8 h-8 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-yellow-700"
                      }`}
                  />
                )}
                <span className={`text-xl font-bold ${index >= 3 && "ml-12"}`}>{index + 1}</span>
                <Avatar>
                  <AvatarImage src={user.avatar || undefined} alt={user.name || ""} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-lg font-medium">{user.name}</span>
              </div>
              <div className="ml-auto text-xl font-bold text-primary">{user.score.toFixed(1)}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
