import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Konnecteer — Find Your Crowd",
  description:
    "AI-powered social coordination platform for FIFA World Cup fans. Find watch parties, meet nearby fans, and coordinate real-world group experiences in real time.",
  keywords: ["FIFA", "World Cup", "watch party", "football", "soccer", "fans"],
  openGraph: {
    title: "Konnecteer — Find Your Crowd",
    description: "Find your crowd instantly. Watch parties, fan meetups, live match chat.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-gray-950 text-white antialiased">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(17, 24, 39, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
