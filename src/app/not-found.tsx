import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="h-20 w-20 bg-blue-100 dark:bg-blue-950/50 rounded-full flex items-center justify-center mb-6">
          <FileSearch className="h-10 w-10 text-brand-navy" />
        </div>
        <h1 className="text-3xl font-bold text-brand-navy mb-3">
          Pagina non trovata
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link href="/">
          <Button size="lg">Torna alla Home</Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
