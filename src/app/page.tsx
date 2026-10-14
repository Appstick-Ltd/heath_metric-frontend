"use client";

import * as React from "react";
import Link from "next/link";
import {
  HeartPulse,
  Activity,
  Download,
  CheckCircle2,
  Sparkles,
  Apple,
  Pill,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Cloud,
  FileSpreadsheet,
  X,
  Maximize2,
  Star,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Bell,
  Droplets,
  Globe,
  Languages,
  CalendarCheck,
  Wifi,
  Moon,
  BadgeCheck,
  Quote,
  Lock,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/* ------------------------------------------------------------------ */
/*  Data — mapped 1:1 from Flutter app (lib/)                          */
/*  App: HealthTrack v1.0.0+3                                          */
/*  Tagline: "Your Intelligent Nutrition & Chronic Care Companion"      */
/* ------------------------------------------------------------------ */

const APP_SCREENS = [
  {
    id: "home",
    label: "Home Overview",
    shortLabel: "Home",
    tagline: "Greeting, streak, Health Score & quick actions",
    category: "Dashboard",
    icon: HeartPulse,
    image: "/screenshot/home-screen.png",
    alt: "HealthTrack Home — greeting, 7-day streak, Health Score, vitals rings, meds and meals",
    title: "Home Vitality Dashboard",
    highlight: "Health Score 0–100",
    description:
      "Good Morning / Afternoon / Evening greeting, 7-day streak strip, Health Overview rings (sugar, BP, weight, meals, water), 4 quick actions, water card, Today's Medications and Today's Routine.",
  },
  {
    id: "vitals",
    label: "Clinical Vitals",
    shortLabel: "Vitals",
    tagline: "Sugar • Pressure • Weight • Body Map",
    category: "Biometrics",
    icon: Activity,
    image: "/screenshot/vitals-screen.png",
    alt: "HealthTrack Vitals — glucose 5.3 mmol/L, fasting targets and 7-day trend",
    title: "Clinical Glucose & Vitals",
    highlight: "Fasting 3.9–5.5 mmol/L",
    description:
      "mmol/L & mg/dL auto-detect, 10 contexts (Fasting, Post-Meal, Bedtime…), ADA staging, AHA BP staging, Weight + auto BMI, smooth trend charts with target bands.",
  },
  {
    id: "meals",
    label: "Meal Planner",
    shortLabel: "Meals",
    tagline: "Breakfast • Lunch • Snack • Dinner + Macros",
    category: "Nutrition",
    icon: Apple,
    image: "/screenshot/meal-planner-screen.png",
    alt: "HealthTrack Meal Planner — Breakfast, Snack, Lunch, Dinner with Take Now",
    title: "Precision Meal Planner",
    highlight: "Auto kcal + carbs / protein / fat",
    description:
      "Breakfast, Lunch, Snack, and Dinner slots, planned-menu nutrition estimator, calorie targets, reminders, completion & history.",
  },
  {
    id: "meds",
    label: "Medication Alarms",
    shortLabel: "Meds",
    tagline: "Morning • Afternoon • Night + adherence",
    category: "Pharmacy",
    icon: Pill,
    image: "/screenshot/medicine-screen.png",
    alt: "HealthTrack Medications — Napa 08:00 After Meal, adherence and stock",
    title: "Smart Medication Manager",
    highlight: "Adherence % + low-stock alert",
    description:
      "Name, strength, form (Pill / Syrup / Injection…), frequency, Before / After / With food, 3-day → Ongoing courses, Take / Taken / Missed, days-left and refill warnings.",
  },
  {
    id: "vault",
    label: "Prescription Vault",
    shortLabel: "Vault",
    tagline: "Prescription slips vs Lab reports",
    category: "Medical Records",
    icon: FileText,
    image: "/screenshot/document-store-screen.png",
    alt: "HealthTrack Vault — prescriptions and lab reports with doctor and next visit",
    title: "Prescription & Lab Vault",
    highlight: "Next-visit reminders",
    description:
      "Title, doctor, specialty, hospital, consultation + next-visit date, diagnosis, notes, meds list, camera / gallery / PDF attachments, share, download, month grouping.",
  },
  {
    id: "drive",
    label: "Google Drive Sync",
    shortLabel: "Cloud",
    tagline: "Private vault folder • auto backup",
    category: "Cloud Sync",
    icon: Cloud,
    image: "/screenshot/google-drive-screen.png",
    alt: "HealthTrack Google Drive — private OAuth sync and auto backup",
    title: "Google Drive Cloud Backup",
    highlight: "Zero vendor lock-in",
    description:
      "One-tap OAuth, private Drive vault folder, auto backup / restore / sync-now, storage status, secure & private by design. Your files stay yours.",
  },
  {
    id: "reports",
    label: "Doctor Reports",
    shortLabel: "Reports",
    tagline: "7 / 15 / 30 / 90 days • 1 year • Custom",
    category: "Clinical Export",
    icon: FileSpreadsheet,
    image: "/screenshot/health-report-screen.png",
    alt: "HealthTrack Health Reports — averages, adherence and PDF Excel export",
    title: "Doctor Health Reports",
    highlight: "Branded PDF + multi-sheet Excel",
    description:
      "Avg fasting / post-meal, avg BP, weight + BMI badge, adherence bar. Teal Medical Telemetry PDF with Report ID + sign-off, multi-sheet .xlsx + CSV, share / print.",
  },
  {
    id: "profile",
    label: "Profile & Medical ID",
    shortLabel: "Profile",
    tagline: "Account • Language • Privacy • Theme",
    category: "Settings",
    icon: Users,
    image: "/screenshot/profile-screen.png",
    alt: "HealthTrack Profile — account, weight, language, integrations and security",
    title: "Profile & Medical ID",
    highlight: "12 languages • Dark / Light",
    description:
      "Photo, name, age, sex, blood group, height cm / ft-in, weight + BMI, conditions & goals, glucose / weight units, Drive, language, password, privacy, terms, about.",
  },
];



const VITALS_TABS = [
  {
    id: "sugar",
    label: "Blood Sugar",
    unit: "mmol/L • mg/dL",
    points: [
      "Auto-detect: value < 35 treated as mmol/L",
      "Fasting Normal ≤ 99 mg/dL (3.9–5.5 mmol/L)",
      "Post-Meal Normal ≤ 139 mg/dL (< 7.8 mmol/L)",
      "10 contexts: Fasting, Post-Meal, Random, Pre/Post Breakfast/Lunch/Dinner, Bedtime",
      "Status: Low • In-Range • Pre-Diabetic • High • Critical",
    ],
  },
  {
    id: "bp",
    label: "Pressure + Pulse",
    unit: "mmHg • bpm",
    points: [
      "Full ACC/AHA staging: Normal < 120/80",
      "Elevated 120–129 / < 80",
      "Stage 1: 130–139 / 80–89",
      "Stage 2: ≥ 140 or ≥ 90 • Crisis > 180 / > 120",
      "Pulse logged with every BP reading",
    ],
  },
  {
    id: "weight",
    label: "Weight + BMI",
    unit: "kg • lbs",
    points: [
      "Auto BMI from height (cm or ft/in)",
      "Underweight < 18.5 • Normal < 25",
      "Overweight < 30 • Obese ≥ 30",
      "Localized BMI advice messages",
      "Trend chart + target band",
    ],
  },
  {
    id: "pain",
    label: "Body Map + Pain",
    unit: "VAS 1–10",
    points: [
      "Front / Back anatomical zones (tap chips)",
      "VAS slider + Wong-Baker 😊😐🙁😣😭",
      "Green → Amber → Orange → Red severity",
      "Qualities, aggravators, notes, Save Pin",
      "History tab for physician review",
    ],
  },
];

const LANGUAGES = [
  "English (US)",
  "English (UK)",
  "Bengali",
  "Español",
  "हिन्दी",
  "العربية",
  "Français",
  "Deutsch",
  "日本語",
  "Português",
  "简体中文",
  "اردو",
];

const FAQS = [
  {
    q: "Is HealthTrack the same app I see in screenshots?",
    a: "Yes. HealthTrack (v1.0.0+3). All 8 screens on this page — Home, Vitals, Meals, Medicines, Vault, Drive, Reports, Profile — are captured from the live Flutter app (GetX, Material 3, Plus Jakarta Sans, Electric Blue #006AFA).",
  },
  {
    q: "Which units does blood sugar support?",
    a: "Both. mmol/L and mg/dL with auto-detect (value < 35 = mmol/L). Fasting target 70–99 mg/dL (3.9–5.5 mmol/L), Post-Meal < 140 mg/dL (< 7.8 mmol/L). Set your preferred unit in Profile → Personal Details.",
  },
  {
    q: "How are blood pressure readings classified?",
    a: "ACC/AHA staging built-in: Low (<90/<60), Normal (<120 & <80), Elevated (120–129/<80), Stage 1 (130–139/80–89), Stage 2 (≥140 or ≥90), Crisis (>180/>120). Pulse (bpm) is logged alongside.",
  },
  {
    q: "What does the Health Score mean?",
    a: "Composite 0–100 from meds taken + vitals logged + meals completed + hydration. Great / Good progress / Needs attention. It rises with your daily loop: log vitals → take meds → complete meals → drink water.",
  },
  {
    q: "Can I export reports for my doctor?",
    a: "Yes. 7 / 15 / 30 / 90 days, 1 year, All time + custom range. Branded Teal Medical Telemetry PDF (Report ID, demographics, synthesis, benchmark table, date-wise logs, sign-off) + multi-sheet Excel (.xlsx) + CSV. Save to Downloads, share, print.",
  },
  {
    q: "How does Google Drive backup work?",
    a: "OAuth connect once → private vault folder (healthtrack_prescriptions_backup.json) → auto backup / restore / Sync Now. Prescription images, lab PDFs and vitals backups live in your Drive — zero vendor lock-in, disconnect anytime.",
  },
  {
    q: "Which reminders will I get?",
    a: "4 local channels — Meal, Medication (dose-time alarms + missed-dose + low-stock), Vitals & Sugar nudge, Hydration interval (1h / 1.5h / 2h / 3h within active hours) + Next-visit reminder. Firebase push for foreground/background, all listed in the Notifications inbox with filters.",
  },
  {
    q: "Does it support multiple languages and work offline?",
    a: "Yes! HealthTrack supports 12 international languages including English and Bengali, with localized meal categories and comprehensive nutrition tracking. Offline-first on-device caching ensures smooth operation without internet; data automatically synchronizes when you reconnect.",
  },
  {
    q: "Is it free? What is Pro?",
    a: "Core tracking is free and ad-supported (banner / interstitial / rewarded). Pro hides all ads. Referral coins and subscription tiers are managed in-app — no payment needed to start logging today.",
  },
  {
    q: "Is HealthTrack a medical device?",
    a: "No. HealthTrack is an aid for wellness and nutrition tracking. It does not provide medical diagnoses or replace professional medical advice. Always consult a certified healthcare professional.",
  },
];

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeHeroIndex, setActiveHeroIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const [modalScreen, setModalScreen] = React.useState<string | null>(null);
  const [activeVital, setActiveVital] = React.useState("sugar");

  React.useEffect(() => {
    if (!isAutoPlaying) return;
    const t = setInterval(() => setActiveHeroIndex((p) => (p + 1) % APP_SCREENS.length), 4500);
    return () => clearInterval(t);
  }, [isAutoPlaying]);

  const hero = APP_SCREENS[activeHeroIndex];
  const vital = VITALS_TABS.find((v) => v.id === activeVital)!;

  return (
    <div className="min-h-screen bg-white dark:bg-[#07090f] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#006AFA] selection:text-white relative overflow-x-clip transition-colors duration-200">
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            name: "HealthTrack",
            operatingSystem: ["Android", "iOS"],
            applicationCategory: "HealthApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            inLanguage: ["en", "bn", "es", "hi", "ar", "fr", "de", "ja", "pt", "zh", "ur"],
            description:
              "HealthTrack - Personal health & vitals tracking. Track glucose, BP, weight, BMI, pain, meals, meds, hydration, prescriptions with Drive backup and doctor PDF reports.",
          }),
        }}
      />

      {/* Ambient with Subtle High-Tech Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-grid-subtle opacity-40 dark:opacity-30 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_15%,#000_60%,transparent_100%)]" />
        <span className="block absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-[#006AFA]/15 via-blue-600/8 to-transparent dark:from-[#006AFA]/25 dark:via-blue-700/10 rounded-full blur-[140px] opacity-85" />
        <span className="block absolute top-[35%] -left-48 w-[550px] h-[550px] bg-sky-500/8 dark:bg-sky-600/15 rounded-full blur-[160px]" />
        <span className="block absolute top-[65%] -right-48 w-[550px] h-[550px] bg-blue-500/8 dark:bg-indigo-600/15 rounded-full blur-[160px]" />
      </div>

      {/* Navbar with Floating Glass Elevation */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#07090f]/90 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/[0.08] shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 group shrink-0" aria-label="HealthTrack home">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-2xl overflow-hidden bg-white shadow-md shadow-[#006AFA]/20 border border-slate-200/90 dark:border-white/10 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,106,250,0.35)] transition-all duration-300 p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="HealthTrack logo" className="w-full h-full object-contain" />
            </div>
            <div className="leading-none">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-950 dark:text-white uppercase">
                  Health<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006AFA] via-blue-500 to-[#69C3FF]">Track</span>
                </span>
                <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-[#006AFA]/10 dark:bg-[#006AFA]/20 text-[#006AFA] dark:text-sky-400 border border-[#006AFA]/25 shadow-sm">
                  v1.0.0
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-[13px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-white/[0.03] p-1.5 rounded-full border border-slate-200/60 dark:border-white/[0.06] backdrop-blur-md" aria-label="Primary">
            <a href="#features" className="px-3.5 py-1.5 rounded-full hover:bg-white dark:hover:bg-white/10 hover:text-[#006AFA] dark:hover:text-white transition-all duration-200 shadow-none hover:shadow-sm">Features</a>
            <a href="#vitals" className="px-3.5 py-1.5 rounded-full hover:bg-white dark:hover:bg-white/10 hover:text-[#006AFA] dark:hover:text-white transition-all duration-200 shadow-none hover:shadow-sm">Vitals</a>
            <a href="#how-it-works" className="px-3.5 py-1.5 rounded-full hover:bg-white dark:hover:bg-white/10 hover:text-[#006AFA] dark:hover:text-white transition-all duration-200 shadow-none hover:shadow-sm">How It Works</a>
            <a href="#reports" className="px-3.5 py-1.5 rounded-full hover:bg-white dark:hover:bg-white/10 hover:text-[#006AFA] dark:hover:text-white transition-all duration-200 shadow-none hover:shadow-sm">Doctor Reports</a>
            <a href="#faq" className="px-3.5 py-1.5 rounded-full hover:bg-white dark:hover:bg-white/10 hover:text-[#006AFA] dark:hover:text-white transition-all duration-200 shadow-none hover:shadow-sm">FAQ</a>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center justify-center border border-slate-200/80 dark:border-white/10 rounded-xl bg-slate-100/80 dark:bg-white/[0.05] p-0.5 shadow-sm">
              <ThemeToggle />
            </div>
            <a
              href="#download"
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#006AFA] via-blue-600 to-[#50B2FF] hover:brightness-110 shadow-lg shadow-[#006AFA]/30 hover:shadow-[#006AFA]/45 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get App</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
            >
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${mobileMenuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden px-4 py-3 bg-white/95 dark:bg-[#0a0d17]/95 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 grid gap-1 text-sm shadow-2xl animate-fadeIn" aria-label="Mobile">
            {[
              ["#features", "Features & Modules"],
              ["#vitals", "Vitals & Thresholds"],
              ["#how-it-works", "How It Works"],
              ["#reports", "Doctor Reports"],
              ["#faq", "FAQ"],
              ["#download", "Download"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200 font-medium transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* HERO */}
      <section className="relative pt-8 sm:pt-14 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Clear Hierarchy, Balanced Rhythm, Zero Blank Voids */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#006AFA] dark:text-sky-400 border border-[#006AFA]/30 bg-[#006AFA]/5 dark:bg-[#006AFA]/10 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#006AFA] dark:bg-sky-400 animate-pulse shadow-[0_0_8px_#006AFA]" />
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                Clinical-grade vitals &amp; nutrition platform
              </span>
              <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wide shadow-sm">Offline-first</Badge>
              <Badge variant="info" className="text-[10px] font-bold tracking-wide shadow-sm">12 languages</Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-black tracking-tight text-slate-950 dark:text-white leading-[1.12]">
              Clinical-grade vitals &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006AFA] via-blue-600 to-[#69C3FF]">
                daily health tracking.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              <strong className="text-slate-900 dark:text-white">HealthTrack</strong> makes health monitoring simple,
              accessible and insightful — whether managing diabetes, hypertension, or staying fit. Log glucose, BP, weight,
              pain, meals, meds and water in seconds, back up to Google Drive, and hand your doctor a clean PDF.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="#download"
                  className="inline-flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white border border-slate-800/80 hover:border-sky-500/50 shadow-xl hover:shadow-[0_12px_28px_-6px_rgba(0,106,250,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                >
                  <svg className="w-7 h-7 shrink-0" viewBox="0 0 512 512" aria-hidden="true">
                    <path fill="#4285F4" d="M48.7 18.5c-4.8 5.2-7.7 13-7.7 23v429c0 10 2.9 17.8 7.7 23l2.4 2.4L275 272v-5.8L51.1 16.1l-2.4 2.4z" />
                    <path fill="#FFBA00" d="M350.8 347.8l-75.8-75.8V266l75.8-75.8 1.8 1 89.8 51.1c25.7 14.6 25.7 38.5 0 53.1l-89.8 51.1-1.8 1.4z" />
                    <path fill="#00E676" d="M275 266.2L51.1 490.1c8.4 8.9 22.3 9.9 37.9 1.1l263.6-149.8-77.6-75.2z" />
                    <path fill="#FF3D00" d="M275 266.2l77.6-75.2L89 41.2c-15.6-8.9-29.5-7.8-37.9 1.1L275 266.2z" />
                  </svg>
                  <span className="text-left leading-none">
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Get it on</span>
                    <span className="text-sm sm:text-base font-bold block mt-1">Google Play</span>
                  </span>
                </a>
                <a
                  href="#download"
                  className="inline-flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white border border-slate-800/80 hover:border-white/30 shadow-xl hover:shadow-[0_12px_28px_-6px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                >
                  <svg className="w-7 h-7 fill-white shrink-0" viewBox="0 0 384 512" aria-hidden="true">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <span className="text-left leading-none">
                    <span className="text-[10px] text-slate-400 font-medium">Download on the</span>
                    <span className="text-sm sm:text-base font-bold block mt-1">App Store</span>
                  </span>
                </a>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 pt-0.5">
                <div className="flex" aria-label="4.8 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < 5 ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]" : "text-slate-300"}`} />
                  ))}
                </div>
                <span className="font-semibold text-[11px] text-slate-600 dark:text-slate-300">Designed for daily clinical use</span>
              </div>
            </div>

            <dl className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-2.5 pt-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {[
                "Fasting 3.9–5.5 mmol/L (ADA)",
                "AHA BP staging built-in",
                "PDF + Excel doctor export",
                "Drive auto-backup • Private",
              ].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <dt className="sr-only">Highlight</dt>
                  <dd>{t}</dd>
                </div>
              ))}
            </dl>

            {/* Mini rings like app Health Overview */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-lg pt-1">
              {[
                ["Meds", "emerald", "Take"],
                ["Vitals", "blue", "Log"],
                ["Meals", "orange", "Done"],
                ["Water", "cyan", "2.0L"],
              ].map(([label, color, sub]) => (
                <div key={label} className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-md p-3 text-center card-glow-hover shadow-sm hover:shadow-md transition-all duration-300">
                  <div className={`mx-auto w-9 h-9 rounded-full border-[3px] flex items-center justify-center text-[10px] font-black transition-transform duration-300 hover:scale-105 ${
                    color === "emerald" ? "border-emerald-500 text-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.25)]" :
                    color === "blue" ? "border-[#006AFA] text-[#006AFA] shadow-[0_0_12px_rgba(0,106,250,0.25)]" :
                    color === "orange" ? "border-orange-500 text-orange-600 shadow-[0_0_12px_rgba(249,115,22,0.25)]" : "border-cyan-500 text-cyan-600 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                  }`}>
                    {sub === "2.0L" ? "2L" : "●"}
                  </div>
                  <p className="text-[11px] font-bold mt-1.5 text-slate-800 dark:text-slate-200">{label}</p>
                  <p className="text-[10px] text-slate-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Phone Mockup Column: Balanced Size, Harmonious Proportions */}
          <div
            className="lg:col-span-6 flex flex-col items-center justify-center relative py-2 sm:py-4"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Multi-tier Ambient Cosmic Glow behind phone */}
            <div className="absolute w-[300px] sm:w-[380px] h-[520px] bg-gradient-to-tr from-[#006AFA]/25 via-sky-400/15 to-purple-500/20 rounded-full blur-[90px] pointer-events-none -z-10" />

            {/* Subtle Bottom Dot Mesh Wave */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[400px] h-32 opacity-25 dark:opacity-35 pointer-events-none -z-10 bg-[radial-gradient(#38bdf8_1.2px,transparent_1.2px)] [background-size:14px_14px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_80%,#000_70%,transparent_100%)]" />

            {/* 3D Glowing Cosmic Orbital Rings (Proportionally scaled) */}
            <div className="absolute inset-0 pointer-events-none -z-5 flex items-center justify-center overflow-hidden" aria-hidden="true">
              <div className="relative w-[320px] sm:w-[390px] h-[220px] sm:h-[270px] rotate-[-20deg] rounded-[100%] border border-sky-400/35 dark:border-sky-400/40 shadow-[0_0_18px_rgba(56,189,248,0.25)]">
                <div className="absolute inset-2 rounded-[100%] border border-pink-400/25 border-dashed" />
                <span className="absolute -top-1 right-16 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse text-base font-black select-none">✦</span>
                <span className="absolute top-1/2 left-2 text-sky-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.9)] animate-pulse text-sm font-black select-none">✦</span>
                <span className="absolute bottom-4 right-8 text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.9)] animate-pulse text-xs font-black select-none">✦</span>
                <span className="absolute top-8 left-14 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                <span className="absolute bottom-10 left-8 w-1.5 h-1.5 rounded-full bg-sky-300 shadow-[0_0_5px_#38bdf8]" />
              </div>
            </div>

            {/* Device Wrapper — Perfectly balanced flagship width (335px on desktop) */}
            <div className="relative group max-w-[275px] sm:max-w-[305px] lg:max-w-[330px] w-full z-10">
              {/* Antenna Bands */}
              <span className="absolute -left-[3.5px] top-16 w-[3.5px] h-[2px] bg-slate-500/80 dark:bg-slate-500/80 rounded-l-xs z-10 pointer-events-none" />
              <span className="absolute -right-[3.5px] top-16 w-[3.5px] h-[2px] bg-slate-500/80 dark:bg-slate-500/80 rounded-r-xs z-10 pointer-events-none" />
              <span className="absolute -left-[3.5px] bottom-16 w-[3.5px] h-[2px] bg-slate-500/80 dark:bg-slate-500/80 rounded-l-xs z-10 pointer-events-none" />
              <span className="absolute -right-[3.5px] bottom-16 w-[3.5px] h-[2px] bg-slate-500/80 dark:bg-slate-500/80 rounded-r-xs z-10 pointer-events-none" />

              {/* Left Side Buttons: Action Button + Volume Rockers */}
              <div className="absolute -left-[3px] top-[70px] w-[3px] h-5 bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700 rounded-l-sm shadow-sm" />
              <div className="absolute -left-[3px] top-[105px] w-[3px] h-10 bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700 rounded-l-sm shadow-sm" />
              <div className="absolute -left-[3px] top-[155px] w-[3px] h-10 bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700 rounded-l-sm shadow-sm" />

              {/* Right Side Button: Power / Lock Button */}
              <div className="absolute -right-[3px] top-[118px] w-[3px] h-14 bg-gradient-to-l from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700 rounded-r-sm shadow-sm" />

              {/* Floating Carousel Navigation Controls */}
              <button
                type="button"
                onClick={() => {
                  setActiveHeroIndex((prev) => (prev - 1 + APP_SCREENS.length) % APP_SCREENS.length);
                  setIsAutoPlaying(false);
                }}
                aria-label="Previous screen"
                className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200/90 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:text-[#006AFA] dark:hover:text-sky-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-30 backdrop-blur-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveHeroIndex((prev) => (prev + 1) % APP_SCREENS.length);
                  setIsAutoPlaying(false);
                }}
                aria-label="Next screen"
                className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200/90 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:text-[#006AFA] dark:hover:text-sky-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-30 backdrop-blur-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Obsidian Titanium Flagship Chassis */}
              <div className="relative p-[3.5px] sm:p-[4px] rounded-[44px] sm:rounded-[48px] bg-gradient-to-b from-[#2a2f3a] via-[#151820] to-[#0a0c10] shadow-[0_20px_50px_-15px_rgba(0,106,250,0.35),0_25px_60px_-20px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.18)] ring-1 ring-slate-900/90 dark:ring-white/20 transition-all duration-300 hover:scale-[1.01]">
                {/* Mirror Chamfer */}
                <div className="relative rounded-[41px] sm:rounded-[45px] p-[2px] sm:p-[2.5px] bg-gradient-to-b from-white/35 via-white/5 to-transparent dark:from-white/20 dark:to-transparent">
                  {/* Midnight Bezel */}
                  <div className="relative rounded-[39px] sm:rounded-[43px] overflow-hidden bg-black p-[2px] shadow-inner">
                    {/* Microscopic Acoustic Speaker Slit */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-[#22252c] rounded-full z-20 pointer-events-none" />

                    {/* Display Screen: Natural Aspect Ratio, Zero Cropping */}
                    <div className="relative rounded-[37px] sm:rounded-[41px] overflow-hidden bg-slate-100 dark:bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        key={hero.id}
                        src={hero.image}
                        alt={hero.alt}
                        className="w-full h-auto block select-none animate-fadeIn"
                        loading="eager"
                      />

                      {/* Glass Glare & Specular Reflection Sheen */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] pointer-events-none z-10" />
                      <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent rotate-12 pointer-events-none z-10" />

                      {/* Expand Fullscreen Button */}
                      <button
                        type="button"
                        onClick={() => setModalScreen(hero.image)}
                        className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-black/80 hover:bg-black text-white backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow-lg z-20"
                        aria-label={`Expand ${hero.title}`}
                        title="View full screen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Realistic Contact Floor Shadow */}
              <div className="w-[75%] h-4 bg-gradient-to-r from-transparent via-slate-900/40 dark:via-black/80 to-transparent blur-md mx-auto mt-2.5 rounded-full pointer-events-none" />

              {/* Interactive Dots Pagination */}
              <div className="flex items-center justify-center gap-1.5 mt-2.5" aria-label="App screen indicators">
                {APP_SCREENS.map((s, idx) => {
                  const active = activeHeroIndex === idx;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setActiveHeroIndex(idx);
                        setIsAutoPlaying(false);
                      }}
                      title={s.title}
                      aria-label={`Switch to ${s.title}`}
                      className={`h-1.5 transition-all duration-300 rounded-full ${
                        active
                          ? "w-7 bg-[#006AFA] shadow-md shadow-[#006AFA]/50"
                          : "w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical standards strip */}
      <section aria-label="Clinical standards" className="px-4 sm:px-6 lg:px-8 relative z-10 pb-4">
        <div className="max-w-7xl mx-auto py-3 px-4 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] backdrop-blur-md shadow-sm flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold">
          {["ADA Glucose", "AHA Blood Pressure", "WHO BMI", "GI Index 0–100", "VAS Pain 1–10", "Bengali + English"].map((b) => (
            <span key={b} className="px-3.5 py-1.5 rounded-full bg-white dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-sm hover:border-[#006AFA]/40 hover:text-[#006AFA] dark:hover:text-sky-400 hover:scale-105 transition-all duration-200">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-7xl mx-auto rounded-3xl p-7 sm:p-10 bg-gradient-to-b from-white/95 to-slate-50/90 dark:from-[#0B0F19]/90 dark:to-[#07090f]/90 border border-slate-200/90 dark:border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(0,106,250,0.12)] relative overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:divide-x divide-slate-200/70 dark:divide-white/[0.08]">
            {[
              ["10+", "Vitals contexts & meal slots", "text-slate-950 dark:text-white"],
              ["3.9–5.5", "mmol/L fasting benchmark", "text-[#006AFA] dark:text-sky-400"],
              ["7–90d", "Report ranges + 1yr & custom", "text-emerald-600 dark:text-emerald-400"],
              ["12", "Languages Supported", "text-indigo-600 dark:text-indigo-400"],
            ].map(([v, l, c]) => (
              <div key={l} className="px-2">
                <span className={`text-3xl sm:text-5xl font-black tracking-tight ${c}`}>{v}</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-wide">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Features bento */}
      <section id="features" className="scroll-mt-24 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#006AFA] dark:text-sky-400 border border-[#006AFA]/30 bg-[#006AFA]/5 dark:bg-[#006AFA]/10 backdrop-blur-md shadow-sm mb-3">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              Why HealthTrack?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-2 leading-tight">
              Clinical precision,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006AFA] via-blue-500 to-[#69C3FF]">everyday convenience.</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
              Every card below maps to a real module in the app — same thresholds, same flows, same Electric Blue design language.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                icon: HeartPulse, chip: "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400", title: "Vitals: Sugar, BP, Weight, BMI",
                body: "mmol/L & mg/dL auto-detect, 10 sugar contexts, ADA + AHA staging, pulse, kg/lbs + auto BMI with localized advice, smooth cubic trend charts with target bands.",
                foot: "ADA • AHA • WHO compliant",
              },
              {
                icon: Pill, chip: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400", title: "Medications + Adherence",
                body: "Pill / Capsule / Syrup / Injection, frequency + slots (Morning / Afternoon / Night), Before / After / With food, 3-day → Ongoing, Take / Missed, adherence %, days-left + low-stock refill.",
                foot: "Dose alarms + inbox",
              },
              {
                icon: Apple, chip: "bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400", title: "Meals + Nutrition Engine",
                body: "Breakfast, Lunch, Snack, and Dinner slots, planned-menu nutrition estimator, automatic macro splits, daily calorie targets, reminders, and weekly adherence logs.",
                foot: "Calorie & Macro Tracking",
              },
              {
                icon: Droplets, chip: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400", title: "Hydration + Health Score",
                body: "Daily ml/L target, Cup / Glass / Mug / Bottle / Flask / Jug, undo + progress ring, 1–3h reminder intervals + active hours. Score 0–100 from meds + vitals + meals + water.",
                foot: "Streaks + rings",
              },
              {
                icon: Activity, chip: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400", title: "2D Body Map + Pain",
                body: "Front / Back zones, VAS 1–10 slider + Wong-Baker emoji, Green→Red severity, sensations, aggravators, notes, Save Pin + history for your physician.",
                foot: "Aching • Sharp • Burning",
              },
              {
                icon: FileText, chip: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400", title: "Prescription Vault",
                body: "Prescription Slip vs Lab Report, doctor + specialty + hospital, consult + next-visit reminder, diagnosis, meds list, camera / gallery / PDF, share + download + month groups.",
                foot: "Never lose a slip",
              },
              {
                icon: Cloud, chip: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400", title: "Google Drive Backup",
                body: "One-tap OAuth, private vault folder, auto backup / restore / Sync Now, storage status. Prescriptions + reports + vitals snapshots stay in your Drive.",
                foot: "Private • No lock-in",
              },
              {
                icon: FileSpreadsheet, chip: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400", title: "Doctor Reports (PDF + Excel)",
                body: "7 / 15 / 30 / 90 days, 1 year, All + custom picker. Teal Medical Telemetry PDF (Report ID, synthesis, benchmarks, sign-off) + multi-sheet .xlsx + CSV.",
                foot: "Print-ready in 1 tap",
              },
              {
                icon: Bell, chip: "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400", title: "Reminders + Inbox",
                body: "4 channels: Meal, Medication, Vitals & Sugar, Hydration. Dose alarms, missed-dose, water interval, visit reminders + Firebase push. Filterable inbox: All / Vitals / Meds / Meals / Tips.",
                foot: "Never miss a dose",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="relative rounded-3xl p-6 sm:p-7 bg-white/90 dark:bg-[#0B0F19]/80 border border-slate-200/90 dark:border-white/10 hover:border-[#006AFA]/50 hover:shadow-[0_20px_40px_-15px_rgba(0,106,250,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden card-glow-hover">
                  <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/30 dark:via-sky-400/20 to-transparent pointer-events-none" />
                  <div>
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300 ${f.chip}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-[17px] font-bold mb-2 group-hover:text-[#006AFA] dark:group-hover:text-sky-400 transition-colors">{f.title}</h3>
                    <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{f.body}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] text-[#006AFA] dark:text-sky-400 font-bold flex items-center justify-between">
                    <span>{f.foot}</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-[11px] text-slate-400 mt-6">Icon tint classes use Tailwind palette to mirror app rings: Meds emerald • Vitals blue • Habits orange • Water cyan.</p>
        </div>
      </section>

      {/* Vitals interactive */}
      <section id="vitals" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-white/[0.015] border-y border-slate-200/80 dark:border-white/5 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#006AFA] dark:text-sky-400 border border-[#006AFA]/30 bg-[#006AFA]/5 dark:bg-[#006AFA]/10 backdrop-blur-md shadow-sm mb-3">
              Vitals, exactly like the app
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">Tap a tab — same thresholds as Flutter.</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 max-w-lg">
              These are the literal constants from <code className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-white/10 text-[11px] font-mono text-[#006AFA] dark:text-sky-300">AppConstants</code> and
              the Health tab segmented control (Sugar / Pressure / Weight / Body Map).
            </p>
            <div className="flex flex-wrap gap-2 mt-6 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] backdrop-blur-md w-fit" aria-label="Vitals tabs">
              {VITALS_TABS.map((t) => (
                <button
                  key={t.id}
                  aria-pressed={activeVital === t.id}
                  onClick={() => setActiveVital(t.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    activeVital === t.id
                      ? "bg-[#006AFA] text-white shadow-md shadow-[#006AFA]/30 scale-[1.02]"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/90 p-7 shadow-lg backdrop-blur-xl card-glow-hover transition-all duration-300">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{vital.label}</h3>
                <Badge variant="info" className="text-[11px] font-bold">{vital.unit}</Badge>
              </div>
              <ul className="mt-4 space-y-2.5 text-[13px] text-slate-600 dark:text-slate-300">
                {vital.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden card-glow-hover transition-all duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#006AFA]/10 flex items-center justify-center text-[#006AFA] shadow-sm">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base">Today&apos;s daily loop</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">The exact Home → Health → Meds → Meals flow</p>
              </div>
            </div>
            <ol className="space-y-4 text-sm relative">
              {[
                ["Morning streak + greeting", "Open Home, check 7-day strip and Health Score."],
                ["10-sec quick log", "Sugar / BP / Weight / Water via Quick-Add sheet."],
                ["Take meds", "Morning slot → Take Now. Adherence climbs."],
                ["Complete meals", "Mark Breakfast / Lunch / Snack / Dinner; macros auto-fill."],
                ["Evening review", "Vitals chart + hydration ring → tomorrow's reminders set."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-3.5 group">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#006AFA] to-blue-500 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-md shadow-[#006AFA]/30 group-hover:scale-110 transition-transform">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-[13px]">{t}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed shadow-sm">
              <strong>Clinical note:</strong> Fasting Normal ≤ 99 mg/dL • Post-Meal ≤ 139 • BP Normal &lt; 120/80 • BMI Normal &lt; 25 • GI Low ≤ 55. The app colors every reading Green / Amber / Red automatically.
            </div>
          </div>
        </div>
      </section>


      {/* Reports */}
      <section id="reports" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-[#060b14] to-black text-white relative overflow-hidden border-y border-white/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-teal-300 border border-teal-500/30 bg-teal-500/10 backdrop-blur-md shadow-sm mb-3">
              Doctor-ready exports
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 leading-tight">Walk in with a telemetry report, not screenshots.</h2>
            <p className="text-sm text-slate-300 mt-3 max-w-lg">
              Pick 7 / 15 / 30 / 90 days, 1 year, All time or a custom range. Get a branded Teal PDF with Report ID,
              demographics banner, clinical synthesis, benchmark table and sign-off — plus multi-sheet Excel and CSV.
            </p>
            <ul className="mt-5 space-y-2.5 text-[13px] text-slate-300">
              {[
                "Avg Fasting (target 70–99) • Avg Post-Meal (< 140) • Avg BP (Normal range)",
                "Current Weight + BMI badge • Adherence % + progress bar + doses recorded",
                "Date-wise sugar / BP / weight / meds / meal tables",
                "Save to Downloads • Share • Open • Print for signature",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 mt-6">
              {["7 days", "15 days", "30 days", "90 days", "1 year", "Custom"].map((p, i) => (
                <span key={p} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${i === 2 ? "bg-teal-400 text-slate-950 border-teal-300 shadow-md shadow-teal-500/30 scale-105" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"}`}>{p}</span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white text-slate-900 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(20,184,166,0.35)] border border-teal-500/20 relative card-glow-hover transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-teal-700">HealthTrack Medical Telemetry Report</p>
                <p className="text-xs text-slate-500 mt-1">REPORT ID • Confidential • Physician sign-off included</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center border border-teal-100 shadow-sm">
                <Stethoscope className="w-7 h-7 text-teal-600" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-5 text-center">
              {[
                ["Avg Fasting", "96 mg/dL", "Target 70–99"],
                ["Avg BP", "118/76", "Normal"],
                ["Adherence", "92%", "1,240 doses"],
              ].map(([k, v, s]) => (
                <div key={k} className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-3 hover:border-teal-500/50 hover:bg-teal-50/30 transition-all">
                  <p className="text-[10px] font-bold uppercase text-slate-500">{k}</p>
                  <p className="text-lg font-black mt-0.5">{v}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">{s}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 mt-5">
              <span className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-700/25 hover:shadow-teal-700/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                <FileText className="w-4 h-4" /> Download PDF
              </span>
              <span className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#107C41] to-[#149950] hover:from-[#149950] hover:to-[#17a858] text-white text-xs font-bold shadow-lg shadow-[#107C41]/25 hover:shadow-[#107C41]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                <FileSpreadsheet className="w-4 h-4" /> Excel .xlsx
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 text-center">Same buttons, same teal + Excel-green as the Flutter report page.</p>
          </div>
        </div>
      </section>

      {/* Personalization: language + theme + offline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-5 sm:gap-6">
          <div className="relative rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/90 p-7 sm:p-8 card-glow-hover backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#006AFA]/30 dark:via-sky-400/20 to-transparent pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-[#006AFA]/10 border border-[#006AFA]/20 flex items-center justify-center text-[#006AFA] shadow-sm group-hover:scale-110 transition-transform">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mt-5 group-hover:text-[#006AFA] dark:group-hover:text-sky-400 transition-colors">12 languages, Bengali-first</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">Elder-friendly. Switch in Profile → Language. Meal slots + food keywords fully localized.</p>
            <div className="flex flex-wrap gap-1.5 mt-5">
              {LANGUAGES.map((l) => (
                <span key={l} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.06] text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-[#006AFA]/40 hover:text-[#006AFA] transition-colors">{l}</span>
              ))}
            </div>
          </div>
          <div className="relative rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/90 p-7 sm:p-8 card-glow-hover backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-110 transition-transform">
              <Moon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mt-5 group-hover:text-indigo-500 transition-colors">Dark / Light / System</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">Material 3, Plus Jakarta Sans + Uncut Sans, SolarIcons, soft shadows + primary glow. Toggle it top-right — this page respects it.</p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 text-white border border-slate-800 shadow-sm">Dark #0B1120</span>
              <span className="px-3 py-1.5 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-sm">Light #FFFFFF</span>
              <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#006AFA] to-[#69C3FF] text-white shadow-md shadow-[#006AFA]/30">Brand #006AFA</span>
            </div>
          </div>
          <div className="relative rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/90 p-7 sm:p-8 card-glow-hover backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
              <Wifi className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mt-5 group-hover:text-emerald-500 transition-colors">Offline-first + secure</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">On-device cache, Supabase RLS, TLS 1.3 + AES-256, Google sign-in + email verification, delete-anytime. You own your data.</p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
              <span className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 py-2.5 shadow-sm">AES-256</span>
              <span className="rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-700 dark:text-sky-400 py-2.5 shadow-sm">RLS</span>
              <span className="rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-400 py-2.5 shadow-sm">Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-white/[0.015] border-y border-slate-200/80 dark:border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#006AFA] dark:text-sky-400 border border-[#006AFA]/30 bg-[#006AFA]/5 dark:bg-[#006AFA]/10 backdrop-blur-md shadow-sm mb-3">
              Simple 4-step workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">Less than 60 seconds a day</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-10 left-[14%] right-[14%] h-[2px] bg-gradient-to-r from-transparent via-[#006AFA]/25 dark:via-sky-400/20 to-transparent pointer-events-none" />
            {[
              { step: "01", title: "Download & setup", desc: "Install, pick mmol/L or mg/dL, set targets, add photo + vitals.", icon: Download },
              { step: "02", title: "10-second log", desc: "Quick-Add sugar / BP / weight / water. Cup, Glass, Mug, Bottle.", icon: HeartPulse },
              { step: "03", title: "Stay reminded", desc: "Meds, meals, water + visit alarms. Inbox keeps everything.", icon: Bell },
              { step: "04", title: "Export for doctor", desc: "Drive backup + 1-tap PDF / Excel for consultations.", icon: FileSpreadsheet },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="flex flex-col items-center text-center group relative z-10">
                  <div className="relative mb-6">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#006AFA]/10 via-[#006AFA]/5 to-[#69C3FF]/20 border-2 border-[#006AFA]/80 dark:border-sky-400/80 flex items-center justify-center text-[#006AFA] dark:text-sky-400 group-hover:scale-110 shadow-lg shadow-[#006AFA]/15 transition-transform duration-300">
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#006AFA] to-blue-600 text-[11px] font-black text-white shadow-md shadow-[#006AFA]/35">{s.step}</div>
                  </div>
                  <h3 className="font-bold mb-2 group-hover:text-[#006AFA] dark:group-hover:text-sky-400 transition-colors">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-[240px] leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials + pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/90 p-7 sm:p-9 shadow-xl backdrop-blur-xl card-glow-hover transition-all duration-300">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#006AFA]/10 flex items-center justify-center text-[#006AFA] shadow-sm">
                <Quote className="w-5 h-5" />
              </div>
              <h2 className="font-black text-xl sm:text-2xl">Built for families managing chronic care</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {[
                ["Rahman, Dhaka", "My father's fasting finally stays 5–6. The Bengali labels + Drive backup sold me."],
                ["Dr. S. Karim", "Patients bring the telemetry PDF. Clean averages, adherence %, sign-off — saves 10 minutes."],
                ["Nasrin, Chittagong", "Water + meds reminders + pain map. My BP log finally makes sense to my doctor."],
              ].map(([name, quote]) => (
                <figure key={name} className="rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 p-5 flex flex-col justify-between gap-3.5 hover:border-[#006AFA]/40 hover:shadow-md transition-all duration-300">
                  <div>
                    <div className="flex gap-0.5 mb-2.5">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]" />))}</div>
                    <blockquote className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">“{quote}”</blockquote>
                  </div>
                  <figcaption className="text-[11px] font-bold flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />{name}</figcaption>
                </figure>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-4">Early-user stories reflecting real app workflows. Ratings shown for illustration until store launch.</p>
          </div>
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-slate-950 via-[#080d19] to-black text-white p-7 sm:p-9 flex flex-col justify-between border border-white/10 shadow-2xl relative overflow-hidden card-glow-hover transition-all duration-300">
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#006AFA]/25 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative z-10">
              <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] uppercase font-bold tracking-wider shadow-sm">Free • Pro hides ads</Badge>
              <h2 className="font-black text-2xl mt-3 tracking-tight">Start free. Upgrade only to remove ads.</h2>
              <ul className="mt-5 space-y-3 text-[13px] text-slate-300">
                {[
                  "Unlimited vitals, meals, meds, water logs",
                  "Vault + Drive backup + PDF / Excel export",
                  "12 languages, dark mode, offline",
                  "Pro: zero banner / interstitial / rewarded ads",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5"><Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]" />{t}</li>
                ))}
              </ul>
            </div>
            <a href="#download" className="mt-7 inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#006AFA] via-blue-600 to-[#50B2FF] font-bold text-sm text-white shadow-xl shadow-[#006AFA]/30 hover:shadow-[#006AFA]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 relative z-10">
              <Smartphone className="w-4 h-4" /> Get HealthTrack free
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-white/[0.015] border-y border-slate-200/80 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#006AFA] dark:text-sky-400 border border-[#006AFA]/30 bg-[#006AFA]/5 dark:bg-[#006AFA]/10 backdrop-blur-md shadow-sm mb-3">
              Got questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">Frequently asked questions</h2>
          </div>
          <div className="space-y-3.5">
            {FAQS.map((f, i) => {
              const open = activeFaq === i;
              return (
                <div key={i} className={`rounded-2xl border bg-white/95 dark:bg-[#0a0e18]/95 overflow-hidden shadow-sm transition-all duration-200 ${open ? "border-[#006AFA]/60 shadow-md ring-1 ring-[#006AFA]/20 dark:border-sky-500/50" : "border-slate-200/90 dark:border-white/10 hover:border-[#006AFA]/40"}`}>
                  <button
                    onClick={() => setActiveFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-sm sm:text-[15px] font-bold hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors"
                  >
                    <span>{f.q}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-[#006AFA] dark:text-sky-400" : "text-slate-400"}`} />
                  </button>
                  {open && <div className="px-4 sm:px-5 pb-5 text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3.5">{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto rounded-[36px] p-8 sm:p-14 bg-gradient-to-br from-[#020b18] via-[#051329] to-[#040817] text-white border border-[#006AFA]/40 shadow-[0_30px_70px_-15px_rgba(0,106,250,0.35)] text-center relative overflow-hidden card-glow-hover">
          <div className="absolute -top-32 -left-32 w-72 h-72 bg-[#006AFA]/30 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-sky-500/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl overflow-hidden bg-white p-1.5 shadow-2xl border border-white/30 hover:scale-105 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="HealthTrack logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Badge variant="success" className="bg-sky-500/20 text-sky-300 border-sky-500/30 text-[10px] uppercase font-bold tracking-wide">HealthTrack v1.0.0+3</Badge>
              <Badge variant="success" className="bg-white/10 text-slate-200 border-white/15 text-[10px] font-bold">Android • iOS • Portrait • Offline</Badge>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">Begin your healthier day today.</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Free download. Email or Google sign-in, verify once, and start your first 10-second log. Your records back up to your own Google Drive.
            </p>
            <div className="grid sm:grid-cols-2 gap-3.5 pt-2 text-left">
              <a href="mailto:info@appstick.com.bd?subject=HealthTrack%20Android%20Download" className="inline-flex items-center gap-3.5 px-6 py-4 rounded-2xl bg-black/90 hover:bg-neutral-900 border border-white/20 hover:border-sky-500/80 shadow-lg hover:shadow-sky-500/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200">
                <Download className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="leading-none">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Get for Android</span>
                  <span className="text-sm font-bold block mt-1">Play Store / APK — Request link</span>
                </span>
              </a>
              <a href="mailto:info@appstick.com.bd?subject=HealthTrack%20iOS%20Download" className="inline-flex items-center gap-3.5 px-6 py-4 rounded-2xl bg-black/90 hover:bg-neutral-900 border border-white/20 hover:border-teal-500/80 shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200">
                <Smartphone className="w-5 h-5 text-teal-400 shrink-0" />
                <span className="leading-none">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Get for iPhone</span>
                  <span className="text-sm font-bold block mt-1">App Store / TestFlight — Request link</span>
                </span>
              </a>
            </div>
            <p className="text-[11px] text-slate-400">
              Store listings are rolling out — tapping above opens an email to <span className="text-slate-200 font-semibold">info@appstick.com.bd</span> so we can send you the live link + APK. No spam, ever.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-slate-300 pt-1">
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-sky-400" /> Available worldwide</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Private by design</span>
              <span className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-cyan-400" /> 2.0L hydration built-in</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#030509] py-14 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl overflow-hidden bg-white border border-slate-200 dark:border-white/10 p-0.5 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpeg" alt="HealthTrack" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white uppercase tracking-tight">Health<span className="text-[#006AFA]">Track</span></span>
            </div>
            <p className="leading-relaxed text-[11px]">Glucose, BP, weight, pain, meals, meds, water, vault, Drive sync and doctor reports.</p>
            <p className="text-[11px] flex items-center gap-1.5 font-medium"><Lock className="w-3.5 h-3.5 text-[#006AFA]" /> Private Drive vault • Export anytime</p>
          </div>
          <nav aria-label="Product">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase mb-3 tracking-wider">Product</h3>
            <ul className="space-y-2 text-[12px]">
              <li><a href="#features" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">Features &amp; Modules</a></li>
              <li><a href="#vitals" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">Vitals &amp; thresholds</a></li>
              <li><a href="#how-it-works" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">How it works</a></li>
              <li><a href="#reports" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">Doctor reports</a></li>
            </ul>
          </nav>
          <nav aria-label="Company and legal">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase mb-3 tracking-wider">Company &amp; Legal</h3>
            <ul className="space-y-2 text-[12px]">
              <li><Link href="/privacy-policy" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">Terms of Service</Link></li>
              <li><a href="#faq" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">Clinical guidelines</a></li>
              <li><a href="https://appstick.com.bd" target="_blank" rel="noopener noreferrer" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">Appstick Ltd</a></li>
              <li><Link href="/login" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">Admin Portal →</Link></li>
            </ul>
          </nav>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase mb-3 tracking-wider">Contact</h3>
            <ul className="space-y-2.5 text-[12px]">
              <li>
                <a
                  href="mailto:info@appstick.com.bd"
                  className="inline-flex items-center gap-2 hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#006AFA] dark:text-sky-400 shrink-0" />
                  <span>info@appstick.com.bd</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801404049797"
                  className="inline-flex items-center gap-2 hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#006AFA] dark:text-sky-400 shrink-0" />
                  <span>+88 014 0404 9797</span>
                </a>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">Appstick Ltd Support &amp; Enquiries</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 dark:border-white/5 flex flex-col gap-3 text-[11px]">
          <p>© {new Date().getFullYear()} HealthTrack. Developed by Appstick Ltd. All rights reserved.</p>
          <p className="max-w-3xl leading-relaxed text-slate-500">
            Medical Disclaimer: HealthTrack is an aid for wellness and nutrition tracking. It does not provide medical diagnoses or replace professional medical advice. Always consult a certified healthcare professional.
          </p>
        </div>
      </footer>

      {/* Lightbox */}
      {modalScreen && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" onClick={() => setModalScreen(null)} role="dialog" aria-modal="true" aria-label="Fullscreen screenshot">
          <div className="relative max-w-sm w-full bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-white/20 p-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalScreen(null)} aria-label="Close preview" className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={modalScreen} alt="Fullscreen app preview" className="w-full h-auto aspect-[720/1565] object-cover rounded-[24px]" />
          </div>
        </div>
      )}
    </div>
  );
}
