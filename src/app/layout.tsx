import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/components/providers";
import { CookieBanner } from "@/components/cookie-banner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://lavorochiaro.it"
  ),
  title: "LavoroChiaro - Analisi AI Busta Paga, 730, Cartelle e Multe",
  description:
    "Carica la tua busta paga e scopri in 30 secondi se è corretta. Analisi AI gratuita, senza registrazione. Verifica stipendio, CCNL, trattenute INPS, contributi, TFR, ferie e straordinari. Controlla anche 730, cartelle esattoriali e multe.",
  keywords: [
    "busta paga",
    "analisi busta paga",
    "verifica cedolino",
    "controllo busta paga online",
    "CCNL",
    "stipendio",
    "trattenute INPS",
    "contributi",
    "TFR",
    "consulente del lavoro",
    "intelligenza artificiale",
    "verifica 730",
    "cartella esattoriale",
    "contestare multa",
    "diritti lavoratori",
  ],
  openGraph: {
    title: "LavoroChiaro - La tua busta paga è corretta?",
    description:
      "Il 67% dei lavoratori ha errori in busta paga. Scopri in 30 secondi se la tua è corretta con l'analisi AI gratuita di LavoroChiaro.",
    type: "website",
    url: "/",
    siteName: "LavoroChiaro",
    locale: "it_IT",
  },
  twitter: {
    card: "summary_large_image",
    title: "LavoroChiaro - La tua busta paga è corretta?",
    description:
      "Il 67% dei lavoratori ha errori in busta paga. Scopri in 30 secondi se la tua è corretta con l'analisi AI gratuita.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LavoroInChiaro" />
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <script
            defer
            src="https://analytics.lavoroinchiaro.it/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
      </head>
      <body
        className="font-mono antialiased"
      >
        <a
          href="#analizza"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand-navy focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
        >
          Vai al contenuto principale
        </a>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <CookieBanner />
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </body>
    </html>
  );
}
