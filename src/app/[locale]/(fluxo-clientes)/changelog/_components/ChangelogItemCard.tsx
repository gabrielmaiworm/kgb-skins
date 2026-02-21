"use client";

import { ChangelogItem } from "@/@types/changelog";

function getTypeBadgeClass(type: string) {
  switch (type) {
    case "FEATURE":
      return "bg-success-10 text-success";
    case "SUPPORT":
      return "bg-info-10 text-info";
    case "BUGFIX":
      return "bg-destructive-10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "FEATURE":
      return "Funcionalidade";
    case "SUPPORT":
      return "Suporte";
    case "BUGFIX":
      return "Correção";
    default:
      return type;
  }
}

export function ChangelogItemCard({ item }: { item: ChangelogItem }) {
  const dateFormatted = new Date(item.date).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="grid grid-cols-[3.5rem_1fr] items-start gap-x-4 gap-y-2">
      <div>
        <span className="body-callout inline-flex rounded-md border border-glass-border px-2 py-1 text-text-muted">
          {dateFormatted}
        </span>
      </div>
      <div className="flex flex-col">
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 body-callout-medium ${getTypeBadgeClass(item.type)}`}
        >
          {getTypeLabel(item.type)}
        </span>
        <h3 className="body-title-bold text-foreground">{item.title}</h3>
        <p className="body-paragraph text-text-muted whitespace-pre-wrap">{item.description}</p>
      </div>
    </div>
  );
}
