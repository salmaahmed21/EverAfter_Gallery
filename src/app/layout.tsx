import type { Metadata } from "next";
import { Manrope, Noto_Serif } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-noto-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nouran & Ali | Engagement Gallery",
  description: "Ever After — an engagement gallery for Nouran & Ali.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${notoSerif.variable}`}>
      <body className="min-h-screen bg-background text-on-background antialiased selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
        {children}
      </body>
    </html>
  );
}
