"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import WebsiteForm from "./_components/WebsiteForm";
import InstallScript from "./_components/InstallScript";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "form", label: "Site details" },
  { key: "script", label: "Install script" },
];

export default function AddWebsiteClient() {
  const searchParams = useSearchParams();
  const step = searchParams.get("step") ?? "form";
  const stepIndex = step === "script" ? 1 : 0;

  return (
    <div className="mx-auto w-full max-w-xl pt-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All websites
      </Link>

      <ol className="mt-6 flex items-center gap-3">
        {STEPS.map((s, i) => (
          <li key={s.key} className="flex items-center gap-3">
            {i > 0 && <span className="h-px w-8 bg-border" />}
            <span
              className={cn(
                "flex items-center gap-2 text-sm",
                i === stepIndex ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "num grid h-5 w-5 place-items-center rounded-full border text-[11px]",
                  i <= stepIndex
                    ? "border-foreground bg-foreground text-background"
                    : "border-input"
                )}
              >
                {i + 1}
              </span>
              {s.label}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-6">
        {step === "form" && <WebsiteForm />}
        {step === "script" && <InstallScript />}
      </div>
    </div>
  );
}
