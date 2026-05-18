import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ToastProvider } from "@/components/ui/Toast";
import { ReferralProvider } from "@/components/referral/ReferralProvider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: {
    default: "EduMind AI — Умный помощник для студентов",
    template: "%s | EduMind AI",
  },
  description:
    "Мультиагентный AI ассистент для студентов. Пиши курсовые и рефераты, готовься к тестам, находи источники по ГОСТ.",
  keywords: [
    "AI для студентов",
    "написать курсовую",
    "реферат онлайн",
    "ГОСТ оформление",
    "ИИ помощник",
    "AI обучение",
    "дипломная работа",
  ],
  authors: [{ name: "EduMind AI" }],
  creator: "EduMind AI",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://edumind.ai",
    siteName: "EduMind AI",
    title: "EduMind AI — Умный помощник для студентов",
    description: "Пиши курсовые с AI, готовься к тестам, находи источники",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduMind AI",
    description: "AI ассистент для студентов",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://edumind.ai" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <SessionProvider session={session}>
              <ReferralProvider>
                {children}
              </ReferralProvider>
            </SessionProvider>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
