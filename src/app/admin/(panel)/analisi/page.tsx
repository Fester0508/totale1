"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnalisiTable } from "@/components/admin/analisi-table";

function AnalisiContent() {
  const searchParams = useSearchParams();

  const initialFilters = {
    stato: searchParams.get("stato") || "",
    semaforo: searchParams.get("semaforo") || "",
    file_type: searchParams.get("file_type") || "",
  };

  return <AnalisiTable initialFilters={initialFilters} />;
}

export default function AnalisiListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analisi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestisci tutte le analisi delle buste paga
        </p>
      </div>
      <Suspense>
        <AnalisiContent />
      </Suspense>
    </div>
  );
}
