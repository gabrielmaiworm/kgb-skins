"use client";

import { useMemo } from "react";
import { useAllChangelogQuery } from "@/querys/changelog/all";
import { ChangelogItemCard } from "./ChangelogItemCard";
import { ChangelogItem } from "@/@types/changelog";
import { Skeleton } from "@/components/ui/skeleton";

type MonthGroup = { label: string; sortKey: number; items: ChangelogItem[] };

function groupByMonthYear(items: ChangelogItem[]): MonthGroup[] {
  const map = new Map<number, { label: string; items: ChangelogItem[] }>();

  for (const item of items) {
    const date = new Date(item.date);
    const sortKey = date.getFullYear() * 100 + (date.getMonth() + 1);
    const label = date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });

    if (!map.has(sortKey)) {
      map.set(sortKey, { label, items: [] });
    }
    map.get(sortKey)!.items.push(item);
  }

  const result: MonthGroup[] = [];
  for (const [sortKey, { label, items }] of map) {
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    result.push({ label, sortKey, items });
  }
  result.sort((a, b) => b.sortKey - a.sortKey);
  return result;
}

export function ChangelogTimeline() {
  const { data, isLoading } = useAllChangelogQuery();

  const grouped = useMemo(() => {
    const items = data?.items ?? [];
    return groupByMonthYear(items);
  }, [data?.items]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (grouped.length === 0) {
    return (
      <div className="glass-card py-16 text-center">
        <div className="glass-bg" />
        <div className="glass-blur" />
        <div className="glass-border" />
        <div className="relative z-10">
          <p className="body-paragraph text-text-muted">Nenhuma entrada no changelog ainda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {grouped.map((group) => (
        <section key={group.sortKey}>
          <h2 className="heading-04 text-foreground mb-6 capitalize">{group.label}</h2>
          <div className="space-y-5">
            {group.items.map((item) => (
              <div key={item.id} className="glass-card">
                <div className="glass-bg" />
                <div className="glass-blur" />
                <div className="glass-border" />
                <div className="relative z-10 p-6">
                  <ChangelogItemCard item={item} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
