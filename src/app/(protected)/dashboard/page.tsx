import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  TrendingUp,
  ShieldAlert,
  Euro,
} from "lucide-react";

const semaforoBadge = {
  verde: {
    label: "Tutto OK",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  giallo: {
    label: "Attenzione",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  rosso: {
    label: "Problemi",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: analisi } = await admin
    .from("analisi")
    .select("id, stato, semaforo, numero_anomalie, created_at, file_type, risultato")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const items = analisi ?? [];

  /* ── Compute summary stats ── */
  const completedItems = items.filter((i) => i.stato === "completed");
  const totalAnomalies = items.reduce((sum, i) => sum + (i.numero_anomalie ?? 0), 0);
  const totalRecoverable = completedItems.reduce((sum, i) => {
    const r = i.risultato as Record<string, unknown> | null;
    return sum + (typeof r?.importo_recuperabile === "number" ? r.importo_recuperabile : 0);
  }, 0);
  const avgScore = completedItems.length > 0
    ? Math.round(
        completedItems.reduce((sum, i) => {
          const r = i.risultato as Record<string, unknown> | null;
          return sum + (typeof r?.score === "number" ? r.score : 0);
        }, 0) / completedItems.length
      )
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Le mie analisi</h1>
          <p className="text-muted-foreground mt-1">
            {items.length === 0
              ? "Non hai ancora analizzato nessun documento"
              : `${items.length} analisi totali`}
          </p>
        </div>
        <Button asChild>
          <Link href="/#analizza" className="gap-2">
            <Plus className="h-4 w-4" />
            Nuova analisi
          </Link>
        </Button>
      </div>

      {/* Summary stats */}
      {completedItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-5 pb-4 px-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedItems.length}</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Analisi</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 px-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalAnomalies}</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Anomalie</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 px-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Euro className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    &euro;{totalRecoverable.toLocaleString("it-IT", { minimumFractionDigits: 0 })}
                  </p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Recuperabile</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 px-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{avgScore ?? "-"}<span className="text-sm font-normal text-muted-foreground">/100</span></p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Score medio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* List */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Nessuna analisi</h2>
            <p className="text-muted-foreground mb-6">
              Carica il tuo primo documento per iniziare l&apos;analisi
            </p>
            <Button asChild>
              <Link href="/#analizza">Carica documento</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const badge = item.semaforo
              ? semaforoBadge[item.semaforo as keyof typeof semaforoBadge]
              : null;
            const isProcessing = item.stato === "processing";
            const isError = item.stato === "error";
            const r = item.risultato as Record<string, unknown> | null;
            const score = typeof r?.score === "number" ? r.score : null;
            const recoverable = typeof r?.importo_recuperabile === "number" ? r.importo_recuperabile : null;
            const date = new Date(item.created_at).toLocaleDateString("it-IT", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Link key={item.id} href={`/analisi/${item.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${
                          item.semaforo === "verde" ? "bg-green-100 dark:bg-green-900/30" :
                          item.semaforo === "rosso" ? "bg-red-100 dark:bg-red-900/30" :
                          item.semaforo === "giallo" ? "bg-amber-100 dark:bg-amber-900/30" :
                          "bg-muted"
                        }`}>
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-base group-hover:text-brand-navy transition-colors">
                            Analisi {item.file_type?.toUpperCase() || "documento"}
                          </CardTitle>
                          <CardDescription>{date}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isProcessing && (
                          <Badge variant="outline" className="gap-1 text-blue-600">
                            <Clock className="h-3 w-3 animate-spin" />
                            In corso
                          </Badge>
                        )}
                        {isError && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Errore
                          </Badge>
                        )}
                        {badge && (
                          <Badge className={badge.className}>{badge.label}</Badge>
                        )}
                        {item.numero_anomalie > 0 && (
                          <Badge variant="outline" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {item.numero_anomalie} {item.numero_anomalie === 1 ? "anomalia" : "anomalie"}
                          </Badge>
                        )}
                        {item.semaforo === "verde" && item.numero_anomalie === 0 && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>
                    {/* Inline stats for completed items */}
                    {item.stato === "completed" && (score !== null || recoverable !== null) && (
                      <div className="flex items-center gap-4 mt-2 ml-12 text-xs text-muted-foreground">
                        {score !== null && (
                          <span>Score: <strong className="text-foreground">{score}/100</strong></span>
                        )}
                        {recoverable !== null && recoverable > 0 && (
                          <span>Recuperabile: <strong className="text-brand-amber">&euro;{recoverable.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</strong></span>
                        )}
                      </div>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
