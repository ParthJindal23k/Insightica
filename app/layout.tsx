import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const plexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Insightica — Web analytics you can read in one glance",
    template: "%s · Insightica",
  },
  description:
    "Insightica is a lightweight, cookie-free web analytics tool. One script tag gives you visitors, sources, locations, devices and live users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: { socialButtonsVariant: "blockButton" },
        elements: {
          // Google and email only
          socialButtonsBlockButton__facebook: { display: "none" },
          socialButtonsBlockButton__google: { width: "100%" },
          socialButtons: { display: "block" },
          socialButtonsIconButton__facebook: { display: "none" },
        },
        variables: {
          colorPrimary: "#0c0c0c",
          borderRadius: "0px",
          fontFamily: "var(--font-plex-sans), system-ui, sans-serif",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          {process.env.NEXT_PUBLIC_HOST_URL && (
            <script
              defer
              data-website-id="c943c300-29f6-4cc0-bedd-21ed2f27bd8f"
              data-domain="https://mywebsite2.com"
              src={`${process.env.NEXT_PUBLIC_HOST_URL}/analytics.js`}
            ></script>
          )}
        </head>
        <body
          className={`${plexSans.variable} ${plexMono.variable}`}
        >
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Provider>{children}</Provider>
            <Toaster position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
