import { create } from "zustand";
import { getGamificationProfile as fetchGamificationProfileFromServer } from "@/app/dashboard/user/gamification/_lib/data"; // Alias to avoid naming conflict

// Define the shape of the gamification profile data
interface GamificationProfile {
  id: string;
  userId: string;
  points: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the state and actions for the Zustand store
interface GamificationState {
  profile: GamificationProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  clearProfile: () => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({ 
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const fetchedProfile = await fetchGamificationProfileFromServer(userId);
      // Prisma returns dates as Date objects if not serialized, so this should be fine.
      // If fetchedProfile.createdAt or updatedAt were strings, they'd need to be new Date(string)
      set({ profile: fetchedProfile, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch gamification profile:", err);
      set({ error: "Failed to load gamification data.", isLoading: false });
    }
  },

  clearProfile: () => set({ profile: null, isLoading: false, error: null }),
}));
