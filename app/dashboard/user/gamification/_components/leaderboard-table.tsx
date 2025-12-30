import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";

// Define a type for a leaderboard entry
interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  level: number;
  rank: number;
  isCurrentUser?: boolean;
}

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
}

export function LeaderboardTable({ leaderboard }: LeaderboardTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Rango</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-right">Puntos</TableHead>
            <TableHead className="text-right">Nivel</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.length > 0 ? (
            leaderboard.map((entry) => (
              <TableRow key={entry.id} className={entry.isCurrentUser ? "bg-primary/10" : ""}>
                <TableCell className="font-medium">{entry.rank}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell className="text-right">{entry.points}</TableCell>
                <TableCell className="text-right">{entry.level}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No hay datos en la tabla de clasificación.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
