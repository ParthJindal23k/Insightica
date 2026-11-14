"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { WebsiteType } from "@/configs/type";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ScriptSnippet from "@/components/analytics/ScriptSnippet";
import { getHostUrl } from "@/lib/host";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 px-5 py-3.5 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-all text-sm">{children}</dd>
    </div>
  );
}

function WebsiteSettings() {
  const { websiteId } = useParams();
  const router = useRouter();

  const [websiteDetails, setWebsiteDetails] = useState<WebsiteType | null>(null);
  const [loadingWebsite, setLoadingWebsite] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const GetWebsiteDetails = async () => {
    try {
      setLoadingWebsite(true);
      const result = await axios.get(
        "/api/website?websiteId=" + websiteId + "&websiteOnly=true"
      );
      setWebsiteDetails(result.data);
    } catch {
      toast.error("Failed to fetch website details");
    } finally {
      setLoadingWebsite(false);
    }
  };

  useEffect(() => {
    GetWebsiteDetails();
  }, []);

  const onDeleteWebsite = async () => {
    try {
      setDeleting(true);
      await axios.delete("/api/website", { data: { websiteId } });
      toast.success("Website deleted");
      router.replace("/dashboard");
    } catch {
      toast.error("Failed to delete website");
    } finally {
      setDeleting(false);
    }
  };

  const domain = websiteDetails?.domain?.replace("https://", "");
  const skeleton = <span className="inline-block h-4 w-40 animate-pulse bg-muted align-middle" />;

  return (
    <div className="mx-auto w-full max-w-3xl pt-8">
      <Link
        href={`/dashboard/website/${websiteId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to analytics
      </Link>

      <h1 className="mt-6 font-semibold text-4xl leading-none tracking-tight sm:text-5xl">
        Settings{domain ? ` for ${domain}` : ""}
      </h1>

      <section className="mt-10">
        <h2 className="text-sm font-medium">Details</h2>
        <dl className="mt-3 divide-y divide-border border border-border bg-card">
          <Row label="Domain">{loadingWebsite ? skeleton : domain ?? "—"}</Row>
          <Row label="Website ID">
            <span className="num text-[13px]">{websiteId}</span>
          </Row>
          <Row label="Reporting timezone">
            {loadingWebsite ? skeleton : websiteDetails?.timezone ?? "—"}
          </Row>
          <Row label="Localhost tracking">
            {loadingWebsite
              ? skeleton
              : websiteDetails?.enableLocalHostTracking
                ? "On"
                : "Off"}
          </Row>
        </dl>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium">Tracking script</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste inside the{" "}
          <code className="bg-muted px-1 py-0.5 font-mono text-xs text-foreground">
            &lt;head&gt;
          </code>{" "}
          of every page. To check it works, open your site and watch the live
          counter on the analytics page.
        </p>
        <ScriptSnippet
          className="mt-3"
          websiteId={String(websiteId)}
          domain={websiteDetails?.domain ?? ""}
          src={`${getHostUrl()}/analytics.js`}
        />
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-destructive">Delete website</h2>
        <div className="mt-3 flex flex-col gap-4 border border-destructive/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm text-muted-foreground">
            Removes {domain ?? "this website"} from Insightica. This can&apos;t
            be undone.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive hover:text-white">
                Delete website
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {domain ?? "this website"}?</AlertDialogTitle>
                <AlertDialogDescription>
                  The website is removed from your account permanently. You
                  would need to add it again and reinstall the script to track
                  it.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Keep it</AlertDialogCancel>
                <Button
                  variant="destructive"
                  className="text-white"
                  disabled={deleting}
                  onClick={onDeleteWebsite}
                >
                  {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Delete website
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </div>
  );
}

export default WebsiteSettings;
