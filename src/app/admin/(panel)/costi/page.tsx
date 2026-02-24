"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/admin/metric-card";
import { AIUsageChart } from "@/components/admin/ai-usage-chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  RotateCcw,
  DollarSign,
  Zap,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

interface AIUsageStats {
  totale_chiamate: number;
  totale_tokens_input: number;
  totale_tokens_output: number;
  totale_costo_usd: number;
  totale_errori: number;
  per_modello: Array<{
    modello: string;
    chiamate: number;
    tokens_input: number;
    tokens_output: number;
    costo_usd: number;
  }>;
  per_giorno: Array<{
    data: string;
    chiamate: number;
    costo_usd: number;
    tokens_input: number;
    tokens_output: number;
  }>;
}

export default function CostiPage() {
  const [stats, setStats] = useState<AIUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [period, setPeriod] = useState("month");

  const fetchStats = useCallback(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/admin/ai-usage?period=${period}`)
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
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  function formatTokens(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Costi AI</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
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
          Non siamo riusciti a caricare i dati sui costi.
        </p>
        <Button variant="outline" onClick={fetchStats}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Riprova
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Costi AI</h1>
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="today">Oggi</TabsTrigger>
            <TabsTrigger value="week">Settimana</TabsTrigger>
            <TabsTrigger value="month">Mese</TabsTrigger>
            <TabsTrigger value="all">Tutto</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Metriche */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Costo totale"
          value={`$${stats.totale_costo_usd.toFixed(2)}`}
          icon={DollarSign}
          iconColor="amber"
        />
        <MetricCard
          title="Chiamate"
          value={stats.totale_chiamate}
          subtitle={`${stats.totale_errori} errori`}
          icon={Zap}
          iconColor="blue"
        />
        <MetricCard
          title="Token input"
          value={formatTokens(stats.totale_tokens_input)}
          icon={ArrowDownToLine}
          iconColor="green"
        />
        <MetricCard
          title="Token output"
          value={formatTokens(stats.totale_tokens_output)}
          icon={ArrowUpFromLine}
          iconColor="purple"
        />
      </div>

      {/* Grafico costi per giorno */}
      <Card>
        <CardHeader>
          <CardTitle>Costo per giorno</CardTitle>
        </CardHeader>
        <CardContent>
          <AIUsageChart perGiorno={stats.per_giorno} />
        </CardContent>
      </Card>

      {/* Dettaglio per modello */}
      <Card>
        <CardHeader>
          <CardTitle>Dettaglio per modello</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.per_modello.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessun dato</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Modello</TableHead>
                  <TableHead>Chiamate</TableHead>
                  <TableHead>Token input</TableHead>
                  <TableHead>Token output</TableHead>
                  <TableHead>Costo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.per_modello.map((m, i) => (
                  <TableRow key={m.modello} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <TableCell className="font-mono text-sm">
                      {m.modello}
                    </TableCell>
                    <TableCell>{m.chiamate}</TableCell>
                    <TableCell>{formatTokens(m.tokens_input)}</TableCell>
                    <TableCell>{formatTokens(m.tokens_output)}</TableCell>
                    <TableCell>${m.costo_usd.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dettaglio per giorno */}
      {stats.per_giorno.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dettaglio giornaliero</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Chiamate</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Costo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.per_giorno.map((d, i) => (
                  <TableRow key={d.data} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <TableCell>{d.data}</TableCell>
                    <TableCell>{d.chiamate}</TableCell>
                    <TableCell>
                      {formatTokens(d.tokens_input + d.tokens_output)}
                    </TableCell>
                    <TableCell>${d.costo_usd.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
