"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import type { ConfrontoEU } from "@/lib/types";

interface ConfrontoEUChartProps {
  confronto: ConfrontoEU;
}

export function ConfrontoEUChart({ confronto }: ConfrontoEUChartProps) {
  const data = [
    { paese: "🇳🇱 Olanda", stipendio: confronto.olanda, isItaly: false },
    { paese: "🇩🇪 Germania", stipendio: confronto.germania, isItaly: false },
    { paese: "🇫🇷 Francia", stipendio: confronto.francia, isItaly: false },
    { paese: "🇮🇹 Italia", stipendio: confronto.italia, isItaly: true },
    { paese: "🇪🇸 Spagna", stipendio: confronto.spagna, isItaly: false },
  ].sort((a, b) => b.stipendio - a.stipendio);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Confronto stipendi EU — {confronto.ruolo_stimato}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 10, right: 20, top: 5, bottom: 5 }}
            >
              <XAxis
                type="number"
                tickFormatter={(v) => `€${v.toLocaleString("it-IT")}`}
                fontSize={12}
              />
              <YAxis
                type="category"
                dataKey="paese"
                width={100}
                fontSize={13}
              />
              <Tooltip
                formatter={(value) =>
                  `€${Number(value).toLocaleString("it-IT", { minimumFractionDigits: 0 })}`
                }
                labelStyle={{ fontWeight: 600 }}
              />
              <Bar dataKey="stipendio" radius={[0, 4, 4, 0]} barSize={24}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.isItaly ? "#1e3a5f" : "#cbd5e1"}
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
