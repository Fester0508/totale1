"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, FileText, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GDPRConsent } from "./gdpr-consent";
import { FreeLimitDialog } from "./free-limit-dialog";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

interface UploadZoneProps {
  documentType?: string;
}

/* ── Progress steps ── */
const PROGRESS_STEPS = [
  { key: "upload", label: "Caricamento" },
  { key: "ocr", label: "OCR" },
  { key: "ai", label: "Analisi AI" },
  { key: "done", label: "Referto pronto" },
] as const;

type StepKey = (typeof PROGRESS_STEPS)[number]["key"];

function ProgressBar({ activeStep }: { activeStep: StepKey }) {
  const activeIdx = PROGRESS_STEPS.findIndex((s) => s.key === activeStep);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-3">
        {PROGRESS_STEPS.map((step, idx) => {
          const isActive = idx === activeIdx;
          const isDone = idx < activeIdx;
          return (
            <div key={step.key} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isDone
                    ? "bg-green-600 text-white"
                    : isActive
                    ? "bg-brand-amber text-accent-foreground animate-pulse"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={`text-[10px] tracking-wide uppercase font-medium ${
                  isActive ? "text-brand-navy" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Progress line */}
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-amber rounded-full transition-all duration-700 ease-out"
          style={{ width: `${((activeIdx + 0.5) / PROGRESS_STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function UploadZone({ documentType = "busta-paga" }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progressStep, setProgressStep] = useState<StepKey>("upload");
  const [showLimitReached, setShowLimitReached] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  /* Simulate progress steps during upload */
  useEffect(() => {
    if (!isUploading) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setProgressStep("ocr"), 2000));
    timers.push(setTimeout(() => setProgressStep("ai"), 5000));
    timers.push(setTimeout(() => setProgressStep("done"), 9000));
    return () => timers.forEach(clearTimeout);
  }, [isUploading]);

  const handleFile = useCallback((file: File) => {
    setError(null);

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/heic",
      "image/heif",
    ];

    const isAllowed =
      allowedTypes.includes(file.type) ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");

    if (!isAllowed) {
      setError("Formato non supportato. Accettiamo PDF, JPG, PNG e HEIC.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Il file supera i 10MB.");
      return;
    }

    setSelectedFile(file);
    setShowConsent(true);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => fileInputRef.current?.click();
  const handleCameraClick = () => cameraInputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleConsentAccept = async () => {
    if (!selectedFile) return;

    setShowConsent(false);
    setIsUploading(true);
    setProgressStep("upload");
    setError(null);

    // Timeout protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const sessionId = uuidv4();
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("sessionId", sessionId);
      formData.append("documentType", documentType);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.status === 403 && data.code === "FREE_LIMIT_REACHED") {
        setShowLimitReached(true);
        setIsUploading(false);
        return;
      }

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Errore durante il caricamento");
      }

      // Salva file in sessionStorage per passarlo all'analisi (demo mode)
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (d, byte) => d + String.fromCharCode(byte),
            ""
          )
        );
        sessionStorage.setItem(`file_${data.id}`, base64);
        sessionStorage.setItem(`mime_${data.id}`, selectedFile.type);
      } catch (e) {
        console.warn("Could not cache file for demo mode:", e);
      }

      setProgressStep("done");
      setTimeout(() => {
        router.push(`/analisi/${data.id}?type=${documentType}`);
      }, 1200);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Il caricamento ha impiegato troppo tempo. Riprova.");
      } else {
        setError(
          err instanceof Error ? err.message : "Errore durante il caricamento"
        );
      }
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const handleConsentDecline = () => {
    setShowConsent(false);
    setSelectedFile(null);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <>
      <div className="w-full max-w-xl mx-auto">
        {isUploading ? (
          <div className="border-2 border-dashed border-brand-amber/40 rounded-2xl p-10 md:p-12 text-center bg-brand-amber-light/20">
            <ProgressBar activeStep={progressStep} />
            <p className="text-sm text-muted-foreground mt-6">
              {progressStep === "upload" && "Caricamento del documento..."}
              {progressStep === "ocr" && "Estrazione testo con OCR avanzato..."}
              {progressStep === "ai" && "Analisi AI in corso, confronto con CCNL..."}
              {progressStep === "done" && "Referto pronto! Reindirizzamento..."}
            </p>
          </div>
        ) : selectedFile && !showConsent ? (
          <div className="border-2 border-brand-navy/30 rounded-2xl p-8 text-center bg-card">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-brand-navy" />
              <div className="text-left">
                <p className="font-medium text-foreground truncate max-w-[250px]">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={removeFile}
                className="ml-2 p-1 hover:bg-muted rounded-full transition-colors"
                aria-label="Rimuovi file"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <Button
              onClick={() => setShowConsent(true)}
              className="w-full"
              size="lg"
            >
              Analizza documento
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
              aria-label="Carica la tua busta paga"
              className={`border-2 border-dashed rounded-2xl p-10 md:p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-brand-amber bg-brand-amber-light/30 scale-[1.02]"
                  : "border-border hover:border-brand-amber/50 hover:bg-card"
              }`}
            >
              <Upload
                className={`h-12 w-12 mx-auto mb-4 ${
                  isDragging ? "text-brand-amber" : "text-muted-foreground"
                }`}
              />
              <p className="text-lg font-medium text-foreground mb-1">
                Carica la tua busta paga
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Trascina qui il file oppure clicca per selezionarlo
              </p>
              <p className="text-xs text-muted-foreground/70">
                PDF, JPG, PNG o HEIC &mdash; max 10MB
              </p>
            </div>

            {/* Mobile camera button */}
            <button
              onClick={handleCameraClick}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-sm font-medium text-foreground md:hidden"
            >
              <Camera className="h-4 w-4" />
              Scatta foto del cedolino
            </button>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 text-center mt-3" role="alert">{error}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />
        {/* Camera input for mobile */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      <GDPRConsent
        open={showConsent}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
      />

      <FreeLimitDialog
        open={showLimitReached}
        onClose={() => setShowLimitReached(false)}
      />
    </>
  );
}
