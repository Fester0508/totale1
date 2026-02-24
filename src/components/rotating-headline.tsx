"use client";

import { useState, useEffect, useCallback } from "react";

interface HeadlineCard {
  id: string;
  src: string;
  alt: string;
}

export function RotatingHeadline({ cards }: { cards: HeadlineCard[] }) {
  const [shuffled] = useState(() => {
    const arr = [...cards];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);

  const next = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setIdx((i) => (i + 1) % shuffled.length);
      setVisible(true);
    }, 400);
  }, [shuffled.length]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  const card = shuffled[idx];

  return (
    <div
      className="mb-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Campagna editoriale"
      aria-live="polite"
    >
      <div
        className={`
          relative w-full max-w-[280px] lg:max-w-[300px] mx-auto lg:mx-0
          rounded-lg overflow-hidden
          border border-white/15
          shadow-2xl shadow-black/40
          transition-all duration-400 ease-in-out cursor-pointer
          ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-[0.97]"}
        `}
        onClick={next}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.src}
          alt={card.alt}
          width={300}
          height={300}
          className="w-full h-auto block"
          loading={idx < 3 ? "eager" : "lazy"}
        />
      </div>

      {/* Dots + counter */}
      <div className="flex items-center justify-center lg:justify-start gap-1.5 mt-3">
        {shuffled.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setVisible(false);
              setTimeout(() => { setIdx(i); setVisible(true); }, 400);
            }}
            className={`
              h-1.5 rounded-full transition-all duration-300
              ${i === idx % 5 ? "bg-brand-amber w-5" : "bg-white/25 w-1.5 hover:bg-white/50"}
            `}
            aria-label={`Headline ${i + 1}`}
          />
        ))}
        <span className="text-[10px] text-white/30 ml-2 font-mono tabular-nums">
          {String(idx + 1).padStart(2, "0")}/{shuffled.length}
        </span>
      </div>
    </div>
  );
}
