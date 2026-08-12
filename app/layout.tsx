import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS — University Library Management System",
  description: "AI-powered library management system"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-sm">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
