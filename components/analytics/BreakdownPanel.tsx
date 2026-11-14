"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/use-in-view";

export type BreakdownRow = {
  name: string;
  uv: number;
  icon?: React.ReactNode;
};

export type BreakdownTab = {
  key: string;
  label: string;
  rows: BreakdownRow[];
};

type Props = {
  title: string;
  tabs: BreakdownTab[];
  loading?: boolean;
  limit?: number;
};

export default function BreakdownPanel({
  title,
  tabs,
  loading,
  limit = 7,
}: Props) {
  const [active, setActive] = useState(tabs[0]?.key);
  const tab = tabs.find((t) => t.key === active) ?? tabs[0];
  const { ref, inView } = useInView<HTMLElement>(0.3);

  const { rows, total, max } = useMemo(() => {
    const sorted = [...(tab?.rows ?? [])]
      .filter((r) => r.name)
      .sort((a, b) => b.uv - a.uv);
    return {
      rows: sorted.slice(0, limit),
      total: sorted.reduce((sum, r) => sum + r.uv, 0),
      max: sorted[0]?.uv ?? 0,
    };
  }, [tab, limit]);

  return (
    <section ref={ref} className="flex flex-col border border-border bg-card">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium">{title}</h3>
        <div role="tablist" className="flex items-center gap-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={t.key === tab?.key}
              onClick={() => setActive(t.key)}
              className={cn(
                "text-xs transition-colors",
                t.key === tab?.key
                  ? "text-foreground underline decoration-foreground decoration-2 underline-offset-[6px]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex items-center justify-between px-4 pt-3">
        <span className="label">{tab?.label}</span>
        <span className="label">Visitors</span>
      </div>

      <div className="min-h-[236px] px-2 pb-3 pt-1.5">
        {loading ? (
          <div className="space-y-1.5 px-2 pt-1">
            {[88, 64, 47, 30, 18].map((w) => (
              <div
                key={w}
                className="h-7 animate-pulse bg-muted"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="grid h-[220px] place-items-center px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing recorded for this range yet.
            </p>
          </div>
        ) : (
          <ul key={tab?.key}>
            {rows.map((row, i) => {
              const share = total > 0 ? (row.uv / total) * 100 : 0;
              const width = max > 0 ? Math.max((row.uv / max) * 100, 2) : 0;
              return (
                <li
                  key={row.name}
                  className="group relative flex h-8 items-center justify-between gap-3 px-2 text-sm transition-colors hover:bg-muted"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0.5 left-0 origin-left bg-brand-soft transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                    style={{
                      width: `${width}%`,
                      transform: inView ? "scaleX(1)" : "scaleX(0)",
                      transitionDelay: `${i * 55}ms`,
                    }}
                  />
                  <span className="relative flex min-w-0 items-center gap-2">
                    {row.icon}
                    <span className="truncate">{row.name}</span>
                  </span>
                  <span className="relative flex shrink-0 items-baseline gap-2">
                    <span className="num text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      {share.toFixed(0)}%
                    </span>
                    <span className="num font-medium">
                      {row.uv.toLocaleString()}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
