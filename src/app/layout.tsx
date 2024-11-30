import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/Sonner";

import { ExitModal, HeartsModal, PracticeModal } from "@/components/modals";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LingoMate",
  description: "Learn new languages at your own pace.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.png",
        href: "/logo.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo.png",
        href: "/logo.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased hydrated">
      <ClerkProvider>
        <body
          className={cn(
            "scrollbar-thumb-gray scrollbar-thumb-rounded scrollbar-track-gray-lighter scrollbar-w-4 scrolling-touch",
            font.className
          )}
        >
          {children}
          <Toaster />
          <ExitModal />
          <HeartsModal />
          <PracticeModal />
        </body>
      </ClerkProvider>
    </html>
  );
}
