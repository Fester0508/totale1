import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Download, AlertTriangle, Mail } from "lucide-react";
import { MarketingToggle } from "./marketing-toggle";
import { ExportButton } from "./export-button";
import { DeleteAccountDialog } from "@/components/user/delete-account-dialog";

export default async function ImpostazioniPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true },
  });

  if (!dbUser) redirect("/login");

  const profile = dbUser.profile;

  const registrationDate = new Date(dbUser.createdAt).toLocaleDateString(
    "it-IT",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "\u2014";
    return new Date(date).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Impostazioni</h1>
        <p className="text-muted-foreground mt-1">
          Gestisci il tuo account e i tuoi dati personali
        </p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Il tuo account</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm font-medium">{dbUser.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Registrato il
            </span>
            <span className="text-sm font-medium">{registrationDate}</span>
          </div>
        </CardContent>
      </Card>

      {/* Privacy e consensi */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">Privacy e consensi</CardTitle>
              <CardDescription>
                Gestisci i tuoi consensi ai sensi del GDPR
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Privacy Policy
            </span>
            <span className="text-sm text-green-600 font-medium">
              Accettata il {formatDate(profile?.privacyAcceptedAt ?? null)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Termini di Servizio
            </span>
            <span className="text-sm text-green-600 font-medium">
              Accettati il {formatDate(profile?.termsAcceptedAt ?? null)}
            </span>
          </div>
          <div className="border-t pt-4">
            <MarketingToggle
              initialValue={profile?.marketingConsent ?? false}
            />
          </div>
        </CardContent>
      </Card>

      {/* Esportazione dati */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">I tuoi dati</CardTitle>
              <CardDescription>
                Diritto alla portabilit&agrave; dei dati (GDPR Art. 20)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Puoi scaricare una copia di tutti i tuoi dati personali in formato
            JSON, incluse le analisi effettuate e i relativi risultati.
          </p>
          <ExportButton />
        </CardContent>
      </Card>

      {/* Zona pericolosa */}
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <CardTitle className="text-lg text-destructive">
                Zona pericolosa
              </CardTitle>
              <CardDescription>
                Azioni irreversibili sul tuo account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            L&apos;eliminazione del tuo account comporta la cancellazione
            permanente di tutti i dati: profilo, analisi e documenti caricati.
            Questa azione non pu&ograve; essere annullata.
          </p>
          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </div>
  );
}
