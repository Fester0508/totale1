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
    .select("id, stato, semaforo, numero_anomalie, created_at, file_type")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const items = analisi ?? [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">
            Le mie analisi
          </h1>
          <p className="text-muted-foreground mt-1">
            {items.length === 0
              ? "Non hai ancora analizzato nessun documento"
              : `${items.length} ${items.length === 1 ? "analisi" : "analisi"} totali`}
          </p>
        </div>
        <Button asChild>
          <Link href="/#analizza" className="gap-2">
            <Plus className="h-4 w-4" />
            Nuova analisi
          </Link>
        </Button>
      </div>

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
            const date = new Date(item.created_at).toLocaleDateString("it-IT", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Link key={item.id} href={`/analisi/${item.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-base">
                            Analisi {item.file_type?.toUpperCase()}
                          </CardTitle>
                          <CardDescription>{date}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isProcessing && (
                          <Badge
                            variant="outline"
                            className="gap-1 text-blue-600"
                          >
                            <Clock className="h-3 w-3" />
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
                          <Badge className={badge.className}>
                            {badge.label}
                          </Badge>
                        )}
                        {item.numero_anomalie > 0 && (
                          <Badge variant="outline" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {item.numero_anomalie}{" "}
                            {item.numero_anomalie === 1
                              ? "anomalia"
                              : "anomalie"}
                          </Badge>
                        )}
                        {item.semaforo === "verde" &&
                          item.numero_anomalie === 0 && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                      </div>
                    </div>
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
