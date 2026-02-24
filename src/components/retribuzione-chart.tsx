"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface RetribuzioneChartProps {
  retribuzione: {
    lordo: number | null;
    netto: number | null;
    trattenute_totali: number | null;
    irpef?: number | null;
    inps?: number | null;
    addizionali?: number | null;
  };
}

export function RetribuzioneChart({ retribuzione }: RetribuzioneChartProps) {
  const netto = retribuzione.netto ?? 0;
  const trattenute = retribuzione.trattenute_totali ?? 0;
  const irpef = retribuzione.irpef ?? 0;
  const inps = retribuzione.inps ?? 0;
  const addizionali = retribuzione.addizionali ?? 0;

  if (netto === 0 && trattenute === 0) return null;

  const hasDetail = irpef > 0 || inps > 0 || addizionali > 0;

  const data = hasDetail
    ? [
        { name: "Netto", value: netto, color: "#22c55e" },
        { name: "IRPEF", value: irpef, color: "#ef4444" },
        { name: "INPS", value: inps, color: "#f59e0b" },
        { name: "Addizionali", value: addizionali, color: "#3b82f6" },
      ].filter((d) => d.value > 0)
    : [
        { name: "Netto", value: netto, color: "#22c55e" },
        { name: "Trattenute", value: trattenute, color: "#ef4444" },
      ].filter((d) => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white dark:bg-card rounded-xl border p-5">
      <div className="flex flex-col items-center">
        <div className="w-44 h-44 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={76}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  `€${Number(value).toLocaleString("it-IT", { minimumFractionDigits: 2 })}`
                }
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-foreground">
              &euro;{netto.toLocaleString("it-IT", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-muted-foreground">netto</span>
          </div>
        </div>

        <div className="w-full mt-4 space-y-2.5">
          {data.map((entry) => {
            const perc = total > 0 ? Math.round((entry.value / total) * 100) : 0;
            return (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-sm shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
                <span className="font-medium text-foreground">
                  &euro;{entry.value.toLocaleString("it-IT", { minimumFractionDigits: 0 })} ({perc}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
