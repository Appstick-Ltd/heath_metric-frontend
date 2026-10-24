import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata: Metadata = {
  title: "Privacy Policy - Health Track (NutriHealth)",
  description:
    "Privacy Policy for Health Track (NutriHealth), package bd.com.appstick.healthtrack, developed by Appstick Ltd.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090f] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#006AFA] selection:text-white transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#07090f]/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
                <img src="/logo.jpeg" alt="Health Track" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-sm tracking-tight text-slate-950 dark:text-white uppercase hidden sm:inline">
                HEALTH<span className="text-[#006AFA]">TRACK</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-12 shadow-sm space-y-6">
          {/* Document Title */}
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
          </div>

          {/* Meta Info */}
          <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 rounded-xl p-4 sm:p-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
            <p>
              <strong>Effective Date:</strong> October 24, 2026
            </p>
            <p>
              <strong>Application:</strong> Health Track (NutriHealth)
            </p>
            <p>
              <strong>Package Name:</strong>{" "}
              <code className="text-[#006AFA] dark:text-sky-400 font-mono text-xs sm:text-sm bg-[#006AFA]/10 px-1.5 py-0.5 rounded">
                bd.com.appstick.healthtrack
              </code>
            </p>
            <p>
              <strong>Developer:</strong> Appstick Ltd.
            </p>
          </div>

          {/* Commitment Highlight */}
          <div className="bg-blue-50/80 dark:bg-blue-950/30 border-l-4 border-[#006AFA] rounded-r-xl p-4 sm:p-5 text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
            <strong>Our Commitment to Health Privacy:</strong> At Health Track, your personal vitals and health logs
            are strictly confidential. We do <strong>NOT</strong> sell, rent, or trade your personal health data to any
            third parties, brokers, or advertisers.
          </div>

          {/* 1. Introduction */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#006AFA] dark:text-sky-400">
              1. Introduction
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Health Track (&quot;NutriHealth&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) provides a personal mobile
              application designed to help users track and monitor their health metrics, blood sugar levels, blood
              pressure readings, medications, prescriptions, and meal logs. This Privacy Policy explains what
              information we collect, how we use it, how it is safeguarded, and your rights regarding your data.
            </p>
          </div>

          {/* 2. Information We Collect */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#006AFA] dark:text-sky-400">
              2. Information We Collect
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              We only collect data that is strictly necessary for the core functionalities of the application:
            </p>

            <div className="space-y-4 pl-1 sm:pl-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  A. Account &amp; Profile Information
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  <li>
                    <strong>User Identity:</strong> Full name, email address, and profile photo (selected by you).
                  </li>
                  <li>
                    <strong>Biometric &amp; Demographic Parameters:</strong> Age, date of birth, gender, height, body
                    weight, and blood group. These are used solely to calculate Body Mass Index (BMI) and tailor health
                    threshold charts.
                  </li>
                  <li>
                    <strong>Authentication:</strong> Login credentials managed securely via Supabase Authentication and
                    Google Sign-In.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  B. Health &amp; Vitality Records (Sensitive Personal Information)
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  <li>
                    <strong>Blood Glucose Readings:</strong> Fasting, post-meal, or bedtime blood sugar records (mg/dL or
                    mmol/L).
                  </li>
                  <li>
                    <strong>Blood Pressure &amp; Pulse:</strong> Systolic and diastolic blood pressure (mmHg) and pulse
                    rate (BPM).
                  </li>
                  <li>
                    <strong>Medication Logs:</strong> Medicine names, dosage, scheduled reminder times, and adherence
                    records.
                  </li>
                  <li>
                    <strong>Prescriptions &amp; Medical Reports:</strong> Photos or digital copies of prescriptions and
                    diagnostic reports uploaded by you.
                  </li>
                  <li>
                    <strong>Meals &amp; Nutrition:</strong> Self-reported daily meals and dietary entries.
                  </li>
                  <li>
                    <strong>Symptom &amp; Pain Records:</strong> User-logged physical symptom details.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  C. Device &amp; Technical Information
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  <li>
                    <strong>Device Identifiers:</strong> Device model, OS version, Firebase Cloud Messaging (FCM) tokens
                    for scheduled reminder delivery, and advertising identifiers (AAID) for ad serving.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Device Permissions & How They Are Used */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#006AFA] dark:text-sky-400">
              3. Device Permissions &amp; How They Are Used
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Health Track requests only the permissions necessary for user-initiated actions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300 pl-1 sm:pl-3">
              <li>
                <strong>Camera (<code className="font-mono text-xs bg-slate-100 dark:bg-white/10 px-1 py-0.5 rounded">android.permission.CAMERA</code>):</strong> Required
                only when you take photos of your physical medical prescriptions, lab reports, or set a profile picture.
              </li>
              <li>
                <strong>Photos &amp; Storage (<code className="font-mono text-xs bg-slate-100 dark:bg-white/10 px-1 py-0.5 rounded">READ_MEDIA_IMAGES</code>,{" "}
                <code className="font-mono text-xs bg-slate-100 dark:bg-white/10 px-1 py-0.5 rounded">READ/WRITE_EXTERNAL_STORAGE</code>):</strong> Required to select
                prescription files from your gallery and save/download your exported PDF/Excel health reports.
              </li>
              <li>
                <strong>Notifications &amp; Exact Alarms (<code className="font-mono text-xs bg-slate-100 dark:bg-white/10 px-1 py-0.5 rounded">POST_NOTIFICATIONS</code>,{" "}
                <code className="font-mono text-xs bg-slate-100 dark:bg-white/10 px-1 py-0.5 rounded">SCHEDULE_EXACT_ALARM</code>,{" "}
                <code className="font-mono text-xs bg-slate-100 dark:bg-white/10 px-1 py-0.5 rounded">USE_EXACT_ALARM</code>):</strong> Required to trigger local alarms
                and push notifications for your scheduled medication doses, vital checks, and meal reminders.
              </li>
              <li>
                <strong>Internet Access (<code className="font-mono text-xs bg-slate-100 dark:bg-white/10 px-1 py-0.5 rounded">INTERNET</code>,{" "}
                <code className="font-mono text-xs bg-slate-100 dark:bg-white/10 px-1 py-0.5 rounded">ACCESS_NETWORK_STATE</code>):</strong> Required to sync your data
                with our secure cloud servers, enable Google Sign-In, and load advertisements.
              </li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-500 italic pt-1">
              Note: We do NOT request access to your GPS location, microphone/audio, phone contacts, or SMS messages.
            </p>
          </div>

          {/* 4. How We Use Your Information */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#006AFA] dark:text-sky-400">
              4. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300 pl-1 sm:pl-3">
              <li>
                <strong>Personal Health Visualization:</strong> Displaying your historical health trends, statistical
                charts, and comparing readings against standard clinical reference thresholds (e.g., ADA, AHA
                guidelines).
              </li>
              <li>
                <strong>Reminders &amp; Alerts:</strong> Sending timely notifications so you never miss a medication
                dose or vital measurement.
              </li>
              <li>
                <strong>Diagnostic Report Generation:</strong> Compiling your logged vitals into exportable PDF or Excel
                files that you can share with your doctor or physician.
              </li>
              <li>
                <strong>Cloud Sync &amp; Backup:</strong> Synchronizing your logs across devices via our database and
                allowing optional backup to your personal Google Drive account.
              </li>
            </ul>
          </div>

          {/* 5. Third-Party Services & Advertising */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#006AFA] dark:text-sky-400">
              5. Third-Party Services &amp; Advertising
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              We work with trusted third-party SDKs to operate and monetize the app:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300 pl-1 sm:pl-3">
              <li>
                <strong>Supabase:</strong> Provides secure cloud database storage and authentication. Enforces Row-Level
                Security (RLS) so only you have access to your personal records.
              </li>
              <li>
                <strong>Google Firebase:</strong> Used for Firebase Cloud Messaging (FCM) to deliver push notifications
                and authentication services.
              </li>
              <li>
                <strong>Google Drive API:</strong> Used solely if you explicitly choose to back up or restore your
                health reports to your own Google Drive account.
              </li>
              <li>
                <strong>Google AdMob (Google Mobile Ads):</strong> Displays in-app banner, interstitial, and rewarded
                advertisements. AdMob may collect your device&apos;s advertising identifier and basic usage data to
                serve ads. <strong>Important: Your private medical vitals, prescriptions, and health logs are NEVER
                shared with or accessible by Google AdMob or advertising partners.</strong>
              </li>
            </ul>
          </div>

          {/* 6. Data Security & Storage */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#006AFA] dark:text-sky-400">
              6. Data Security &amp; Storage
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300 pl-1 sm:pl-3">
              <li>
                <strong>Encryption in Transit:</strong> All communications between the app and backend servers are
                encrypted using modern TLS 1.3 / HTTPS protocols.
              </li>
              <li>
                <strong>Encryption at Rest:</strong> Server-side database records and uploaded files are safeguarded
                with AES-256 encryption.
              </li>
              <li>
                <strong>Local Storage:</strong> Local preferences and offline caches are stored securely within your
                device&apos;s private sandboxed app storage.
              </li>
            </ul>
          </div>

          {/* 7. Data Retention & Account Deletion */}
          <div id="data-deletion" className="space-y-3 pt-2 scroll-mt-24">
            <h2 className="text-lg sm:text-xl font-bold text-[#006AFA] dark:text-sky-400">
              7. Data Retention &amp; Account Deletion (Your Rights)
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              You maintain full control and ownership over your data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300 pl-1 sm:pl-3">
              <li>
                <strong>Edit or Delete Logs:</strong> You can edit or permanently delete individual vital entries,
                medication schedules, or uploaded prescriptions directly inside the app at any time.
              </li>
              <li>
                <strong>Export Data:</strong> You can download and export your complete health history into PDF and
                Excel reports at any time.
              </li>
              <li>
                <strong>Complete Account Deletion:</strong> You can permanently delete your entire account and all
                associated health records directly in the app under <em>Profile &gt; Settings &gt; Delete Account</em>.
                Upon confirmation, all personal profiles, vitals, prescriptions, and database records are immediately
                and permanently erased from our Supabase cloud database and local device storage.
              </li>
              <li>
                You can also request manual data deletion by contacting us at:{" "}
                <a
                  href="mailto:info@appstick.com.bd"
                  className="text-[#006AFA] dark:text-sky-400 font-semibold underline underline-offset-2"
                >
                  info@appstick.com.bd
                </a>.
              </li>
            </ul>
          </div>

          {/* 8. Medical Disclaimer */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#006AFA] dark:text-sky-400">
              8. Medical Disclaimer
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Health Track (NutriHealth) is an informational wellness aid designed to support personal self-monitoring of
              blood glucose, blood pressure, medications, and nutrition. It is not an FDA-certified medical diagnostic
              device and does not provide formal medical diagnoses or clinical advice. Always consult a certified
              healthcare professional for medical concerns. In an acute health emergency, contact your local emergency
              medical service immediately.
            </p>
          </div>

          {/* 9. Children's Privacy */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#006AFA] dark:text-sky-400">
              9. Children&apos;s Privacy
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Our service is not directed to children under 13 years of age. We do not knowingly collect personal
              identifiable information from children under 13. If you believe a child has provided us with personal
              information, please contact us immediately for prompt deletion.
            </p>
          </div>

          {/* 10. Changes to This Privacy Policy */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#006AFA] dark:text-sky-400">
              10. Changes to This Privacy Policy
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated
              effective date. Continued use of the application constitutes acceptance of the revised policy.
            </p>
          </div>

          {/* 11. Contact Us */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#006AFA] dark:text-sky-400">
              11. Contact Us
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              If you have any questions, privacy inquiries, or data deletion requests, please contact us:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300 pl-1 sm:pl-3">
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:info@appstick.com.bd"
                  className="text-[#006AFA] dark:text-sky-400 font-semibold underline underline-offset-2"
                >
                  info@appstick.com.bd
                </a>
              </li>
              <li>
                <strong>Developer:</strong> Appstick Ltd.
              </li>
              <li>
                <strong>Website:</strong>{" "}
                <a
                  href="https://appstick.com.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#006AFA] dark:text-sky-400 font-semibold underline underline-offset-2"
                >
                  https://appstick.com.bd
                </a>
              </li>
            </ul>
          </div>

          {/* Document Footer */}
          <div className="pt-8 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-500">
            &copy; 2026 Appstick Ltd. All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
}
