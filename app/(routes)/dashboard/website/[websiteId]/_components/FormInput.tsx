"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WebsiteType } from "@/configs/type";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

type Props = {
  websiteList: WebsiteType[];
  setFormData: any;
  setReloadData: any;
  loading?: boolean;
};

const DAY = 24 * 60 * 60 * 1000;

function FormInput({ websiteList, setFormData, setReloadData, loading }: Props) {
  const { websiteId } = useParams();
  const router = useRouter();

  const today = useMemo(() => new Date(), []);
  const [analyticType, setAnalyticType] = useState("hourly");
  const [date, setDate] = useState<DateRange | undefined>({ from: today });

  const handleDateChange = (range: DateRange | undefined) => {
    if (!range?.from) return;
    setDate(range.to ? { from: range.from, to: range.to } : { from: range.from });
  };

  const presets = [
    { label: "Today", range: { from: today } as DateRange, type: "hourly" },
    {
      label: "Last 7 days",
      range: { from: new Date(today.getTime() - 6 * DAY), to: today },
      type: "daily",
    },
    {
      label: "Last 30 days",
      range: { from: new Date(today.getTime() - 29 * DAY), to: today },
      type: "daily",
    },
  ];

  useEffect(() => {
    setFormData({
      analyticType,
      fromDate: date?.from ?? today,
      toDate: date?.to ?? date?.from ?? today,
    });
  }, [date, analyticType, setFormData, today]);

  const dateLabel = useMemo(() => {
    if (!date?.from) return "Select date";
    if (!date.to || date.to.toDateString() === date.from.toDateString()) {
      return date.from.toDateString() === today.toDateString()
        ? "Today"
        : format(date.from, "d MMM yyyy");
    }
    return `${format(date.from, "d MMM")} – ${format(date.to, "d MMM yyyy")}`;
  }, [date, today]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <Select
        value={(websiteId as string) || ""}
        onValueChange={(v) => router.push(`/dashboard/website/${v}`)}
      >
        <SelectTrigger className="h-9 w-full bg-card sm:w-[220px]">
          <SelectValue placeholder="Select a website" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {websiteList.map((website) => (
              <SelectItem key={website.websiteId} value={website.websiteId}>
                {website.domain.replace("https://", "")}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9 w-full justify-start bg-card font-normal sm:w-auto sm:min-w-[170px]"
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{dateLabel}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <div className="flex gap-1 border-b border-border p-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setDate(p.range);
                  setAnalyticType(p.type);
                }}
                className="px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {p.label}
              </button>
            ))}
          </div>
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleDateChange}
            disabled={{ after: today }}
            className="p-3"
          />
        </PopoverContent>
      </Popover>

      <div
        role="group"
        aria-label="Chart resolution"
        className="flex h-9 items-center border border-input bg-card p-0.5"
      >
        {["hourly", "daily"].map((type) => (
          <button
            key={type}
            onClick={() => setAnalyticType(type)}
            aria-pressed={analyticType === type}
            className={cn(
              "h-full flex-1 px-3 text-sm capitalize transition-colors sm:flex-none",
              analyticType === type
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setReloadData(true)}
        aria-label="Refresh data"
        className="hidden h-9 w-9 text-muted-foreground sm:inline-flex"
      >
        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
      </Button>
    </div>
  );
}

export default FormInput;
