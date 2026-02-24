"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface MarketingToggleProps {
  initialValue: boolean;
}

export function MarketingToggle({ initialValue }: MarketingToggleProps) {
  const [enabled, setEnabled] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  async function handleToggle(checked: boolean) {
    setLoading(true);
    try {
      const res = await fetch("/api/user/marketing-consent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketing_consent: checked }),
      });

      if (res.ok) {
        setEnabled(checked);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between">
      <Label
        htmlFor="marketing-consent"
        className="text-sm text-muted-foreground font-normal"
      >
        Comunicazioni su novit&agrave; e aggiornamenti
      </Label>
      <Switch
        id="marketing-consent"
        checked={enabled}
        onCheckedChange={handleToggle}
        disabled={loading}
      />
    </div>
  );
}
