import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maya",
  description: "A companionship app",
};

// viewport-fit=cover lets the app extend under the notch/home bar on iOS;
// we then use env(safe-area-inset-*) in CSS to pad content back into view.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
