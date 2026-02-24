"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  Netto: "#2E7D32",
  IRPEF: "#C62828",
  INPS: "#E65100",
  Addizionali: "#1565C0",
  Trattenute: "#C62828",
} as Record<string, string>;

interface DonutChartProps {
  retribuzione: {
    lordo: number | null;
    netto: number | null;
    trattenute_totali: number | null;
    irpef?: number | null;
    inps?: number | null;
    addizionali?: number | null;
  };
}

export function DonutChart({ retribuzione }: DonutChartProps) {
  const netto = retribuzione.netto ?? 0;
  const irpef = retribuzione.irpef ?? 0;
  const inps = retribuzione.inps ?? 0;
  const addizionali = retribuzione.addizionali ?? 0;
  const trattenute = retribuzione.trattenute_totali ?? 0;

  if (netto === 0 && trattenute === 0) return null;

  const hasDetail = irpef > 0 || inps > 0 || addizionali > 0;

  const data = hasDetail
    ? [
        { name: "Netto", value: netto },
        { name: "IRPEF", value: irpef },
        { name: "INPS", value: inps },
        { name: "Addizionali", value: addizionali },
      ].filter((d) => d.value > 0)
    : [
        { name: "Netto", value: netto },
        { name: "Trattenute", value: trattenute },
      ].filter((d) => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-card rounded-xl border p-5">
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
                  <Cell key={i} fill={COLORS[entry.name] ?? "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  `\u20ac${Number(value).toLocaleString("it-IT", { minimumFractionDigits: 2 })}`
                }
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-foreground">
              &euro;{netto.toLocaleString("it-IT", { minimumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-muted-foreground">netto</span>
          </div>
        </div>

        {/* Legend table */}
        <div className="w-full mt-4 space-y-2.5">
          {data.map((entry) => {
            const perc = total > 0 ? Math.round((entry.value / total) * 100) : 0;
            return (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-sm shrink-0"
                    style={{ backgroundColor: COLORS[entry.name] ?? "#94a3b8" }}
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
