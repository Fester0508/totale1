"use client";

import { motion } from "motion/react";
import { AlertTriangle, ArrowRight, CircleDollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Anomalia } from "@/lib/types";

interface AnomalyCardProps {
  anomalia: Anomalia;
  index?: number;
}

export function AnomalyCard({ anomalia, index = 0 }: AnomalyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card className="border-red-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-red-50 dark:bg-red-950/40 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                Impatto economico
              </span>
            </div>
            <span className="font-bold text-red-700 dark:text-red-400 text-lg">
              {anomalia.impatto_economico}
            </span>
          </div>

          <div className="p-5 space-y-3">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <h4 className="font-semibold text-foreground">
                {anomalia.titolo}
              </h4>
            </div>

            <div className="bg-muted/50 rounded-lg border p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Cosa fare
              </p>
              <div className="flex gap-2 items-start">
                <ArrowRight className="h-4 w-4 text-brand-amber shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">
                  {anomalia.cosa_fare}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
