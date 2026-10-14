"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { AuthService } from "@/lib/auth-service";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const [activeAdmin, setActiveAdmin] = React.useState<import("@/lib/auth-service").AdminUser | null>(() => {
    if (typeof window !== "undefined") {
      return AuthService.getCurrentAdmin();
    }
    return null;
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await AuthService.login(email.trim(), password);

      if (!result.success) {
        setErrorMessage(result.error || "Invalid administrative credentials.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 400);
    } catch {
      setErrorMessage("An unexpected authentication error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050811] text-white flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Background Grid Pattern & Ambient Glows */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#006AFA]/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Left: Back to Site */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-200 shadow-sm backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Site</span>
        </Link>
      </div>

      {/* Centered Auth Card matching https://bloodbank.appstick.com.bd/mc-portal/auth */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <div className="rounded-[16px] border border-white/10 bg-[#0B0F19]/90 backdrop-blur-2xl p-7 sm:p-9 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] relative">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[10px] bg-white border border-white/20 p-1 flex items-center justify-center shadow-md shadow-[#006AFA]/20 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpeg"
                alt="HealthTrack Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-white uppercase flex items-center gap-1">
                Health<span className="text-[#006AFA]">Track</span>
              </span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Management Portal
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mt-7">
            <h1 className="text-2xl font-black tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Already Active Admin Banner */}
          {activeAdmin && (
            <div className="mt-5 p-3 rounded-[8px] bg-emerald-950/40 border border-emerald-500/30 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 truncate">
                  Active: <strong className="text-white">{activeAdmin.name}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => router.push(redirectUrl)}
                className="px-2.5 py-1 rounded-[6px] bg-emerald-500 text-white font-bold text-[11px] hover:bg-emerald-600 transition-colors shrink-0"
              >
                Go to Dashboard &rarr;
              </button>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mt-5 p-3 rounded-[8px] bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-white">Authentication Failed</p>
                <p className="text-[11px] text-rose-200 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Message Alert */}
          {success && (
            <div className="mt-5 p-3 rounded-[8px] bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-white">Verified! Entering Admin Portal...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="example@gmail.com"
                  className="w-full h-11 pl-10 pr-4 rounded-[8px] bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#006AFA] focus:ring-1 focus:ring-[#006AFA] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Please contact system owner at info@appstick.com.bd to reset administrative credentials.")}
                  className="text-[11px] text-[#006AFA] hover:text-sky-400 transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 rounded-[8px] bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#006AFA] focus:ring-1 focus:ring-[#006AFA] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-[8px] bg-[#006AFA] hover:bg-blue-600 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#006AFA]/30 transition-all duration-200 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Copyright inside card */}
          <div className="mt-8 text-center text-[11px] text-slate-500">
            © {new Date().getFullYear()} HealthTrack. All rights reserved.
          </div>
        </div>
      </div>

      {/* Bottom spacer for centering balance */}
      <div className="relative z-10 text-center text-[11px] text-slate-600 pb-2">
        Powered by <a href="https://appstick.com.bd" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors font-semibold">Appstick</a>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#050811] flex items-center justify-center text-xs text-slate-500">
          Loading portal authentication...
        </div>
      }
    >
      <AuthForm />
    </React.Suspense>
  );
}
