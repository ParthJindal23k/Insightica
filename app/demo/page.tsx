"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AppHeader from "@/app/_components/AppHeader";
import Overview from "@/components/analytics/Overview";
import {
  DevicesPanel,
  LocationsPanel,
  SourcesPanel,
} from "@/components/analytics/Breakdowns";
import { demoAnalytics } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export default function DemoPage() {
  const [type, setType] = useState("hourly");
  const [live, setLive] = useState(14);

  // Gentle drift so the live counter feels like the real thing.
  useEffect(() => {
    const id = setInterval(() => {
      setLive((n) => Math.min(24, Math.max(8, n + (Math.random() > 0.5 ? 1 : -1))));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-brand px-4 py-2.5 text-sm text-black">
          <span>
            <span className="mr-2 font-semibold">Sample data.</span>
            This is a read-only tour of the dashboard. Nothing here is a real
            visitor.
          </span>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
          >
            Track your own site <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-semibold text-4xl leading-none tracking-tight sm:text-5xl">
            acme-bakery.com
          </h1>
          <div
            role="group"
            aria-label="Chart resolution"
            className="flex h-9 items-center border border-input bg-card p-0.5"
          >
            {["hourly", "daily"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className={cn(
                  "h-full px-3 text-sm capitalize transition-colors",
                  type === t
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <Overview
            analytics={demoAnalytics}
            analyticType={type}
            liveUserCount={live}
            deltas={{ visitors: 12.4, pageViews: 8.1, totalActive: 5.6, avgActive: -2.3 }}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SourcesPanel analytics={demoAnalytics} />
          <LocationsPanel analytics={demoAnalytics} />
          <DevicesPanel analytics={demoAnalytics} />
        </div>
      </main>
    </div>
  );
}
