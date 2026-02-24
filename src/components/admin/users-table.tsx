"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RotateCcw, Search, Download } from "lucide-react";
import { exportToCSV } from "@/lib/csv-export";

interface UserRow {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  analisi_count: number;
  profile: {
    marketing_consent: boolean;
    privacy_accepted_at: string;
  } | null;
}

export function UsersTable() {
  const router = useRouter();
  const [data, setData] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const perPage = 20;

  // Debounce ricerca
  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json.data);
      setTotal(json.total ?? json.data.length);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(total / perPage);

  function formatDate(iso: string | null) {
    if (!iso) return "\u2014";
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
      const params = new URLSearchParams({ per_page: "1000" });
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error();
      const json = await res.json();

      exportToCSV(
        "utenti.csv",
        ["Email", "Registrato il", "Ultimo accesso", "Analisi", "Marketing"],
        json.data.map((row: UserRow) => [
          row.email,
          formatDate(row.created_at),
          formatDate(row.last_sign_in_at),
          row.analisi_count.toString(),
          row.profile?.marketing_consent ? "Sì" : "No",
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
      {/* Ricerca e azioni */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per email..."
            className="pl-10 w-72"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
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
          {total} utent{total === 1 ? "e" : "i"}
        </p>
      )}

      {/* Tabella */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Registrato il</TableHead>
              <TableHead>Ultimo accesso</TableHead>
              <TableHead>Analisi</TableHead>
              <TableHead>Marketing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
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
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  {searchQuery
                    ? "Nessun utente trovato"
                    : "Nessun utente registrato"}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow
                  key={row.id}
                  className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                    i % 2 === 0 ? "bg-muted/20" : ""
                  }`}
                  onClick={() => router.push(`/admin/utenti/${row.id}`)}
                >
                  <TableCell className="font-medium">{row.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(row.created_at)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(row.last_sign_in_at)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.analisi_count}</Badge>
                  </TableCell>
                  <TableCell>
                    {row.profile?.marketing_consent ? (
                      <Badge className="bg-green-100 text-green-800">
                        Sì
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">No</span>
                    )}
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
