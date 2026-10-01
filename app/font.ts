import localFont from "next/font/local";

export const clashDisplay = localFont({
  src: [
    {
      path: "../fonts/clashDisplay/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/clashDisplay/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/clashDisplay/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
  fallback: ["sans-serif"],
});

export const DepartureMono = localFont({
  src: [
    {
      path: "../fonts/DepartureMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-depMono",
  display: "swap",
  fallback: ["Helvetica"],
});
