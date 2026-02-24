"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RotateCcw, Download } from "lucide-react";
import { exportToCSV } from "@/lib/csv-export";

interface AnalisiRow {
  id: string;
  stato: string;
  semaforo: string | null;
  file_type: string;
  numero_anomalie: number;
  created_at: string;
}

const STATO_COLORS: Record<string, string> = {
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
};

const STATO_LABELS: Record<string, string> = {
  processing: "In elaborazione",
  completed: "Completata",
  error: "Errore",
};

const SEMAFORO_COLORS: Record<string, string> = {
  verde: "bg-green-500",
  giallo: "bg-yellow-400",
  rosso: "bg-red-500",
};

interface AnalisiTableProps {
  initialFilters?: {
    stato?: string;
    semaforo?: string;
    file_type?: string;
  };
}

export function AnalisiTable({ initialFilters }: AnalisiTableProps) {
  const router = useRouter();
  const [data, setData] = useState<AnalisiRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({
    stato: initialFilters?.stato || "",
    semaforo: initialFilters?.semaforo || "",
    file_type: initialFilters?.file_type || "",
  });

  const perPage = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      if (filters.stato) params.set("stato", filters.stato);
      if (filters.semaforo) params.set("semaforo", filters.semaforo);
      if (filters.file_type) params.set("file_type", filters.file_type);

      const res = await fetch(`/api/admin/analisi?${params}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json.data);
      setTotal(json.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(total / perPage);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleExport() {
    setExporting(true);
    try {
      const params = new URLSearchParams({ per_page: "10000" });
      if (filters.stato) params.set("stato", filters.stato);
      if (filters.semaforo) params.set("semaforo", filters.semaforo);
      if (filters.file_type) params.set("file_type", filters.file_type);

      const res = await fetch(`/api/admin/analisi?${params}`);
      if (!res.ok) throw new Error();
      const json = await res.json();

      exportToCSV(
        "analisi.csv",
        ["ID", "Stato", "Semaforo", "Tipo File", "Anomalie", "Data"],
        json.data.map((row: AnalisiRow) => [
          row.id,
          STATO_LABELS[row.stato] || row.stato,
          row.semaforo || "-",
          row.file_type,
          row.numero_anomalie.toString(),
          formatDate(row.created_at),
        ])
      );
    } catch {
      // silently fail
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filtri e azioni */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-3 flex-wrap">
          <Select
            value={filters.stato}
            onValueChange={(v) => {
              setFilters((f) => ({ ...f, stato: v === "tutti" ? "" : v }));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti gli stati</SelectItem>
              <SelectItem value="processing">In elaborazione</SelectItem>
              <SelectItem value="completed">Completata</SelectItem>
              <SelectItem value="error">Errore</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.semaforo}
            onValueChange={(v) => {
              setFilters((f) => ({ ...f, semaforo: v === "tutti" ? "" : v }));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Semaforo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti i semafori</SelectItem>
              <SelectItem value="verde">Verde</SelectItem>
              <SelectItem value="giallo">Giallo</SelectItem>
              <SelectItem value="rosso">Rosso</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.file_type}
            onValueChange={(v) => {
              setFilters((f) => ({
                ...f,
                file_type: v === "tutti" ? "" : v,
              }));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo file" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti i tipi</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={exporting || total === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          {exporting ? "Esportando..." : "Esporta CSV"}
        </Button>
      </div>

      {/* Conteggio risultati */}
      {!loading && !error && (
        <p className="text-sm text-muted-foreground">
          {total} risultat{total === 1 ? "o" : "i"}
        </p>
      )}

      {/* Tabella */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Semaforo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Anomalie</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <p className="text-muted-foreground">
                      Errore nel caricamento dei dati
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchData}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Riprova
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nessuna analisi trovata
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow
                  key={row.id}
                  className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                    i % 2 === 0 ? "bg-muted/20" : ""
                  }`}
                  onClick={() => router.push(`/admin/analisi/${row.id}`)}
                >
                  <TableCell
                    className="font-mono text-xs"
                    title={row.id}
                  >
                    {row.id.substring(0, 8)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={STATO_COLORS[row.stato] || ""}
                    >
                      {STATO_LABELS[row.stato] || row.stato}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {row.semaforo ? (
                      <span
                        className={`inline-block h-3 w-3 rounded-full ${
                          SEMAFORO_COLORS[row.semaforo] || ""
                        }`}
                      />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.file_type}</Badge>
                  </TableCell>
                  <TableCell>{row.numero_anomalie}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(row.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginazione */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Pagina {page} di {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Precedente
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Successiva
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
