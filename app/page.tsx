"use client";

import React from "react";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { ArrowRight, Check } from "lucide-react";

import Logo from "./_components/Logo";
import ToggleTheme from "./_components/ToggleTheme";
import Overview from "@/components/analytics/Overview";
import {
  DevicesPanel,
  LocationsPanel,
  SourcesPanel,
} from "@/components/analytics/Breakdowns";
import ScriptSnippet from "@/components/analytics/ScriptSnippet";
import { demoAnalytics } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "Visitors and page views",
    body: "Unique visitors, total views and time on site. By the hour for today, by the day for any range you pick.",
  },
  {
    title: "Traffic sources",
    body: "Which sites send you people, and which campaign links and URL parameters they arrived with.",
  },
  {
    title: "Countries, regions, cities",
    body: "A ranked list of where your readers are, down to the city.",
  },
  {
    title: "Devices, browsers, operating systems",
    body: "Find out whether to test on a phone first, and which browsers you can stop worrying about.",
  },
  {
    title: "Live visitors",
    body: "How many people are on the site right now, refreshed every 10 seconds.",
  },
  {
    title: "Several sites, 1 login",
    body: "Each site gets its own dashboard, timezone and script. Switch between them from one menu.",
  },
];

const STEPS = [
  ["Add your domain", "Enter the domain and the timezone you report in."],
  ["Paste 1 script tag", "Put it in your <head>. It loads deferred and weighs 3.3 kB."],
  ["Read your numbers", "Visits show up within seconds. Nothing else to configure."],
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    note: "For a portfolio, a blog or a side project.",
    features: [
      "1 website",
      "Visitors, page views and active time",
      "Sources, locations and devices",
      "Live visitor count",
    ],
    cta: "Start free",
    href: "/dashboard",
    primary: false,
  },
  {
    name: "Pro",
    price: "$4.99",
    note: "For everything else you run.",
    features: [
      "Unlimited websites",
      "Everything in Free",
      "1 login for every dashboard",
      "AI summaries of your traffic (coming soon)",
    ],
    cta: "See Pro",
    href: "/dashboard/pricing",
    primary: true,
  },
];

function CtaLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center gap-2 border border-line bg-brand px-6 text-[15px] font-semibold text-black transition-colors hover:bg-foreground hover:text-background",
        className
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export default function Home() {
  const { user, isLoaded } = useUser();

  return (
    <div className="min-h-screen overflow-x-clip">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-8 px-4 sm:px-6">
          <Link href="/" aria-label="Insightica home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="hover:underline hover:underline-offset-4">
              Features
            </a>
            <a href="#install" className="hover:underline hover:underline-offset-4">
              Install
            </a>
            <a href="#pricing" className="hover:underline hover:underline-offset-4">
              Pricing
            </a>
            <Link href="/demo" className="hover:underline hover:underline-offset-4">
              Demo
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <ToggleTheme />
            {isLoaded && !user && (
              <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
                <button className="h-9 border border-line px-4 text-sm font-medium transition-colors hover:bg-foreground hover:text-background">
                  Sign in
                </button>
              </SignInButton>
            )}
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="hidden h-9 items-center border border-line px-4 text-sm font-medium transition-colors hover:bg-foreground hover:text-background sm:inline-flex"
                >
                  Dashboard
                </Link>
                <UserButton />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-24">
        <h1 className="max-w-4xl text-[clamp(2.5rem,8.2vw,5.75rem)] font-semibold leading-[0.98]">
          See who visits your site.
        </h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <div>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Insightica counts your visitors and shows where they came from,
              where they are and what they used. One page, one script tag, no
              cookies.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <CtaLink href="/dashboard" className="justify-center sm:justify-start">
                {user ? "Open your dashboard" : "Start tracking for free"}
              </CtaLink>
              <Link
                href="/demo"
                className="text-[15px] font-medium underline underline-offset-4"
              >
                Try the demo first
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-3 border-t border-line">
            {[
              ["3.3 kB", "script size"],
              ["0", "cookies"],
              ["10 s", "live refresh"],
            ].map(([value, label]) => (
              <div key={label} className="pr-3 pt-4">
                <dt className="num text-2xl font-medium sm:text-3xl">{value}</dt>
                <dd className="label mt-1">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Product, shown for real */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="border border-line">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
            <span className="text-lg font-semibold tracking-tight">
              acme-bakery.com
            </span>
            <span className="bg-brand px-2 py-0.5 text-xs font-medium text-black">
              Sample data
            </span>
          </div>

          <div className="[&>section]:border-0">
            <Overview
              analytics={demoAnalytics}
              analyticType="hourly"
              liveUserCount={14}
              deltas={{ visitors: 12.4, pageViews: 8.1, totalActive: 5.6, avgActive: -2.3 }}
              chartHeightClass="h-[220px] sm:h-[300px]"
            />
          </div>
          <div className="grid border-t border-line md:grid-cols-3 md:divide-x md:divide-line [&_section]:border-0">
            <SourcesPanel analytics={demoAnalytics} />
            <div className="hidden md:block">
              <LocationsPanel analytics={demoAnalytics} />
            </div>
            <div className="hidden md:block">
              <DevicesPanel analytics={demoAnalytics} />
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          This is the working dashboard, not a screenshot. Hover the chart or
          switch the tabs.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-14 px-4 py-20 sm:px-6 sm:py-28">
        <h2 className="max-w-2xl text-3xl font-semibold leading-[1.05] sm:text-5xl">
          Answer 6 questions about your traffic.
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          We left out funnels, heatmaps and custom dimensions on purpose. Most
          sites need to know these things, and little else.
        </p>

        <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="border-t border-line pt-4">
              <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Install */}
      <section id="install" className="scroll-mt-14 bg-muted">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-semibold leading-[1.05] sm:text-5xl">
              Install it in 3 steps.
            </h2>

            <ol className="mt-10">
              {STEPS.map(([title, body], i) => (
                <li key={title} className="flex gap-4 border-t border-input py-5">
                  <span className="num w-5 shrink-0 font-medium">{i + 1}.</span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="min-w-0 lg:pt-2">
            <ScriptSnippet
              websiteId="your-website-id"
              domain="https://yourwebsite.com"
              src={`${process.env.NEXT_PUBLIC_HOST_URL ?? "https://insightica-phi.vercel.app"}/analytics.js`}
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Works anywhere HTML does: plain pages, React, Next.js, WordPress.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto w-full max-w-6xl scroll-mt-14 px-4 py-20 sm:px-6 sm:py-28">
        <h2 className="max-w-2xl text-3xl font-semibold leading-[1.05] sm:text-5xl">
          Pay nothing for your first site.
        </h2>

        <div className="mt-10 grid border border-line md:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col p-6 sm:p-10",
                plan.primary && "border-t border-line md:border-l md:border-t-0"
              )}
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-5 flex items-baseline gap-2">
                <span className="num text-5xl font-medium sm:text-6xl">{plan.price}</span>
                <span className="text-sm text-muted-foreground">per month</span>
              </p>
              <p className="mt-3 text-muted-foreground">{plan.note}</p>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={cn(
                  "mt-8 inline-flex h-12 items-center justify-center border border-line px-5 text-[15px] font-semibold transition-colors",
                  plan.primary
                    ? "bg-foreground text-background hover:bg-brand hover:text-black"
                    : "hover:bg-foreground hover:text-background"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="bg-brand text-black">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-2xl text-4xl font-semibold leading-[1] sm:text-6xl">
            Find out who showed up today.
          </h2>
          <Link
            href="/dashboard"
            className="inline-flex h-12 shrink-0 items-center gap-2 bg-black px-6 text-[15px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            {user ? "Open your dashboard" : "Add your first site"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
            <Link href="/demo" className="hover:text-foreground">
              Demo
            </Link>
            <a href="#pricing" className="hover:text-foreground">
              Pricing
            </a>
            <Link href="/sign-in" className="hover:text-foreground">
              Sign in
            </Link>
            <span>© {new Date().getFullYear()} Insightica</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
