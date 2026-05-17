import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Captain Cool — Multi-Agent Cricket Strategist",
  description:
    "A Gemini-powered multi-agent IPL decision engine. Get real-time tactical recommendations backed by an internal AI debate.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "var(--surface)", color: "var(--on-surface)" }}
        className="antialiased min-h-screen">
        <Sidebar />
        <main style={{ marginLeft: "220px", minHeight: "100vh" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
