import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";
import { agents } from "@/lib/agents";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Servizi AI — LavoroChiaro",
  description:
    "Accedi ai nostri assistenti AI: redazione lettere, calcolo NASPI, maternità, controllo multe e molto altro.",
};

export default function ServiziPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            I nostri servizi AI
          </h1>
          <p className="text-muted-foreground text-lg">
            Assistenti intelligenti pronti ad aiutarti con le questioni
            lavorative più comuni. Scegli un servizio e inizia subito la
            conversazione.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <Card
                key={agent.id}
                className="group hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy/10 text-brand-navy dark:bg-brand-amber/10 dark:text-brand-amber">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{agent.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {agent.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="w-full bg-brand-navy hover:bg-brand-navy-light text-primary-foreground"
                  >
                    <Link href={`/servizi/${agent.id}`}>
                      Inizia chat
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
