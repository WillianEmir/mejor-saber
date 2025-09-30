
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/Button";

interface SimulacroResultsTableProps {
  results: any[]; // Replace 'any' with actual type from your server action
}

export const SimulacroResultsTable = ({ results }: SimulacroResultsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados Detallados de Simulacros</CardTitle>
        <CardDescription>Visualiza el rendimiento de los estudiantes en los simulacros.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estudiante</TableHead>
              <TableHead>Simulacro</TableHead>
              <TableHead>Puntaje</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.user.firstName} {result.user.lastName}</TableCell>
                <TableCell>{result.competencia.nombre}</TableCell>
                <TableCell>{result.score}</TableCell>
                <TableCell>{new Date(result.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Ver Detalles</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
