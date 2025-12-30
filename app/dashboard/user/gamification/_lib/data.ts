'use server'

import prisma from "@/src/lib/prisma"; 

// Helper type for combined user badge data
type UserBadgeDisplay = {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  earned: boolean;
  earnedAt?: Date;
};

// Function to get the user's gamification profile
export async function getGamificationProfile(userId: string) {  
  try {
    const profile = await prisma.gamificationProfile.findUnique({
      where: { userId },
    });
    return profile;
  } catch (error) {
    console.error("Error fetching gamification profile:", error);
    return null;
  }
}

// Function to get all badges, marking which ones the user has earned
export async function getBadges(userId: string): Promise<UserBadgeDisplay[]> {
  try {
    const allBadges = await prisma.badge.findMany();
    const userEarnedBadges = await prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true, earnedAt: true },
    });

    const earnedBadgeMap = new Map<string, Date>();
    userEarnedBadges.forEach((ub) => earnedBadgeMap.set(ub.badgeId, ub.earnedAt));

    return allBadges.map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      iconUrl: badge.iconUrl || undefined,
      earned: earnedBadgeMap.has(badge.id),
      earnedAt: earnedBadgeMap.get(badge.id) || undefined,
    }));
  } catch (error) {
    console.error("Error fetching badges:", error);
    return [];
  }
}

// Define a type for a leaderboard entry for consistent return
interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  level: number;
  rank: number; // Rank will be calculated after fetching
  isCurrentUser?: boolean;
}

// Function to get leaderboard data
export async function getLeaderboardData(
  scope: "global" | "school",
  schoolId?: string,
  currentUserId?: string
): Promise<LeaderboardEntry[]> {
  try {
    let whereClause = {};
    if (scope === "school" && schoolId) {
      whereClause = { user: { schoolId } };
    }

    const rawLeaderboard = await prisma.gamificationProfile.findMany({
      where: whereClause,
      orderBy: { points: "desc" },
      take: 100, // Limit to top 100 for performance
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            image: true,
          },
        },
      },
    });

    // Map and calculate rank
    return rawLeaderboard.map((entry, index) => ({
      id: entry.userId,
      name: `${entry.user.name} ${entry.user.lastName || ""}`.trim(), 
      points: entry.points,
      level: entry.level,
      rank: index + 1,
      isCurrentUser: currentUserId === entry.userId,
    }));
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
  }
}

// You might need more data functions, e.g., for challenges, daily streaks etc.
