import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { GamificationProfileCard } from "../_components/gamification-profile-card"; // This component needs to be created
import { BadgeCollection } from "./_components/badge-collection";
import { LeaderboardTable } from "./_components/leaderboard-table";
import { getGamificationProfile, getBadges, getLeaderboardData } from "./_lib/data";

export default async function GamificationPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin"); 
  }

  const userId = session.user.id;
  const profile = await getGamificationProfile(userId);
  const userBadges = await getBadges(userId);
  const globalLeaderboard = await getLeaderboardData("global");
  // const schoolLeaderboard = await getLeaderboardData("school", session.user.schoolId); // If user has a school

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Centro de Gamificación</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile && <GamificationProfileCard profile={profile} />}
        {/* Placeholder for a custom component displaying recent activity or challenges */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
          <p className="text-muted-foreground">Aquí se mostrarán tus logros y actividades más recientes.</p>
          {/* Example: Display recent badges earned or points gained */}
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Mis Insignias</h2>
        <BadgeCollection userBadges={userBadges} />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Tabla de Clasificación Global</h2>
        <LeaderboardTable leaderboard={globalLeaderboard} />
      </section>

      {/* Optionally display school leaderboard if applicable */}
      {/* {session.user.schoolId && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Tabla de Clasificación de mi Colegio</h2>
          <LeaderboardTable leaderboard={schoolLeaderboard} />
        </section>
      )} */}
    </div>
  );
}
