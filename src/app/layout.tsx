import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#07090f" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://healthtrack.app"),
  title: {
    default: "HealthTrack | Personal Health & Vitals Companion",
    template: "%s | HealthTrack",
  },
  description:
    "HealthTrack (v1.0.0+3) makes health monitoring simple, accessible and insightful. Track glucose (mmol/L & mg/dL), blood pressure, weight + BMI, pain body map, precision meal planning, medications, hydration, prescriptions with Google Drive backup, and doctor-ready PDF + Excel reports. 12 languages, offline-first.",
  keywords: [
    "HealthTrack",
    "health tracker",
    "diabetes tracker",
    "blood sugar mmol/L mg/dL",
    "blood pressure tracker AHA",
    "BMI tracker",
    "medication reminder",
    "meal planner",
    "glycemic index",
    "prescription vault",
    "Google Drive health backup",
    "doctor PDF report",
    "hydration tracker",
    "pain body map VAS",
  ],
  authors: [{ name: "Appstick Ltd" }],
  creator: "Appstick Ltd",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.jpeg", type: "image/jpeg" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    title: "HealthTrack — Personal Health & Vitals Companion",
    description:
      "Glucose, BP, weight, pain, meals, meds, water, prescriptions + Drive backup + doctor PDF/Excel. 12 languages supported. Offline-first.",
    images: [{ url: "/logo.jpeg", width: 512, height: 512, alt: "HealthTrack logo" }],
  },
  twitter: {
    card: "summary",
    title: "HealthTrack",
    description: "Clinical precision, everyday convenience. Diabetes, hypertension, nutrition & chronic care in one app.",
    images: ["/logo.jpeg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="referrer" content="no-referrer" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        {/* Prevent flash of wrong theme: must run synchronously before any paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
