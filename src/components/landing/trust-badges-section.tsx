import { Shield, Lock, UserX, Brain } from "lucide-react";
import { AnimatedSection } from "./animated-section";

const badges = [
  {
    icon: Lock,
    title: "Dati criptati AES-256",
    description: "Mai condivisi",
  },
  {
    icon: Shield,
    title: "Conforme GDPR",
    description: "Privacy garantita",
  },
  {
    icon: UserX,
    title: "Zero registrazione",
    description: "Analisi immediata",
  },
  {
    icon: Brain,
    title: "AI specializzata",
    description: "Normativa italiana",
  },
];

export function TrustBadgesSection() {
  return (
    <section className="py-12 bg-white dark:bg-background border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {badges.map((badge, i) => (
            <AnimatedSection key={badge.title} delay={i * 0.1}>
              <div className="group flex flex-col items-center text-center p-4 md:p-6 rounded-xl bg-muted/30 dark:bg-muted/10 border border-border/30 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-brand-navy/15 hover:bg-white dark:hover:bg-muted/20 cursor-default">
                <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50">
                  <badge.icon className="h-5 w-5 text-brand-navy transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">
                  {badge.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {badge.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
