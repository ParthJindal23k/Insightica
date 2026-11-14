"use client";

import { LiveUserType, WebsiteInfoType, WebsiteType } from "@/configs/type";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { format } from "date-fns-tz";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

import FormInput from "./_components/FormInput";
import Overview from "@/components/analytics/Overview";
import {
  DevicesPanel,
  LocationsPanel,
  SourcesPanel,
} from "@/components/analytics/Breakdowns";

function WebsiteDetail() {
  const { websiteId } = useParams();
  const [websiteList, setWebsiteList] = React.useState<WebsiteType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [liveUsers, setLiveUsers] = React.useState<LiveUserType[]>([]);
  const [websiteInfo, setWebsiteInfo] =
    React.useState<WebsiteInfoType | null>();
  const [formData, setFormData] = React.useState<any>({
    analyticType: "hourly",
    fromDate: new Date(),
    toDate: new Date(),
  });

  const GetWebsiteList = async () => {
    const websites = await axios.get("/api/website?websiteOnly=true");
    setWebsiteList(websites.data);
  };

  const GetLiveUsers = async () => {
    try {
      const result = await axios.get("/api/live?websiteId=" + websiteId);
      setLiveUsers(Array.isArray(result.data) ? result.data : []);
    } catch {
      setLiveUsers([]);
    }
  };

  const GetWebsiteAnalyticalDetail = async () => {
    setLoading(true);
    try {
      const fromDate = format(formData?.fromDate, "yyyy-MM-dd");
      const toDate = formData?.toDate
        ? format(formData?.toDate, "yyyy-MM-dd")
        : fromDate;
      const websiteResult = await axios.get(
        `/api/website/?websiteId=${websiteId}&from=${fromDate}&to=${toDate}`
      );
      setWebsiteInfo(websiteResult.data);
    } finally {
      setLoading(false);
    }
    GetLiveUsers();
  };

  useEffect(() => {
    GetWebsiteList();
  }, []);

  useEffect(() => {
    GetWebsiteAnalyticalDetail();
  }, [formData.analyticType, formData.fromDate, formData.toDate]);

  useEffect(() => {
    if (!websiteId) return;

    let interval: NodeJS.Timeout;
    const startPolling = () => {
      interval = setInterval(GetLiveUsers, 15000);
    };
    const stopPolling = () => {
      if (interval) clearInterval(interval);
    };
    const handleVisibilityChange = () => {
      document.hidden ? stopPolling() : startPolling();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    GetLiveUsers();
    startPolling();

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [websiteId]);

  const domain =
    websiteInfo?.website?.domain?.replace("https://", "") ??
    websiteList
      .find((w) => w.websiteId === websiteId)
      ?.domain.replace("https://", "");

  return (
    <div className="pt-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All websites
      </Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-semibold text-4xl leading-none tracking-tight sm:text-5xl">
          {domain ?? <span className="text-muted-foreground">Loading…</span>}
        </h1>
        <Link
          href={`/dashboard/website/${websiteId}/settings`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Settings &amp; install script
        </Link>
      </div>

      <div className="mt-6">
        <FormInput
          websiteList={websiteList}
          setFormData={setFormData}
          setReloadData={() => GetWebsiteAnalyticalDetail()}
          loading={loading}
        />
      </div>

      <div className="mt-4">
        <Overview
          analytics={websiteInfo?.analytics}
          loading={loading}
          analyticType={formData?.analyticType}
          liveUserCount={liveUsers.length}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SourcesPanel analytics={websiteInfo?.analytics} loading={loading} />
        <LocationsPanel analytics={websiteInfo?.analytics} loading={loading} />
        <DevicesPanel analytics={websiteInfo?.analytics} loading={loading} />
      </div>
    </div>
  );
}

export default WebsiteDetail;
