import { PricingTable } from "@clerk/nextjs";
import React from "react";

function Pricing() {
  return (
    <div className="pt-10">
      <div className="border-b border-border pb-6">
        <h1 className="font-semibold text-4xl leading-none tracking-tight sm:text-5xl">
          Free for one site. Pro when you outgrow it.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Every plan includes the full dashboard. Pro lifts the one-website
          limit so you can track everything you run from a single account.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-4xl">
        <PricingTable />
      </div>
    </div>
  );
}

export default Pricing;
