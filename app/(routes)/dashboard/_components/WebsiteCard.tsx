import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Area, AreaChart } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { WebsiteInfoType } from "@/configs/type";

type Props = {
  websiteInfo: WebsiteInfoType;
};

const chartConfig = {
  count: { label: "Visitors", color: "var(--chart-1)" },
} satisfies ChartConfig;

function WebsiteCard({ websiteInfo }: Props) {
  const hourlyData = websiteInfo?.analytics?.hourlyVisitors ?? [];

  const chartData = useMemo(() => {
    if (hourlyData.length === 1) {
      return [{ ...hourlyData[0], count: 0 }, hourlyData[0]];
    }
    return hourlyData;
  }, [hourlyData]);

  const domain =
    websiteInfo?.website?.domain?.replace("https://", "") ?? "Website";
  const visitors = Number(websiteInfo?.analytics?.last24hVisitors ?? 0);
  const views = Number(websiteInfo?.analytics?.totalSessions ?? 0);
  const gradientId = `spark-${websiteInfo?.website?.websiteId}`;

  return (
    <Link
      href={`/dashboard/website/${websiteInfo?.website?.websiteId}`}
      className="group flex flex-col border border-border bg-card transition-colors hover:border-foreground/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px] shrink-0 "
            onError={(e) => (e.currentTarget.style.visibility = "hidden")}
          />
          <h2 className="truncate text-[15px] font-medium">{domain}</h2>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <div className="mt-4 h-[72px] px-1">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
            <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 6, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                dataKey="count"
                type="monotone"
                fill={`url(#${gradientId})`}
                stroke="var(--chart-1)"
                strokeWidth={1.75}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-end px-4 pb-2">
            <div className="w-full border-t border-dashed border-border" />
          </div>
        )}
      </div>

      <div className="mt-2 grid grid-cols-2 border-t border-border">
        <div className="border-r border-border px-5 py-3">
          <p className="label">Visitors · 24h</p>
          <p className="num mt-1 text-xl font-medium">{visitors.toLocaleString()}</p>
        </div>
        <div className="px-5 py-3">
          <p className="label">Page views · total</p>
          <p className="num mt-1 text-xl font-medium">{views.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}

export default WebsiteCard;
