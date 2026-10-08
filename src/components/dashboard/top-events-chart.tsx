"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { TrendingUp } from "lucide-react";

const BAR_COLORS = [
  "hsl(262 83% 58%)",
  "hsl(262 83% 62%)",
  "hsl(262 83% 66%)",
  "hsl(262 83% 70%)",
  "hsl(262 83% 74%)",
];

interface TopEventsChartProps {
  data: Array<{ id: string; title: string; revenue: number }>;
}

export function TopEventsChart({ data }: TopEventsChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top events by revenue</CardTitle>
          <CardDescription>Your best-performing events.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={TrendingUp}
            title="No data yet"
            description="Publish an event and start selling tickets to see this chart."
          />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    shortTitle: d.title.length > 18 ? `${d.title.slice(0, 18)}…` : d.title,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top events by revenue</CardTitle>
        <CardDescription>Your best-performing events.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-neutral-200 dark:stroke-neutral-800"
                vertical={false}
              />
              <XAxis
                dataKey="shortTitle"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tick={{ fill: "currentColor" }}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "currentColor" }}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: number) => [
                  `৳${value.toLocaleString()}`,
                  "Revenue",
                ]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.title ?? ""
                }
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
