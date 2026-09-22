import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriHealth Admin & Operations Portal",
  description: "Operations, User Directory, Health Analytics, and Content Management for NutriHealth Platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
