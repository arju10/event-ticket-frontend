"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const COLORS = [
  "hsl(262 83% 58%)",
  "hsl(210 100% 55%)",
  "hsl(142 76% 36%)",
  "hsl(38 92% 50%)",
  "hsl(0 84% 60%)",
  "hsl(280 65% 60%)",
  "hsl(180 65% 45%)",
  "hsl(340 75% 55%)",
  "hsl(25 85% 55%)",
  "hsl(215 16% 47%)",
];

interface CategoryPieChartProps {
  data: Array<{ category: string; count: number }>;
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartData = data
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Popular categories</CardTitle>
        <CardDescription>
          Event distribution across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground py-12 text-center text-sm">
            No events yet.
          </p>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
