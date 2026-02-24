import { Header } from "@/components/header";
import { UploadZone } from "@/components/upload-zone";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustBadgesSection } from "@/components/landing/trust-badges-section";
import { StatsSection } from "@/components/landing/stats-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { ServicesSection } from "@/components/landing/services-section";
import { EducationalSection } from "@/components/landing/educational-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { SocialProofBanner } from "@/components/landing/social-proof-banner";
import { FinalCTASection } from "@/components/landing/final-cta-section";
import { Footer } from "@/components/landing/footer";
import { StickyCTA } from "@/components/landing/sticky-cta";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "LavoroChiaro",
      url: "https://lavorochiaro.it",
      description:
        "Il primo servizio italiano di analisi documenti di lavoro con intelligenza artificiale.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "info@lavorochiaro.it",
        contactType: "customer service",
        availableLanguage: "Italian",
      },
    },
    {
      "@type": "WebApplication",
      name: "LavoroChiaro",
      url: "https://lavorochiaro.it",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      offers: [
        {
          "@type": "Offer",
          name: "Piano Free",
          price: "0",
          priceCurrency: "EUR",
          description: "3 analisi al mese, verdetto rapido a semafori",
        },
        {
          "@type": "Offer",
          name: "Piano Pro",
          price: "4.99",
          priceCurrency: "EUR",
          description:
            "Analisi illimitate, chatbot AI, report PDF completo. Pagamento unico.",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        bestRating: "5",
        ratingCount: "2400",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Quanto costa usare LavoroChiaro?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Il piano Free ti permette di analizzare fino a 3 documenti al mese, completamente gratis e senza registrazione. Il piano Pro costa solo €4,99 — un pagamento unico, senza abbonamenti.",
          },
        },
        {
          "@type": "Question",
          name: "I miei dati sono al sicuro?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ogni documento viene crittografato con standard AES-256, trasmesso su connessione HTTPS e conservato su server europei conformi GDPR. I file vengono eliminati automaticamente dopo 30 giorni.",
          },
        },
        {
          "@type": "Question",
          name: "Come funziona l'analisi della busta paga?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI estrae tutti i dati con OCR avanzato, poi confronta ogni voce con le tabelle CCNL, la normativa vigente e le aliquote fiscali aggiornate. Il risultato è un report con sistema a semafori in circa 30 secondi.",
          },
        },
        {
          "@type": "Question",
          name: "Funziona con il mio contratto di lavoro?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sì, supportiamo tutti i principali CCNL italiani: Commercio, Metalmeccanico, Pubblico Impiego, Sanità, Edilizia, Turismo, Trasporti, Telecomunicazioni, Chimico-Farmaceutico e molti altri.",
          },
        },
        {
          "@type": "Question",
          name: "Posso usarlo da smartphone?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "LavoroChiaro è mobile-first: basta scattare una foto alla busta paga e caricarla. Funziona su iPhone, Android e qualsiasi tablet.",
          },
        },
        {
          "@type": "Question",
          name: "Quali documenti posso analizzare oltre alla busta paga?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Puoi analizzare il modello 730, le cartelle esattoriali e le multe. Ogni tipo di documento ha un'analisi AI specializzata.",
          },
        },
        {
          "@type": "Question",
          name: "L'analisi sostituisce un consulente del lavoro?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, LavoroChiaro è uno strumento informativo. Ti permette di arrivare dal consulente già informato, risparmiando tempo e denaro.",
          },
        },
        {
          "@type": "Question",
          name: "In quanto tempo ottengo il risultato?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'analisi richiede in media 30 secondi. Risultato istantaneo, 24/7.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main>
        <HeroSection />
        <TrustBadgesSection />
        <StatsSection />

        <div id="come-funziona">
          <HowItWorksSection />
        </div>

        <ServicesSection />
        <EducationalSection />

        {/* Upload Section */}
        <section
          id="analizza"
          className="py-20 md:py-24 bg-gradient-to-b from-blue-50/50 to-white dark:from-background dark:to-background"
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">
                Carica il tuo documento
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Trascina qui il file oppure clicca per selezionarlo. PDF, foto o
                scansione &mdash; va bene tutto. L&apos;analisi parte in
                automatico e il risultato arriva in 30 secondi.
              </p>
            </div>
            <UploadZone />
          </div>
        </section>

        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <SocialProofBanner />
        <FinalCTASection />
      </main>

      <Footer />
      <StickyCTA />
    </div>
  );
}
