import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Konnecteer — Find Your Crowd",
  description:
    "Social coordination platform to discover events, tag along on plans, join group chats, and connect with people around you.",
  keywords: ["events", "social", "meetup", "community", "connect"],
  openGraph: {
    title: "Konnecteer — Find Your Crowd",
    description: "Events · Tag Along · Talk Along · Real Connections",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#030712] text-white antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(10, 14, 23, 0.98)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
