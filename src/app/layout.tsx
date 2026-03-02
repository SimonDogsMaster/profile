import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";

import "@/styles/globals.css";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"]
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Simon S. | Front-end Engineer / Motion Designer",
  description: "Modern 3D portfolio built with Next.js, React Three Fiber, and Framer Motion."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem("portfolio-theme");
                  var theme = stored === "light" ? "light" : "dark";
                  document.documentElement.setAttribute("data-theme", theme);
                } catch (error) {
                  document.documentElement.setAttribute("data-theme", "dark");
                }
              })();
            `
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
