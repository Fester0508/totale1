"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileSearch,
  DollarSign,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const NAV_ITEMS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/utenti", label: "Utenti", icon: Users },
  { href: "/admin/analisi", label: "Analisi", icon: FileSearch },
  { href: "/admin/costi", label: "Costi AI", icon: DollarSign },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="w-60 border-r bg-muted/30 flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b">
        <Link href="/admin/dashboard" className="font-bold text-lg">
          LavoroChiaro
        </Link>
        <p className="text-xs text-muted-foreground">Pannello Admin</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors text-left"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Esci
        </button>
      </div>
    </aside>
  );
}
