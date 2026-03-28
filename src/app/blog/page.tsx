import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";
import { blogArticles } from "@/lib/blog-articles";
import { ArrowRight, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — LavoroInChiaro | Guide su busta paga, CCNL, diritti e lavoro",
  description:
    "Articoli e guide aggiornate su busta paga, CCNL, NASPI, TFR, maternità, multe e diritti dei lavoratori. Risorse gratuite per capire il tuo cedolino.",
  openGraph: {
    title: "Blog — LavoroInChiaro",
    description:
      "Guide pratiche su busta paga, contratti, diritti dei lavoratori e molto altro.",
    type: "website",
    url: "/blog",
    siteName: "LavoroInChiaro",
    locale: "it_IT",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Header */}
        <section className="relative overflow-hidden px-6 pt-24 pb-16 md:pt-32 md:pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent_50%)]" />
          <div className="relative container mx-auto text-center">
            <p className="text-sm font-semibold text-blue-200 tracking-wide uppercase mb-3">
              Blog
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Guide e articoli su lavoro e diritti
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Risorse gratuite per capire la tua busta paga, i tuoi diritti e
              orientarti nel mondo del lavoro italiano.
            </p>
          </div>
        </section>

        {/* Articles grid */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {blogArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group"
                >
                  <article className="h-full rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(article.date).toLocaleDateString("it-IT", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
                      {article.metaDescription}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                      Leggi l&apos;articolo
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
