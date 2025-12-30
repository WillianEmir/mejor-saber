import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { AwardIcon } from "lucide-react";

interface UserBadgeDisplay {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  earned: boolean;
  earnedAt?: Date;
}

interface BadgeCollectionProps {
  userBadges: UserBadgeDisplay[];
}

export function BadgeCollection({ userBadges }: BadgeCollectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {userBadges.length > 0 ? (
        userBadges.map((badge) => (
          <Card key={badge.id} className={badge.earned ? "border-primary" : "opacity-50"}>
            <CardHeader className="flex flex-row items-center gap-4">
              {badge.iconUrl ? (
                <img src={badge.iconUrl} alt={badge.name} className="w-10 h-10 object-contain" />
              ) : (
                <AwardIcon className="w-10 h-10 text-muted-foreground" />
              )}
              <div>
                <CardTitle>{badge.name}</CardTitle>
                <CardDescription>
                  {badge.earned ? `Obtenida el ${badge.earnedAt?.toLocaleDateString()}` : "No obtenida"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>{badge.description}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="col-span-full text-center text-muted-foreground">No hay insignias para mostrar.</p>
      )}
    </div>
  );
}
