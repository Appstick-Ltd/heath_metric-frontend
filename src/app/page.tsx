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

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=bd.com.appstick.healthtrack&pcampaignid=web_share";

/* ------------------------------------------------------------------ */
/*  Data — mapped 1:1 from Flutter app (lib/)                          */
/*  App: HealthTrack v1.0.0+3                                          */
/*  Tagline: "Your Intelligent Nutrition & Chronic Care Companion"      */
/* ------------------------------------------------------------------ */





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
  "Español",
  "Français",
  "Deutsch",
  "Português",
  "Italiano",
  "العربية",
  "हिन्दी",
  "日本語",
  "한국어",
  "简体中文",
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
    a: "Yes! HealthTrack supports international languages with localized meal categories and global clinical nutrition metrics. Offline-first on-device caching ensures smooth operation without internet; data automatically synchronizes when you reconnect.",
  },
  {
    q: "Is HealthTrack free to use?",
    a: "Yes! Core vitals logging, Google Drive cloud vault backups, and clinical PDF telemetry exports are completely free, supported by non-intrusive Google AdMob advertisements. No payment or credit card is needed to start logging today.",
  },
  {
    q: "Is HealthTrack a medical device?",
    a: "No. HealthTrack is an aid for wellness and nutrition tracking. It does not provide medical diagnoses or replace professional medical advice. Always consult a certified healthcare professional.",
  },
];

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [modalScreen, setModalScreen] = React.useState<string | null>(null);
  const [activeVital, setActiveVital] = React.useState("sugar");
  const [activeSection, setActiveSection] = React.useState<string>("home");

  // Interactive Live Tools State (from Blueprint Section 3)
  const [bmiHeightCm, setBmiHeightCm] = React.useState(172);
  const [bmiWeightKg, setBmiWeightKg] = React.useState(68);

  // Blood sugar converter state
  const [sugarInput, setSugarInput] = React.useState(5.4);
  const [sugarUnit, setSugarUnit] = React.useState<"mmol/L" | "mg/dL">("mmol/L");
  const [sugarContext, setSugarContext] = React.useState<"fasting" | "postMeal" | "bedtime">("fasting");

  // Anatomical Body Pain Map interactive state (from Blueprint Section 2)
  const [painBodyView, setPainBodyView] = React.useState<"front" | "back">("front");
  const [selectedPainZone, setSelectedPainZone] = React.useState("Head / Migraine");
  const [vasScore, setVasScore] = React.useState(4);
  const [painQuality, setPainQuality] = React.useState("Throbbing");

  React.useEffect(() => {
    const sectionIds = ["home", "features", "vitals", "pain-map", "tools", "reports", "faq"];

    const handleScroll = () => {
      if (window.scrollY < 250) {
        setActiveSection("home");
        return;
      }

      const scrollPosition = window.scrollY + 140;

      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = id;
          }
        }
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
        current = "faq";
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const vital = VITALS_TABS.find((v) => v.id === activeVital)!;

  // Derived BMI
  const bmiValue = Number((bmiWeightKg / Math.pow(bmiHeightCm / 100, 2)).toFixed(1));
  const bmiCategory =
    bmiValue < 18.5
      ? { label: "Underweight", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/25", advice: "Gradual caloric surplus and resistance training recommended." }
      : bmiValue <= 24.9
        ? { label: "Normal Weight (Optimal)", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/25", advice: "Maintain balanced macro intake and consistent daily hydration." }
        : bmiValue <= 29.9
          ? { label: "Overweight", color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-600/25", advice: "Moderate caloric deficit with 30 mins brisk walking suggested." }
          : { label: "Obese (High Risk)", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/25", advice: "Physician consultation recommended for personalized glycemic plan." };

  // Derived Blood Sugar Conversion & ADA Staging
  const sugarInMmol = sugarUnit === "mmol/L" ? sugarInput : sugarInput / 18.0182;
  const sugarInMgdl = sugarUnit === "mg/dL" ? sugarInput : sugarInput * 18.0182;
  const convertedSugarDisplay =
    sugarUnit === "mmol/L"
      ? `${Math.round(sugarInMgdl)} mg/dL`
      : `${sugarInMmol.toFixed(1)} mmol/L`;

  const sugarEvaluation = React.useMemo(() => {
    if (sugarInMmol < 3.9) {
      return { stage: "Hypoglycemia (Low)", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10", advice: "Immediate fast-acting glucose required (15g carbs)." };
    }
    if (sugarContext === "fasting") {
      if (sugarInMmol <= 5.5) return { stage: "Normal Fasting", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", advice: "Ideal ADA fasting range (70–99 mg/dL / 3.9–5.5 mmol/L)." };
      if (sugarInMmol <= 6.9) return { stage: "Elevated / Pre-Diabetic", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", advice: "Impaired fasting glucose. Monitor meal carbohydrates." };
      return { stage: "High Glycemic / Diabetic", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10", advice: "Fasting glucose elevated (≥126 mg/dL). Share report with doctor." };
    } else {
      if (sugarInMmol <= 7.8) return { stage: "Normal Post-Meal", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", advice: "Standard post-prandial glycemic response (<140 mg/dL)." };
      if (sugarInMmol <= 11.0) return { stage: "Elevated Post-Meal", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", advice: "Impaired glucose tolerance (140–199 mg/dL). Check meal portion." };
      return { stage: "High Post-Meal Spike", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10", advice: "Significant glycemic spike (≥200 mg/dL). Review insulin/medication timing." };
    }
  }, [sugarInMmol, sugarContext]);

  const NAV_ITEMS = [
    { href: "#home", label: "Home", id: "home" },
    { href: "#features", label: "Features", id: "features" },
    { href: "#vitals", label: "Vitals", id: "vitals" },
    { href: "#pain-map", label: "Pain Map", id: "pain-map" },
    { href: "#tools", label: "Health Tools", id: "tools" },
    { href: "#faq", label: "FAQ", id: "faq" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#02081d] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#006AFA] selection:text-white relative overflow-x-clip transition-colors duration-200">
      {/* Ambient with Subtle High-Tech Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-grid-subtle opacity-40 dark:opacity-30 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_15%,#000_60%,transparent_100%)]" />
        <span className="block absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-[#006AFA]/15 via-blue-600/8 to-transparent dark:from-[#006AFA]/30 dark:via-blue-600/15 rounded-full blur-[140px] opacity-90 animate-aurora" />
        <span className="block absolute top-[35%] -left-48 w-[550px] h-[550px] bg-sky-500/8 dark:bg-sky-600/20 rounded-full blur-[160px] animate-aurora-reverse" />
        <span className="block absolute top-[65%] -right-48 w-[550px] h-[550px] bg-blue-500/8 dark:bg-indigo-600/15 rounded-full blur-[160px]" />
      </div>

      {/* Navbar with Floating Glass Elevation */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#02081d]/90 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/[0.08] shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-3">
          <Link href="#home" onClick={() => setActiveSection("home")} className="flex items-center gap-3 group shrink-0" aria-label="HealthTrack home">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-[8px] overflow-hidden bg-white shadow-md shadow-[#006AFA]/20 border border-slate-200/90 dark:border-white/10 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,106,250,0.35)] transition-all duration-300 p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="HealthTrack logo" className="w-full h-full object-contain" />
            </div>
            <div className="leading-none">
              <span className="font-black text-base sm:text-lg tracking-tight text-slate-950 dark:text-white uppercase">
                Health<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006AFA] via-blue-500 to-[#69C3FF]">Track</span>
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-[13px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-white/[0.03] p-1.5 rounded-[8px] border border-slate-200/60 dark:border-white/[0.06] backdrop-blur-md" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-3.5 py-1.5 rounded-[8px] transition-all duration-200 ${isActive
                    ? "bg-white dark:bg-white/15 text-[#006AFA] dark:text-sky-400 font-bold shadow-sm border border-slate-200/70 dark:border-white/15"
                    : "hover:bg-white/60 dark:hover:bg-white/10 hover:text-[#006AFA] dark:hover:text-white text-slate-600 dark:text-slate-300 shadow-none border border-transparent"
                    }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center justify-center border border-slate-200/80 dark:border-white/10 rounded-[8px] bg-slate-100/80 dark:bg-white/[0.05] p-0.5 shadow-sm">
              <ThemeToggle />
            </div>
            <a
              href="#download"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[8px] text-sm font-bold text-white bg-gradient-to-r from-[#006AFA] via-blue-600 to-[#50B2FF] hover:brightness-110 shadow-lg shadow-[#006AFA]/30 hover:shadow-[#006AFA]/45 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Get App</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden h-11 w-11 flex items-center justify-center rounded-[8px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
            >
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${mobileMenuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden px-4 py-3 bg-white/95 dark:bg-[#02081d]/95 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 grid gap-1 text-sm shadow-2xl animate-fadeIn" aria-label="Mobile">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2.5 rounded-[8px] font-medium transition-colors ${isActive
                    ? "bg-[#006AFA]/10 text-[#006AFA] dark:bg-[#006AFA]/20 dark:text-sky-400 font-bold"
                    : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200"
                    }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden bg-gradient-to-b from-sky-50/70 via-blue-50/35 to-white dark:bg-[radial-gradient(ellipse_120%_90%_at_75%_25%,#0b236d_0%,#030f40_35%,#02081d_75%,#02081d_100%)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-center lg:pt-2">
          {/* Left Column: Clear Hierarchy, Balanced Rhythm, Zero Blank Voids */}
          <div className="lg:col-span-6 space-y-6">
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
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 h-12 px-6 rounded-[8px] min-w-[180px] bg-slate-950 hover:bg-slate-900 text-white border border-slate-800/80 hover:border-sky-500/50 shadow-xl hover:shadow-[0_12px_28px_-6px_rgba(0,106,250,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                >
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 512 512" aria-hidden="true">
                    <path fill="#4285F4" d="M48.7 18.5c-4.8 5.2-7.7 13-7.7 23v429c0 10 2.9 17.8 7.7 23l2.4 2.4L275 272v-5.8L51.1 16.1l-2.4 2.4z" />
                    <path fill="#FFBA00" d="M350.8 347.8l-75.8-75.8V266l75.8-75.8 1.8 1 89.8 51.1c25.7 14.6 25.7 38.5 0 53.1l-89.8 51.1-1.8 1.4z" />
                    <path fill="#00E676" d="M275 266.2L51.1 490.1c8.4 8.9 22.3 9.9 37.9 1.1l263.6-149.8-77.6-75.2z" />
                    <path fill="#FF3D00" d="M275 266.2l77.6-75.2L89 41.2c-15.6-8.9-29.5-7.8-37.9 1.1L275 266.2z" />
                  </svg>
                  <span className="text-left leading-none">
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Get it on</span>
                    <span className="text-sm font-bold block mt-1">Google Play</span>
                  </span>
                </a>
                <div
                  className="inline-flex items-center justify-center gap-3 h-12 px-6 rounded-[8px] min-w-[180px] bg-slate-950/80 text-white/80 border border-slate-800/80 shadow-xl cursor-default select-none relative"
                  title="iOS version is upcoming on the App Store"
                >
                  <svg className="w-6 h-6 fill-white/70 shrink-0" viewBox="0 0 384 512" aria-hidden="true">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <span className="text-left leading-none">
                    <span className="text-[10px] text-slate-400 font-medium">Download on the</span>
                    <span className="text-sm font-bold block mt-1 flex items-center gap-1.5 text-slate-300">
                      App Store
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-wide">
                        Upcoming
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Mini rings like app Health Overview */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-lg pt-1">
              {[
                ["Meds", "emerald", "Take"],
                ["Vitals", "blue", "Log"],
                ["Meals", "orange", "Done"],
                ["Water", "cyan", "2.0L"],
              ].map(([label, color, sub]) => (
                <div key={label} className="rounded-[8px] border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-md p-3 text-center card-glow-hover shadow-sm hover:shadow-md transition-all duration-300">
                  <div className={`mx-auto w-9 h-9 rounded-full border-[3px] flex items-center justify-center text-[10px] font-black transition-transform duration-300 hover:scale-105 ${color === "emerald" ? "border-emerald-500 text-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.25)]" :
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

          {/* App Showcase Column */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative py-2 sm:py-4 w-full">
            {/* Multi-tier Ambient Cosmic Glow matching image tones */}
            {/* Deep Royal Midnight Blue Core Glow */}
            <div className="absolute inset-0 w-[420px] sm:w-[520px] h-[380px] bg-[#0b2470]/40 rounded-full blur-[100px] m-auto pointer-events-none -z-10" />
            {/* Left Cyan/Blue Ambient Glow */}
            <div className="absolute -left-10 top-1/4 w-[280px] sm:w-[360px] h-[360px] bg-gradient-to-tr from-[#006AFA]/35 to-sky-400/25 rounded-full blur-[90px] pointer-events-none -z-10 animate-aurora-reverse" />
            {/* Right Pink/Purple Ambient Glow */}
            <div className="absolute -right-10 top-1/3 w-[280px] sm:w-[360px] h-[360px] bg-gradient-to-tl from-purple-500/30 to-pink-500/25 rounded-full blur-[90px] pointer-events-none -z-10 animate-aurora" />
            {/* Bottom Neon Floor Reflection */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-24 bg-gradient-to-r from-sky-400/25 via-[#4848d2]/40 to-purple-500/30 blur-2xl pointer-events-none -z-10 animate-pulse-glow" />

            {/* Subtle Bottom Dot Mesh Wave */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[480px] h-32 opacity-25 dark:opacity-35 pointer-events-none -z-10 bg-[radial-gradient(#38bdf8_1.2px,transparent_1.2px)] [background-size:14px_14px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_80%,#000_70%,transparent_100%)]" />

            {/* Showcase Presentation Container with seamless edge blending */}
            <div className="relative group w-full max-w-[540px] sm:max-w-[580px] lg:max-w-none z-10 flex flex-col items-center animate-levitate">
              <div
                onClick={() => setModalScreen("/screenshot/hero-showcase.png")}
                className="relative w-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.012] rounded-2xl sm:rounded-3xl bg-[#02081d] dark:bg-transparent shadow-2xl shadow-blue-950/25 dark:shadow-none border border-slate-800/40 dark:border-0 p-0"
                title="Click to view full preview"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/screenshot/hero-showcase.png"
                  alt="HealthTrack App 3D Showcase with Smart Vitals, Medication, and Google Drive Cloud Sync"
                  className="hero-showcase-mask w-full h-auto select-none object-contain block transition-transform duration-500 group-hover:scale-[1.01]"
                  loading="eager"
                />
              </div>

              {/* 3D Realistic Contact Floor Shadow with Cyan-Purple Gradient */}
              <div className="w-[85%] h-6 bg-gradient-to-r from-sky-500/30 via-[#4848d2]/50 to-purple-500/40 blur-xl mx-auto -mt-3 rounded-full pointer-events-none animate-shadow-levitate" />
            </div>
          </div>
        </div>
      </section>


      {/* Animated Telemetry ECG Heartbeat Waveform Strip */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 overflow-hidden pointer-events-none select-none -mt-6 sm:-mt-8 mb-2 z-10" aria-hidden="true">
        <div className="flex items-center justify-between gap-4 mb-1 px-2 text-[10px] font-mono tracking-wider uppercase text-sky-500/70 dark:text-sky-400/80">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block -ml-3.5" />
            LIVE TELEMETRY • LEAD II
          </span>
          <span className="hidden sm:inline font-bold text-slate-400 dark:text-slate-500">25 mm/s • 10 mm/mV • HR 72 BPM</span>
        </div>
        <svg viewBox="0 0 1200 60" fill="none" className="w-full h-8 sm:h-11 opacity-70 dark:opacity-85">
          <defs>
            <linearGradient id="ecgGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#006AFA" stopOpacity="1" />
              <stop offset="75%" stopColor="#a855f7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
            </linearGradient>
            <filter id="ecgGlowFilter" x="-10%" y="-40%" width="120%" height="180%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M0,30 L180,30 Q195,30 200,24 Q205,30 220,30 L260,30 L270,35 L285,6 L300,54 L312,22 L322,34 L335,30 L370,30 Q385,30 395,20 Q405,30 420,30 L600,30 L780,30 Q795,30 800,24 Q805,30 820,30 L860,30 L870,35 L885,6 L900,54 L912,22 L922,34 L935,30 L970,30 Q985,30 995,20 Q1005,30 1020,30 L1200,30"
            stroke="url(#ecgGlowGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ecgGlowFilter)"
            className="animate-ecg"
          />
        </svg>
      </div>

      {/* Clinical standards strip */}
      <section aria-label="Clinical standards" className="px-4 sm:px-6 lg:px-8 relative z-10 pb-4">
        <div className="max-w-7xl mx-auto py-3 px-4 rounded-[8px] bg-white/60 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] backdrop-blur-md shadow-sm flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold">
          {["ADA Glucose", "AHA Blood Pressure", "WHO BMI", "GI Index 0–100", "VAS Pain 1–10", "Global Multi-Language"].map((b) => (
            <span key={b} className="px-3.5 py-1.5 rounded-[8px] bg-white dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-sm hover:border-[#006AFA]/40 hover:text-[#006AFA] dark:hover:text-sky-400 hover:scale-105 transition-all duration-200">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-7xl mx-auto rounded-[8px] p-7 sm:p-10 bg-gradient-to-b from-white/95 to-slate-50/90 dark:from-[#0B0F19]/90 dark:to-[#02081d]/90 border border-slate-200/90 dark:border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(0,106,250,0.12)] relative overflow-hidden">
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
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider text-[#006AFA] dark:text-sky-400 border border-[#006AFA]/30 bg-[#006AFA]/5 dark:bg-[#006AFA]/10 backdrop-blur-md shadow-sm mb-3">
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
                <div key={f.title} className="relative rounded-[8px] p-6 sm:p-7 bg-white/90 dark:bg-[#0B0F19]/80 border border-slate-200/90 dark:border-white/10 hover:border-[#006AFA]/50 hover:shadow-[0_20px_40px_-15px_rgba(0,106,250,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden card-glow-hover">
                  <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/30 dark:via-sky-400/20 to-transparent pointer-events-none" />
                  <div>
                    <div className={`w-12 h-12 rounded-[8px] border flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300 ${f.chip}`}>
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
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider text-[#006AFA] dark:text-sky-400 border border-[#006AFA]/30 bg-[#006AFA]/5 dark:bg-[#006AFA]/10 backdrop-blur-md shadow-sm mb-3">
              Vitals, exactly like the app
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">Tap a tab — same thresholds as Flutter.</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 max-w-lg">
              These are the literal constants from <code className="px-1.5 py-0.5 rounded-[8px] bg-slate-200/80 dark:bg-white/10 text-[11px] font-mono text-[#006AFA] dark:text-sky-300">AppConstants</code> and
              the Health tab segmented control (Sugar / Pressure / Weight / Body Map).
            </p>
            <div className="flex flex-wrap gap-2 mt-6 p-1.5 rounded-[8px] bg-slate-200/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] backdrop-blur-md w-fit" aria-label="Vitals tabs">
              {VITALS_TABS.map((t) => (
                <button
                  key={t.id}
                  aria-pressed={activeVital === t.id}
                  onClick={() => setActiveVital(t.id)}
                  className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-all duration-200 ${activeVital === t.id
                    ? "bg-[#006AFA] text-white shadow-md shadow-[#006AFA]/30 scale-[1.02]"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-[8px] border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/90 p-7 shadow-lg backdrop-blur-xl card-glow-hover transition-all duration-300">
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
          <div className="rounded-[8px] border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden card-glow-hover transition-all duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-[8px] bg-[#006AFA]/10 flex items-center justify-center text-[#006AFA] shadow-sm">
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
            <div className="mt-6 rounded-[8px] bg-amber-500/10 border border-amber-500/25 p-4 text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed shadow-sm">
              <strong>Clinical note:</strong> Fasting Normal ≤ 99 mg/dL • Post-Meal ≤ 139 • BP Normal &lt; 120/80 • BMI Normal &lt; 25 • GI Low ≤ 55. The app colors every reading Green / Amber / Red automatically.
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Anatomical Body Pain Map Showcase (Mapped from anatomical_body_map_sheet.dart) */}
      <section id="pain-map" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50/50 dark:bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 border border-rose-500/30 bg-rose-500/10 backdrop-blur-md shadow-sm mb-3">
              Anatomical Body Pain Map
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">Point to where it hurts. Zero guessing.</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              Tap specific anatomical regions on the 2D interactive model. Record VAS score (1–10), pain sensations, and aggravating factors for your doctor.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Body Visualizer Card */}
            <div className="lg:col-span-6 rounded-[8px] border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-rose-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Anatomical Selector
                  </span>
                </div>
                <div className="flex rounded-[8px] bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setPainBodyView("front")}
                    className={`px-3 py-1 rounded-[6px] text-xs font-bold transition-all ${painBodyView === "front"
                      ? "bg-rose-500 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                      }`}
                  >
                    Front View
                  </button>
                  <button
                    onClick={() => setPainBodyView("back")}
                    className={`px-3 py-1 rounded-[6px] text-xs font-bold transition-all ${painBodyView === "back"
                      ? "bg-rose-500 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                      }`}
                  >
                    Back View
                  </button>
                </div>
              </div>

              {/* Body Map Hotspot Buttons */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(painBodyView === "front"
                  ? [
                    "Head / Migraine",
                    "Cervical / Neck",
                    "Chest / Sternum",
                    "Epigastric / Stomach",
                    "Right Abdomen",
                    "Left Knee / Joint",
                    "Right Knee / Joint",
                    "Ankles & Feet",
                  ]
                  : [
                    "Occipital / Back of Head",
                    "Upper Trapezius",
                    "Thoracic Spine",
                    "Lower Lumbar Back",
                    "Gluteal / Sciatic",
                    "Hamstrings",
                    "Calf Muscles",
                    "Heels / Achilles",
                  ]
                ).map((zone) => {
                  const isSelected = selectedPainZone === zone;
                  return (
                    <button
                      key={zone}
                      onClick={() => setSelectedPainZone(zone)}
                      className={`p-3 rounded-[8px] text-left text-xs font-bold transition-all border ${isSelected
                        ? "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500 shadow-sm"
                        : "bg-slate-50/80 dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-rose-300"
                        }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-rose-500 animate-ping" : "bg-slate-400"}`} />
                        <span className="truncate">{zone}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 p-4 rounded-[8px] bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Selected Region</p>
                  <p className="font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5">{selectedPainZone}</p>
                </div>
                <Badge variant="outline" className="border-rose-400 text-rose-600 dark:text-rose-400 font-mono text-xs">
                  {painBodyView.toUpperCase()} MODEL
                </Badge>
              </div>
            </div>

            {/* Pain Intensity & Characteristics Form */}
            <div className="lg:col-span-6 rounded-[8px] border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Visual Analog Scale (VAS 1–10)
                  </label>
                  <span className="px-2.5 py-0.5 rounded-[6px] bg-rose-500 text-white text-xs font-black">
                    VAS {vasScore}/10
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={vasScore}
                  onChange={(e) => setVasScore(Number(e.target.value))}
                  className="w-full mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-semibold">
                  <span>1: Mild Discomfort</span>
                  <span>5: Moderate Pain</span>
                  <span>10: Emergency Severe</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2.5">
                  Pain Sensation Quality
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Throbbing", "Sharp / Stabbing", "Burning", "Dull Ache"].map((quality) => (
                    <button
                      key={quality}
                      onClick={() => setPainQuality(quality)}
                      className={`py-2 px-2.5 rounded-[8px] text-xs font-semibold text-center border transition-all ${painQuality === quality
                        ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-500 font-bold"
                        : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                        }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[8px] bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-4 space-y-2 text-xs">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Clinical Symptom Telemetry
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[12px]">
                  Logged with timestamps in local storage and synced to Supabase <code className="font-mono text-rose-500">symptom_records</code>. App automatically generates medical history charts for neurological or orthopedic visits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Preview / Demo Tools (from Blueprint Section 3) */}
      <section id="tools" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.015]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider text-[#006AFA] dark:text-sky-400 border border-[#006AFA]/30 bg-[#006AFA]/5 dark:bg-[#006AFA]/10 backdrop-blur-md shadow-sm mb-3">
              Interactive Clinical Calculators
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">Try our tools live before downloading</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              Same formulas, clinical thresholds, and automatic recommendations implemented in the mobile Flutter app.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Tool 1: BMI Calculator Widget */}
            <div className="rounded-[8px] border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/90 p-7 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-[#006AFA]" />
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Smart BMI Calculator</h3>
                  </div>
                  <Badge variant="outline" className="text-[11px] rounded-[6px] border-[#006AFA]/40 text-[#006AFA]">
                    WHO Standard
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Height ({bmiHeightCm} cm)
                    </label>
                    <input
                      type="range"
                      min={120}
                      max={220}
                      value={bmiHeightCm}
                      onChange={(e) => setBmiHeightCm(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#006AFA]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>120 cm</span>
                      <span>220 cm</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Weight ({bmiWeightKg} kg)
                    </label>
                    <input
                      type="range"
                      min={35}
                      max={160}
                      value={bmiWeightKg}
                      onChange={(e) => setBmiWeightKg(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#006AFA]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>35 kg</span>
                      <span>160 kg</span>
                    </div>
                  </div>
                </div>

                {/* Result Card */}
                <div className={`mt-6 p-5 rounded-[8px] ${bmiCategory.bg} border ${bmiCategory.border} transition-all`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                        Calculated Body Mass Index
                      </p>
                      <p className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                        {bmiValue} <span className="text-sm font-semibold text-slate-500">kg/m²</span>
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-[6px] text-xs font-black ${bmiCategory.color} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm`}>
                      {bmiCategory.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    {bmiCategory.advice}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Healthy Range: 18.5 – 24.9</span>
                <span>Automatic weight history in app</span>
              </div>
            </div>

            {/* Tool 2: Blood Sugar Converter & ADA Staging */}
            <div className="rounded-[8px] border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/90 p-7 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-sky-500" />
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Glucose Converter &amp; ADA Staging</h3>
                  </div>
                  <div className="flex rounded-[8px] bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => {
                        if (sugarUnit !== "mmol/L") {
                          setSugarUnit("mmol/L");
                          setSugarInput(Number((sugarInput / 18.0182).toFixed(1)));
                        }
                      }}
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-bold transition-all ${sugarUnit === "mmol/L" ? "bg-[#006AFA] text-white" : "text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      mmol/L
                    </button>
                    <button
                      onClick={() => {
                        if (sugarUnit !== "mg/dL") {
                          setSugarUnit("mg/dL");
                          setSugarInput(Math.round(sugarInput * 18.0182));
                        }
                      }}
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-bold transition-all ${sugarUnit === "mg/dL" ? "bg-[#006AFA] text-white" : "text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      mg/dL
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Blood Glucose Value ({sugarUnit})
                      </label>
                      <input
                        type="number"
                        step={sugarUnit === "mmol/L" ? "0.1" : "1"}
                        value={sugarInput}
                        onChange={(e) => setSugarInput(Number(e.target.value) || 0)}
                        className="w-full h-11 px-3.5 rounded-[8px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#006AFA]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Converted Value
                      </label>
                      <div className="h-11 px-3.5 rounded-[8px] bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center font-black text-lg text-[#006AFA] dark:text-sky-400">
                        {convertedSugarDisplay}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Clinical Measurement Context
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "fasting", label: "Fasting (8-12h)" },
                        { id: "postMeal", label: "Post-Meal (2h)" },
                        { id: "bedtime", label: "Bedtime (Night)" },
                      ].map((ctx) => (
                        <button
                          key={ctx.id}
                          onClick={() => setSugarContext(ctx.id as typeof sugarContext)}
                          className={`py-2 px-2 rounded-[8px] text-[11px] font-bold border transition-all ${sugarContext === ctx.id
                            ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-500"
                            : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                            }`}
                        >
                          {ctx.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ADA Evaluation */}
                  <div className={`p-4 rounded-[8px] ${sugarEvaluation.bg} border border-slate-200 dark:border-white/10 transition-all`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ADA Diagnostic Stage</span>
                      <span className={`font-black text-xs ${sugarEvaluation.color}`}>{sugarEvaluation.stage}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{sugarEvaluation.advice}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>ADA Clinical Criteria</span>
                <span>Auto-converts mmol/L ↔ mg/dL</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="reports" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-[#060b14] to-black text-white relative overflow-hidden border-y border-white/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider text-teal-300 border border-teal-500/30 bg-teal-500/10 backdrop-blur-md shadow-sm mb-3">
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
                <span key={p} className={`px-3 py-1.5 rounded-[8px] text-xs font-bold border transition-all ${i === 2 ? "bg-teal-400 text-slate-950 border-teal-300 shadow-md shadow-teal-500/30 scale-105" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"}`}>{p}</span>
              ))}
            </div>
          </div>
          <div className="rounded-[8px] bg-white text-slate-900 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(20,184,166,0.35)] border border-teal-500/20 relative card-glow-hover transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-teal-700">HealthTrack Medical Telemetry Report</p>
                <p className="text-xs text-slate-500 mt-1">REPORT ID • Confidential • Physician sign-off included</p>
              </div>
              <div className="w-12 h-12 rounded-[8px] bg-teal-50 flex items-center justify-center border border-teal-100 shadow-sm">
                <Stethoscope className="w-7 h-7 text-teal-600" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-5 text-center">
              {[
                ["Avg Fasting", "96 mg/dL", "Target 70–99"],
                ["Avg BP", "118/76", "Normal"],
                ["Adherence", "92%", "1,240 doses"],
              ].map(([k, v, s]) => (
                <div key={k} className="rounded-[8px] border border-slate-200/90 bg-slate-50/80 p-3 hover:border-teal-500/50 hover:bg-teal-50/30 transition-all">
                  <p className="text-[10px] font-bold uppercase text-slate-500">{k}</p>
                  <p className="text-lg font-black mt-0.5">{v}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">{s}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 mt-5">
              <span className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-5 rounded-[8px] bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-teal-700/25 hover:shadow-teal-700/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                <FileText className="w-4 h-4" /> Download PDF
              </span>
              <span className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-5 rounded-[8px] bg-gradient-to-r from-[#107C41] to-[#149950] hover:from-[#149950] hover:to-[#17a858] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#107C41]/25 hover:shadow-[#107C41]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                <FileSpreadsheet className="w-4 h-4" /> Excel .xlsx
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 text-center">Same buttons, same teal + Excel-green as the Flutter report page.</p>
          </div>
        </div>
      </section>



      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-white/[0.015] border-y border-slate-200/80 dark:border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider text-[#006AFA] dark:text-sky-400 border border-[#006AFA]/30 bg-[#006AFA]/5 dark:bg-[#006AFA]/10 backdrop-blur-md shadow-sm mb-3">
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



      {/* Security & Privacy Assurance (from Blueprint Section 4) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.015]">
        <div className="max-w-7xl mx-auto rounded-[8px] border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/90 p-8 sm:p-12 shadow-xl backdrop-blur-xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                Your Data, Your Ownership
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Complete Data Privacy with Google Drive Medical Vault
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                We believe your clinical records belong exclusively to you. HealthTrack stores vitals locally on your device and provides direct zero-knowledge backup to your personal <strong>Google Drive</strong> account under <code className="font-mono text-xs text-[#006AFA]">NutriHealth Medical Vault</code>. We never sell or share biometric telemetry.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {[
                  ["AES-256", "Military grade data encryption"],
                  ["Google Drive API", "Direct user-owned cloud backups"],
                  ["Offline-First", "Fully functional without internet"],
                  ["GDPR Compliant", "Instant 1-click permanent wipe"],
                ].map(([title, desc]) => (
                  <div key={title} className="p-3 rounded-[8px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                    <p className="font-bold text-xs text-slate-900 dark:text-white">{title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-[8px] bg-gradient-to-br from-[#006AFA]/10 to-emerald-500/10 border border-[#006AFA]/20 text-center">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center text-[#006AFA] mb-4">
                <Cloud className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Encrypted Google Vault</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs">
                Back up prescriptions, lab reports and blood sugar logs directly to your personal Google cloud in 1 click.
              </p>
              <a
                href="#download"
                className="mt-5 inline-flex items-center justify-center h-11 px-5 rounded-[8px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white hover:border-[#006AFA] transition-all shadow-sm"
              >
                Learn More in App
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-white/[0.015] border-y border-slate-200/80 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider text-[#006AFA] dark:text-sky-400 border border-[#006AFA]/30 bg-[#006AFA]/5 dark:bg-[#006AFA]/10 backdrop-blur-md shadow-sm mb-3">
              Got questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">Frequently asked questions</h2>
          </div>
          <div className="space-y-3.5">
            {FAQS.map((f, i) => {
              const open = activeFaq === i;
              return (
                <div key={i} className={`rounded-[8px] border bg-white/95 dark:bg-[#0a0e18]/95 overflow-hidden shadow-sm transition-all duration-200 ${open ? "border-[#006AFA]/60 shadow-md ring-1 ring-[#006AFA]/20 dark:border-sky-500/50" : "border-slate-200/90 dark:border-white/10 hover:border-[#006AFA]/40"}`}>
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
        <div className="max-w-5xl mx-auto rounded-[8px] p-8 sm:p-14 bg-gradient-to-br from-[#020b18] via-[#051329] to-[#040817] text-white border border-[#006AFA]/40 shadow-[0_30px_70px_-15px_rgba(0,106,250,0.35)] text-center relative overflow-hidden card-glow-hover">
          <div className="absolute -top-32 -left-32 w-72 h-72 bg-[#006AFA]/30 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-sky-500/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-[8px] overflow-hidden bg-white p-1.5 shadow-2xl border border-white/30 hover:scale-105 transition-transform duration-300">
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
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3.5 h-16 px-6 rounded-[8px] bg-black/90 hover:bg-neutral-900 border border-white/20 hover:border-sky-500/80 shadow-lg hover:shadow-sky-500/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
              >
                <Download className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="leading-none">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Get for Android</span>
                  <span className="text-sm font-bold block mt-1">Google Play Store</span>
                </span>
              </a>
              <div
                className="inline-flex items-center gap-3.5 h-16 px-6 rounded-[8px] bg-black/60 border border-white/10 opacity-90 select-none shadow-lg cursor-default"
                title="iOS version is upcoming on the App Store"
              >
                <Smartphone className="w-5 h-5 text-slate-400 shrink-0" />
                <span className="leading-none">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Get for iPhone</span>
                  <span className="text-sm font-bold block mt-1 flex items-center gap-2">
                    <span>App Store</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wide">
                      Upcoming
                    </span>
                  </span>
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              HealthTrack is officially available on Google Play. The iOS App Store release is upcoming — feel free to email <span className="text-slate-200 font-semibold">info@appstick.com.bd</span> for early access or inquiries. No spam, ever.
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
      {/* Footer matching https://bloodbank.appstick.com.bd/ */}
      <footer className="bg-transparent dark:bg-[#050811] pt-14 pb-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-[8px] overflow-hidden bg-white border border-slate-200 dark:border-white/10 p-0.5 shadow-sm flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpeg" alt="HealthTrack Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white uppercase">
                  HEALTH <span className="text-[#006AFA]">TRACK</span>
                </span>
                <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                  Smart Care. Save Lives.
                </p>
              </div>
            </Link>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The smart digital clinical vitals &amp; chronic care companion. Connecting patients with clinical tracking, Google Drive medical vault, and instant doctor telemetry reports.
            </p>
          </div>

          {/* Solutions Column */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Solutions
            </h4>
            <ul className="space-y-3 text-xs sm:text-[13px] text-slate-600 dark:text-slate-400">
              <li>
                <a href="#vitals" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
                  Smart Vitals Tracker
                </a>
              </li>
              <li>
                <a href="#pain-map" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
                  2D Anatomical Body Map
                </a>
              </li>
              <li>
                <a href="#tools" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
                  Clinical BMI &amp; Sugar Tools
                </a>
              </li>
              <li>
                <a href="#reports" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
                  Doctor Telemetry PDF
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
                  Medication &amp; Routine Alarms
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
                  Google Drive Cloud Vault
                </a>
              </li>
            </ul>
          </div>

          {/* Guides & Blog Column */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Guides &amp; Blog
            </h4>
            <ul className="space-y-3 text-xs sm:text-[13px] text-slate-600 dark:text-slate-400">
              <li>
                <a href="#faq" className="font-bold text-slate-900 dark:text-white hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
                  All Guides &amp; Medical Blog
                </a>
              </li>
              <li>
                <a href="#tools" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
                  Blood Sugar Staging Criteria
                </a>
              </li>
              <li>
                <a href="#vitals" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
                  AHA Blood Pressure Ranges
                </a>
              </li>
              <li>
                <a href="#tools" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
                  BMI &amp; Nutrition Estimator
                </a>
              </li>
              <li>
                <a href="#reports" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
                  Hospital Emergency Protocol
                </a>
              </li>
              <li>
                <a href="#vitals" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
                  Clinical Telemetry &amp; Safety Standards
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} HealthTrack. All rights reserved.</p>

          <div className="flex items-center gap-2">
            <Link href="/privacy-policy" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-of-service" className="hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors">
              Terms of Service
            </Link>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span>Powered by</span>
            <a
              href="https://appstick.com.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-900 dark:text-white hover:text-[#006AFA] transition-colors"
            >
              Appstick
            </a>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      {modalScreen && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" onClick={() => setModalScreen(null)} role="dialog" aria-modal="true" aria-label="Fullscreen screenshot">
          <div className="relative max-w-4xl w-full bg-slate-950/90 rounded-2xl overflow-hidden shadow-2xl border border-white/20 p-2 sm:p-3" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalScreen(null)} aria-label="Close preview" className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={modalScreen} alt="Fullscreen app preview" className="w-full h-auto max-h-[85vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
