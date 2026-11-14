"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import ToggleTheme from "./ToggleTheme";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Websites", match: (p: string) => p === "/dashboard" || p.startsWith("/dashboard/website") || p.startsWith("/dashboard/new") },
  { href: "/dashboard/pricing", label: "Plans", match: (p: string) => p.startsWith("/dashboard/pricing") },
  { href: "/demo", label: "Demo", match: (p: string) => p.startsWith("/demo") },
];

function AppHeader() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname() ?? "";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href={user ? "/dashboard" : "/"} aria-label="Insightica home">
          <Logo />
        </Link>

        <nav className="hidden h-full items-stretch gap-1 sm:flex">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center px-3 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 bg-foreground" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <ToggleTheme />
          {isLoaded && !user && (
            <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
              <button className="h-9 bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                Sign in
              </button>
            </SignInButton>
          )}
          {user && (
            <UserButton
              appearance={{ elements: { avatarBox: "h-8 w-8 " } }}
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
