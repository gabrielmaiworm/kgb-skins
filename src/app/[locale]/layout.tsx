import "./globals.css";
import Script from "next/script";
import Providers from "@/components/layout/providers";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { getMessages } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GeistSans } from "geist/font/sans";

const APP_NAME = "KGB SKINS";
const APP_DEFAULT_TITLE = "KGB SKINS";
const APP_TITLE_TEMPLATE = "%s";
const APP_DESCRIPTION = "KGB SKINS!";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.FRONTEND_URL || "http://localhost:3000"),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  formatDetection: {
    telephone: false,
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const messages = await getMessages(resolvedParams.locale as any);
  const session = await getServerSession(authOptions);

  return (
    <html className={`${GeistSans.variable}`} suppressHydrationWarning lang="pt-BR">
      <body className={""}>
        <Providers messages={messages} locale={resolvedParams.locale} session={session}>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
