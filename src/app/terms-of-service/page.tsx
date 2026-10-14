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
  Scale,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata: Metadata = {
  title: "Terms of Service | HealthTrack (Appstick)",
  description: "Terms of Service, medical limitations, Google Play guidelines, and user agreements for the HealthTrack mobile application and clinical platform.",
};

export default function TermsOfServicePage() {
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
            <Scale className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#006AFA] dark:text-sky-400 mt-1 uppercase tracking-wider">
              Google Play Compliant • Last Updated: October 2026 • Version 2.5
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            These Terms of Service govern your access to and use of the <strong>HealthTrack</strong> mobile application, web telemetry services, and APIs operated by <strong>Appstick Ltd.</strong>
          </p>
        </div>

        {/* Mandatory Medical Disclaimer Banner (Google Play Health Policy) */}
        <div className="rounded-[12px] p-6 sm:p-7 bg-amber-500/10 dark:bg-amber-500/10 border-2 border-amber-500/40 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
              <span>Essential Medical &amp; Clinical Disclaimer</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-[4px] bg-amber-500 text-black uppercase">
                Must Read
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>HealthTrack is not a medical device and does not provide formal medical diagnoses or clinical prescriptions.</strong> The app is an informational self-monitoring tool designed to record blood sugar, blood pressure, hydration, and medicine routines. It should never be used as a replacement for emergency healthcare or professional clinical guidance. Always consult your licensed doctor or healthcare professional before making health or medication decisions.
            </p>
          </div>
        </div>

        {/* Section 1: Acceptance & Eligibility */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">1</span>
            <span>Acceptance of Terms &amp; Eligibility</span>
          </h2>

          <div className="rounded-[12px] bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Legally Binding Agreement
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  By downloading, installing, or registering an account on HealthTrack, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you must uninstall and cease using the application.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Age &amp; Jurisdiction
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  You represent that you are at least 18 years old or possess legal parental/guardian consent to use the service in compliance with local regulations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Data Accuracy & Responsibility */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">2</span>
            <span>Biometric Logs &amp; User Accuracy</span>
          </h2>

          <div className="rounded-[12px] bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  User-Entered Vitals &amp; Staging
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Blood glucose readings (mmol/L), blood pressure (mmHg), and medications entered into the app depend entirely on user input accuracy. Appstick is not responsible for miscalculations or erroneous trends resulting from incorrect user input or malfunctioning physical glucometer / sphygmomanometer hardware.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Emergency Medical Protocol
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  The application is not an emergency notification dispatcher. If you or a family member experience critical vitals (e.g., severe hypoglycemia &lt;3.9 mmol/L or hypertensive crisis &gt;180/120 mmHg), immediately contact your local hospital or emergency ambulance service.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Intellectual Property & Appstick Ownership */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">3</span>
            <span>Intellectual Property &amp; Appstick Ownership</span>
          </h2>

          <div className="rounded-[12px] bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Code className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Proprietary Assets &amp; Codebase
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  All logos, trademarks, anatomical body maps, UI components, nutritional databases, and software algorithms are the proprietary intellectual property of <strong>Appstick Ltd.</strong> You may not copy, reverse-engineer, decompile, or redistribute any portion of the software.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Advertisements & Ad-Supported Model */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">4</span>
            <span>Advertisements &amp; No Forced Subscriptions</span>
          </h2>

          <div className="rounded-[12px] bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-sky-500/10 text-[#006AFA] flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Google Mobile Ads Integration
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  HealthTrack provides free clinical self-monitoring supported by non-intrusive advertisements served via Google AdMob. There are no mandatory recurring subscriptions required to access core vitals logging, Google Drive cloud backup, or medical PDF exports.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Governing Law & Jurisdiction */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] text-xs flex items-center justify-center font-bold">5</span>
            <span>Governing Law &amp; Dispute Resolution</span>
          </h2>

          <div className="rounded-[12px] p-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-sm text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of Bangladesh. Any dispute arising from or related to the use of the platform shall be subject to the exclusive jurisdiction of the competent courts of Khulna, Bangladesh.
            </p>
          </div>
        </div>

        {/* Contact Developer Card */}
        <div className="rounded-[12px] p-6 sm:p-8 bg-gradient-to-r from-[#020b18] via-[#051329] to-[#040817] text-white border border-[#006AFA]/40 shadow-xl text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-[8px] bg-white/10 flex items-center justify-center text-sky-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Questions Regarding Terms?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              If you have any questions regarding these Terms of Service or clinical agreements, contact:
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
