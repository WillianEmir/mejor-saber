import { ClockIcon } from "lucide-react";

interface TimerProps {
  time: number;
  competenciaName?: string;
  areaName?: string;
  onFinish: () => void;
  isPending: boolean;
}

export const Timer = ({ time, competenciaName, onFinish, isPending, areaName }: TimerProps) => {
  
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                {formatTime(time)}
              </span>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 hidden md:block">
              {competenciaName || areaName}
            </h1>
          </div>
          <button 
            onClick={onFinish}
            disabled={isPending}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold cursor-pointer text-white shadow-sm hover:bg-green-700 disabled:opacity-50">
            {isPending ? 'Finalizando...' : 'Finalizar Intento'}
          </button>
        </div>
      </div>
    </div>
  );
};