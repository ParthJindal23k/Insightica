"use client";

import React from "react";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

/** Slides its children up once, when they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <div
      ref={ref}
      className={cn("reveal", inView && "in", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Headline that rises word by word from behind a mask. */
export function WordRise({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden className="word">
          <span style={{ animationDelay: `${i * 70}ms` }}>{word}</span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/** Endless horizontal strip of short facts. Pauses on hover. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden} className="marquee-row">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-8 pr-8">
          <span>{item}</span>
          <span className="inline-block h-3 w-3 bg-brand" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee border-y border-line bg-foreground py-4 text-2xl font-semibold tracking-tight text-background sm:py-5 sm:text-4xl">
      {row(false)}
      {row(true)}
    </div>
  );
}
