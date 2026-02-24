"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { RetribuzioneChart } from "./retribuzione-chart";
import { TrafficLight } from "./semaforo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ShieldCheck,
  TriangleAlert,
  ShieldAlert,
  Check,
  Info,
  CheckCircle2,
  XCircle,
  Briefcase,
  Calendar,
  Clock,
} from "lucide-react";
import type { RisultatoAnalisi, VoceAnalisi } from "@/lib/types";
import Link from "next/link";

interface AnalysisResultProps {
  risultato: RisultatoAnalisi;
  id?: string;
}

/* ── Animations ── */

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

/* ── Helpers ── */

function generateRefNumber(id?: string): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const short = id ? id.replace(/-/g, "").slice(0, 5).toUpperCase() : "00000";
  return `REF-${y}-${m}-${short}`;
}

function fmtEuro(v: number): string {
  return v.toLocaleString("it-IT", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

/* ── Formule normative per categoria ── */

const FORMULE: Record<string, { titolo: string; formula: string; legge: string }> = {
  TFR: {
    titolo: "Calcolo TFR (Trattamento di Fine Rapporto)",
    formula:
      "Accantonamento annuo = Retribuzione annua lorda / 13,5 (circa 7,41%). " +
      "Si sottrae lo 0,50% dell'imponibile previdenziale per il Fondo di Garanzia INPS. " +
      "Accantonamento netto mensile = circa 6,91% della retribuzione lorda mensile. " +
      "Rivalutazione: 1,5% fisso annuo + 75% della variazione ISTAT FOI.",
    legge: "Art. 2120 Codice Civile — L. 297/1982",
  },
  IRPEF: {
    titolo: "Calcolo IRPEF (Imposta sul Reddito delle Persone Fisiche)",
    formula:
      "Si applica per scaglioni progressivi: " +
      "23% fino a 28.000\u20ac, 33% da 28.001 a 50.000\u20ac, 43% oltre 50.000\u20ac (2026). " +
      "No tax area lavoratori dipendenti: 8.500\u20ac. " +
      "Detrazione massima lavoro dipendente: 1.955\u20ac (redditi fino a 15.000\u20ac).",
    legge: "TUIR — D.P.R. 917/1986 Art. 11 e 13",
  },
  INPS: {
    titolo: "Contributi Previdenziali INPS",
    formula:
      "Aliquota IVS totale: 33% (di cui 9,19% a carico del lavoratore privato). " +
      "Per apprendisti: 5,84% a carico lavoratore. " +
      "Per dipendenti pubblici: 8,80% a carico lavoratore. " +
      "L'imponibile previdenziale pu\u00f2 differire dall'imponibile fiscale.",
    legge: "L. 335/1995 — Riforma Dini",
  },
  STRAORDINARI: {
    titolo: "Maggiorazioni per Lavoro Straordinario",
    formula:
      "Retribuzione oraria base \u00d7 percentuale di maggiorazione prevista dal CCNL. " +
      "Le percentuali variano per tipo: feriale (15-30%), notturno (30-50%), festivo (30-50%), " +
      "notturno festivo (50-75%). Le maggiorazioni generalmente non sono cumulabili.",
    legge: "D.Lgs. 66/2003 Art. 5 + CCNL specifico",
  },
  FERIE: {
    titolo: "Ferie e Permessi Retribuiti",
    formula:
      "Minimo 4 settimane/anno di ferie (D.Lgs. 66/2003). " +
      "Almeno 2 settimane consecutive nell'anno di maturazione. " +
      "Le restanti entro 18 mesi dalla fine dell'anno di maturazione. " +
      "Le ferie non godute non possono essere monetizzate durante il rapporto di lavoro.",
    legge: "D.Lgs. 66/2003 Art. 10 — Cost. Art. 36",
  },
  DETRAZIONI: {
    titolo: "Detrazioni per Lavoro Dipendente",
    formula:
      "Redditi fino a 15.000\u20ac: detrazione max 1.955\u20ac. " +
      "Redditi tra 15.000\u20ac e 28.000\u20ac: formula proporzionale decrescente. " +
      "Redditi tra 28.000\u20ac e 50.000\u20ac: formula proporzionale ridotta. " +
      "Oltre 50.000\u20ac: nessuna detrazione.",
    legge: "TUIR Art. 13 — D.P.R. 917/1986",
  },
};

/* ── Config ── */

const semaforoConfig = {
  verde: {
    label: "Tutto Regolare",
    Icon: ShieldCheck,
    cls: "bg-green-50 text-green-800 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800",
  },
  giallo: {
    label: "Anomalie Rilevate",
    Icon: TriangleAlert,
    cls: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  },
  rosso: {
    label: "Problemi Critici",
    Icon: ShieldAlert,
    cls: "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  },
};

const statusConfig = {
  rosso: {
    border: "border-l-red-500",
    label: "ERRORE",
    labelCls: "text-red-600 dark:text-red-400",
    hoverBg: "hover:bg-red-50/60 dark:hover:bg-red-950/20",
  },
  giallo: {
    border: "border-l-amber-500",
    label: "VERIFICA",
    labelCls: "text-amber-600 dark:text-amber-400",
    hoverBg: "hover:bg-amber-50/60 dark:hover:bg-amber-950/20",
  },
  verde: {
    border: "border-l-green-500",
    label: "CORRETTO",
    labelCls: "text-green-600 dark:text-green-400",
    hoverBg: "hover:bg-green-50/60 dark:hover:bg-green-950/20",
  },
};

const statusTextCls = {
  green: "text-green-600 dark:text-green-400",
  yellow: "text-amber-600 dark:text-amber-400",
  red: "text-red-600 dark:text-red-400",
};

/* ── Main Component ── */

export function AnalysisResult({ risultato, id }: AnalysisResultProps) {
  const vociRosse = risultato.voci?.filter((v) => v.stato === "rosso") ?? [];
  const vociVerdi = risultato.voci?.filter((v) => v.stato === "verde") ?? [];
  const totalVoci = risultato.voci?.length ?? 0;

  let rIdx = 0,
    gIdx = 0,
    vIdx = 0;
  const vociWithCodes = (risultato.voci ?? []).map((voce) => {
    let codice: string;
    if (voce.stato === "rosso") codice = `ERR-${String(++rIdx).padStart(3, "0")}`;
    else if (voce.stato === "giallo") codice = `AVV-${String(++gIdx).padStart(3, "0")}`;
    else codice = `OK-${String(++vIdx).padStart(3, "0")}`;
    return { ...voce, codice };
  });

  const refNumber = generateRefNumber(id);
  const semaforo = semaforoConfig[risultato.semaforo_globale];
  const SemaforoIcon = semaforo.Icon;

  const importoRecuperabile =
    risultato.importo_recuperabile ??
    vociRosse.reduce(
      (s, v) =>
        s + Math.abs((v as VoceAnalisi & { impatto_euro?: number | null }).impatto_euro ?? 0),
      0,
    );

  const lordo = risultato.retribuzione?.lordo ?? 0;
  const netto = risultato.retribuzione?.netto ?? 0;
  const score = risultato.score;

  const scoreColor: "green" | "yellow" | "red" =
    score != null ? (score >= 80 ? "green" : score >= 50 ? "yellow" : "red") : "green";
  const scoreLabel =
    score != null
      ? score >= 80
        ? "Regolare"
        : score >= 50
          ? "Anomalie presenti"
          : "Problemi critici"
      : "";

  const raccomandazioni =
    risultato.raccomandazioni ?? risultato.anomalie?.map((a) => a.cosa_fare) ?? [];

  return (
    <motion.div
      className="max-w-5xl mx-auto pb-12 space-y-6"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Back */}
      <motion.div variants={fadeUp}>
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 transition-transform duration-200 hover:-translate-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Nuova analisi
          </Button>
        </Link>
      </motion.div>

      {/* ── HEADER ── */}
      <motion.div
        variants={fadeUp}
        className="bg-card rounded-xl border shadow-sm p-6 md:p-8 transition-shadow duration-300 hover:shadow-md"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
              Intestatario Cedolino
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-1">
              {risultato.dati_anagrafici?.nome ?? "\u2014"}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
              {risultato.dati_anagrafici?.ccnl && (
                <span className="font-medium text-foreground">
                  CCNL: {risultato.dati_anagrafici.ccnl}
                </span>
              )}
              {risultato.dati_anagrafici?.livello && (
                <span>Livello: {risultato.dati_anagrafici.livello}</span>
              )}
              {risultato.dati_anagrafici?.tipo_contratto && (
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {risultato.dati_anagrafici.tipo_contratto}
                </span>
              )}
              {risultato.dati_anagrafici?.ore_settimanali && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {risultato.dati_anagrafici.ore_settimanali}h/sett.
                </span>
              )}
              {risultato.dati_anagrafici?.anzianita && (
                <span>Anzianit&agrave;: {risultato.dati_anagrafici.anzianita}</span>
              )}
              {risultato.dati_anagrafici?.mese_anno && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {risultato.dati_anagrafici.mese_anno}
                </span>
              )}
              {risultato.dati_anagrafici?.paga_oraria != null && (
                <span>
                  Paga oraria: &euro;{risultato.dati_anagrafici.paga_oraria.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <TrafficLight colore={risultato.semaforo_globale} size="lg" />
            <div className="text-left md:text-right">
              <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
                Referto
              </p>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold mt-1 transition-transform duration-200 hover:scale-105 ${semaforo.cls}`}
              >
                <SemaforoIcon className="h-4 w-4" />
                {semaforo.label}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{refNumber}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── METRIC CARDS ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="LORDO MENSILE"
          value={fmtEuro(lordo)}
          unit="euro"
          status="Nella media contrattuale"
          color="green"
        />
        <MetricCard
          label="NETTO ACCREDITATO"
          value={fmtEuro(netto)}
          unit="euro"
          status="Regolare"
          color="green"
        />
        {score != null && (
          <MetricCard
            label="SCORE BUSTA PAGA"
            value={String(score)}
            unit="punti / 100"
            status={scoreLabel}
            color={scoreColor}
          />
        )}
        <MetricCard
          label="RECUPERABILE"
          value={fmtEuro(importoRecuperabile)}
          unit="euro stimati"
          status={importoRecuperabile === 0 ? "Nessuna anomalia" : "Verifica consigliata"}
          color={importoRecuperabile === 0 ? "green" : "yellow"}
        />
      </motion.div>

      {/* ── FERIE E PERMESSI ── */}
      {risultato.ferie_permessi && (
        <motion.div
          variants={fadeUp}
          className="bg-card rounded-xl border p-6 transition-shadow duration-300 hover:shadow-md"
        >
          <h2 className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-4">
            Ferie, Permessi e Assenze
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MiniStat
              label="Ferie residue"
              value={risultato.ferie_permessi.ferie_residue}
              unit="giorni"
            />
            <MiniStat
              label="Ferie godute"
              value={risultato.ferie_permessi.ferie_godute}
              unit="giorni"
            />
            <MiniStat
              label="Permessi residui"
              value={risultato.ferie_permessi.permessi_residui}
              unit="ore"
            />
            <MiniStat
              label="ROL residui"
              value={risultato.ferie_permessi.rol_residui}
              unit="ore"
            />
            <MiniStat
              label="Malattia"
              value={risultato.ferie_permessi.malattia_giorni}
              unit="giorni"
            />
          </div>
          {risultato.ferie_permessi.note && (
            <p className="text-sm text-muted-foreground mt-3 italic">
              {risultato.ferie_permessi.note}
            </p>
          )}
        </motion.div>
      )}

      {/* ── TFR ── */}
      {risultato.tfr && (
        <motion.div
          variants={fadeUp}
          className="bg-card rounded-xl border p-6 transition-shadow duration-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
              TFR &mdash; Trattamento di Fine Rapporto
            </h2>
            {risultato.tfr.conforme != null && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  risultato.tfr.conforme
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                }`}
              >
                {risultato.tfr.conforme ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                {risultato.tfr.conforme ? "Conforme" : "Non conforme"}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MiniStat
              label="Dal cedolino"
              value={risultato.tfr.accantonamento_mensile}
              unit="\u20ac/mese"
              format="euro"
            />
            <MiniStat
              label="Calcolato"
              value={risultato.tfr.accantonamento_calcolato}
              unit="\u20ac/mese"
              format="euro"
            />
            <MiniStat
              label="Differenza"
              value={risultato.tfr.differenza}
              unit="\u20ac"
              format="euro"
              highlight={risultato.tfr.differenza != null && risultato.tfr.differenza !== 0}
            />
            {risultato.tfr.destinazione && (
              <div>
                <p className="text-[10px] tracking-wider uppercase text-muted-foreground">
                  Destinazione
                </p>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {risultato.tfr.destinazione}
                </p>
              </div>
            )}
          </div>
          {risultato.tfr.nota && (
            <p className="text-sm text-muted-foreground mt-3 italic">{risultato.tfr.nota}</p>
          )}
          <p className="text-[10px] text-muted-foreground mt-3">
            Rif. normativo: Art. 2120 Codice Civile &mdash; L. 297/1982
          </p>
        </motion.div>
      )}

      {/* ── TWO COLUMNS ── */}
      <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left: Risultanze */}
        <motion.div variants={fadeUp}>
          <h2 className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-4">
            Risultanze Analisi
          </h2>
          <div className="space-y-3">
            {vociWithCodes.map((voce, i) => (
              <RisultanzaItem key={i} voce={voce} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Right sidebar */}
        <motion.div variants={fadeUp} className="space-y-6">
          {risultato.retribuzione && (
            <div>
              <h2 className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-4">
                Composizione Retribuzione
              </h2>
              <RetribuzioneChart retribuzione={risultato.retribuzione} />
            </div>
          )}

          {raccomandazioni.length > 0 && (
            <div>
              <h2 className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-4">
                Raccomandazioni
              </h2>
              <div className="space-y-4">
                {raccomandazioni.map((racc, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-3 group cursor-default"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                  >
                    <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground leading-relaxed transition-colors duration-200 group-hover:text-foreground/80">
                      <FormattedText text={racc} />
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── BOTTOM SUMMARY ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
            Errori Confermati
          </p>
          <p className="text-4xl font-bold text-foreground mt-2">{vociRosse.length}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {vociRosse.length > 0
              ? `${vociRosse.map((v) => v.nome.split(" ").slice(0, 3).join(" ")).join(" e ")} — richiedono correzione immediata`
              : "Nessun errore confermato"}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
            Voci Regolari
          </p>
          <p className="text-4xl font-bold text-foreground mt-2">{vociVerdi.length}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Su {totalVoci} voci analizzate, {vociVerdi.length} risultano corrette e conformi al
            contratto applicato
          </p>
        </div>
        <div className="bg-brand-amber rounded-xl p-6 text-accent-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-brand-amber-dark">
          <p className="text-[11px] tracking-[0.15em] uppercase text-accent-foreground/70 font-medium">
            Importo Recuperabile
          </p>
          <p className="text-4xl font-bold mt-2">
            &euro; {importoRecuperabile.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-accent-foreground/80 mt-2">
            Stima basata sulle anomalie rilevate &mdash; soggetta a verifica del consulente del lavoro
          </p>
        </div>
      </motion.div>

      {/* ── FOOTER ── */}
      <motion.footer
        variants={fadeUp}
        className="border-t pt-6 flex flex-col md:flex-row md:justify-between gap-4"
      >
        <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
          <span className="font-medium">Nota legale:</span> Il presente referto ha natura
          meramente informativa e non costituisce consulenza legale, fiscale o previdenziale. Per
          azioni legali o contestazioni formali rivolgersi a un consulente del lavoro abilitato.
        </p>
        <p className="text-xs text-muted-foreground shrink-0">
          {refNumber} &middot; lavoroinchiaro.it
        </p>
      </motion.footer>
    </motion.div>
  );
}

/* ── MiniStat ── */

function MiniStat({
  label,
  value,
  unit,
  format,
  highlight,
}: {
  label: string;
  value: number | null | undefined;
  unit: string;
  format?: "euro";
  highlight?: boolean;
}) {
  if (value == null) return null;
  const formatted =
    format === "euro"
      ? value.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : String(value);

  return (
    <div>
      <p className="text-[10px] tracking-wider uppercase text-muted-foreground">{label}</p>
      <p
        className={`text-lg font-bold mt-1 ${
          highlight ? "text-red-600 dark:text-red-400" : "text-foreground"
        }`}
      >
        {formatted}
      </p>
      <p className="text-xs text-muted-foreground">{unit}</p>
    </div>
  );
}

/* ── MetricCard ── */

function MetricCard({
  label,
  value,
  unit,
  status,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  status: string;
  color: "green" | "yellow" | "red";
}) {
  const underline = {
    green: "bg-green-500",
    yellow: "bg-amber-500",
    red: "bg-red-500",
  };

  return (
    <div className="bg-card rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default">
      <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
        {label}
      </p>
      <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{unit}</p>
      <div className="mt-3">
        <p className={`text-xs font-semibold ${statusTextCls[color]}`}>{status}</p>
        <div className={`h-0.5 w-12 mt-1 rounded ${underline[color]}`} />
      </div>
    </div>
  );
}

/* ── RisultanzaItem ── */

function RisultanzaItem({
  voce,
  index,
}: {
  voce: VoceAnalisi & { codice: string };
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const cfg = statusConfig[voce.stato];
  const impatto = (voce as VoceAnalisi & { impatto_euro?: number | null }).impatto_euro;
  const categoriaKey = voce.categoria?.toUpperCase() ?? "";
  const formula = FORMULE[categoriaKey] ?? null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.06, duration: 0.4 }}
        className={`bg-card rounded-lg border border-l-4 ${cfg.border} ${cfg.hoverBg} transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="p-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[10px] tracking-wider uppercase text-muted-foreground">
                {voce.codice} &middot; {voce.categoria ?? "GENERALE"}
              </p>
              {(voce.riferimento_normativo || formula) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDialogOpen(true);
                  }}
                  className="p-0.5 rounded-full hover:bg-muted transition-colors"
                  title="Dettaglio normativo"
                >
                  <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            <h3 className="font-semibold text-foreground mt-0.5 leading-snug text-sm md:text-base">
              {voce.nome}
            </h3>

            {/* Hover/click reveal */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expanded ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                {voce.spiegazione}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            {voce.stato === "verde" ? (
              <>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 ml-auto transition-transform duration-200 hover:scale-110">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </span>
                <p className={`text-xs font-semibold mt-1 ${cfg.labelCls}`}>{cfg.label}</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-foreground whitespace-nowrap">
                  {voce.stato === "rosso" ? "\u2013" : "~"} &euro;
                  {Math.abs(impatto ?? voce.importo).toLocaleString("it-IT", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className={`text-xs font-semibold ${cfg.labelCls}`}>{cfg.label}</p>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Dialog normativo */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  voce.stato === "verde"
                    ? "bg-green-500"
                    : voce.stato === "giallo"
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              />
              {voce.nome}
            </DialogTitle>
            <DialogDescription>Dettaglio normativo e calcolo</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm leading-relaxed">{voce.spiegazione}</p>

            {voce.problema && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 rounded-lg">
                <p className="text-xs uppercase tracking-wider text-red-600 dark:text-red-400 font-semibold mb-1">
                  Problema riscontrato
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">{voce.problema}</p>
              </div>
            )}

            {voce.riferimento_normativo && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
                <p className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-1">
                  Riferimento normativo
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  {voce.riferimento_normativo}
                </p>
              </div>
            )}

            {formula && (
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                <p className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  {formula.titolo}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {formula.formula}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Fonte: {formula.legge}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
