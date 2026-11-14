import Link from "next/link";
import Logo from "./Logo";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="dark hidden flex-col justify-between bg-background p-12 text-foreground lg:flex">
        <Link href="/">
          <Logo />
        </Link>

        <div>
          <p className="font-semibold text-5xl leading-[1.05] tracking-tight">
            See who visits your site.
          </p>
          <ul className="mt-10 space-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
            <li className="flex justify-between gap-6">
              <span>Tracking script</span>
              <span className="num text-foreground">3.3 kB</span>
            </li>
            <li className="flex justify-between gap-6">
              <span>Cookies set</span>
              <span className="num text-foreground">0</span>
            </li>
            <li className="flex justify-between gap-6">
              <span>To install</span>
              <span className="num text-foreground">1 script tag</span>
            </li>
          </ul>
        </div>

        <p className="text-sm text-muted-foreground">Insightica</p>
      </aside>

      <main className="flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 lg:hidden">
          <Logo />
        </Link>
        {children}
      </main>
    </div>
  );
}
