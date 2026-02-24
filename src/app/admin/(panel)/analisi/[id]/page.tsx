"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteAnalisiDialog } from "@/components/admin/delete-analisi-dialog";
import { AlertCircle, RotateCcw } from "lucide-react";
import type { RisultatoAnalisi, AIUsage } from "@/lib/types";

interface AnalisiDetail {
  id: string;
  session_id: string;
  file_url: string;
  file_type: string;
  stato: string;
  semaforo: string | null;
  numero_anomalie: number;
  dati_estratti: Record<string, unknown> | null;
  risultato: RisultatoAnalisi | null;
  processing_started_at: string | null;
  created_at: string;
  expires_at: string;
}

const SEMAFORO_COLORS: Record<string, string> = {
  verde: "bg-green-500",
  giallo: "bg-yellow-400",
  rosso: "bg-red-500",
};

export default function AnalisiDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [analisi, setAnalisi] = useState<AnalisiDetail | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [aiUsage, setAiUsage] = useState<AIUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const fetchAnalisi = useCallback(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/admin/analisi/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setAnalisi(data.analisi);
        setSignedUrl(data.signed_url);
        setAiUsage(data.ai_usage);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchAnalisi();
  }, [fetchAnalisi]);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (error || !analisi) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {error ? "Errore nel caricamento" : "Analisi non trovata"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {error
            ? "Non siamo riusciti a caricare i dettagli dell'analisi."
            : "L'analisi richiesta non esiste o è stata eliminata."}
        </p>
        <div className="flex gap-3">
          {error && (
            <Button variant="outline" onClick={fetchAnalisi}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Riprova
            </Button>
          )}
          <Button variant="ghost" onClick={() => router.push("/admin/analisi")}>
            Torna alla lista
          </Button>
        </div>
      </div>
    );
  }

  const risultato = analisi.risultato;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/analisi")}
            className="mb-2"
          >
            &larr; Torna alla lista
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Analisi
            <span className="font-mono text-base text-muted-foreground">
              {analisi.id.substring(0, 8)}
            </span>
            {analisi.semaforo && (
              <span
                className={`inline-block h-4 w-4 rounded-full ${
                  SEMAFORO_COLORS[analisi.semaforo] || ""
                }`}
              />
            )}
          </h1>
        </div>
        <DeleteAnalisiDialog
          analisiId={analisi.id}
          onDeleted={() => router.push("/admin/analisi")}
        />
      </div>

      {/* Info generali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Stato</div>
            <Badge className="mt-1">{analisi.stato}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Tipo file</div>
            <div className="font-medium mt-1">{analisi.file_type}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Anomalie</div>
            <div className="font-medium mt-1">{analisi.numero_anomalie}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Creata il</div>
            <div className="font-medium mt-1 text-sm">
              {formatDate(analisi.created_at)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonna sinistra: dati analisi */}
        <div className="space-y-4">
          {/* Dati anagrafici */}
          {risultato?.dati_anagrafici && (
            <Card>
              <CardHeader>
                <CardTitle>Dati Anagrafici</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                {risultato.dati_anagrafici.nome && (
                  <div>
                    <span className="text-muted-foreground">Nome:</span>{" "}
                    {risultato.dati_anagrafici.nome}
                  </div>
                )}
                {risultato.dati_anagrafici.azienda && (
                  <div>
                    <span className="text-muted-foreground">Azienda:</span>{" "}
                    {risultato.dati_anagrafici.azienda}
                  </div>
                )}
                {risultato.dati_anagrafici.ccnl && (
                  <div>
                    <span className="text-muted-foreground">CCNL:</span>{" "}
                    {risultato.dati_anagrafici.ccnl}
                  </div>
                )}
                {risultato.dati_anagrafici.livello && (
                  <div>
                    <span className="text-muted-foreground">Livello:</span>{" "}
                    {risultato.dati_anagrafici.livello}
                  </div>
                )}
                {risultato.dati_anagrafici.mese_anno && (
                  <div>
                    <span className="text-muted-foreground">Periodo:</span>{" "}
                    {risultato.dati_anagrafici.mese_anno}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Retribuzione */}
          {risultato?.retribuzione && (
            <Card>
              <CardHeader>
                <CardTitle>Retribuzione</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                {risultato.retribuzione.lordo != null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lordo</span>
                    <span className="font-medium">
                      &euro;{risultato.retribuzione.lordo.toFixed(2)}
                    </span>
                  </div>
                )}
                {risultato.retribuzione.netto != null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Netto</span>
                    <span className="font-medium">
                      &euro;{risultato.retribuzione.netto.toFixed(2)}
                    </span>
                  </div>
                )}
                {risultato.retribuzione.trattenute_totali != null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trattenute</span>
                    <span className="font-medium">
                      &euro;{risultato.retribuzione.trattenute_totali.toFixed(2)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Riepilogo */}
          {risultato?.riepilogo && (
            <Card>
              <CardHeader>
                <CardTitle>Riepilogo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{risultato.riepilogo}</p>
              </CardContent>
            </Card>
          )}

          {/* Anomalie */}
          {risultato?.anomalie && risultato.anomalie.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Anomalie ({risultato.anomalie.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {risultato.anomalie.map((a, i) => (
                  <div key={i} className="border-l-2 border-red-500 pl-3">
                    <div className="font-medium text-sm">{a.titolo}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Impatto: {a.impatto_economico}
                    </div>
                    <div className="text-xs mt-1">{a.cosa_fare}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonna destra: file preview + dati tecnici */}
        <div className="space-y-4">
          {/* File preview */}
          {signedUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Documento</CardTitle>
              </CardHeader>
              <CardContent>
                {analisi.file_type === "pdf" ? (
                  <iframe
                    src={signedUrl}
                    className="w-full h-96 border rounded"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={signedUrl}
                    alt="Documento"
                    className="w-full rounded border"
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Usage */}
          {aiUsage.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Utilizzo AI</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fase</TableHead>
                      <TableHead>Modello</TableHead>
                      <TableHead>Token</TableHead>
                      <TableHead>Costo</TableHead>
                      <TableHead>Durata</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiUsage.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="capitalize">{u.fase}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {u.modello}
                        </TableCell>
                        <TableCell className="text-xs">
                          {u.tokens_input + u.tokens_output}
                        </TableCell>
                        <TableCell className="text-xs">
                          ${Number(u.costo_usd).toFixed(4)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {u.durata_ms ? `${(u.durata_ms / 1000).toFixed(1)}s` : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Dati OCR raw */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Dati OCR</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRaw(!showRaw)}
                >
                  {showRaw ? "Nascondi" : "Mostra"}
                </Button>
              </div>
            </CardHeader>
            {showRaw && (
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-96">
                  {JSON.stringify(analisi.dati_estratti, null, 2)}
                </pre>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      <Separator />

      {/* Info tecniche */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div>ID completo: {analisi.id}</div>
        <div>Session ID: {analisi.session_id}</div>
        <div>File URL: {analisi.file_url}</div>
        <div>Scadenza: {formatDate(analisi.expires_at)}</div>
      </div>
    </div>
  );
}
