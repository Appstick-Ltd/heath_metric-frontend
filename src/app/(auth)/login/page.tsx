"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeartPulse, Lock, User, Users, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AuthService } from "@/lib/auth-service";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const [activeAdmin, setActiveAdmin] = React.useState<import("@/lib/auth-service").AdminUser | null>(null);

  React.useEffect(() => {
    setActiveAdmin(AuthService.getCurrentAdmin());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await AuthService.login(username, password);

      if (!result.success) {
        setErrorMessage(result.error || "Authentication failed.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleQuickFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto h-14 w-14 rounded-2xl overflow-hidden bg-white shadow-xl shadow-sky-500/20 border border-slate-200 dark:border-white/10 p-1 mb-3 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpeg"
            alt="HealthTrack Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
          Health<span className="text-sky-500">Track</span> Admin Portal
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
          Enter your administrative credentials to manage clinical records and operations
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          {/* Active Session Notice if already signed in */}
          {activeAdmin && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 truncate">
                  Signed in: <strong className="text-slate-900 dark:text-white">{activeAdmin.name}</strong> ({activeAdmin.role})
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-[11px] px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50"
                  onClick={() => router.push(redirectUrl)}
                >
                  Dashboard &rarr;
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 text-[11px] px-2 text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  onClick={() => {
                    AuthService.logout();
                    setActiveAdmin(null);
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in zoom-in-95">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="flex-1">
                <p className="font-semibold">Login Failed</p>
                <p className="text-[11px] opacity-90 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>Authentication successful! Accessing portal...</span>
            </div>
          )}

          {/* Username / Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Admin Username or Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                required
                autoComplete="username"
                className="pl-9 text-xs"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="admin or admin@healthtrack.app"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className="pl-9 pr-10 text-xs"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter admin password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isLoading}
            loadingText="Authenticating Admin..."
          >
            Sign In to Portal
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </form>

      {/* Default Credentials Helper */}
      <CardFooter className="flex flex-col space-y-3 pt-2 bg-slate-50/60 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800">
        <div className="w-full text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            <Sparkles className="h-3 w-3 text-emerald-500" />
            Quick Demo Accounts & Roles
          </div>

          <div className="grid grid-cols-3 gap-2 text-left">
            <button
              type="button"
              onClick={() => handleQuickFill("admin", "admin123")}
              className={`p-2 rounded-xl border text-xs transition-all ${
                username === "admin"
                  ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-1 font-semibold text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Super Admin
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">admin / admin123</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("nutritionist", "nutri123")}
              className={`p-2 rounded-xl border text-xs transition-all ${
                username === "nutritionist"
                  ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-1 font-semibold text-[11px]">
                <HeartPulse className="h-3.5 w-3.5 text-teal-600" />
                Clinical Doc
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">nutritionist / nutri123</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("user", "user123")}
              className={`p-2 rounded-xl border text-xs transition-all ${
                username === "user"
                  ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-1 font-semibold text-[11px]">
                <Users className="h-3.5 w-3.5 text-sky-600" />
                Patient User
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">user / user123</p>
            </button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-sm text-slate-400 animate-pulse">
          Loading login portal...
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
