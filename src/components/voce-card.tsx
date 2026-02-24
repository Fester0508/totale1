"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Scale } from "lucide-react";
import { SemaforoInline } from "./semaforo";
import { Badge } from "@/components/ui/badge";
import type { VoceAnalisi } from "@/lib/types";

interface VoceCardProps {
  voce: VoceAnalisi;
  index?: number;
}

const statusBarColors = {
  verde: "bg-green-500",
  giallo: "bg-yellow-500",
  rosso: "bg-red-500",
};

export function VoceCard({ voce, index = 0 }: VoceCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`border rounded-lg overflow-hidden transition-colors ${
        voce.stato === "rosso"
          ? "border-red-200 bg-red-50/30 dark:bg-red-950/10"
          : voce.stato === "giallo"
            ? "border-yellow-200 bg-yellow-50/30 dark:bg-yellow-950/10"
            : "border-border"
      }`}
    >
      <div className="flex">
        <div className={`w-1 shrink-0 ${statusBarColors[voce.stato]}`} />

        <div className="flex-1 p-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <SemaforoInline colore={voce.stato} />
              <span className="font-medium text-foreground truncate">
                {voce.nome}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-2">
              <span className="font-mono text-foreground/80">
                &euro;{voce.importo.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
              </span>
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-border/60 space-y-3 text-sm">
                  <p className="text-muted-foreground leading-relaxed">
                    {voce.spiegazione}
                  </p>
                  {voce.problema && (
                    <div className="bg-red-50 dark:bg-red-950/30 rounded-md p-3">
                      <p className="text-red-700 dark:text-red-400 font-medium">
                        {voce.problema}
                      </p>
                    </div>
                  )}
                  {voce.riferimento_normativo && (
                    <Badge
                      variant="outline"
                      className="gap-1.5 text-xs font-normal bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800"
                    >
                      <Scale className="h-3 w-3" />
                      {voce.riferimento_normativo}
                    </Badge>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
