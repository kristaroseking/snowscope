import type { Metadata } from "next";
import { Space_Mono, Courier_Prime } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";

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
  metadataBase: new URL("https://snowscope.co"),
  title: "Snowscope",
  description: "Reliable snow forecasting",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  openGraph: {
    title: "Snowscope",
    description: "Reliable snow forecasting",
    url: "https://snowscope.co",
    siteName: "Snowscope",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snowscope",
    description: "Reliable snow forecasting",
  },
  icons: {
    icon: "/favicon.ico",
  },
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
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
