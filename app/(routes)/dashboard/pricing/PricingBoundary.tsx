"use client";

import React from "react";
import Link from "next/link";
import { PricingTable } from "@clerk/nextjs";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    note: "1 website",
    features: ["Visitors, page views and active time", "Sources, locations and devices", "Live visitor count"],
  },
  {
    name: "Pro",
    price: "$4.99",
    note: "Unlimited websites",
    features: ["Everything in Free", "1 login for every dashboard", "AI summaries (coming soon)"],
  },
];

function Fallback() {
  return (
    <div>
      <div className="grid border border-line md:grid-cols-2">
        {PLANS.map((plan, i) => (
          <div
            key={plan.name}
            className={`flex flex-col p-6 sm:p-8 ${i === 1 ? "border-t border-line md:border-l md:border-t-0" : ""}`}
          >
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="num text-5xl font-medium">{plan.price}</span>
              <span className="text-sm text-muted-foreground">per month</span>
            </p>
            <p className="mt-2 text-muted-foreground">{plan.note}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            {i === 0 ? (
              <Link
                href="/dashboard"
                className="press mt-8 inline-flex h-11 items-center justify-center border border-line px-5 text-[15px] font-semibold hover:bg-brand hover:text-black"
              >
                Continue on Free
              </Link>
            ) : (
              <span className="mt-8 inline-flex h-11 items-center justify-center border border-dashed border-input px-5 text-sm text-muted-foreground">
                Checkout is not enabled yet
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Clerk throws when billing is switched off for the instance. Show the plans
// without checkout instead of crashing the page.
export default class PricingBoundary extends React.Component<
  object,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <Fallback /> : <PricingTable />;
  }
}
