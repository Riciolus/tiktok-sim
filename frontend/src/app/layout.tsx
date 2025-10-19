import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AuthProvider } from "@/context/AuthContext";
import { SignProvider } from "@/context/SignContext";
import { CommentProvider } from "@/context/CommentContext";
import { PlayerProvider } from "@/context/PlayerContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiktok Simulator",
  description: "Personal Project Clone Tiktok",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <PlayerProvider>
            <AuthProvider>
              <SignProvider>
                <CommentProvider>{children}</CommentProvider>
              </SignProvider>
            </AuthProvider>
          </PlayerProvider>
        </Providers>
      </body>
    </html>
  );
}
