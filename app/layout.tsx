import type { Metadata } from "next";
import { Space_Mono, Courier_Prime } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier-prime",
});

export const metadata: Metadata = {
  title: "SLOPE - Mountain Weather Forecasts",
  description: "Retro mountain weather forecasts for skiers and snowboarders",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.variable} ${courierPrime.variable} antialiased`}
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {children}
      </body>
    </html>
  );
}
