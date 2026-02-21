import { redirect } from "next/navigation";

export default async function CriarUsuarioPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale?: string }>;
  searchParams: Promise<{ referrerInviteCode?: string; callbackUrl?: string; phone?: string }>;
}) {
  const { locale = "pt" } = await params;
  const qs = await searchParams;
  const search = new URLSearchParams();
  search.set("openRegister", "1");
  if (qs.referrerInviteCode) search.set("referrerInviteCode", qs.referrerInviteCode);
  if (qs.callbackUrl) search.set("callbackUrl", qs.callbackUrl);
  if (qs.phone) search.set("phone", qs.phone);
  redirect(`/${locale}/login?${search.toString()}`);
}
