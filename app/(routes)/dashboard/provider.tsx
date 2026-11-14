"use client";
import AppHeader from "@/app/_components/AppHeader";
import React from "react";

function Dashboardprovider({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        {children}
      </main>
    </div>
  );
}

export default Dashboardprovider;
