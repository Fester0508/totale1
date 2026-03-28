import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";
import { blogArticles } from "@/lib/blog-articles";
import { ArrowLeft, Calendar } from "lucide-react";
import { BlogArticleContent } from "./blog-article-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: `${article.title} — LavoroInChiaro`,
    description: article.metaDescription,
    keywords: [article.keyword, ...article.secondaryKeywords],
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: "article",
      url: `/blog/${article.slug}`,
      siteName: "LavoroInChiaro",
      locale: "it_IT",
      publishedTime: article.date,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.metaDescription,
    },
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: "LavoroInChiaro",
      url: "https://lavoroinchiaro.it",
    },
    publisher: {
      "@type": "Organization",
      name: "LavoroInChiaro",
      url: "https://lavoroinchiaro.it",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://lavoroinchiaro.it/blog/${article.slug}`,
    },
    keywords: [article.keyword, ...article.secondaryKeywords].join(", "),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Header />

      <main>
        <article className="py-24 md:py-32">
          <div className="container mx-auto px-6 max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Torna al blog
            </Link>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4" />
              {new Date(article.date).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight">
              {article.title}
            </h1>

            <BlogArticleContent content={article.content} slug={article.slug} />

            {/* CTA */}
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Vuoi verificare la tua busta paga?
              </h3>
              <p className="text-muted-foreground mb-4">
                Carica il tuo cedolino e ricevi un&apos;analisi gratuita in 30
                secondi.
              </p>
              <Link
                href="/#analizza"
                className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg"
              >
                Analizza GRATIS la tua busta paga
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
