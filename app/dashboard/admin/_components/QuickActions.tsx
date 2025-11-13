
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import Link from "next/link";

export const QuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Acciones Rápidas</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <Button asChild variant="outline" className="w-full justify-start">
        <Link href="/dashboard/admin/users">Gestionar Usuarios</Link>
      </Button>
      <Button asChild variant="outline" className="w-full justify-start">
        <Link href="/dashboard/admin/preguntas">Gestionar Preguntas</Link>
      </Button>
      <Button asChild variant="outline" className="w-full justify-start">
        <Link href="/dashboard/admin/areas">Gestionar Áreas y Competencias</Link>
      </Button>
    </CardContent>
  </Card>
);
