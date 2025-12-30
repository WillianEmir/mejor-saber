import { getBadges } from "./_lib/Badge.data";
import { Badges } from "./_components/Badges";

export default async function InsigniasPage() {
  const badges = await getBadges();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Administración de Insignias</h1>
      <Badges initialBadges={badges} />
    </div>
  );
}