import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import { DarkModeSync } from "@/components/site/DarkModeSync";
import { MiseChatWidget } from "@/components/site/MiseChatWidget";
import { SiteAnnouncement } from "@/components/site/SiteAnnouncement";
import { MISE_GREETING_DEFAULT } from "@/lib/mise-personality";
import { getPortalSettings } from "@/lib/portal-settings";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

/** Editorial serif for headings — pairs with Geist for body (premium, still warm). */
const displaySerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.tagline,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const portal = await getPortalSettings();
  const banner = portal.announcementBanner?.trim() ?? "";
  const chatEnabled = portal.chatEnabled !== false;
  const greeting = portal.chatGreeting?.trim() || MISE_GREETING_DEFAULT;
  const chatFooter =
    portal.chatFooterNote?.trim() ??
    `For project-specific answers, contact ${siteConfig.ownerName} — see Contact.`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var q=new URLSearchParams(location.search);if(q.get("dark")==="1")document.documentElement.classList.add("dark");else if(q.get("dark")==="0"){}else if(window.matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.classList.add("dark");}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} font-sans antialiased`}
      >
        <Suspense fallback={null}>
          <DarkModeSync />
        </Suspense>
        {banner ? <SiteAnnouncement text={banner} /> : null}
        {children}
        {chatEnabled ? <MiseChatWidget initialGreeting={greeting} footerNote={chatFooter} /> : null}
      </body>
    </html>
  );
}
