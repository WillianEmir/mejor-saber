"use server";

import { auth } from "@/auth";
import prisma from "@/src/lib/prisma";

// Define the types of actions that can award points/badges
export type GamificationActionType =
  | "COMPLETE_SIMULACRO_COMPETENCIA"
  | "COMPLETE_SIMULACRO_AREA"
  | "HIGH_SCORE_SIMULACRO"
  | "DAILY_LOGIN"
  | "COMPLETE_ACTIVIDAD";

interface AwardPointsParams {
  userId: string;
  actionType: GamificationActionType;
  score?: number; // Optional: for actions like HIGH_SCORE_SIMULACRO
}

// Function to calculate points based on action type
const calculatePoints = (actionType: GamificationActionType, score?: number): number => {
  switch (actionType) {
    case "COMPLETE_SIMULACRO_COMPETENCIA":
      return 50;
    case "COMPLETE_SIMULACRO_AREA":
      return 100;
    case "HIGH_SCORE_SIMULACRO":
      return score && score >= 80 ? 25 : 0; // Bonus for high score
    case "DAILY_LOGIN":
      return 10;
    case "COMPLETE_ACTIVIDAD":
      return 15;
    default:
      return 0;
  }
};

// Function to check and award badges
const checkAndAwardBadges = async (userId: string, actionType: GamificationActionType) => {
  // This is a simplified example. In a real app, you'd have more complex logic
  // to check various criteria for badges (e.g., "complete 5 simulacros", "reach level X")

  const earnedBadges: string[] = [];

  // Example: "Primer Simulacro" badge
  if (actionType === "COMPLETE_SIMULACRO_COMPETENCIA" || actionType === "COMPLETE_SIMULACRO_AREA") {
    const simulacrosCount = await prisma.simulacro.count({ where: { userId } });
    if (simulacrosCount === 1) {
      const badge = await prisma.badge.findUnique({ where: { name: "Primer Simulacro" } });
      if (badge) {
        await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
        earnedBadges.push(badge.name);
      }
    }
  }

  // More badge logic here...

  return earnedBadges; // Return names of newly earned badges
};

// Server Action to award points and check for badges
export async function awardPointsAndCheckBadges({ userId, actionType, score }: AwardPointsParams) {
  try {
    const pointsToAward = calculatePoints(actionType, score);

    if (pointsToAward > 0) {
      const gamificationProfile = await prisma.gamificationProfile.upsert({
        where: { userId },
        update: { points: { increment: pointsToAward } },
        create: { userId, points: pointsToAward },
      });

      // Simplified level up logic (could be more complex)
      const newLevel = Math.floor(gamificationProfile.points / 100) + 1; // 100 points per level
      if (newLevel > gamificationProfile.level) {
        await prisma.gamificationProfile.update({
          where: { userId },
          data: { level: newLevel },
        });
      }
    }

    const newlyEarnedBadges = await checkAndAwardBadges(userId, actionType);

    return { success: true, pointsAwarded: pointsToAward, newlyEarnedBadges };
  } catch (error) {
    console.error("Error awarding points or checking badges:", error);
    return { success: false, error: "Failed to award points or check badges." };
  }
}

// Server Action for daily login reward (example)
export async function claimDailyLoginReward() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  // Basic check for last login (could be more sophisticated)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.lastLogin && new Date(user.lastLogin).toDateString() === new Date().toDateString()) {
    return { success: false, error: "Daily login reward already claimed today." };
  }

  // Award points
  const result = await awardPointsAndCheckBadges({ userId, actionType: "DAILY_LOGIN" });

  if (result.success) {
    // Update last login date
    await prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  return result;
}

// You might also need actions for creating/managing badges for ADMIN, but that's out of scope for user gamification
