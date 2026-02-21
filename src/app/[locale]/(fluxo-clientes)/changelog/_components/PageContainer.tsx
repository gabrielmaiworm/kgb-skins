"use client";

import Aurora from "@/components/ui/aurora";
import { ChangelogTimeline } from "./ChangelogTimeline";
import { History } from "lucide-react";

export const PageContainer = () => {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <div className="relative pt-28 pb-12 px-4 max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <History className="size-8 text-kgb-gold" />
            <h1 className="heading-03-bold text-foreground">Changelog</h1>
          </div>
          <p className="body-paragraph text-text-muted">Acompanhe as novidades, correções e melhorias da plataforma.</p>
        </header>

        <ChangelogTimeline />
      </div>
    </div>
  );
};
