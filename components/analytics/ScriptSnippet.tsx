"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/use-in-view";

type Props = {
  websiteId: string;
  domain: string;
  src: string;
  className?: string;
  /** Type the lines out when the block scrolls into view. */
  typed?: boolean;
};

export function buildScript({ websiteId, domain, src }: Omit<Props, "className">) {
  return `<script
  defer
  data-website-id="${websiteId}"
  data-domain="${domain}"
  src="${src}">
</script>`;
}

const Attr = ({ name, value }: { name: string; value: string }) => (
  <div className="pl-4">
    <span className="text-[#f2f2ee]">{name}</span>
    <span className="text-[#8b8b86]">=</span>
    <span className="text-[#9be3b8]">&quot;{value}&quot;</span>
  </div>
);

export default function ScriptSnippet({ websiteId, domain, src, className, typed }: Props) {
  const [copied, setCopied] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>(0.5);
  const line = (n: number) =>
    typed
      ? { className: "type-line", style: { "--n": n } as React.CSSProperties }
      : {};

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildScript({ websiteId, domain, src }));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — the user can still select the text */
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        typed && inView && "typing",
        "overflow-hidden border border-[#2c2c29] bg-[#0c0c0c] text-[#f2f2ee]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[#2c2c29] px-4 py-2">
        <span className="text-xs text-[#a3a39c]">
          Paste inside &lt;head&gt;
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-[#f2f2ee] transition-colors hover:bg-white/10"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-6">
        <code>
          <div {...line(0)}>
            <span className="text-[#8b8b86]">&lt;</span>
            <span className="text-[#ffd60a]">script</span>
          </div>
          <div {...line(1)}>
            <div className="pl-4 text-[#f2f2ee]">defer</div>
          </div>
          <div {...line(2)}>
            <Attr name="data-website-id" value={websiteId} />
          </div>
          <div {...line(3)}>
            <Attr name="data-domain" value={domain} />
          </div>
          <div {...line(4)}>
            <div className="pl-4">
              <span className="text-[#f2f2ee]">src</span>
              <span className="text-[#8b8b86]">=</span>
              <span className="text-[#9be3b8]">&quot;{src}&quot;</span>
              <span className="text-[#8b8b86]">&gt;</span>
            </div>
          </div>
          <div {...line(5)}>
            <span className="text-[#8b8b86]">&lt;/</span>
            <span className="text-[#ffd60a]">script</span>
            <span className="text-[#8b8b86]">&gt;</span>
            {typed && <span className="caret ml-1" />}
          </div>
        </code>
      </pre>
    </div>
  );
}
