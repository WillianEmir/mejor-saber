"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { GemIcon, TrophyIcon } from "lucide-react";
import Link from "next/link";
import { useGamificationStore } from "@/src/store/gamification.store"; // Importar el store de Zustand

export default function GamificationHUD() {
  const { data: session } = useSession();
  const { profile, isLoading, error, fetchProfile } = useGamificationStore(); // Usar el store de Zustand

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile(session.user.id);
    }
  }, [session?.user?.id, fetchProfile]); // fetchProfile se añade a las dependencias, pero Zustand garantiza estabilidad

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 p-2 rounded-md transition-colors animate-pulse">
        <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
        <div className="h-4 w-8 bg-gray-300 rounded"></div>
        <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
        <div className="h-4 w-8 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching gamification profile:", error);
    return null; // O mostrar un indicador de error en la UI
  }

  if (!profile) {
    return null; // No hay perfil y no está cargando, quizás el usuario no tiene uno aún.
  }

  return (
    <Link href="/dashboard/user/gamification" className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors">
      <div className="flex items-center space-x-1">
        <GemIcon className="h-6 w-6 text-yellow-500" />
        <span className="text-xl font-medium">{profile.level}</span>
      </div>
      <div className="flex items-center space-x-1">
        <TrophyIcon className="h-6 w-6 text-blue-500" />
        <span className="text-xl font-medium">{profile.points}</span>
      </div>
    </Link>
  );
}
