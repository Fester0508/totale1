import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Link href="/" className="flex items-center gap-1 mb-8">
        <span className="text-2xl font-bold uppercase tracking-wider">
          <span className="text-brand-navy">LAVORO</span>
          <span className="text-brand-gray mx-1 text-xl font-normal">IN</span>
          <span className="text-brand-amber">CHIARO</span>
        </span>
      </Link>
      {children}
    </div>
  );
}
