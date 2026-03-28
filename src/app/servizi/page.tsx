import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";
import { agents } from "@/lib/agents";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  FileSearch,
  Brain,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Servizi AI — LavoroChiaro",
  description:
    "Accedi ai nostri assistenti AI: analisi buste paga, redazione lettere, calcolo NASPI, maternità, controllo multe e molto altro.",
};

const agentDescriptions: Record<string, string> = {
  "redazione-lettere":
    "Genera richieste formali, contestazioni e comunicazioni al tuo datore di lavoro. L'AI ti guida passo passo nella redazione di lettere professionali e conformi alla normativa vigente.",
  assistenza:
    "Hai una domanda sul diritto del lavoro? Il nostro assistente AI è disponibile 24/7 per rispondere alle tue domande su contratti, retribuzione, ferie, permessi e molto altro.",
  "calcolo-naspi":
    "Simula la tua indennità di disoccupazione NASPI. Inserisci i tuoi dati lavorativi e scopri l'importo mensile, la durata e i requisiti necessari per accedere alla prestazione.",
  maternita:
    "Tutto quello che devi sapere sulla maternità: congedo obbligatorio, facoltativo, indennità INPS, diritti del padre, permessi allattamento e tutela del posto di lavoro.",
  professionisti:
    "Trova commercialisti, consulenti del lavoro e avvocati specializzati nella tua zona. Collegati con professionisti verificati per risolvere le tue questioni lavorative e fiscali.",
  dimissioni:
    "Assistenza completa per le dimissioni telematiche. Preavviso, documentazione, procedura online — ti seguiamo passo passo.",
  "controllo-multe":
    "Verifica la regolarità delle tue multe stradali. Controlla tempi di notifica, importi, prescrizioni e scopri se hai diritto a contestare o fare ricorso.",
  "contratti-colf":
    "Assistenza completa per contratti di lavoro domestico: colf, badanti e baby-sitter. Calcolo contributi, TFR, ferie, tredicesima e gestione del rapporto di lavoro.",
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  FileText: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  MessageCircle: { bg: "bg-indigo-50 dark:bg-indigo-950/30", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800" },
  Calculator: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  Heart: { bg: "bg-pink-50 dark:bg-pink-950/30", text: "text-pink-600 dark:text-pink-400", border: "border-pink-200 dark:border-pink-800" },
  Users: { bg: "bg-teal-50 dark:bg-teal-950/30", text: "text-teal-600 dark:text-teal-400", border: "border-teal-200 dark:border-teal-800" },
  LogOut: { bg: "bg-slate-50 dark:bg-slate-950/30", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-800" },
  Shield: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
  Home: { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
};

export default function ServiziPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* ── HERO BANNER ── */}
        <section className="relative overflow-hidden px-6 pt-24 pb-16 md:pt-32 md:pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent_50%)]" />

          <div className="relative container mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <Sparkles className="h-4 w-4" />
              Tutti i servizi sono alimentati da intelligenza artificiale
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
              I nostri servizi
            </h1>
            <p className="text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
              Assistenti intelligenti pronti ad aiutarti con le questioni lavorative, fiscali e legali pi&ugrave; comuni.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* ── FLAGSHIP: ANALISI BUSTA PAGA ── */}
          <Link href="/#analizza" className="block group mb-12">
            <div className="relative rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-8 md:p-10 transition-all hover:shadow-xl hover:-translate-y-1 ring-1 ring-blue-500/20 max-w-5xl mx-auto">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Servizio principale
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shrink-0 shadow-lg shadow-blue-500/25">
                  <FileSearch className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Analisi Busta Paga</h2>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">
                    Il nostro servizio di punta: carica il tuo cedolino e ricevi un report dettagliato con score, errori, anomalie e soldi da recuperare. L&apos;AI confronta ogni voce con le tabelle CCNL e la normativa vigente.
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors shadow-md">
                    Analizza ora
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* ── AI AGENT SERVICES ── */}
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground font-heading">Assistenti AI</h2>
                <p className="text-sm text-muted-foreground">Scegli un servizio e inizia subito la conversazione</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => {
                const Icon = agent.icon;
                const iconName = agent.icon.displayName || agent.icon.name || "";
                const colors = colorMap[iconName] || { bg: "bg-muted", text: "text-foreground", border: "border-border" };

                return (
                  <Card
                    key={agent.id}
                    className={`group hover:shadow-lg hover:-translate-y-1 transition-all border ${colors.border}`}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {agentDescriptions[agent.id] || agent.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button
                        asChild
                        variant="default"
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      >
                        <Link href={`/servizi/${agent.id}`}>
                          Inizia chat
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
