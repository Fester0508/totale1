"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GDPRConsent } from "./gdpr-consent";
import { FreeLimitDialog } from "./free-limit-dialog";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

interface UploadZoneProps {
  documentType?: string;
}

export function UploadZone({ documentType = "busta-paga" }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showLimitReached, setShowLimitReached] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = useCallback((file: File) => {
    setError(null);

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/heic",
      "image/heif",
    ];

    // Check type
    const isAllowed =
      allowedTypes.includes(file.type) ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");

    if (!isAllowed) {
      setError("Formato non supportato. Accettiamo PDF, JPG, PNG e HEIC.");
      return;
    }

    // Check size (10MB)
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

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleConsentAccept = async () => {
    if (!selectedFile) return;

    setShowConsent(false);
    setIsUploading(true);
    setError(null);

    try {
      const sessionId = uuidv4();
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("sessionId", sessionId);
      formData.append("documentType", documentType);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

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

      // Redirect to analysis page
      router.push(`/analisi/${data.id}?type=${documentType}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Errore durante il caricamento"
      );
      setIsUploading(false);
    }
  };

  const handleConsentDecline = () => {
    setShowConsent(false);
    setSelectedFile(null);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div id="analizza" className="w-full max-w-xl mx-auto scroll-mt-24">
        {isUploading ? (
          <div className="border-2 border-dashed border-brand-amber/40 rounded-2xl p-12 text-center bg-brand-amber-light/30">
            <Loader2 className="h-12 w-12 text-brand-amber animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">
              Caricamento in corso...
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Stiamo caricando il tuo documento
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
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
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
        )}

        {error && (
          <p className="text-sm text-red-600 text-center mt-3">{error}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
          onChange={handleInputChange}
          className="hidden"
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
