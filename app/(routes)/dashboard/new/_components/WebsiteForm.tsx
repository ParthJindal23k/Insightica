"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// IANA names, so the server can bucket visits by the site's local day.
const TIMEZONES: { region: string; zones: [string, string][] }[] = [
  {
    region: "Asia",
    zones: [
      ["Asia/Kolkata", "India (IST)"],
      ["Asia/Dubai", "Gulf (GST)"],
      ["Asia/Singapore", "Singapore (SGT)"],
      ["Asia/Shanghai", "China (CST)"],
      ["Asia/Tokyo", "Japan (JST)"],
      ["Asia/Seoul", "Korea (KST)"],
    ],
  },
  {
    region: "Europe & Africa",
    zones: [
      ["Europe/London", "London (GMT/BST)"],
      ["Europe/Berlin", "Central Europe (CET)"],
      ["Europe/Athens", "Eastern Europe (EET)"],
      ["Europe/Moscow", "Moscow (MSK)"],
      ["Africa/Johannesburg", "South Africa (SAST)"],
      ["Africa/Nairobi", "East Africa (EAT)"],
    ],
  },
  {
    region: "Americas",
    zones: [
      ["America/New_York", "US Eastern (ET)"],
      ["America/Chicago", "US Central (CT)"],
      ["America/Denver", "US Mountain (MT)"],
      ["America/Los_Angeles", "US Pacific (PT)"],
      ["America/Sao_Paulo", "Brasília (BRT)"],
      ["America/Argentina/Buenos_Aires", "Argentina (ART)"],
    ],
  },
  {
    region: "Australia & Pacific",
    zones: [
      ["Australia/Perth", "Perth (AWST)"],
      ["Australia/Sydney", "Sydney (AEST)"],
      ["Pacific/Auckland", "New Zealand (NZST)"],
    ],
  },
  { region: "Other", zones: [["UTC", "UTC"]] },
];

const cleanDomain = (value: string) =>
  value
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase();

function WebsiteForm() {
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [timezone, setTimezone] = useState("");
  const [enableLocalHostTracking, setEnableLocalHostTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);

  // Preselect the visitor's own timezone when it is one we list.
  useEffect(() => {
    try {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const known = TIMEZONES.flatMap((g) => g.zones.map((z) => z[0]));
      const match = local === "Asia/Calcutta" ? "Asia/Kolkata" : local;
      if (known.includes(match)) setTimezone((tz) => tz || match);
    } catch {
      /* leave empty */
    }
  }, []);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timezone) {
      toast.error("Pick a timezone for this site.");
      return;
    }

    setLoading(true);
    setNeedsUpgrade(false);
    const websiteId = crypto.randomUUID();
    const fullDomain = "https://" + cleanDomain(domain);

    try {
      const result = await axios.post("/api/website", {
        websiteId,
        domain: fullDomain,
        timezone,
        enableLocalHostTracking,
      });
      const data = result.data;
      const message: string | undefined = data?.message ?? data?.msg;

      if (message?.toLowerCase().includes("upgrade")) {
        setNeedsUpgrade(true);
        return;
      }

      // "Domain already exists" returns the existing record in data.data
      const saved = data?.data ?? (Array.isArray(data) ? data[0] : null);
      if (message && !saved) {
        toast.error(message);
        return;
      }

      router.push(
        `/dashboard/new?step=script&websiteId=${saved?.websiteId ?? websiteId}` +
          `&domain=${encodeURIComponent(saved?.domain ?? fullDomain)}`
      );
    } catch {
      toast.error("Couldn't add that website. Is the domain already in use?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-semibold text-4xl leading-tight tracking-tight">
        Which site are we tracking?
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Two fields. Neither can be edited afterwards, so give them a second look.
      </p>

      <form
        onSubmit={onFormSubmit}
        className="mt-6 border border-border bg-card"
      >
        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <label htmlFor="domain" className="text-sm font-medium">
              Domain
            </label>
            <div className="mt-1.5 flex h-10 items-center border border-input bg-background focus-within:border-foreground focus-within:ring-1 focus-within:ring-foreground">
              <span className="num border-r border-input px-3 text-sm text-muted-foreground">
                https://
              </span>
              <input
                id="domain"
                type="text"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                placeholder="yourwebsite.com"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onBlur={() => setDomain((d) => cleanDomain(d))}
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Just the domain — no path, no trailing slash.
            </p>
          </div>

          <div>
            <label htmlFor="timezone" className="text-sm font-medium">
              Reporting timezone
            </label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger id="timezone" className="mt-1.5 h-10 w-full bg-background">
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((group) => (
                  <SelectGroup key={group.region}>
                    <SelectLabel>{group.region}</SelectLabel>
                    {group.zones.map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1.5 text-xs text-muted-foreground">
              &ldquo;Today&rdquo; in your charts starts at midnight in this timezone.
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <Checkbox
              className="mt-0.5"
              checked={enableLocalHostTracking}
              onCheckedChange={(value) => setEnableLocalHostTracking(value === true)}
            />
            <span>
              Track visits from localhost
              <span className="block text-xs text-muted-foreground">
                Handy while you test the install. Turn it off for clean numbers.
              </span>
            </span>
          </label>
        </div>

        {needsUpgrade && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-brand-soft/50 px-5 py-3 text-sm sm:px-6">
            <span>The free plan tracks one website. Pro removes the limit.</span>
            <Link
              href="/dashboard/pricing"
              className="font-medium underline underline-offset-4"
            >
              See plans
            </Link>
          </div>
        )}

        <div className="flex items-center justify-end border-t border-border px-5 py-4 sm:px-6">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            Continue to install
          </button>
        </div>
      </form>
    </div>
  );
}

export default WebsiteForm;
