"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import WebsiteCard from "./_components/WebsiteCard";
import { WebsiteInfoType } from "@/configs/type";

function Dashboard() {
  const { user } = useUser();
  const [websiteList, setWebsiteList] = useState<WebsiteInfoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    GetUserWebsites();
  }, []);

  const GetUserWebsites = async () => {
    try {
      setLoading(true);
      setFailed(false);
      const result = await axios.get("/api/website");
      setWebsiteList(Array.isArray(result.data) ? result.data : []);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const count = websiteList.length;

  return (
    <div className="pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-semibold text-4xl leading-none tracking-tight sm:text-5xl">
            {user?.firstName ? `${user.firstName}'s websites` : "Your websites"}
          </h1>
        </div>

        <Link
          href="/dashboard/new"
          className="inline-flex h-9 items-center gap-2 bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add website
        </Link>
      </div>

      {loading && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-[206px] animate-pulse border border-border bg-card" />
          ))}
        </div>
      )}

      {!loading && failed && (
        <div className="mt-6 border border-border bg-card px-6 py-10 text-center">
          <p className="font-semibold text-2xl">We couldn&apos;t load your websites</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <button
            onClick={GetUserWebsites}
            className="mt-4 h-9 border border-input px-4 text-sm transition-colors hover:bg-secondary"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !failed && count === 0 && (
        <div className="mt-6 grid overflow-hidden border border-border bg-card md:grid-cols-[1.1fr_1fr]">
          <div className="p-8 sm:p-10">
            <h2 className="font-semibold text-3xl leading-tight sm:text-4xl">
              Add the first site you want to understand.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Give us a domain and a timezone. You&apos;ll get one script tag to
              paste into your page, and visits start showing up here within
              seconds.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard/new"
                className="inline-flex h-10 items-center gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Add website
              </Link>
              <Link
                href="/demo"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                or look at the demo first
              </Link>
            </div>
          </div>
          <ol className="border-t border-border bg-muted/40 p-8 text-sm sm:p-10 md:border-l md:border-t-0">
            {[
              ["1", "Add your domain", "Takes about a minute."],
              ["2", "Paste one script tag", "Any stack — plain HTML, React, Next.js, WordPress."],
              ["3", "Watch visits arrive", "Sources, locations, devices and live users."],
            ].map(([n, title, body]) => (
              <li key={n} className="flex gap-4 border-b border-border py-4 first:pt-0 last:border-0 last:pb-0">
                <span className="num text-xs text-muted-foreground">{n}</span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="mt-0.5 text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {!loading && !failed && count > 0 && (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            <span className="num text-foreground">{count}</span>{" "}
            {count === 1 ? "site" : "sites"} tracked
          </p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {websiteList.map((website) => (
              <WebsiteCard key={website.website.websiteId} websiteInfo={website} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
