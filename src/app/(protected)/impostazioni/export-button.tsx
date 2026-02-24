"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ExportButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch("/api/user/export-data");
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          res.headers
            .get("Content-Disposition")
            ?.match(/filename="(.+)"/)?.[1] ??
          `lavorochiaro-dati-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={loading}>
      <Download className="h-4 w-4 mr-2" />
      {loading ? "Download in corso..." : "Scarica i tuoi dati"}
    </Button>
  );
}
