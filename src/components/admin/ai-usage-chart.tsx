"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DayData {
  data: string;
  costo_usd: number;
  chiamate: number;
}

interface AIUsageChartProps {
  perGiorno: DayData[];
}

export function AIUsageChart({ perGiorno }: AIUsageChartProps) {
  if (perGiorno.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-8 text-center">
        Nessun dato disponibile
      </div>
    );
  }

  const chartData = perGiorno.map((d) => ({
    ...d,
    costo_usd: Number(d.costo_usd.toFixed(4)),
    label: d.data.substring(5),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `$${v}`}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: 13,
          }}
          formatter={((value: number | undefined, name?: string) => {
            const v = value ?? 0;
            if (name === "costo_usd") return [`$${v.toFixed(4)}`, "Costo"];
            return [v, "Chiamate"];
          }) as never}
          labelFormatter={(label) => `Data: ${label}`}
        />
        <Bar
          dataKey="costo_usd"
          fill="hsl(var(--primary))"
          radius={[6, 6, 0, 0]}
          opacity={0.8}
          animationDuration={500}
        />
        <Line
          type="monotone"
          dataKey="costo_usd"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          animationDuration={500}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
