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
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata: Metadata = {
  title: "Privacy Policy | HealthTrack",
  description: "At HealthTrack, your medical vitals and wellness logs are strictly confidential. Read our complete privacy policy and data protection practices.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090f] text-slate-900 dark:text-slate-100 font-sans selection:bg-sky-500 selection:text-white relative overflow-x-hidden transition-colors duration-200">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <span className="block absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-sky-500/10 via-blue-600/5 to-transparent dark:from-sky-500/15 dark:via-blue-700/5 rounded-full blur-[140px] opacity-75" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#07090f]/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center border border-slate-200 dark:border-white/10 rounded-xl bg-slate-100/80 dark:bg-white/[0.05]">
              <ThemeToggle />
            </div>

            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200 p-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpeg" alt="HealthTrack" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-sm tracking-tight text-slate-950 dark:text-white uppercase hidden sm:inline">
                HEALTH<span className="text-sky-500">TRACK</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10 space-y-8 sm:space-y-10">
        {/* Hero Card */}
        <div className="rounded-3xl p-6 sm:p-10 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-xl text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 mt-1 uppercase tracking-wider">
              Last Updated: October 2026 • Version 2.4
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            At HealthTrack, your medical vitals and wellness logs are strictly confidential. Your personal health records are private and never sold to third parties.
          </p>
        </div>

        {/* Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">AES-256</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Encrypted at rest & transit</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">Protected</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Never sold to advertisers</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">You Own It</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Export anytime (PDF/XLS)</p>
            </div>
          </div>
        </div>

        {/* Section 1: Data We Collect */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 text-xs flex items-center justify-center">1</span>
            <span>Data We Collect</span>
          </h2>

          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Profile & Account Information
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  When you create a profile, we store your name, email, profile photo, and biometric parameters (such as age, gender, height, weight, and blood group) to configure personalized medical thresholds.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Health & Vitality Logs
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Health entries you record including blood glucose levels (mmol/L or mg/dL), blood pressure readings (systolic/diastolic), heart rate, body weight, medications, prescription photos, and meal nutrition logs.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Device & Advertising Data
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Device model, notification tokens, and mobile advertising identifiers used to deliver dose reminder alarms and support in-app ads. Sensitive health logs are never shared with advertisers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: How We Use Your Data */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 text-xs flex items-center justify-center">2</span>
            <span>How We Use Your Data</span>
          </h2>

          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <ChartBar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Personalized Health Insights
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Evaluating your health statistics against clinical reference ranges (such as ADA and AHA thresholds) to present actionable trends, spike alerts, and longitudinal graphs.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Medication & Health Reminders
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Delivering timely notifications for medication dosages, vital measurements, 2.0L hydration targets, and scheduled meal logging routines.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Diagnostic Reports for Physicians
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Generating organized clinical summaries (PDF and CSV/Excel) that you can export and share with your certified healthcare provider during appointments.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Security & Protection */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 text-xs flex items-center justify-center">3</span>
            <span>Security & Protection</span>
          </h2>

          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  End-to-End Encryption
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  All data transfers between the app and cloud backend utilize TLS 1.3 encryption. Stored records are safeguarded using enterprise AES-256 encryption at rest.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <KeyRound className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Row-Level Access Security (RLS)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Our database enforces strict Row-Level Security, giving you isolated, exclusive access to your records and permitted family members. No unauthorized accounts can access your clinical files.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Secure On-Device Storage
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Key profile preferences and cache files are stored securely in local device storage for high performance and offline accessibility when no Internet connection is available.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Your Rights & Control */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 text-xs flex items-center justify-center">4</span>
            <span>Your Rights & Control</span>
          </h2>

          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                <Download className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Access & Portability
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  You maintain full ownership of your data with the right to view, download, and export your complete health history at any time in structured formats.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Data Rectification & Deletion
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  You can update, edit, or permanently erase individual health records, medication schedules, or your entire profile anytime directly in the app.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Notification & Privacy Settings
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  You have full control to customize, mute, or turn off reminder notifications and adjust diagnostic permissions directly from Settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sky-950 via-slate-950 to-blue-950 text-white border border-sky-500/30 shadow-xl text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-sky-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Have Privacy Questions?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Our Data Protection Officer and compliance team are available to address any security inquiries.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:info@appstick.com.bd"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>info@appstick.com.bd</span>
            </a>
            <a
              href="tel:+8801404049797"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+88 014 0404 9797</span>
            </a>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HealthTrack. Developed by Appstick Ltd. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
