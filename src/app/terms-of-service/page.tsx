import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ShieldAlert,
  ArrowLeft,
  RefreshCw,
  HeartPulse,
  AlertTriangle,
  Lock,
  User,
  ShieldCheck,
  Code,
  Smartphone,
  Globe,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata: Metadata = {
  title: "Terms of Service | HealthTrack",
  description: "Read the Terms of Service, medical disclaimers, and user agreements for the HealthTrack platform and mobile applications.",
};

export default function TermsOfServicePage() {
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
            <FileText className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 mt-1 uppercase tracking-wider">
              Last Updated: October 2026 • Version 2.4
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before accessing or using the HealthTrack mobile application and web telemetry services.
          </p>
        </div>

        {/* Important Clinical Disclaimer Card */}
        <div className="rounded-3xl p-6 sm:p-7 bg-amber-500/10 dark:bg-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <span>Clinical & Medical Disclaimer</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-black uppercase">
                Important
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              HealthTrack is an informational wellness aid designed to support personal self-monitoring of blood glucose, blood pressure, medications, and nutrition. It does not provide medical diagnoses or replace professional medical advice. Always consult a certified healthcare professional before altering medication or treatment plans.
            </p>
          </div>
        </div>

        {/* Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">Clear Terms</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Fair & transparent agreement</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">Wellness Aid</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Self-monitoring tool</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">Zero Data Sale</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Strict personal privacy</p>
            </div>
          </div>
        </div>

        {/* Section 1: Acceptance of Terms */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 text-xs flex items-center justify-center">1</span>
            <span>Acceptance of Terms</span>
          </h2>

          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Agreement to Legal Terms
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  By downloading, accessing, or using HealthTrack, you acknowledge that you are at least 18 years of age (or have parental/guardian consent) and agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Modifications to Terms
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  We reserve the right to revise or update these terms at any time. Continued use of the application following updates constitutes your acceptance of the amended terms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Medical Limitations */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 text-xs flex items-center justify-center">2</span>
            <span>Medical Limitations</span>
          </h2>

          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Not a Substitute for Medical Advice
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  HealthTrack is an informational wellness aid designed to support personal self-monitoring of blood glucose, blood pressure, medications, and nutrition. It is not an FDA-certified diagnostic device and does not provide formal medical diagnoses.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Emergency Circumstances
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  If you experience acute health distress or suspect a critical medical emergency (e.g., severe hypoglycemia or hypertensive crisis), immediately contact your local emergency response service or physician.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: User Accounts & Integrity */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 text-xs flex items-center justify-center">3</span>
            <span>User Accounts & Integrity</span>
          </h2>

          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Account Security
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  You remain responsible for preserving the confidentiality of your login credentials and for all logged events occurring under your authenticated profile.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Accuracy of Biometric Data
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  You agree to provide true and accurate demographic and biometric information so health classifications and nutritional calculations compute reliably.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Acceptable Use */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 text-xs flex items-center justify-center">4</span>
            <span>Acceptable Use</span>
          </h2>

          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Permitted Personal Use
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  You agree to use HealthTrack strictly for personal wellness management. You shall not reverse-engineer, decompile, or misuse the application services.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                <Code className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Intellectual Property Rights
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  All application interfaces, brand graphics, medical reference databases, trademarks, and algorithms remain the exclusive property of HealthTrack and Appstick Ltd.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Advertisements & Third-Party Content */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 text-xs flex items-center justify-center">5</span>
            <span>Advertisements & Third-Party Content</span>
          </h2>

          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  In-App Advertisements
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  HealthTrack is an ad-supported platform. By using the app, you agree that we may display third-party advertisements and sponsored promotions to keep our core features free for individuals worldwide.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Globe className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Third-Party Advertisers & Links
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Any interactions with advertisers or links to external websites within the app are strictly between you and that third party. HealthTrack is not liable for third-party products, services, or claims.
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
            <h3 className="text-xl font-bold">Questions Regarding Terms?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              If you have any questions regarding these Terms of Service or user compliance, contact our team.
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
