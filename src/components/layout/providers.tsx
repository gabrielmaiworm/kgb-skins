"use client";
import React from "react";
import { ThemeProvider } from "next-themes";
import { WindowSizeProvider } from "@/context/WindowSizeContext";
import { HtmlFontSizeProvider } from "@/context/HtmlFontSizeContext";
import { UpdateProvider } from "@/context/UpdateContext";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { AuthProvider } from "@/context/AuthContext";
import { SortProvider } from "@/context/SortContext";
import { ColumnsContexProvider } from "@/context/ColumnsContext";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { QueryProvider } from "@/providers/QueryProvider";
export default function Providers({
  children,
  locale,
  messages,
  session,
}: {
  children: React.ReactNode;
  locale: string | undefined;
  messages: AbstractIntlMessages | undefined;
  session: SessionProviderProps["session"];
}) {
  return (
    <>
      <NextIntlClientProvider messages={messages} timeZone={"America/Sao_Paulo"} locale={locale}>
        <WindowSizeProvider>
          <HtmlFontSizeProvider>
            <ColumnsContexProvider>
              <SortProvider>
                <QueryProvider>
                  <UpdateProvider>
                    <AuthProvider>
                      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
                        <UpdateProvider>
                          <SessionProvider session={session}>{children}</SessionProvider>
                        </UpdateProvider>
                      </ThemeProvider>
                    </AuthProvider>
                  </UpdateProvider>
                </QueryProvider>
              </SortProvider>
            </ColumnsContexProvider>
          </HtmlFontSizeProvider>
        </WindowSizeProvider>
      </NextIntlClientProvider>
    </>
  );
}
