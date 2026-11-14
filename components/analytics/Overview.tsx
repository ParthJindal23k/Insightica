"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AnalyticsType } from "@/configs/type";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/use-in-view";

type Deltas = {
  visitors: number | null;
  pageViews: number | null;
  totalActive: number | null;
  avgActive: number | null;
};

type Props = {
  analytics: AnalyticsType | undefined | null;
  loading?: boolean;
  analyticType?: string;
  liveUserCount?: number;
  /** Optional fixed deltas (used by the demo). Otherwise compared with the first loaded range. */
  deltas?: Deltas;
  chartHeightClass?: string;
};

const chartConfig = {
  count: { label: "Visitors", color: "var(--chart-1)" },
} satisfies ChartConfig;

function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = from + (target - from) * eased;
      fromRef.current = current;
      setValue(current);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

export function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${sec.toString().padStart(2, "0")}s`;
  return `${sec}s`;
}

function Delta({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  if (Math.abs(value) < 0.05) {
    return <span className="num text-xs text-muted-foreground">0%</span>;
  }
  const up = value > 0;
  return (
    <span
      className={cn("num text-xs", up ? "text-positive" : "text-negative")}
      title="Today compared with the selected range"
    >
      {up ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function Stat({
  label,
  value,
  delta,
  loading,
}: {
  label: string;
  value: string;
  delta?: number | null;
  loading?: boolean;
  }) {
  return (
    <div
      className="flex flex-col gap-2 px-4 py-4 sm:px-5"
    >
      <span className="label">{label}</span>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2.5">
        {loading ? (
          <span className="h-9 w-20 animate-pulse bg-muted" />
        ) : (
          <span className="num whitespace-nowrap text-2xl font-medium leading-9 sm:text-[32px]">
            {value}
          </span>
        )}
        {!loading && <Delta value={delta} />}
      </div>
    </div>
  );
}

export function LivePill({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            count > 0 ? "bg-positive" : "bg-muted-foreground/50"
          )}
        />
      </span>
      <span key={count} className="num tick font-medium">{count}</span>
      <span className="text-muted-foreground">
        {count === 1 ? "person" : "people"} on the site now
      </span>
    </span>
  );
}

export default function Overview({
  analytics,
  loading,
  analyticType = "hourly",
  liveUserCount = 0,
  deltas,
  chartHeightClass = "h-[260px] sm:h-[320px]",
}: Props) {
  const isLoading = loading || !analytics;
  const { ref: chartRef, inView: chartInView } = useInView<HTMLDivElement>(0.3);

  const visitors = Number(analytics?.totalVisitors ?? 0);
  const pageViews = Number(analytics?.totalSessions ?? 0);
  const totalActive = Number(analytics?.totalActiveTime ?? 0);
  const avgActive = Number(analytics?.avgActiveTime ?? 0);

  // The first loaded range (today) is kept as the reference point.
  const baselineRef = useRef<null | {
    visitors: number;
    pageViews: number;
    totalActive: number;
    avgActive: number;
  }>(null);

  useEffect(() => {
    if (!isLoading && !baselineRef.current) {
      baselineRef.current = { visitors, pageViews, totalActive, avgActive };
    }
  }, [isLoading, visitors, pageViews, totalActive, avgActive]);

  const computed = useMemo<Deltas>(() => {
    const base = baselineRef.current;
    const calc = (selected: number, latest: number) =>
      selected === 0 ? null : ((latest - selected) / selected) * 100;
    if (!base)
      return { visitors: null, pageViews: null, totalActive: null, avgActive: null };
    return {
      visitors: calc(visitors, base.visitors),
      pageViews: calc(pageViews, base.pageViews),
      totalActive: calc(totalActive, base.totalActive),
      avgActive: calc(avgActive, base.avgActive),
    };
  }, [visitors, pageViews, totalActive, avgActive]);

  const d = deltas ?? computed;

  const visitorsShown = useCountUp(isLoading ? 0 : visitors);
  const pageViewsShown = useCountUp(isLoading ? 0 : pageViews);

  const hourly = analyticType === "hourly";
  const chartData = hourly ? analytics?.hourlyVisitors : analytics?.dailyVisitors;
  const xKey = hourly ? "hourLabel" : "date";
  const hasPoints = (chartData?.length ?? 0) > 0;

  return (
    <section className="overflow-hidden border border-border bg-card">
      <div className="grid grid-cols-2 divide-border max-lg:[&>*:nth-child(n+3)]:border-t max-lg:[&>*:nth-child(odd)]:border-r lg:grid-cols-4 lg:divide-x">
        <Stat
          label="Unique visitors"
          value={Math.round(visitorsShown).toLocaleString()}
          delta={d.visitors}
          loading={isLoading}
        />
        <Stat
          label="Page views"
          value={Math.round(pageViewsShown).toLocaleString()}
          delta={d.pageViews}
          loading={isLoading}
        />
        <Stat
          label="Total active time"
          value={formatDuration(totalActive)}
          delta={d.totalActive}
          loading={isLoading}
        />
        <Stat
          label="Avg. time per visitor"
          value={formatDuration(avgActive)}
          delta={d.avgActive}
          loading={isLoading}
        />
      </div>

      <div ref={chartRef} className="border-t border-border px-2 pb-3 pt-4 sm:px-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-2">
          <h3 className="text-sm font-medium">
            Visitors{" "}
            <span className="font-normal text-muted-foreground">
              {hourly ? "by hour" : "by day"}
            </span>
          </h3>
          <LivePill count={liveUserCount} />
        </div>

        {isLoading ? (
          <div className={cn("animate-pulse bg-muted", chartHeightClass)} />
        ) : !chartInView ? (
          <div className={chartHeightClass} />
        ) : !hasPoints ? (
          <div className={cn("grid place-items-center", chartHeightClass)}>
            <div className="text-center">
              <p className="font-semibold text-2xl">No visits in this range</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick another date, or check that the script is installed.
              </p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className={cn("w-full aspect-auto", chartHeightClass)}
          >
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 0, right: 12, top: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="2 4" />
              <XAxis
                dataKey={xKey}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={28}
                fontSize={11}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={36}
                fontSize={11}
              />
              <ChartTooltip
                cursor={{ stroke: "var(--foreground)", strokeOpacity: 0.25 }}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="count"
                type="monotone"
                fill="url(#visitorsFill)"
                stroke="var(--chart-1)"
                strokeWidth={2}
                activeDot={{ r: 4, strokeWidth: 0 }}
                animationDuration={1300}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>
    </section>
  );
}
