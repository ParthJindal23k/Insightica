import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("h-7 w-7", className)}
    >
      <rect width="32" height="32" className="fill-foreground" />
      <rect x="7" y="17" width="4" height="8" className="fill-background" />
      <rect x="14" y="12" width="4" height="13" className="fill-background" />
      <rect x="21" y="7" width="4" height="18" className="fill-brand" />
    </svg>
  );
}

export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-[19px] font-semibold leading-none tracking-[-0.03em]">
        Insightica
      </span>
    </span>
  );
}
