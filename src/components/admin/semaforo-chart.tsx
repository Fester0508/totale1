"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface SemaforoChartProps {
  verde: number;
  giallo: number;
  rosso: number;
  onSegmentClick?: (semaforo: string) => void;
}

const COLORS = {
  verde: "#22c55e",
  giallo: "#eab308",
  rosso: "#ef4444",
};

const LABELS: Record<string, string> = {
  verde: "Verde",
  giallo: "Giallo",
  rosso: "Rosso",
};

export function SemaforoChart({
  verde,
  giallo,
  rosso,
  onSegmentClick,
}: SemaforoChartProps) {
  const totale = verde + giallo + rosso;
  if (totale === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        Nessun dato disponibile
      </div>
    );
  }

  const data = [
    { name: "verde", value: verde },
    { name: "giallo", value: giallo },
    { name: "rosso", value: rosso },
  ].filter((d) => d.value > 0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <ResponsiveContainer width={220} height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
              onClick={(entry) => onSegmentClick?.(entry.name)}
              className={onSegmentClick ? "cursor-pointer" : ""}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={((value: number | undefined, name?: string) => [
                value ?? 0,
                LABELS[name ?? ""] || name,
              ]) as never}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Totale al centro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold">{totale}</span>
          <span className="text-xs text-muted-foreground">totale</span>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex gap-6 text-sm">
        {[
          { key: "verde" as const, label: "Verde", count: verde },
          { key: "giallo" as const, label: "Giallo", count: giallo },
          { key: "rosso" as const, label: "Rosso", count: rosso },
        ].map((item) => (
          <button
            key={item.key}
            className={`flex items-center gap-1.5 ${
              onSegmentClick
                ? "hover:opacity-70 cursor-pointer"
                : "cursor-default"
            }`}
            onClick={() => onSegmentClick?.(item.key)}
            type="button"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[item.key] }}
            />
            {item.label}: {item.count} (
            {((item.count / totale) * 100).toFixed(0)}%)
          </button>
        ))}
      </div>
    </div>
  );
}
