import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { AgentChat } from "@/components/agent-chat";
import { getAgentById, agents } from "@/lib/agents";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return agents.map((a) => ({ agentId: a.id }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = use(params);
  const agent = getAgentById(agentId);
  if (!agent) return { title: "Servizio non trovato" };
  return {
    title: `${agent.name} — LavoroChiaro`,
    description: agent.description,
  };
}

export default function AgentChatPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = use(params);
  const agent = getAgentById(agentId);
  if (!agent) notFound();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/servizi">
              <ArrowLeft className="h-4 w-4" />
              Tutti i servizi
            </Link>
          </Button>
        </div>
        <div className="flex-1 border rounded-xl bg-card overflow-hidden">
          <AgentChat agent={agent} />
        </div>
      </div>
    </div>
  );
}
