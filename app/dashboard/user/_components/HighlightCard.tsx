'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils.client";

interface HighlightCardProps { 
  variant: "success" | "warning";
  areaName: string;
  average: number;
  icon: React.ReactNode;
}

export const HighlightCard = ({ variant, areaName, average, icon }: HighlightCardProps) => {
  const wrapperClasses = cn("h-full flex flex-col", {
    "bg-green-100 dark:bg-green-900/30 border-green-500/50": variant === "success",
    "bg-amber-100 dark:bg-amber-900/30 border-amber-500/50": variant === "warning",
  });

  const valueClasses = cn("text-3xl font-bold", {
    "text-green-700 dark:text-green-400": variant === "success",
    "text-amber-700 dark:text-amber-400": variant === "warning",
  });

  const title = variant === 'success' ? 'Área Destacada' : 'Área de Enfoque';

  return (
    <Card className={wrapperClasses}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <p className="text-lg font-bold text-foreground/90">{areaName}</p>
        </div>
        {icon}
      </CardHeader>
      <CardContent className="flex items-end h-full">
        <div className={valueClasses}>
          {average.toFixed(0)}
        </div>
        <p className="text-xs text-muted-foreground ml-2">de promedio</p>
      </CardContent>
    </Card>
  );
};
