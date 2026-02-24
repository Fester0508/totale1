"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/admin/metric-card";
import { SemaforoChart } from "@/components/admin/semaforo-chart";
import { TrendChart } from "@/components/admin/trend-chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  RotateCcw,
  Users,
  FileSearch,
  BarChart3,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

interface Stats {
  contatori: { totale: number; oggi: number; settimana: number; mese: number };
  utenti_registrati: number;
  semaforo: { verde: number; giallo: number; rosso: number };
  tasso_errore: string;
  top_ccnl: Array<{ ccnl: string; totale: number }>;
  top_anomalie: Array<{ titolo: string; totale: number }>;
  costo_ai_mese: number;
  trend_30_giorni: Array<{ data: string; conteggio: number }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  const fetchStats = useCallback(() => {
    setLoading(true);
    setError(false);
    fetch("/api/admin/stats")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Errore nel caricamento
        </h2>
        <p className="text-muted-foreground mb-6">
          Non siamo riusciti a caricare le statistiche.
        </p>
        <Button variant="outline" onClick={fetchStats}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Riprova
        </Button>
      </div>
    );
  }

  const maxCcnl = stats.top_ccnl.length > 0 ? stats.top_ccnl[0].totale : 1;
  const maxAnomalie = stats.top_anomalie.length > 0 ? stats.top_anomalie[0].totale : 1;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Metriche principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Utenti registrati"
          value={stats.utenti_registrati}
          icon={Users}
          iconColor="blue"
          href="/admin/utenti"
        />
        <MetricCard
          title="Analisi oggi"
          value={stats.contatori.oggi}
          subtitle={`${stats.contatori.settimana} questa settimana`}
          icon={FileSearch}
          iconColor="green"
          href="/admin/analisi"
        />
        <MetricCard
          title="Analisi totali"
          value={stats.contatori.totale}
          subtitle={`${stats.contatori.mese} questo mese`}
          icon={BarChart3}
          iconColor="purple"
          href="/admin/analisi"
        />
        <MetricCard
          title="Tasso errore"
          value={`${stats.tasso_errore}%`}
          icon={AlertTriangle}
          iconColor="red"
          href="/admin/analisi?stato=error"
        />
        <MetricCard
          title="Costo AI (mese)"
          value={`$${stats.costo_ai_mese.toFixed(2)}`}
          icon={DollarSign}
          iconColor="amber"
          href="/admin/costi"
        />
      </div>

      {/* Trend 30 giorni */}
      <Card>
        <CardHeader>
          <CardTitle>Andamento Analisi (30 giorni)</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={stats.trend_30_giorni} />
        </CardContent>
      </Card>

      {/* Distribuzione semaforo */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuzione Semaforo</CardTitle>
        </CardHeader>
        <CardContent>
          <SemaforoChart
            verde={stats.semaforo.verde}
            giallo={stats.semaforo.giallo}
            rosso={stats.semaforo.rosso}
            onSegmentClick={(semaforo) =>
              router.push(`/admin/analisi?semaforo=${semaforo}`)
            }
          />
        </CardContent>
      </Card>

      {/* Top CCNL e Top Anomalie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>CCNL più frequenti</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.top_ccnl.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessun dato</p>
            ) : (
              <div className="space-y-3">
                {stats.top_ccnl.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm truncate flex-1 mr-2">
                        <span className="text-xs text-muted-foreground font-mono mr-2">
                          #{i + 1}
                        </span>
                        {item.ccnl}
                      </span>
                      <span className="text-sm font-semibold tabular-nums">
                        {item.totale}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/60 rounded-full transition-all"
                        style={{
                          width: `${(item.totale / maxCcnl) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anomalie più frequenti</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.top_anomalie.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessun dato</p>
            ) : (
              <div className="space-y-3">
                {stats.top_anomalie.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm truncate flex-1 mr-2">
                        <span className="text-xs text-muted-foreground font-mono mr-2">
                          #{i + 1}
                        </span>
                        {item.titolo}
                      </span>
                      <span className="text-sm font-semibold tabular-nums">
                        {item.totale}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500/60 rounded-full transition-all"
                        style={{
                          width: `${(item.totale / maxAnomalie) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
