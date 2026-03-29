"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Moon,
  Sun,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label="Cambia tema"
      suppressHydrationWarning
    >
      <Sun className="h-5 w-5 text-foreground hidden dark:block" />
      <Moon className="h-5 w-5 text-foreground block dark:hidden" />
    </button>
  );
}

const navLinks = [
  { href: "#analizza", label: "Analizza" },
  { href: "/servizi", label: "Servizi" },
  { href: "#prezzi", label: "Prezzi" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user ?? null;
  const router = useRouter();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-1.5">
          <span className="text-xl font-bold uppercase tracking-wider transition-colors duration-300 font-heading">
            <span className="text-brand-navy">LAVORO</span>
            <span className="text-brand-gray mx-1 text-lg font-normal">IN</span>
            <span className="text-brand-amber group-hover:text-brand-amber-dark transition-colors duration-300">CHIARO</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          <div className="relative group">
            <Link
              href="#associati"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted flex items-center gap-1"
            >
              Associati
              <ChevronDown className="h-3 w-3" />
            </Link>
            <div className="absolute top-full left-0 mt-1 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link
                href="#associati"
                className="block px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted rounded-t-lg"
              >
                Associati — €0,99/mese
              </Link>
              <Link
                href="/chi-siamo"
                className="block px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted"
              >
                Chi siamo
              </Link>
              <Link
                href="/blog"
                className="block px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted rounded-b-lg"
              >
                Blog
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex gap-2"
                >
                  <UserIcon className="h-4 w-4" />
                  {user.email?.split("@")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Le mie analisi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/impostazioni" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Impostazioni
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Esci
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex flex-col items-center">
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="bg-brand-navy hover:bg-brand-navy-light text-primary-foreground"
                >
                  <Link href="/login">Accedi</Link>
                </Button>
                <span className="text-[10px] text-muted-foreground mt-0.5">per i lavoratori</span>
              </div>
              <div className="flex flex-col items-center">
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="bg-brand-amber hover:bg-brand-amber-dark text-white"
                >
                  <Link href="/accreditati">Accreditati</Link>
                </Button>
                <span className="text-[10px] text-muted-foreground mt-0.5">per i professionisti</span>
              </div>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-foreground/70 hover:text-foreground transition-colors px-3 py-2.5 rounded-lg hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          <div className="px-3 pt-2 pb-1 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
            Associati
          </div>
          <Link
            href="#associati"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-foreground/70 hover:text-foreground transition-colors pl-6 pr-3 py-2.5 rounded-lg hover:bg-muted"
          >
            Associati — €0,99/mese
          </Link>
          <Link
            href="/chi-siamo"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-foreground/70 hover:text-foreground transition-colors pl-6 pr-3 py-2.5 rounded-lg hover:bg-muted"
          >
            Chi siamo
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-foreground/70 hover:text-foreground transition-colors pl-6 pr-3 py-2.5 rounded-lg hover:bg-muted"
          >
            Blog
          </Link>
          <div className="pt-2">
            {user ? (
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start gap-2"
                >
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Le mie analisi
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start gap-2"
                >
                  <Link
                    href="/impostazioni"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Impostazioni
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Esci
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-col items-center">
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="w-full bg-brand-navy hover:bg-brand-navy-light text-primary-foreground"
                  >
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Accedi
                    </Link>
                  </Button>
                  <span className="text-[10px] text-muted-foreground mt-0.5">per i lavoratori</span>
                </div>
                <div className="flex flex-col items-center">
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="w-full bg-brand-amber hover:bg-brand-amber-dark text-white"
                  >
                    <Link href="/accreditati" onClick={() => setMobileOpen(false)}>
                      Accreditati
                    </Link>
                  </Button>
                  <span className="text-[10px] text-muted-foreground mt-0.5">per i professionisti</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
