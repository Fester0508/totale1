"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const uploadSection = document.getElementById("analizza");

      if (uploadSection) {
        const rect = uploadSection.getBoundingClientRect();
        const isUploadVisible =
          rect.top < window.innerHeight && rect.bottom > 0;
        setVisible(scrollPercent > 0.15 && !isUploadVisible);
      } else {
        setVisible(scrollPercent > 0.15);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToUpload = () => {
    document
      .getElementById("analizza")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-3 bg-gradient-to-t from-background via-background to-transparent">
      <button
        onClick={scrollToUpload}
        className="w-full bg-brand-navy hover:bg-brand-navy-light text-white font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-brand-navy/30 transition-all active:scale-[0.98]"
      >
        Analizza gratis
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
