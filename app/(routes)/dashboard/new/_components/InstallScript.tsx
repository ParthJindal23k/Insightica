"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import ScriptSnippet from "@/components/analytics/ScriptSnippet";
import { getHostUrl } from "@/lib/host";

export default function InstallScript() {
  const searchParams = useSearchParams();
  const websiteId = searchParams.get("websiteId") ?? "";
  const domain = searchParams.get("domain") ?? "";

  return (
    <div>
      <h1 className="font-semibold text-4xl leading-tight tracking-tight">
        Paste this into your site.
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Put it inside the{" "}
        <code className="bg-muted px-1 py-0.5 font-mono text-xs text-foreground">
          &lt;head&gt;
        </code>{" "}
        of every page on{" "}
        <span className="text-foreground">{domain.replace("https://", "")}</span>
        . It loads with <code className="font-mono text-xs">defer</code>, so it
        never blocks rendering.
      </p>

      <ScriptSnippet
        className="mt-6"
        websiteId={websiteId}
        domain={domain}
        src={`${getHostUrl()}/analytics.js`}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-border bg-card px-5 py-4">
        <p className="max-w-xs text-sm text-muted-foreground">
          Open your site in another tab after deploying. You should appear as a
          live visitor within ten seconds.
        </p>
        <Link
          href={`/dashboard/website/${websiteId}`}
          className="inline-flex h-9 items-center gap-2 bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Open analytics
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
