"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("admin@nutrihealth.com");
  const [password, setPassword] = React.useState("••••••••••••");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  const handleQuickDemoLogin = (role: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 400);
  };

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-md">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 mb-3">
          <HeartPulse className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          NutriHealth Admin
        </CardTitle>
        <CardDescription>
          Sign in to access platform management, clinical metrics & operations
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                required
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nutrihealth.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <a href="#" className="text-xs text-emerald-600 hover:underline">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                required
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Sign In to Portal"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </form>

      <CardFooter className="flex flex-col space-y-3 pt-2">
        <div className="relative w-full text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-slate-800" />
          </div>
          <span className="relative bg-white dark:bg-slate-900 px-2 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            One-Click Demo Access
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickDemoLogin("Super Admin")}
            className="text-xs"
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
            Super Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickDemoLogin("Nutritionist")}
            className="text-xs"
          >
            Nutritionist CMS
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
