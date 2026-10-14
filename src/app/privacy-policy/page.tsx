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
  KeyRound,
  Download,
  Trash2,
  Sliders,
  ArrowLeft,
  Mail,
  Phone,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Radio,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata: Metadata = {
  title: "Privacy Policy | HealthTrack (Appstick)",
  description: "Comprehensive Privacy Policy for HealthTrack mobile app & web services. Compliant with Google Play Store Data Safety, GDPR, and sensitive medical data protection standards.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090f] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#006AFA] selection:text-white relative overflow-x-hidden transition-colors duration-200">
      {/* Background glow */}
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
            <div className="flex items-center justify-center border border-slate-200 dark:border-white/10 rounded-[8px] bg-slate-100/80 dark:bg-white/[0.05]">
              <ThemeToggle />
            </div>

            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-[8px] overflow-hidden bg-white shadow-sm border border-slate-200 p-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpeg" alt="HealthTrack" className="w-full h-full object-contain" />
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
              Privacy Policy &amp; Data Safety
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#006AFA] dark:text-sky-400 mt-1 uppercase tracking-wider">
              Google Play Store Compliant • Last Updated: October 2026 • Version 2.5
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            At <strong>HealthTrack</strong> (developed and operated by <strong>Appstick Ltd.</strong>), your medical vitals and health telemetry are strictly private. We adhere to Google Play Store Developer Policies, GDPR, and medical confidentiality standards. Your health records are never sold, rented, or shared with advertisers.
          </p>
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
                Health &amp; Fitness (Blood Sugar, Blood Pressure, Pulse, Body Weight), Personal Info (Name, Email), Device IDs.
              </p>
            </div>
            <div className="p-3.5 rounded-[8px] bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Data Sharing</p>
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                No health or biometric data is shared with third parties or data brokers.
              </p>
            </div>
            <div className="p-3.5 rounded-[8px] bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Security Practices</p>
              <p className="text-slate-600 dark:text-slate-300">
                Data is encrypted in transit via TLS 1.3 and encrypted at rest with AES-256. Row-Level Security (RLS) is enforced.
              </p>
            </div>
            <div className="p-3.5 rounded-[8px] bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Data Deletion Mechanism</p>
              <p className="text-slate-600 dark:text-slate-300">
                Users can request full account and health data deletion directly in-app or via our web portal anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Data We Collect */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">1</span>
            <span>Information We Collect</span>
          </h2>

          <div className="rounded-[12px] bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  User Account &amp; Profile Details
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  When creating an account, we record your name, email address, demographic markers (age, biological sex, height, target weight), and blood group to calibrate personalized clinical staging standards (e.g., ADA guidelines).
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Health &amp; Clinical Biometric Logs (Sensitive Data)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Entries you voluntarily log: Blood glucose levels (mmol/L or mg/dL), blood pressure measurements (systolic &amp; diastolic mmHg), resting pulse, medication prescriptions, meal macro nutrition, and symptom assessments. This data is classified as sensitive personal data and is handled with strict medical-grade encryption.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-sky-500/10 text-[#006AFA] flex items-center justify-center shrink-0 mt-0.5">
                <Cloud className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Google Drive Cloud Medical Vault
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  If you enable Google Drive cloud backup, the app connects directly to your personal Google account via Google Drive API v3. Encrypted backup archives are saved into your own private <code className="text-xs font-mono text-[#006AFA]">NutriHealth Medical Vault</code> folder. Appstick servers never hold your Google decryption keys.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Radio className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Google Mobile Ads (AdMob) &amp; Device Identifiers
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  To keep the application 100% free with no forced subscriptions, we integrate the official Google Mobile Ads SDK (AdMob). AdMob may collect standard non-identifying device IDs (such as Android Advertising ID - AAID) and performance metrics to serve non-intrusive advertisements. <strong>Your clinical vitals and glucose logs are NEVER shared with or used by ad networks.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: How We Use Your Data */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">2</span>
            <span>How We Use Your Data</span>
          </h2>

          <div className="rounded-[12px] bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <ChartBar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Personal Clinical Monitoring &amp; Trends
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Visualizing blood pressure curves, glucose fasting averages, and hydration metrics against American Diabetes Association (ADA) and American Heart Association (AHA) reference thresholds.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Medication &amp; Vital Reminders
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Triggering local on-device reminder alarms for medicine doses, hydration targets (2.0L), and post-meal glucose checks.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Doctor Telemetry Reports
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Generating formatted PDF reports and Excel summaries that you can export and provide to your physician or hospital clinic during visits.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Data Deletion & Account Erasure (Google Play Requirement) */}
        <div id="data-deletion" className="space-y-4 scroll-mt-24">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-rose-500/10 text-rose-600 text-xs flex items-center justify-center font-bold">3</span>
            <span>Account Deletion &amp; Data Erasure (User Rights)</span>
          </h2>

          <div className="rounded-[12px] p-6 sm:p-8 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[8px] bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Full Control to Permanently Delete Your Data
                </h3>
                <p className="text-xs text-slate-500">
                  Google Play Policy requires a simple mechanism for complete data wiping.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              You have the unconditional right to delete your account, clinical entries, and all associated information permanently at any time. We provide two instant options:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-[8px] bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#006AFA]" />
                  Option A: Inside the Mobile App
                </p>
                <ol className="text-xs text-slate-600 dark:text-slate-400 list-decimal list-inside space-y-1">
                  <li>Open HealthTrack mobile application</li>
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
                  Send an email from your registered address to <a href="mailto:info@appstick.com.bd?subject=HealthTrack%20Account%20Deletion%20Request" className="text-[#006AFA] font-bold underline">info@appstick.com.bd</a> with the subject <em>&quot;HealthTrack Account Deletion Request&quot;</em>. Our automated compliance service will wipe all database rows within 48 hours and send you a confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Children's Privacy (COPPA) */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">4</span>
            <span>Children&apos;s Privacy (COPPA Compliance)</span>
          </h2>

          <div className="rounded-[12px] p-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              HealthTrack is designed for general adult self-care and is not directed at children under the age of 13. We do not knowingly collect personal identifiable information or health data from children under 13. If you become aware that a child has provided us with personal records without parental consent, please contact us at <a href="mailto:info@appstick.com.bd" className="text-[#006AFA] font-bold">info@appstick.com.bd</a> to purge the records immediately.
            </p>
          </div>
        </div>

        {/* Contact Developer Card */}
        <div className="rounded-[12px] p-6 sm:p-8 bg-gradient-to-r from-[#020b18] via-[#051329] to-[#040817] text-white border border-[#006AFA]/40 shadow-xl text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-[8px] bg-white/10 flex items-center justify-center text-sky-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Official Developer &amp; Data Protection Contact</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              For privacy requests, Google Play Data Safety inquiries, or compliance questions:
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:info@appstick.com.bd"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#006AFA] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>info@appstick.com.bd</span>
            </a>
            <a
              href="https://appstick.com.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shadow-md"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>https://appstick.com.bd</span>
            </a>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Appstick Ltd. • Sheikh Para, Khulna, Bangladesh
          </p>
        </div>

        {/* Footer info */}
        <div className="text-center pt-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HealthTrack. Developed and owned by Appstick. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
