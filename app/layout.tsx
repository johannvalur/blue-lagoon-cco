import type { Metadata } from "next";
import { Suspense } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
import { DemoOverlay } from "@/components/DemoOverlay";
import { Footer } from "@/components/Footer";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Blue Lagoon · an AI-first concept",
  description:
    "An exploration of what an AI-first Blue Lagoon could look like. Clickable prototype + strategy doc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <DemoOverlay />
        </Suspense>
        <div className="flex min-h-dvh flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
