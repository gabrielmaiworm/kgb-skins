"use client";

import { useSession } from "next-auth/react";
import { useMyInvitedUsersQuery } from "@/querys/users/my-invited";
import { UserPlus, Mail, Phone, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { InvitedUserItem } from "@/@types/users";

function InvitedUserCard({ user }: { user: InvitedUserItem }) {
  return (
    <div className="glass-card">
      <div className="glass-bg" />
      <div className="glass-blur" />
      <div className="glass-border" />

      <div className="relative z-10 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h3 className="body-title-bold text-foreground">{user.name}</h3>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 body-callout text-text-muted">
                <Mail className="size-4 text-kgb-gold" />
                {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1.5 body-callout text-text-muted">
                  <Phone className="size-4 text-kgb-gold" />
                  {user.phone}
                </span>
              )}
            </div>
            <p className="body-caption text-text-muted flex items-center gap-1.5">
              <Calendar className="size-4 text-kgb-gold" />
              Cadastrado em{" "}
              {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          {user.inviteCode && (
            <code className="body-callout-bold font-mono text-kgb-gold bg-kgb-gold/10 px-3 py-1.5 rounded-lg shrink-0">
              {user.inviteCode}
            </code>
          )}
        </div>
      </div>
    </div>
  );
}

export const InvitedUsersSection = () => {
  const { data: session } = useSession();
  const { data, isLoading } = useMyInvitedUsersQuery(!!session?.user);

  const items = data?.items ?? [];
  const totalItems = data?.totalItems ?? 0;

  if (!session?.user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="heading-04-bold text-foreground flex items-center gap-2 flex-wrap">
          <UserPlus className="size-6 text-kgb-gold" />
          Pessoas que você convidou
          {totalItems > 0 && (
            <span className="body-callout text-text-muted">
              ({totalItems} {totalItems === 1 ? "pessoa" : "pessoas"})
            </span>
          )}
        </h2>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((user) => (
            <InvitedUserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="glass-card py-12 text-center">
          <div className="glass-bg" />
          <div className="glass-blur" />
          <div className="glass-border" />
          <div className="relative z-10">
            <UserPlus className="size-12 text-text-muted mx-auto mb-3" />
            <p className="body-paragraph text-text-muted">Nenhuma pessoa convidada ainda</p>
            <p className="body-caption text-text-subtle mt-1">Compartilhe seu código de indicação para começar!</p>
          </div>
        </div>
      )}
    </div>
  );
};
