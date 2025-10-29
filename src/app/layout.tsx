import React from "react";
import "./globals.css";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "SmartLogger Demo",
  description: "Minimal demo of SmartLogger (Next.js + MongoDB)"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, ui-sans-serif, system-ui", background: "#0b1220", color: "#e5e7eb" }}>
        <div style={{ maxWidth: 980, margin: "32px auto", padding: "0 16px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>{process.env.NEXT_PUBLIC_APP_NAME || "SmartLogger Demo"}</h1>
            <nav style={{ display: "flex", gap: 16 }}>
              <a href="/" style={{ color: "#93c5fd" }}>Dashboard</a>
              <a href="/projects" style={{ color: "#93c5fd" }}>Projects</a>
              <a href="/tester" style={{ color: "#93c5fd" }}>Tester</a>
            </nav>
          </header>
          <main>{children}</main>
          <footer style={{ marginTop: 32, opacity: .6, fontSize: 12 }}>Demo build for client walkthrough.</footer>
        </div>
      </body>
    </html>
  );
}
