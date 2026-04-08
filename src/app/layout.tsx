import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupplyOne Wisconsin - Document Library",
  description: "Document library and viewer for SupplyOne Wisconsin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
