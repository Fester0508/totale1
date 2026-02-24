import Link from "next/link";
import { FileSearch } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <FileSearch className="h-8 w-8 text-brand-navy" />
        <span className="text-2xl font-bold text-brand-navy">
          Lavoro<span className="text-brand-amber">Chiaro</span>
        </span>
      </Link>
      {children}
    </div>
  );
}
