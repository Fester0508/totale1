"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendChartProps {
  data: Array<{ data: string; conteggio: number }>;
}

export function TrendChart({ data }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Nessun dato disponibile
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="data"
          tick={{ fontSize: 11 }}
          tickFormatter={(v: string) => v.slice(5)}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          tick={{ fontSize: 11 }}
          allowDecimals={false}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: 13,
          }}
          formatter={((value: number | undefined) => [value ?? 0, "Analisi"]) as never}
          labelFormatter={(label) => `Data: ${label}`}
        />
        <Area
          type="monotone"
          dataKey="conteggio"
          stroke="hsl(var(--primary))"
          fill="url(#trendGradient)"
          strokeWidth={2}
          animationDuration={500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
