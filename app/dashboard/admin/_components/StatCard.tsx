
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtext: string;
}

export const StatCard = ({ icon: Icon, title, value, subtext }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium tracking-tight">{title}</CardTitle>
      <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{subtext}</p>
    </CardContent>
  </Card>
);
