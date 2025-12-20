import type { Metadata } from "next";
import "./globals.css";
import { MainLayout } from "@/components/layout/main-layout";
import { Toaster } from "@/components/ui/toaster";
import AuthButton from "@/components/auth/AuthButton";

export const metadata: Metadata = {
  title: "Empatheia: AI Companion for Mental Wellness",
  description:
    "A highly personalized and empathetic AI companion designed to support users' mental wellness.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="font-body antialiased">
        {/* GLOBAL HEADER */}
        <header className="flex items-center justify-between px-6 py-3 border-b">
          <h1 className="font-bold text-lg">Empatheia</h1>
          <AuthButton />
        </header>

        {/* APP CONTENT */}
        <MainLayout>{children}</MainLayout>

        <Toaster />
      </body>
    </html>
  );
}
