import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  User,
  HeartPulse,
  Smartphone,
  ChartBar,
  Bell,
  FileText,
  Trash2,
  ArrowLeft,
  Mail,
  Cloud,
  CheckCircle2,
  Globe,
  Radio,
  Camera,
  HardDrive,
  Wifi,
  Stethoscope,
  ExternalLink,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata: Metadata = {
  title: "Privacy Policy | Health Track (NutriHealth) - Appstick",
  description:
    "Official Privacy Policy and Google Play Store Data Safety disclosures for Health Track (NutriHealth) mobile app (bd.com.appstick.healthtrack) developed by Appstick Ltd.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090f] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#006AFA] selection:text-white relative overflow-x-hidden transition-colors duration-200">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <span className="block absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#006AFA]/10 via-blue-600/5 to-transparent dark:from-[#006AFA]/15 dark:via-blue-700/5 rounded-full blur-[140px] opacity-75" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#07090f]/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#006AFA] dark:hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#006AFA] dark:hover:text-sky-400 border border-slate-200 dark:border-white/10 rounded-[8px] hover:border-[#006AFA]/40 transition-colors"
              title="Open standalone static HTML version"
            >
              <span>Plain HTML</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center justify-center border border-slate-200 dark:border-white/10 rounded-[8px] bg-slate-100/80 dark:bg-white/[0.05]">
              <ThemeToggle />
            </div>

            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-[8px] overflow-hidden bg-white shadow-sm border border-slate-200 p-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpeg" alt="Health Track" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-sm tracking-tight text-slate-950 dark:text-white uppercase hidden sm:inline">
                HEALTH<span className="text-[#006AFA]">TRACK</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10 space-y-8 sm:space-y-10">
        {/* Hero Card */}
        <div className="rounded-[12px] p-6 sm:p-10 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-xl text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-[10px] bg-[#006AFA]/10 border border-[#006AFA]/20 flex items-center justify-center text-[#006AFA] dark:text-sky-400 shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#006AFA] dark:text-sky-400 mt-1 uppercase tracking-wider">
              Health Track (NutriHealth) • Google Play Store Compliant
            </p>
          </div>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-medium text-slate-700 dark:text-slate-300">
              <strong>Effective Date:</strong> October 24, 2026
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-medium text-slate-700 dark:text-slate-300">
              <strong>Package:</strong> <code className="text-[#006AFA] dark:text-sky-400">bd.com.appstick.healthtrack</code>
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-medium text-slate-700 dark:text-slate-300">
              <strong>Developer:</strong> Appstick Ltd.
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed pt-1">
            This Privacy Policy explains what information we collect, how we use it, how it is safeguarded, and your rights regarding your personal health data.
          </p>
        </div>

        {/* Commitment Highlight Callout */}
        <div className="rounded-[12px] p-5 sm:p-6 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10 border-l-4 border-[#006AFA] shadow-sm">
          <div className="flex items-start gap-3.5">
            <Lock className="w-5 h-5 text-[#006AFA] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Our Commitment to Health Privacy
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                At <strong>Health Track</strong>, your personal vitals and health logs are strictly confidential. We do <strong>NOT</strong> sell, rent, or trade your personal health data to any third parties, brokers, or advertisers.
              </p>
            </div>
          </div>
        </div>

        {/* Google Play Data Safety Summary Box */}
        <div className="rounded-[12px] p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 via-sky-500/5 to-transparent border-2 border-emerald-500/30 dark:border-emerald-500/20 space-y-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Google Play Data Safety Summary
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            This section summarizes the data safety disclosures submitted to Google Play Console:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-[8px] bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Data Collected</p>
              <p className="text-slate-600 dark:text-slate-300">
                Health &amp; Fitness (Blood Glucose, Blood Pressure, Pulse, Body Weight, Medications, Meals), Personal Info (Name, Email), Device IDs.
              </p>
            </div>
            <div className="p-3.5 rounded-[8px] bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Data Sharing</p>
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                No health or biometric data is shared with third parties, brokers, or advertisers.
              </p>
            </div>
            <div className="p-3.5 rounded-[8px] bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Security Practices</p>
              <p className="text-slate-600 dark:text-slate-300">
                Data is encrypted in transit via TLS 1.3 / HTTPS and encrypted at rest with AES-256. Row-Level Security (RLS) is strictly enforced.
              </p>
            </div>
            <div className="p-3.5 rounded-[8px] bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Data Deletion Mechanism</p>
              <p className="text-slate-600 dark:text-slate-300">
                Users can permanently delete their account and wipe all records directly in-app or via email request anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Introduction */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">1</span>
            <span>Introduction</span>
          </h2>

          <div className="rounded-[12px] p-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
            <p>
              Health Track (&quot;NutriHealth&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) provides a personal mobile application designed to help users track and monitor their health metrics, blood sugar levels, blood pressure readings, medications, prescriptions, and meal logs.
            </p>
            <p>
              This Privacy Policy explains what information we collect, how we use it, how it is safeguarded, and your rights regarding your data. By using the Health Track application, you acknowledge that you have read and understood this policy.
            </p>
          </div>
        </div>

        {/* Section 2: Information We Collect */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">2</span>
            <span>Information We Collect</span>
          </h2>

          <div className="rounded-[12px] bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            {/* A. Account & Profile */}
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  A. Account &amp; Profile Information
                </h3>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>
                    <strong>User Identity:</strong> Full name, email address, and profile photo (selected by you).
                  </li>
                  <li>
                    <strong>Biometric &amp; Demographic Parameters:</strong> Age, date of birth, gender, height, body weight, and blood group. These are used solely to calculate Body Mass Index (BMI) and tailor health threshold charts.
                  </li>
                  <li>
                    <strong>Authentication:</strong> Login credentials managed securely via Supabase Authentication and Google Sign-In.
                  </li>
                </ul>
              </div>
            </div>

            {/* B. Health & Vitality Records */}
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  B. Health &amp; Vitality Records (Sensitive Personal Information)
                </h3>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>
                    <strong>Blood Glucose Readings:</strong> Fasting, post-meal, or bedtime blood sugar records (mg/dL or mmol/L).
                  </li>
                  <li>
                    <strong>Blood Pressure &amp; Pulse:</strong> Systolic and diastolic blood pressure (mmHg) and pulse rate (BPM).
                  </li>
                  <li>
                    <strong>Medication Logs:</strong> Medicine names, dosage, scheduled reminder times, and adherence records.
                  </li>
                  <li>
                    <strong>Prescriptions &amp; Medical Reports:</strong> Photos or digital copies of prescriptions and diagnostic reports uploaded by you.
                  </li>
                  <li>
                    <strong>Meals &amp; Nutrition:</strong> Self-reported daily meals and dietary entries.
                  </li>
                  <li>
                    <strong>Symptom &amp; Pain Records:</strong> User-logged physical symptom details.
                  </li>
                </ul>
              </div>
            </div>

            {/* C. Device & Technical */}
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  C. Device &amp; Technical Information
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Device Identifiers:</strong> Device model, OS version, Firebase Cloud Messaging (FCM) tokens for scheduled reminder delivery, and advertising identifiers (AAID) for ad serving.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Device Permissions & How They Are Used */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">3</span>
            <span>Device Permissions &amp; How They Are Used</span>
          </h2>

          <div className="rounded-[12px] bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                <Camera className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Camera (<code className="text-xs">android.permission.CAMERA</code>)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Required only when you take photos of your physical medical prescriptions, diagnostic lab reports, or set a profile picture.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <HardDrive className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Photos &amp; Storage (<code className="text-xs">READ_MEDIA_IMAGES</code>, <code className="text-xs">READ/WRITE_EXTERNAL_STORAGE</code>)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Required to select prescription files from your gallery and save/download your exported PDF/Excel health reports.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Notifications &amp; Exact Alarms (<code className="text-xs">POST_NOTIFICATIONS</code>, <code className="text-xs">SCHEDULE_EXACT_ALARM</code>, <code className="text-xs">USE_EXACT_ALARM</code>)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Required to trigger local alarms and push notifications for your scheduled medication doses, vital checks, and meal reminders.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Wifi className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Internet Access (<code className="text-xs">INTERNET</code>, <code className="text-xs">ACCESS_NETWORK_STATE</code>)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Required to sync your data with our secure cloud servers, enable Google Sign-In, and load advertisements.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-white/[0.02]">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 italic">
                Note: We do NOT request access to your GPS location, microphone/audio, phone contacts, or SMS messages.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: How We Use Your Information */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">4</span>
            <span>How We Use Your Information</span>
          </h2>

          <div className="rounded-[12px] bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <ChartBar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Personal Health Visualization
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Displaying your historical health trends, statistical charts, and comparing readings against standard clinical reference thresholds (e.g., ADA, AHA guidelines).
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Reminders &amp; Alerts
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Sending timely notifications so you never miss a medication dose or vital measurement.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Diagnostic Report Generation
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Compiling your logged vitals into exportable PDF or Excel files that you can share with your doctor or physician.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-sky-500/10 text-[#006AFA] flex items-center justify-center shrink-0 mt-0.5">
                <Cloud className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Cloud Sync &amp; Backup
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Synchronizing your logs across devices via our database and allowing optional backup to your personal Google Drive account.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Third-Party Services & Advertising */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">5</span>
            <span>Third-Party Services &amp; Advertising</span>
          </h2>

          <div className="rounded-[12px] p-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We work with trusted third-party SDKs to operate and monetize the app:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-[8px] bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-1.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#006AFA]" />
                  Supabase
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Provides secure cloud database storage and authentication. Enforces Row-Level Security (RLS) so only you have access to your personal records.
                </p>
              </div>

              <div className="p-4 rounded-[8px] bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-1.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#006AFA]" />
                  Google Firebase
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Used for Firebase Cloud Messaging (FCM) to deliver push notifications and authentication services.
                </p>
              </div>

              <div className="p-4 rounded-[8px] bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-1.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Cloud className="w-4 h-4 text-[#006AFA]" />
                  Google Drive API
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Used solely if you explicitly choose to back up or restore your health reports to your own Google Drive account.
                </p>
              </div>

              <div className="p-4 rounded-[8px] bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-1.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-[#006AFA]" />
                  Google AdMob (Mobile Ads)
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Displays in-app banner, interstitial, and rewarded advertisements. AdMob may collect your device&apos;s advertising identifier and basic usage data.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-[8px] bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
              <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                <strong>Important:</strong> Your private medical vitals, prescriptions, and health logs are <strong>NEVER</strong> shared with or accessible by Google AdMob or advertising partners.
              </p>
            </div>
          </div>
        </div>

        {/* Section 6: Data Security & Storage */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">6</span>
            <span>Data Security &amp; Storage</span>
          </h2>

          <div className="rounded-[12px] bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Encryption in Transit
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  All communications between the app and backend servers are encrypted using modern TLS 1.3 / HTTPS protocols.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Encryption at Rest
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Server-side database records and uploaded files are safeguarded with AES-256 encryption.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <HardDrive className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Local Sandboxed Storage
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Local preferences and offline caches are stored securely within your device&apos;s private sandboxed app storage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 7: Data Retention & Account Deletion */}
        <div id="data-deletion" className="space-y-4 scroll-mt-24">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-rose-500/10 text-rose-600 text-xs flex items-center justify-center font-bold">7</span>
            <span>Data Retention &amp; Account Deletion (Your Rights)</span>
          </h2>

          <div className="rounded-[12px] p-6 sm:p-8 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[8px] bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  You Maintain Full Ownership Over Your Data
                </h3>
                <p className="text-xs text-slate-500">
                  Google Play Policy compliant self-serve deletion mechanism.
                </p>
              </div>
            </div>

            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
              <li>
                <strong>Edit or Delete Logs:</strong> You can edit or permanently delete individual vital entries, medication schedules, or uploaded prescriptions directly inside the app at any time.
              </li>
              <li>
                <strong>Export Data:</strong> You can download and export your complete health history into PDF and Excel reports at any time.
              </li>
              <li>
                <strong>Complete Account Deletion:</strong> You can permanently delete your entire account and all associated health records directly in the app under <em>Profile &gt; Settings &gt; Delete Account</em>. Upon confirmation, all personal profiles, vitals, prescriptions, and database records are immediately and permanently erased from our Supabase cloud database and local device storage.
              </li>
              <li>
                You can also request manual data deletion by contacting us at:{" "}
                <a href="mailto:privacy@nutrihealth.app" className="text-[#006AFA] font-bold underline">
                  privacy@nutrihealth.app
                </a>{" "}
                or{" "}
                <a href="mailto:info@appstick.com.bd" className="text-[#006AFA] font-bold underline">
                  info@appstick.com.bd
                </a>.
              </li>
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-[8px] bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#006AFA]" />
                  Option A: Inside the Mobile App
                </p>
                <ol className="text-xs text-slate-600 dark:text-slate-400 list-decimal list-inside space-y-1">
                  <li>Open Health Track mobile application</li>
                  <li>Tap on <strong>Profile &gt; Settings</strong></li>
                  <li>Scroll to <strong>Account Security</strong></li>
                  <li>Tap <strong>Delete Account &amp; Wipe All Data</strong></li>
                  <li>Confirm deletion for instant permanent erasure</li>
                </ol>
              </div>

              <div className="p-4 rounded-[8px] bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#006AFA]" />
                  Option B: Email Deletion Request
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Send an email from your registered address to <a href="mailto:privacy@nutrihealth.app?subject=Health%20Track%20Account%20Deletion%20Request" className="text-[#006AFA] font-bold underline">privacy@nutrihealth.app</a> or <a href="mailto:info@appstick.com.bd?subject=Health%20Track%20Account%20Deletion%20Request" className="text-[#006AFA] font-bold underline">info@appstick.com.bd</a> with the subject <em>&quot;Health Track Account Deletion Request&quot;</em>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 8: Medical Disclaimer */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-amber-500/10 text-amber-600 text-xs flex items-center justify-center font-bold">8</span>
            <span>Medical Disclaimer</span>
          </h2>

          <div className="rounded-[12px] p-6 bg-amber-500/5 border border-amber-500/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold mb-1">
              <Stethoscope className="w-5 h-5" />
              <span>Informational &amp; Wellness Self-Monitoring Notice</span>
            </div>
            <p>
              Health Track (NutriHealth) is an informational wellness aid designed to support personal self-monitoring of blood glucose, blood pressure, medications, and nutrition. It is not an FDA-certified medical diagnostic device and does not provide formal medical diagnoses or clinical advice.
            </p>
            <p>
              Always consult a certified healthcare professional for medical concerns. In an acute health emergency, contact your local emergency medical service immediately.
            </p>
          </div>
        </div>

        {/* Section 9: Children's Privacy */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">9</span>
            <span>Children&apos;s Privacy</span>
          </h2>

          <div className="rounded-[12px] p-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              Our service is not directed to children under 13 years of age. We do not knowingly collect personal identifiable information from children under 13. If you believe a child has provided us with personal information, please contact us immediately for prompt deletion.
            </p>
          </div>
        </div>

        {/* Section 10: Changes to This Privacy Policy */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">10</span>
            <span>Changes to This Privacy Policy</span>
          </h2>

          <div className="rounded-[12px] p-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Continued use of the application constitutes acceptance of the revised policy.
            </p>
          </div>
        </div>

        {/* Section 11: Contact Us */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">11</span>
            <span>Contact Us</span>
          </h2>

          <div className="rounded-[12px] p-6 sm:p-8 bg-gradient-to-r from-[#020b18] via-[#051329] to-[#040817] text-white border border-[#006AFA]/40 shadow-xl text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-[8px] bg-white/10 flex items-center justify-center text-sky-400">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Official Developer &amp; Data Protection Contact</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                If you have any questions, privacy inquiries, or data deletion requests, please contact us:
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:privacy@nutrihealth.app"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#006AFA] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>privacy@nutrihealth.app</span>
              </a>
              <a
                href="mailto:support@nutrihealth.app"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shadow-md"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>support@nutrihealth.app</span>
              </a>
              <a
                href="mailto:info@appstick.com.bd"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shadow-md"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>info@appstick.com.bd</span>
              </a>
              <a
                href="https://nutrihealth.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shadow-md"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>https://nutrihealth.app</span>
              </a>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Appstick Ltd. • Sheikh Para, Khulna, Bangladesh
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500">
          <p>© 2026 Appstick Ltd. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
