import {
  FileText,
  MessageCircle,
  Calculator,
  Heart,
  Users,
  Shield,
  Home,
} from "lucide-react";

export const AGENTS_BASE_URL =
  process.env.NEXT_PUBLIC_AGENTS_URL ||
  "https://lic-ai-agents.livelywater-2e6c6c48.northeurope.azurecontainerapps.io";

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  endpoint: string;
}

export const agents: AgentConfig[] = [
  {
    id: "redazione-lettere",
    name: "Redazione Lettere",
    description: "Genera richieste formali al tuo datore di lavoro",
    icon: FileText,
    endpoint: "/agents/redazione-lettere/chat",
  },
  {
    id: "assistenza",
    name: "Assistenza",
    description: "Hai bisogno di aiuto? Chiedi al nostro assistente",
    icon: MessageCircle,
    endpoint: "/agents/assistenza/chat",
  },
  {
    id: "calcolo-naspi",
    name: "Calcolo NASPI",
    description: "Simula la tua indennità di disoccupazione",
    icon: Calculator,
    endpoint: "/agents/calcolo-naspi/chat",
  },
  {
    id: "maternita",
    name: "Maternità",
    description: "Congedo, indennità e diritti per la maternità",
    icon: Heart,
    endpoint: "/agents/maternita/chat",
  },
  {
    id: "professionisti",
    name: "Rete Professionisti",
    description: "Collegati con commercialisti e consulenti del lavoro",
    icon: Users,
    endpoint: "/agents/professionisti/chat",
  },
  {
    id: "controllo-multe",
    name: "Controllo Multe",
    description: "Verifica la regolarità delle tue multe",
    icon: Shield,
    endpoint: "/agents/controllo-multe/chat",
  },
  {
    id: "contratti-colf",
    name: "Contratti Colf",
    description: "Assistenza contratti di lavoro domestico",
    icon: Home,
    endpoint: "/agents/contratti-colf/chat",
  },
];

export function getAgentById(id: string): AgentConfig | undefined {
  return agents.find((a) => a.id === id);
}
