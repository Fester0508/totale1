"use client";

import { useState, useEffect } from "react";
import { FileSearch, Brain, CheckCircle, Loader2 } from "lucide-react";

const steps = [
  {
    icon: FileSearch,
    label: "Sto leggendo il documento...",
    duration: 3000,
  },
  {
    icon: Brain,
    label: "Analizzo le voci della busta paga...",
    duration: 5000,
  },
  {
    icon: CheckCircle,
    label: "Verifico con la normativa vigente...",
    duration: 0, // stays here until complete
  },
];

export function AnalysisLoading() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, steps[currentStep].duration);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-8">
        <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
      </div>

      <div className="space-y-4 w-full max-w-sm">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 transition-all duration-500 ${
                isActive
                  ? "opacity-100 translate-x-0"
                  : isDone
                    ? "opacity-50 translate-x-0"
                    : "opacity-0 translate-x-4"
              }`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  isDone
                    ? "bg-green-100 text-green-600"
                    : isActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={`text-sm ${
                  isActive ? "text-gray-900 font-medium" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        L&apos;analisi richiede circa 20-30 secondi
      </p>
    </div>
  );
}
