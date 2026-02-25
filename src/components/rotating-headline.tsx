"use client";

import { useState, useEffect, useCallback } from "react";

const HEADLINES = [
  { title: "Anche Cesare si fid\u00f2.", subtitle: "Ti fidi del tuo cedolino?" },
  { title: "Bruto trad\u00ec in silenzio.", subtitle: "Il tuo cedolino parla chiaro?" },
  { title: "Il cavallo di Troia era un regalo.", subtitle: "Anche gli errori in busta paga lo sembrano." },
  { title: "Giuda lo fece per soldi.", subtitle: "Tu quanti ne stai perdendo?" },
  { title: "Il 15 marzo cambi\u00f2 tutto.", subtitle: "Conosci le date che contano per te?" },
  { title: "Watergate era un documento.", subtitle: "Sai leggere il tuo cedolino?" },
  { title: "Enrico VIII cambi\u00f2 le regole.", subtitle: "Conosci i tuoi diritti prima che cambino le regole." },
  { title: "Suarez morse Chiellini.", subtitle: "Qualcuno ti sta mordendo lo stipendio." },
  { title: "Le telefonate c\u2019erano.", subtitle: "Il tuo cedolino \u00e8 un documento. L\u2019hai mai letto davvero?" },
  { title: "7 Tour. Tutte bugie.", subtitle: "Anche una busta paga pu\u00f2 sembrare corretta. Pu\u00f2 non esserlo." },
  { title: "Il gol fantasma.", subtitle: "In busta paga i dubbi costano. Ogni mese." },
  { title: "Lo fece in diretta.", subtitle: "Certi errori in busta paga sono evidenti. Nessuno te li mostra." },
  { title: "I fumogeni erano in casa sua.", subtitle: "Ogni mese senza controllare, bruci qualcosa di tuo." },
  { title: "Calciopoli.", subtitle: "Le regole c\u2019erano. Non venivano rispettate." },
  { title: "Totti non vide il cartellino.", subtitle: "Non vedi gli errori se non li cerchi." },
  { title: "Retrocessione.", subtitle: "Le certezze finiscono in fretta. Sai cosa ti spetta?" },
  { title: "Madoff pagava tutti. Coi soldi degli altri.", subtitle: "Chi paga cosa nella tua busta paga?" },
  { title: "Enron valeva miliardi. Sulla carta.", subtitle: "Anche la tua busta paga pu\u00f2 sembrare giusta. Sulla carta." },
  { title: "Theranos analizzava il sangue. Con niente.", subtitle: "I numeri in busta paga vanno verificati con metodo." },
  { title: "Fu assolto.", subtitle: "Anche gli errori in busta paga passano inosservati." },
  { title: "Nixon neg\u00f2 tutto.", subtitle: "I documenti parlano. Il tuo cedolino anche." },
  { title: "Volkswagen truccava i motori.", subtitle: "Anche i numeri in busta paga possono essere truccati." },
  { title: "Il Muro cadde in una notte.", subtitle: "Quanto tempo ci vuole per scoprire un errore? 30 secondi." },
  { title: "Telefonava di notte.", subtitle: "Le scelte sul tuo contratto vengono prese senza di te." },
  { title: "Pandora apr\u00ec il vaso.", subtitle: "Cosa c\u2019\u00e8 dentro la tua busta paga?" },
  { title: "Il lupo si vest\u00ec da agnello.", subtitle: "Gli errori peggiori sono quelli che non noti." },
];

export function RotatingHeadline() {
  const [shuffled, setShuffled] = useState(HEADLINES);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Shuffle only on client after mount to avoid hydration mismatch
  useEffect(() => {
    const arr = [...HEADLINES];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
    setMounted(true);
  }, []);

  const next = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setIdx((i) => (i + 1) % shuffled.length);
      setVisible(true);
    }, 500);
  }, [shuffled.length]);

  useEffect(() => {
    if (paused || !mounted) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next, mounted]);

  const h = shuffled[idx];

  return (
    <div
      className="text-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Fregature storiche"
      aria-live="polite"
    >
      <div
        className={`
          transition-all duration-500 ease-in-out min-h-[100px] flex flex-col items-center justify-center
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        <span className="text-brand-amber/40 text-4xl md:text-5xl font-serif leading-none select-none">&laquo;</span>

        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-amber mt-1 mb-2 max-w-2xl leading-snug">
          {h.title}
        </p>

        <p className="text-sm sm:text-base md:text-lg text-primary-foreground/60 max-w-lg leading-relaxed">
          {h.subtitle}
        </p>

        <span className="text-brand-amber/40 text-4xl md:text-5xl font-serif leading-none select-none mt-1">&raquo;</span>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setVisible(false);
              setTimeout(() => { setIdx(i); setVisible(true); }, 500);
            }}
            className={`
              h-1.5 rounded-full transition-all duration-300
              ${i === idx % 5 ? "bg-brand-amber w-5" : "bg-white/20 w-1.5 hover:bg-white/40"}
            `}
            aria-label={`Frase ${i + 1}`}
          />
        ))}
        <span className="text-[10px] text-white/25 ml-2 font-mono tabular-nums">
          {String(idx + 1).padStart(2, "0")}/{shuffled.length}
        </span>
      </div>
    </div>
  );
}
