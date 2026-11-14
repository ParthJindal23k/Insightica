"use client";

import React from "react";
import "flag-icons/css/flag-icons.min.css";
import {
  Globe,
  Link2,
  Monitor,
  Smartphone,
  Tablet,
  AppWindow,
  Cpu,
} from "lucide-react";
import { AnalyticsType } from "@/configs/type";
import BreakdownPanel from "./BreakdownPanel";

type Props = {
  analytics: AnalyticsType | undefined | null;
  loading?: boolean;
};

const iconClass = "h-3.5 w-3.5 shrink-0 text-muted-foreground";

function Favicon({ domain }: { domain: string }) {
  const [failed, setFailed] = React.useState(false);
  if (!domain || domain === "direct" || failed) {
    return <Link2 className={iconClass} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://icons.duckduckgo.com/ip3/${domain}.com.ico`}
      alt=""
      width={14}
      height={14}
      className="h-3.5 w-3.5 shrink-0 "
      onError={() => setFailed(true)}
    />
  );
}

function Flag({ code }: { code?: string | null }) {
  if (!code || code === "UNKNOWN" || code.length !== 2) {
    return <Globe className={iconClass} />;
  }
  return (
    <span
      className={`fi fi-${code.toLowerCase()} shrink-0 `}
      style={{ width: 16, height: 12 }}
    />
  );
}

function deviceIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("mobile") || n.includes("phone"))
    return <Smartphone className={iconClass} />;
  if (n.includes("tablet")) return <Tablet className={iconClass} />;
  return <Monitor className={iconClass} />;
}

const titleCase = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1);

export function SourcesPanel({ analytics, loading }: Props) {
  return (
    <BreakdownPanel
      title="Where they came from"
      loading={loading}
      tabs={[
        {
          key: "source",
          label: "Source",
          rows: (analytics?.referrals ?? []).map((r) => ({
            name: r.domainName === "direct" ? "Direct / none" : titleCase(r.domainName),
            uv: r.uv,
            icon: <Favicon domain={r.domainName} />,
          })),
        },
        {
          key: "params",
          label: "URL params",
          rows: (analytics?.refParams ?? []).map((r) => ({
            name: r.name,
            uv: r.uv,
            icon: <Link2 className={iconClass} />,
          })),
        },
      ]}
    />
  );
}

export function LocationsPanel({ analytics, loading }: Props) {
  const toRows = (list: { name: string; uv: number; code: string }[] = []) =>
    list.map((r) => ({
      name: r.name,
      uv: r.uv,
      icon: <Flag code={r.code} />,
    }));

  return (
    <BreakdownPanel
      title="Where they are"
      loading={loading}
      tabs={[
        { key: "country", label: "Country", rows: toRows(analytics?.countries) },
        { key: "region", label: "Region", rows: toRows(analytics?.regions) },
        { key: "city", label: "City", rows: toRows(analytics?.cities) },
      ]}
    />
  );
}

export function DevicesPanel({ analytics, loading }: Props) {
  return (
    <BreakdownPanel
      title="What they used"
      loading={loading}
      tabs={[
        {
          key: "device",
          label: "Device",
          rows: (analytics?.devices ?? []).map((r) => ({
            name: r.name === "Unknown" ? "Desktop" : titleCase(r.name),
            uv: r.uv,
            icon: deviceIcon(r.name),
          })),
        },
        {
          key: "browser",
          label: "Browser",
          rows: (analytics?.browsers ?? []).map((r) => ({
            name: r.name,
            uv: r.uv,
            icon: <AppWindow className={iconClass} />,
          })),
        },
        {
          key: "os",
          label: "OS",
          rows: (analytics?.os ?? []).map((r) => ({
            name: r.name,
            uv: r.uv,
            icon: <Cpu className={iconClass} />,
          })),
        },
      ]}
    />
  );
}
