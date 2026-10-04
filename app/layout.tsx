import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { caveat, clashDisplay, DepartureMono } from "./font";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nirmalkharal.dev"),
  title: "Hey !",
  description:
    "Portfolio of Nirmal Kharal, a full-stack developer creating thoughtful interfaces and robust systems.",
  openGraph: {
    title: "Hey !",
    description:
      "Portfolio of Nirmal Kharal, a full-stack developer creating thoughtful interfaces and robust systems.",
    url: "https://nirmalkharal.dev",
    siteName: "Nirmal Kharal",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nirmal Kharal Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Hey !",
    description:
      "Portfolio of Nirmal Kharal, a full-stack developer creating thoughtful interfaces and robust systems..",
    images: ["/og-image.png"],
  },
};

const themeScript = `
  try {
    const savedTheme = localStorage.getItem("portfolio-theme");
    const isDark = savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  } catch {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${clashDisplay.variable} ${DepartureMono.variable} h-full antialiased`}
    >
      <body className="flex flex-col min-h-full">
        {children}
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </body>
    </html>
  );
}
