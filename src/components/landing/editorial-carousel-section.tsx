"use client";

import Image from "next/image";
import { AnimatedSection } from "./animated-section";

const editorialCards = [
  {
    id: "01",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/01%3A27-4hhvjGvYVtn2ZV2yIGpxjLQYtFtqdk.png",
    alt: "Anche Cesare si fido'. Ti fidi del tuo cedolino?",
  },
  {
    id: "02",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/02%3A27-gNwJRfl1zEK5BdG62tmClIVz5AhVpq.png",
    alt: "Bruto tradi' in silenzio. Leggi il tuo cedolino riga per riga.",
  },
  {
    id: "03",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/03%3A27-lril61lPTPSMmIpaoXdNRgKWgk0eor.png",
    alt: "Il cavallo di Troia era un regalo. Fino a quando qualcuno guarda dentro.",
  },
  {
    id: "04",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04%3A27-UQJTFqEzKzZtnFc2Y6709neWpMe287.png",
    alt: "Giuda lo fece per soldi. Quanto hai perso finora?",
  },
  {
    id: "05",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/05%3A27-1tApasQNO8drFjcipRz1o6qbNX1d8t.png",
    alt: "Il 15 marzo cambio' tutto. Le conosci tutte?",
  },
  {
    id: "06",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/06%3A27-bxw7DjzWQOxTqzPmB3qMosvxIZeUFz.png",
    alt: "Watergate era un documento. Sai leggere il tuo cedolino?",
  },
  {
    id: "07",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/07%3A27-pkz4WJ6vEApF7VYc6t86wnhGJdktXr.png",
    alt: "Enrico VIII cambio' le regole. Conosci i tuoi diritti.",
  },
  {
    id: "08",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/08%3A27-t8DSwOBfIHQjmUDsTxEihMUCfGvEKR.png",
    alt: "Suarez morse Chiellini. Il tuo cedolino lo sa.",
  },
  {
    id: "09",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/09%3A27-wDapLUXTPJl9FnPFQXJQ6QT735QKRc.png",
    alt: "Le telefonate c'erano. L'hai mai letto davvero?",
  },
  {
    id: "10",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10%3A27-bWbytmIT2IVy0d4jB2febj1wRIUfwf.png",
    alt: "7 Tour. Tutte bugie. Scoprilo in 2 minuti.",
  },
];

function MarqueeRow({
  cards,
  direction = "left",
  speed = 40,
}: {
  cards: typeof editorialCards;
  direction?: "left" | "right";
  speed?: number;
}) {
  const duplicated = [...cards, ...cards];
  const duration = cards.length * speed;

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        className={`flex gap-5 md:gap-6 ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
        style={{
          animationDuration: `${duration}s`,
        }}
      >
        {duplicated.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            className="shrink-0 w-[280px] md:w-[320px] lg:w-[360px] group"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden border border-border/40 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:scale-[1.02] group-hover:border-brand-amber/30">
              <Image
                src={card.src}
                alt={card.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 360px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EditorialCarouselSection() {
  const firstRow = editorialCards.slice(0, 5);
  const secondRow = editorialCards.slice(5, 10);

  return (
    <section className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-4 mb-12 md:mb-16">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-brand-amber uppercase tracking-widest mb-3">
              La campagna
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-navy mb-4 text-balance">
              La storia insegna.
              <br />
              <span className="text-brand-amber">Il tuo cedolino anche.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
              27 storie. 27 motivi per controllare i tuoi documenti di lavoro.
              Segui la campagna sui nostri social.
            </p>
          </div>
        </AnimatedSection>
      </div>

      <div className="flex flex-col gap-5 md:gap-6">
        <MarqueeRow cards={firstRow} direction="left" speed={35} />
        <MarqueeRow cards={secondRow} direction="right" speed={40} />
      </div>
    </section>
  );
}
