import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"; // Assuming shadcn/ui card component
import { Progress } from "@/src/components/ui/progress"; // Assuming shadcn/ui progress component
import { GemIcon, TrophyIcon, UserIcon } from "lucide-react"; // Assuming lucide-react for icons
import { GamificationProfile } from "@/src/generated/prisma"; // Import Prisma model for type safety

interface GamificationProfileCardProps {
  profile: GamificationProfile; 
}

export function GamificationProfileCard({ profile }: GamificationProfileCardProps) {
  // Simple logic for points needed for next level (e.g., 100 points per level)
  const pointsForCurrentLevel = (profile.level - 1) * 100;
  const pointsForNextLevel = profile.level * 100;
  const progressValue = ((profile.points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Tu Perfil de Gamificación</CardTitle>
        <UserIcon className="h-8 w-8 text-muted-foreground" />
      </CardHeader>
      <CardContent className="grow flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <GemIcon className="h-5 w-5 text-yellow-500" />
            <p className="text-lg font-semibold">Nivel: {profile.level}</p>
          </div>
          <div className="flex items-center space-x-2">
            <TrophyIcon className="h-5 w-5 text-blue-500" />
            <p className="text-lg font-semibold">Puntos: {profile.points}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Progreso al siguiente nivel ({profile.level + 1}):</p>
            <Progress value={progressValue} className="w-full" />
            <p className="text-xs text-muted-foreground mt-1">
              {profile.points - pointsForCurrentLevel} / {pointsForNextLevel - pointsForCurrentLevel} puntos para el Nivel {profile.level + 1}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
