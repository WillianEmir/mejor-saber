
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export const SummaryCard = ({ title, value, icon }: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
