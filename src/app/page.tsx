"use client";

import * as React from "react";
import Link from "next/link";
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  Download,
  CheckCircle2,
  Sparkles,
  Apple,
  Pill,
  Users2,
  FileText,
  Flame,
  Bell,
  Clock,
  ChevronDown,
  Lock,
  Search,
  ChevronRight,
  Star,
  Check,
  TrendingDown,
  Stethoscope,
  ChevronLeft,
  Play,
  Pause,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(0);
  const [foodSearch, setFoodSearch] = React.useState("");
  const [selectedFoodCategory, setSelectedFoodCategory] = React.useState("ALL");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Dynamic Multi-Tab Mobile App Screens captured from live Flutter app
  const APP_SCREENS = [
    {
      id: "home",
      label: "Home",
      tagline: "Daily Habit & Vitality Score Tracker",
      icon: HeartPulse,
      image: "/app_screen_clean.png",
      badgeTop: {
        icon: TrendingDown,
        color: "text-emerald-600 dark:text-emerald-400",
        title: "-35% Glucose Spikes",
        subtitle: "with 7-Day Habit Streak",
      },
      badgeBottom: {
        icon: Star,
        color: "text-amber-500",
        fill: true,
        title: "4.9 / 5.0 (10K+ Reviews)",
        subtitle: "Doctor Endorsed",
      },
    },
    {
      id: "vitals",
      label: "Vitals",
      tagline: "Clinical Glucose & BP Staging",
      icon: Activity,
      image: "/tab_health.png",
      badgeTop: {
        icon: CheckCircle2,
        color: "text-sky-600 dark:text-sky-400",
        title: "ADA Standard Targets",
        subtitle: "Fasting 70-99 mg/dL (3.9-5.5)",
      },
      badgeBottom: {
        icon: ShieldCheck,
        color: "text-teal-600 dark:text-teal-400",
        fill: false,
        title: "Instant Risk Staging",
        subtitle: "WHO & AHA Guidelines",
      },
    },
    {
      id: "meals",
      label: "Meals",
      tagline: "Nutrition & Macro Calorie Planner",
      icon: Apple,
      image: "/tab_meals.png",
      badgeTop: {
        icon: Sparkles,
        color: "text-teal-600 dark:text-teal-400",
        title: "1,800 kcal Precision Target",
        subtitle: "Automated Nutrition Goals",
      },
      badgeBottom: {
        icon: Check,
        color: "text-emerald-600 dark:text-emerald-400",
        fill: false,
        title: "Meal Timing Alerts",
        subtitle: "Breakfast • Lunch • Snack",
      },
    },
    {
      id: "meds",
      label: "Meds",
      tagline: "Smart Drug Prescriptions & Dose Alarms",
      icon: Pill,
      image: "/tab_meds.png",
      badgeTop: {
        icon: Clock,
        color: "text-purple-600 dark:text-purple-400",
        title: "Timely Intake Alarms",
        subtitle: "Morning, Lunch & Bedtime",
      },
      badgeBottom: {
        icon: Bell,
        color: "text-indigo-600 dark:text-indigo-400",
        fill: false,
        title: "Never Miss a Dose",
        subtitle: "Refill Countdowns Active",
      },
    },
    {
      id: "profile",
      label: "Profile",
      tagline: "Emergency Medical ID & Family Caregivers",
      icon: Users2,
      image: "/tab_profile.png",
      badgeTop: {
        icon: Stethoscope,
        color: "text-rose-600 dark:text-rose-400",
        title: "Emergency Medical ID",
        subtitle: "Blood Type O+ • BMI 24.2",
      },
      badgeBottom: {
        icon: Users2,
        color: "text-sky-600 dark:text-sky-400",
        fill: false,
        title: "Family Caregiver Sync",
        subtitle: "Multi-Profile Protected",
      },
    },
  ];

  const [activeScreenIndex, setActiveScreenIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  React.useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveScreenIndex((prev) => (prev + 1) % APP_SCREENS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, APP_SCREENS.length]);

  // Sample Interactive Foods for the "Can I Eat?" Demo
  const DEMO_FOODS = [
    {
      name: "Steamed Brown Rice",
      category: "Grains",
      portion: "1 medium bowl (100g)",
      gi: 50,
      giCat: "Low",
      calories: 111,
      carbs: 23,
      isDiabetic: true,
      isBP: true,
      tip: "Rich in complex fiber and manganese. Absorbs slowly, avoiding sudden glucose spikes.",
    },
    {
      name: "Baked Salmon Fillet",
      category: "Fish & Protein",
      portion: "1 fillet (150g)",
      gi: 0,
      giCat: "Zero",
      calories: 208,
      carbs: 0,
      isDiabetic: true,
      isBP: true,
      tip: "Rich in Omega-3 EPA/DHA supporting cardiovascular elasticity and arterial health.",
    },
    {
      name: "Fresh Green Spinach",
      category: "Vegetables",
      portion: "1 cup cooked (180g)",
      gi: 15,
      giCat: "Low",
      calories: 23,
      carbs: 3.6,
      isDiabetic: true,
      isBP: true,
      tip: "High natural potassium and magnesium that assist healthy blood pressure balance.",
    },
    {
      name: "Granny Smith Green Apple",
      category: "Fruits",
      portion: "1 small apple (120g)",
      gi: 39,
      giCat: "Low",
      calories: 52,
      carbs: 14,
      isDiabetic: true,
      isBP: true,
      tip: "High pectin soluble fiber delays gastric carbohydrate absorption.",
    },
    {
      name: "Raw Unsalted Almonds",
      category: "Nuts & Seeds",
      portion: "10-12 nuts (28g)",
      gi: 10,
      giCat: "Low",
      calories: 164,
      carbs: 6,
      isDiabetic: true,
      isBP: true,
      tip: "Monounsaturated healthy fats providing prolonged satiety and stabilizing insulin.",
    },
    {
      name: "Refined White Flour Paratha",
      category: "Grains",
      portion: "1 large piece (120g)",
      gi: 78,
      giCat: "High",
      calories: 340,
      carbs: 45,
      isDiabetic: false,
      isBP: false,
      tip: "High glycemic load with saturated oil causes rapid sugar spikes and elevated arterial pressure.",
    },
  ];

  const filteredDemoFoods = DEMO_FOODS.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(foodSearch.toLowerCase());
    const matchCat = selectedFoodCategory === "ALL" || f.category === selectedFoodCategory;
    return matchSearch && matchCat;
  });

  const faqs = [
    {
      q: "Does NutriHealth support both mmol/L and mg/dL for blood sugar?",
      a: "Yes! NutriHealth automatically detects and supports both international standards (mmol/L used in the UK, Bangladesh, Europe, and Canada) and mg/dL (used in the US). You can set your preferred unit in Settings, and the app seamlessly converts benchmarks (3.9–5.5 mmol/L / 70–99 mg/dL).",
    },
    {
      q: "How does the 'Can I Eat?' food guidance feature work?",
      a: "Our clinical nutrition database checks the Glycemic Index (GI), Glycemic Load, and sodium density of foods. It alerts you whether a food is diabetic-safe, low-sodium for hypertension, gluten-free, or renal-friendly, along with dietitian advice.",
    },
    {
      q: "Can I manage health tracking for my parents or family members?",
      a: "Absolutely. With Multi-Profile Dependent Care, you can create and monitor multiple profiles (e.g. Parents, Spouse, Children) under a single account, complete with separate medication schedules and vitals logs.",
    },
    {
      q: "How do I share health reports with my doctor?",
      a: "NutriHealth provides one-click PDF and CSV clinical export. It organizes your 7-day, 30-day, or 90-day glucose trends, blood pressure averages, medication compliance, and symptom history into clean doctor-ready reports.",
    },
    {
      q: "Is my personal biometric and medical data secure?",
      a: "Yes. All biometrics and health logs are encrypted using enterprise-grade 256-bit encryption with Supabase PostgreSQL cloud infrastructure. Your health data is strictly private and never sold to third parties.",
    },
    {
      q: "Can I use the app for free without subscribing?",
      a: "Yes! NutriHealth has a generous Forever-Free tier that includes full vital biometrics tracking (glucose, BP, weight), basic medication reminders, and food search. Pro tiers unlock unlimited family dependents, advanced analytics, and doctor exports.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden transition-colors duration-200">
      {/* Ambient Glow & Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <span className="block absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-500/20 dark:via-teal-600/5 rounded-full blur-[140px] opacity-80" />
        <span className="block absolute top-[30%] -left-60 w-[550px] h-[550px] bg-teal-500/5 dark:bg-teal-600/10 rounded-full blur-[160px]" />
        <span className="block absolute top-[60%] -right-60 w-[550px] h-[550px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[160px]" />
        <span
          className="block absolute inset-0 opacity-[0.03] dark:opacity-[0.025]"
          style={{
            backgroundSize: "40px 40px",
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. FIXED NAVBAR */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-[#07090e]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.08] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200 flex items-center justify-center text-white shrink-0">
              <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-950 dark:text-white uppercase">
                  NUTRI<span className="text-emerald-600 dark:text-emerald-400">HEALTH</span>
                </span>
                <span className="hidden xs:inline-block text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30">
                  App
                </span>
              </div>
              <p className="hidden xs:block text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight -mt-0.5">
                Smart Care • Clinical Precision
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#home" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Home
            </a>
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Features
            </a>
            <a href="#food-inspector" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Can I Eat?
            </a>
            <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Theme Toggle (Light / Dark / System) */}
            <div className="flex items-center justify-center border border-slate-200 dark:border-white/10 rounded-xl bg-slate-100/80 dark:bg-white/[0.05]">
              <ThemeToggle />
            </div>

            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/10 transition-all"
            >
              <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Admin Portal</span>
            </Link>

            <a
              href="#download"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-700 shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer"
            >
              <span className="hidden xs:inline">Download</span>
              <span className="xs:hidden">Get</span>
              <span>App</span>
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Download className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </div>
            </a>

            {/* Mobile Drawer Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
            >
              <ChevronDown className={`h-5 w-5 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-4 bg-white/95 dark:bg-[#0a0d17]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 space-y-2 text-sm shadow-2xl">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200 font-medium"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200 font-medium"
            >
              Features
            </a>
            <a
              href="#food-inspector"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200 font-medium"
            >
              Can I Eat? Food Guide
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200 font-medium"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200 font-medium"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200 font-medium"
            >
              FAQ
            </a>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-emerald-600 dark:text-emerald-400 font-semibold border-t border-slate-100 dark:border-white/5 pt-3"
            >
              Admin Portal Sign In &rarr;
            </Link>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section id="home" className="relative pt-24 sm:pt-36 pb-14 sm:pb-24 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-500/10 shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>PERSONAL HEALTH & NUTRITION ASSISTANT</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.14] text-slate-950 dark:text-white">
                Track Glucose, Blood Pressure & Food with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-300 dark:to-white">
                  Clinical Precision.
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                The smart daily health companion designed for diabetes, hypertension, and family wellness. Log vital readings, inspect food glycemic safety with <em>&quot;Can I Eat?&quot;</em>, schedule medication alarms, and keep family members protected.
              </p>

              {/* App Store / Google Play Badges */}
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 pt-2">
                <a
                  href="#download"
                  className="inline-flex items-center justify-center gap-3.5 px-5 py-2.5 sm:py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white border border-slate-800 shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-150 group cursor-pointer"
                >
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 group-hover:scale-105 transition-transform duration-150" viewBox="0 0 512 512">
                    <path fill="#4285F4" d="M48.7 18.5c-4.8 5.2-7.7 13-7.7 23v429c0 10 2.9 17.8 7.7 23l2.4 2.4L275 272v-5.8L51.1 16.1l-2.4 2.4z" />
                    <path fill="#FFBA00" d="M350.8 347.8l-75.8-75.8V266l75.8-75.8 1.8 1 89.8 51.1c25.7 14.6 25.7 38.5 0 53.1l-89.8 51.1-1.8 1.4z" />
                    <path fill="#00E676" d="M275 266.2L51.1 490.1c8.4 8.9 22.3 9.9 37.9 1.1l263.6-149.8-77.6-75.2z" />
                    <path fill="#FF3D00" d="M275 266.2l77.6-75.2L89 41.2c-15.6-8.9-29.5-7.8-37.9 1.1L275 266.2z" />
                  </svg>
                  <div className="text-left flex flex-col justify-center leading-none">
                    <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">GET IT ON</span>
                    <span className="text-sm sm:text-base font-bold text-white tracking-tight mt-1">Google Play</span>
                  </div>
                </a>

                <a
                  href="#download"
                  className="inline-flex items-center justify-center gap-3.5 px-5 py-2.5 sm:py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white border border-slate-800 shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-150 group cursor-pointer"
                >
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-white shrink-0 group-hover:scale-105 transition-transform duration-150" viewBox="0 0 384 512">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <div className="text-left flex flex-col justify-center leading-none">
                    <span className="text-[10px] text-slate-400 font-medium tracking-wide">Download on the</span>
                    <span className="text-sm sm:text-base font-bold text-white tracking-tight mt-1">App Store</span>
                  </div>
                </a>
              </div>

              {/* Trust Badges Chips */}
              <div className="pt-2 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> Auto mmol/L & mg/dL
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> Instant Vital Alerts
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> Multi-Family Profiles
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> Cloud Sync & Backup
                </span>
              </div>
            </div>

            {/* Right Mobile Phone Device Mockup with Real App Screenshot (Framed Professionally & Dynamically Interactive) */}
            <div 
              className="lg:col-span-6 relative flex flex-col items-center justify-center py-4 sm:py-6"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Interactive Tab Switcher Pill Bar (Responsive with horizontal touch swipe) */}
              <div className="w-full max-w-[280px] xs:max-w-[340px] sm:max-w-none flex items-center justify-start sm:justify-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 shadow-xl backdrop-blur-xl mb-3 z-30 transition-all overflow-x-auto no-scrollbar scroll-smooth">
                {APP_SCREENS.map((screen, idx) => {
                  const Icon = screen.icon;
                  const isActive = activeScreenIndex === idx;
                  return (
                    <button
                      key={screen.id}
                      type="button"
                      onClick={() => {
                        setActiveScreenIndex(idx);
                        setIsAutoPlaying(false);
                      }}
                      className={`shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>{screen.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tagline for active screen */}
              <div className="mb-3 sm:mb-4 text-center h-5">
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide transition-all">
                  {APP_SCREENS[activeScreenIndex].tagline}
                </span>
              </div>

              {/* Phone Frame Container with Floating Chips */}
              <div className="relative flex items-center justify-center w-full">
                {/* Floating Chip 1: Dynamic Top-Left (Desktop/Tablet) */}
                <div className="hidden sm:flex absolute top-10 -left-4 lg:-left-12 z-30 items-center gap-3 p-3.5 rounded-2xl bg-white/95 dark:bg-[#0f1422]/95 border border-slate-200/90 dark:border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300">
                  <div className={`h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center ${APP_SCREENS[activeScreenIndex].badgeTop.color} shrink-0`}>
                    {React.createElement(APP_SCREENS[activeScreenIndex].badgeTop.icon, { className: "h-5 w-5" })}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {APP_SCREENS[activeScreenIndex].badgeTop.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {APP_SCREENS[activeScreenIndex].badgeTop.subtitle}
                    </p>
                  </div>
                </div>

                {/* Floating Chip 2: Dynamic Bottom-Right (Desktop/Tablet) */}
                <div className="hidden sm:flex absolute bottom-12 -right-4 lg:-right-12 z-30 items-center gap-3 p-3.5 rounded-2xl bg-white/95 dark:bg-[#0f1422]/95 border border-slate-200/90 dark:border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                    {React.createElement(APP_SCREENS[activeScreenIndex].badgeBottom.icon, {
                      className: `h-5 w-5 ${APP_SCREENS[activeScreenIndex].badgeBottom.fill ? "fill-amber-500" : ""}`,
                    })}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {APP_SCREENS[activeScreenIndex].badgeBottom.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {APP_SCREENS[activeScreenIndex].badgeBottom.subtitle}
                    </p>
                  </div>
                </div>

                {/* Realistic Premium Smartphone Mockup Frame (Optimized width for all devices) */}
                <div className="relative z-10 w-full max-w-[270px] xs:max-w-[305px] sm:max-w-[335px] rounded-[48px] xs:rounded-[52px] p-2.5 sm:p-3 bg-gradient-to-b from-slate-800 via-slate-950 to-slate-900 border-[5px] sm:border-[6px] border-slate-700/80 shadow-[0_25px_80px_-15px_rgba(16,185,129,0.35)] ring-1 ring-white/15 shrink-0 flex flex-col group transition-transform duration-300 hover:scale-[1.01]">
                  {/* Dynamic Island / Speaker Notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-22 sm:w-26 h-4 sm:h-4.5 bg-black rounded-full z-30 flex items-center justify-center pointer-events-none shadow-md">
                    <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-neutral-900 border border-neutral-700 mr-2" />
                    <div className="w-7 sm:w-8 h-1 bg-neutral-800 rounded-full" />
                  </div>

                  {/* Inner Screen Display with Active Screen Screenshot */}
                  <div className="rounded-[38px] xs:rounded-[40px] overflow-hidden w-full aspect-[720/1565] bg-[#F8FAFC] relative shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={APP_SCREENS[activeScreenIndex].id}
                      src={APP_SCREENS[activeScreenIndex].image}
                      alt={APP_SCREENS[activeScreenIndex].tagline}
                      className="w-full h-full object-cover object-top select-none pointer-events-none transition-opacity duration-300 animate-fadeIn"
                      loading="eager"
                    />
                    {/* Subtle Screen Glass Reflection Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Mobile Screen Insight Badges (Visible on small screens < 640px) */}
              <div className="sm:hidden grid grid-cols-2 gap-2 w-full max-w-[290px] mt-4 z-20">
                <div className="p-2.5 rounded-xl bg-white/95 dark:bg-[#0f1422]/95 border border-slate-200/90 dark:border-white/10 shadow-md text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={`p-1 rounded-md bg-emerald-500/10 ${APP_SCREENS[activeScreenIndex].badgeTop.color} shrink-0`}>
                      {React.createElement(APP_SCREENS[activeScreenIndex].badgeTop.icon, { className: "h-3.5 w-3.5" })}
                    </div>
                    <p className="text-[10px] font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">
                      {APP_SCREENS[activeScreenIndex].badgeTop.title}
                    </p>
                  </div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">
                    {APP_SCREENS[activeScreenIndex].badgeTop.subtitle}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/95 dark:bg-[#0f1422]/95 border border-slate-200/90 dark:border-white/10 shadow-md text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="p-1 rounded-md bg-amber-500/10 text-amber-500 shrink-0">
                      {React.createElement(APP_SCREENS[activeScreenIndex].badgeBottom.icon, {
                        className: `h-3.5 w-3.5 ${APP_SCREENS[activeScreenIndex].badgeBottom.fill ? "fill-amber-500" : ""}`,
                      })}
                    </div>
                    <p className="text-[10px] font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">
                      {APP_SCREENS[activeScreenIndex].badgeBottom.title}
                    </p>
                  </div>
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight line-clamp-1">
                    {APP_SCREENS[activeScreenIndex].badgeBottom.subtitle}
                  </p>
                </div>
              </div>

              {/* Slider Bottom Controls (Dots + Prev/Next + AutoPlay Indicator) */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-4 sm:mt-5 z-20">
                <button
                  type="button"
                  aria-label="Previous screen"
                  onClick={() => {
                    setActiveScreenIndex((prev) => (prev === 0 ? APP_SCREENS.length - 1 : prev - 1));
                    setIsAutoPlaying(false);
                  }}
                  className="p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-110 transition-all cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  {APP_SCREENS.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      aria-label={`Go to screen ${dotIdx + 1}`}
                      onClick={() => {
                        setActiveScreenIndex(dotIdx);
                        setIsAutoPlaying(false);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeScreenIndex === dotIdx
                          ? "w-6 bg-emerald-600 dark:bg-emerald-400"
                          : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Next screen"
                  onClick={() => {
                    setActiveScreenIndex((prev) => (prev + 1) % APP_SCREENS.length);
                    setIsAutoPlaying(false);
                  }}
                  className="p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-110 transition-all cursor-pointer shadow-sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  title={isAutoPlaying ? "Pause auto-rotation" : "Resume auto-rotation"}
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="ml-1 p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer shadow-sm text-[10px]"
                >
                  {isAutoPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIX PILLARS BADGES STRIP */}
      {/* ========================================================================= */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-white/10 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-2xl transition-colors duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 text-center">
              {[
                { title: "Smart\nBiometrics", icon: HeartPulse, color: "text-emerald-600 dark:text-emerald-400", href: "#features" },
                { title: "Can I Eat?\nFood Guide", icon: Apple, color: "text-teal-600 dark:text-teal-400", href: "#food-inspector" },
                { title: "Medicine\nAlarms", icon: Pill, color: "text-purple-600 dark:text-purple-400", href: "#features" },
                { title: "Multi-Profile\nFamily Care", icon: Users2, color: "text-sky-600 dark:text-sky-400", href: "#features" },
                { title: "Doctor\nPDF Reports", icon: FileText, color: "text-amber-600 dark:text-amber-400", href: "#features" },
                { title: "Pain & Symptom\nTracker", icon: Flame, color: "text-rose-600 dark:text-rose-400", href: "#features" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.href}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-all duration-150 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-500 group-hover:bg-emerald-500/20 transition-all duration-150 shadow-md">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="mt-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors whitespace-pre-line leading-tight">
                      {item.title}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CORE FEATURES (BENTO GRID) */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              WHY CHOOSE NUTRIHEALTH?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white mt-2 leading-tight">
              Everything Your Body Needs, <br />
              <span className="text-emerald-600 dark:text-emerald-400">All in One Powerful App</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
              Engineered with medical standards to simplify disease management and elevate daily well-being.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group rounded-3xl p-7 bg-white dark:bg-[#0B0F19]/80 border border-slate-200/90 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:shadow-xl dark:hover:bg-slate-900/90 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-200 shadow-lg shadow-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <HeartPulse className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Dual Unit Glycemic Analytics
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Seamlessly log in <strong>mmol/L</strong> or <strong>mg/dL</strong>. Real-time ADA classification highlights Fasting, Post-Meal, and Bedtime targets with instant hypoglycemia or spike notifications.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span>ADA & WHO benchmarks compliant</span> &rarr;
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-3xl p-7 bg-white dark:bg-[#0B0F19]/80 border border-slate-200/90 dark:border-white/10 hover:border-teal-500/50 dark:hover:border-teal-500/40 hover:shadow-xl dark:hover:bg-slate-900/90 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-200 shadow-lg shadow-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Apple className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  &quot;Can I Eat?&quot; Clinical Nutrition Guide
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Never guess meal safety again. Search 500+ foods with instant <strong>Glycemic Index (GI)</strong>, net carbs, diabetic suitability, and low-sodium hypertension guidance.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1">
                <span>Instant food safety indicators</span> &rarr;
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-3xl p-7 bg-white dark:bg-[#0B0F19]/80 border border-slate-200/90 dark:border-white/10 hover:border-purple-500/50 dark:hover:border-purple-500/40 hover:shadow-xl dark:hover:bg-slate-900/90 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-200 shadow-lg shadow-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Pill className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Smart Prescriptions & Dose Alarms
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Master drug directory with dosage forms (tablets, syrups, insulin). Schedule morning, lunch, and bedtime times with <em>before/after meal</em> instructions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                <span>Refill countdowns & missed dose alerts</span> &rarr;
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-3xl p-7 bg-white dark:bg-[#0B0F19]/80 border border-slate-200/90 dark:border-white/10 hover:border-sky-500/50 dark:hover:border-sky-500/40 hover:shadow-xl dark:hover:bg-slate-900/90 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-sky-500/20 transition-all duration-200 shadow-lg shadow-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Users2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Family Multi-Profile & Dependents
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Care for elderly parents or children with managed dependent profiles. View vitals trends remotely and send secure family account invitations.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1">
                <span>Multi-account linked monitoring</span> &rarr;
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-3xl p-7 bg-white dark:bg-[#0B0F19]/80 border border-slate-200/90 dark:border-white/10 hover:border-amber-500/50 dark:hover:border-amber-500/40 hover:shadow-xl dark:hover:bg-slate-900/90 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-200 shadow-lg shadow-amber-500/10 text-amber-600 dark:text-amber-400">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Doctor-Ready PDF & CSV Reports
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Export formatted 30-day clinical summaries with graphical sugar logs, blood pressure staging (AHA/ACC), BMI trajectory, and doctor notes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <span>Clean print & WhatsApp doctor export</span> &rarr;
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-3xl p-7 bg-white dark:bg-[#0B0F19]/80 border border-slate-200/90 dark:border-white/10 hover:border-rose-500/50 dark:hover:border-rose-500/40 hover:shadow-xl dark:hover:bg-slate-900/90 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all duration-200 shadow-lg shadow-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Flame className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  Visual Pain & Symptom Heatmap
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Pinpoint pain locations across front/back anatomical body regions with standardized Visual Analog Scale (VAS 1-10) and aggravating factors.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                <span>Track frequency and pain relief</span> &rarr;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE "CAN I EAT?" NUTRITION DEMO */}
      {/* ========================================================================= */}
      <section id="food-inspector" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-slate-100/60 dark:bg-white/[0.015] border-y border-slate-200/80 dark:border-white/5 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              INTERACTIVE PREVIEW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mt-2 leading-tight">
              Test the &quot;Can I Eat?&quot; Engine Live
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2">
              Search or filter everyday foods below to see instant clinical glycemic index and condition safety.
            </p>
          </div>

          {/* Interactive Search Bar & Categories */}
          <div className="max-w-3xl mx-auto space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search food e.g. Brown Rice, Spinach, Salmon, Apple..."
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
            </div>

            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 text-xs">
              {["ALL", "Grains", "Fish & Protein", "Vegetables", "Fruits", "Nuts & Seeds"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFoodCategory(cat)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                    selectedFoodCategory === cat
                      ? "bg-teal-600 text-white dark:bg-teal-500 dark:text-black font-bold shadow-md shadow-teal-500/20"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Food Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {filteredDemoFoods.map((food, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-[#0a0e18] border border-slate-200/90 dark:border-white/10 hover:border-teal-500/50 dark:hover:border-teal-500/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{food.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{food.portion}</p>
                    </div>
                    <Badge
                      variant={
                        food.giCat === "Low" || food.giCat === "Zero"
                          ? "success"
                          : food.giCat === "Medium"
                          ? "warning"
                          : "danger"
                      }
                      className="text-[10px]"
                    >
                      GI: {food.gi} ({food.giCat})
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">{food.tip}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    {food.isDiabetic ? (
                      <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                        <Check className="h-3 w-3" /> Diabetic Safe
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                        ✕ High Glycemic
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] shrink-0">
                    {food.calories} kcal • {food.carbs}g carbs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW IT WORKS (ROADMAP 01 - 04) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white mt-2 leading-tight">
              Simple Steps to Lifelong Vitality
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
              Built to take less than 60 seconds of your day while delivering maximum health protection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              {
                step: "01",
                title: "Download & Setup",
                desc: "Install NutriHealth, set your glucose units (mmol/L or mg/dL), and configure conditions.",
                icon: Download,
              },
              {
                step: "02",
                title: "Daily Quick Log",
                desc: "Log your morning blood sugar, evening blood pressure, or weight in 10 fast seconds.",
                icon: HeartPulse,
              },
              {
                step: "03",
                title: "Check Food Safety",
                desc: "Inspect any meal with 'Can I Eat?' before eating to avoid sudden sugar spikes.",
                icon: Apple,
              },
              {
                step: "04",
                title: "Share with Doctor",
                desc: "Export instant clinical PDF reports with charts for your next physician consultation.",
                icon: FileText,
              },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="relative flex flex-col items-center text-center group">
                  <div className="relative mb-6">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 dark:from-emerald-600/30 dark:to-teal-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-200 text-emerald-600 dark:text-emerald-400">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-[10px] font-black text-white dark:text-black shadow-md">
                      {s.step}
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PRICING & TIERS */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10 bg-slate-100/60 dark:bg-white/[0.015] border-y border-slate-200/80 dark:border-white/5 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              TRANSPARENT PLANS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white mt-2 leading-tight">
              Invest in Your Long-Term Health
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
              Start completely free, or unlock unlimited family multi-profiles and doctor-ready reports with Pro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="p-7 rounded-3xl bg-white dark:bg-[#0a0e18] border border-slate-200/90 dark:border-white/10 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all">
              <div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Starter Free</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Essential vitals logging for individuals</p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/ forever</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Single Patient Profile</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Glucose & Blood Pressure Logging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Basic &quot;Can I Eat?&quot; Food Search</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Daily Medicine Reminders</span>
                  </li>
                </ul>
              </div>
              <a
                href="#download"
                className="mt-8 w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs font-bold text-center border border-slate-300 dark:border-white/10 transition-all"
              >
                Get Started Free
              </a>
            </div>

            {/* Pro Monthly */}
            <div className="p-7 rounded-3xl bg-white dark:bg-[#0a0e18] border border-slate-200/90 dark:border-white/10 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all">
              <div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Pro Monthly</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Flexible month-to-month care</p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">$4.99</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Up to 5 Family Dependents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Unlimited PDF & CSV Doctor Reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Advanced Glycemic Load Analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Automatic Cloud Sync & Backup</span>
                  </li>
                </ul>
              </div>
              <a
                href="#download"
                className="mt-8 w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs font-bold text-center border border-slate-300 dark:border-white/10 transition-all"
              >
                Upgrade to Pro
              </a>
            </div>

            {/* Pro Annual (Highlighted) */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 dark:from-emerald-950/70 dark:to-[#0a0e18] border-2 border-emerald-600 dark:border-emerald-500/80 shadow-2xl shadow-emerald-500/10 dark:shadow-emerald-500/15 flex flex-col justify-between relative transition-all">
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black text-[10px] font-black uppercase tracking-wider">
                Best Value • 33% Off
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Pro Annual</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-1">Complete year-round wellness suite</p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">$39.99</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/ year ($3.33/mo)</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-800 dark:text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Everything in Pro Monthly</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Priority Clinical Cloud Backup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Longitudinal 90-Day Trend Charts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>24/7 Priority Support Response</span>
                  </li>
                </ul>
              </div>
              <a
                href="#download"
                className="mt-8 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold text-center shadow-lg shadow-emerald-600/20 transition-all"
              >
                Start 7-Day Free Trial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FAQ SECTION */}
      {/* ========================================================================= */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              GOT QUESTIONS?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mt-2 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2">
              Everything you need to know about the NutriHealth app and clinical safety.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0a0e18] overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ml-3 ${
                        isOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL DOWNLOAD CTA BANNER */}
      {/* ========================================================================= */}
      <section id="download" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto rounded-3xl p-6 sm:p-14 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 text-white border border-emerald-500/40 shadow-2xl shadow-emerald-500/10 text-center relative overflow-hidden">
          <div className="relative z-10 space-y-5 sm:space-y-6 max-w-2xl mx-auto">
            <Badge variant="success" className="text-xs uppercase px-3 py-1 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              Available Worldwide
            </Badge>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Begin Your Journey to Better Health Today.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Download NutriHealth now on Android and iOS. Take the guesswork out of daily nutrition, blood sugar, and medication.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={() => alert("Google Play Store build is linking to your store publication.")}
                className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-3 px-5 py-3 rounded-2xl bg-black hover:bg-neutral-900 text-white border border-white/20 hover:border-emerald-500/60 shadow-xl transition-all cursor-pointer"
              >
                <Download className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-left leading-none">
                  <span className="text-[10px] text-slate-400 uppercase">Direct Download</span>
                  <p className="text-sm font-bold text-white mt-1">Android APK / Play Store</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => alert("Apple TestFlight / App Store build is preparing for distribution.")}
                className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-3 px-5 py-3 rounded-2xl bg-black hover:bg-neutral-900 text-white border border-white/20 hover:border-emerald-500/60 shadow-xl transition-all cursor-pointer"
              >
                <Download className="w-5 h-5 text-teal-400 shrink-0" />
                <div className="text-left leading-none">
                  <span className="text-[10px] text-slate-400 uppercase">Direct Download</span>
                  <p className="text-sm font-bold text-white mt-1">iOS App Store</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-[#040508] py-12 px-4 sm:px-6 lg:px-8 relative z-10 text-xs text-slate-600 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white uppercase tracking-tight">
                Nutri<span className="text-emerald-600 dark:text-emerald-400">Health</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Personal health metric tracking, glycemic food validation, and clinical medication management for individuals and families worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase mb-3 tracking-wider">Features</h5>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Blood Glucose Tracker</a></li>
              <li><a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Blood Pressure Monitor</a></li>
              <li><a href="#food-inspector" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">&quot;Can I Eat?&quot; Food Guide</a></li>
              <li><a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Prescription Alarms</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase mb-3 tracking-wider">Company & Legal</h5>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              <li><a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Clinical Guidelines</a></li>
              <li><a href="https://appstick.com.bd" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Appstick Ltd</a></li>
            </ul>
          </div>

          {/* Admin & Operations */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase mb-3 tracking-wider">Administration</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Authorized clinical staff, nutritionists, and platform administrators.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all shadow-sm"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Admin Portal Sign In</span>
            </Link>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 dark:text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} NutriHealth / HealthMetric. Developed by Appstick Ltd. All rights reserved.
          </p>
          <p className="max-w-md text-center sm:text-right">
            Medical Disclaimer: NutriHealth is designed for personal wellness and tracking. It is not a substitute for professional medical diagnosis or treatment.
          </p>
        </div>
      </footer>
    </div>
  );
}
