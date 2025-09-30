
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";

interface StudentProgressListProps {
  progress: any[]; // Replace 'any' with actual type from your server action
}

export const StudentProgressList = ({ progress }: StudentProgressListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progreso de Estudiantes por Eje Temático</CardTitle>
        <CardDescription>Visualiza el avance de cada estudiante en los diferentes ejes temáticos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {progress.map((student, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{student.studentName}</h3>
            <div className="space-y-2">
              {student.progress.map((eje: any, ejeIndex: number) => (
                <div key={ejeIndex}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{eje.ejeNombre}</span>
                    <span className="text-sm text-gray-500">{eje.progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={eje.progress} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
