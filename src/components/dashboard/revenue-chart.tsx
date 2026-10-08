"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
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
import { BarChart3 } from "lucide-react";

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number; bookings: number }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue trend</CardTitle>
          <CardDescription>Estimated revenue by event date.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={BarChart3}
            title="No revenue data yet"
            description="Once you have published events with bookings, revenue will appear here."
          />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Revenue trend</CardTitle>
        <CardDescription>Estimated revenue by event date.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(262 83% 58%)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(262 83% 58%)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-neutral-200 dark:stroke-neutral-800"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "currentColor" }}
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
                formatter={(value: number, name: string) => {
                  if (name === "revenue")
                    return [`৳${value.toLocaleString()}`, "Revenue"];
                  return [value, "Bookings"];
                }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(262 83% 58%)"
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
