"use client";

import React, { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  BookOpenCheck,
  Building2,
  Wrench,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import { useAuth, normalizeRole, getDashboardPathForRole } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";

type AuthTab = "signin" | "signup" | "forgot";

const DEMO_ACCOUNTS = [
  {
    role: "student",
    label: "Student",
    name: "Aarav Sharma",
    email: "student@nitx.demo",
    password: "Student@123",
    icon: GraduationCap,
    desc: "Academic radar, 75% attendance forecaster & peer study",
    color: "from-burgundy-800/90 to-burgundy-900/95 text-gold-300 border-gold-500/35 hover:border-gold-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]",
  },
  {
    role: "faculty",
    label: "Faculty",
    name: "Prof. Vikram Sen",
    email: "faculty@nitx.demo",
    password: "Faculty@123",
    icon: BookOpenCheck,
    desc: "Relative grading sandbox, IRT item audit & at-risk alerts",
    color: "from-burgundy-800/90 to-burgundy-900/95 text-gold-200 border-gold-500/35 hover:border-gold-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]",
  },
  {
    role: "admin",
    label: "Admin",
    name: "Chief Administrator",
    email: "admin@nitx.demo",
    password: "Admin@123",
    icon: Building2,
    desc: "Campus overview, ARR billing, NBA outcomes & SLA desk",
    color: "from-burgundy-800/90 to-burgundy-900/95 text-gold-400 border-gold-500/45 hover:border-gold-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.35)]",
  },
  {
    role: "other",
    label: "Other / Staff",
    name: "Sunil Verma (Warden)",
    email: "staff@nitx.demo",
    password: "Staff@123",
    icon: Wrench,
    desc: "Facilities triage desk, hash-chained ledger & campus logistics",
    color: "from-burgundy-800/90 to-burgundy-900/95 text-gold-300 border-gold-500/35 hover:border-gold-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]",
  },
];

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const { user, isAuthenticated, isLoading: authLoading, login, register, forgotPassword, resetPassword } = useAuth();

  const [tab, setTab] = useState<AuthTab>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up state (Admin role is strictly excluded from public registration)
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpRole, setSignUpRole] = useState<"student" | "faculty" | "other">("student");
  const [signUpDept, setSignUpDept] = useState("CSE");

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState<"request" | "reset">("request");

  // Redirect authenticated user immediately to their dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const target = redirectParam || getDashboardPathForRole(user.role);
      router.replace(target);
    }
  }, [isAuthenticated, user, authLoading, router, redirectParam]);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signInEmail.trim() || !signInPassword) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setBusy(true);
    try {
      const loggedUser = await login(signInEmail.trim(), signInPassword, "NITX");
      setSuccessMsg(`Welcome back, ${loggedUser.full_name || loggedUser.email}! Redirecting...`);
      const target = redirectParam || getDashboardPathForRole(loggedUser.role);
      setTimeout(() => router.push(target), 400);
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setBusy(false);
    }
  };

  const handleQuickDemoLogin = async (acc: (typeof DEMO_ACCOUNTS)[0]) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setSignInEmail(acc.email);
    setSignInPassword(acc.password);
    setBusy(true);

    try {
      const loggedUser = await login(acc.email, acc.password, "NITX");
      setSuccessMsg(`Authenticated as ${acc.label} (${loggedUser.full_name}). Redirecting...`);
      const target = redirectParam || getDashboardPathForRole(loggedUser.role);
      setTimeout(() => router.push(target), 300);
    } catch (err: any) {
      setErrorMsg(err.message || "Quick demo login failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      await register({
        full_name: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        role: signUpRole,
        department: signUpDept,
        college_code: "NITX",
      });
      setSuccessMsg("Account created successfully! You are now logged in.");
      const target = redirectParam || getDashboardPathForRole(signUpRole);
      setTimeout(() => router.push(target), 500);
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please check your inputs.");
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPasswordRequest = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!forgotEmail.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setBusy(true);
    try {
      const res = await forgotPassword(forgotEmail.trim());
      setSuccessMsg(res.message || "Password reset token generated.");
      if (res.reset_token) {
        setResetToken(res.reset_token);
        setForgotStep("reset");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process forgot password request.");
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!resetToken.trim() || !newPassword) {
      setErrorMsg("Reset token and new password are required.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      await resetPassword({
        email: forgotEmail.trim(),
        token: resetToken.trim(),
        new_password: newPassword,
      });
      setSuccessMsg("Password reset successfully! Please sign in with your new password.");
      setSignInEmail(forgotEmail);
      setSignInPassword("");
      setTimeout(() => {
        setTab("signin");
        setForgotStep("request");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset password. Please verify your token.");
    } finally {
      setBusy(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-darkEmerald-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-mint-400">
          <div className="w-8 h-8 border-2 border-mint-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs tracking-wider text-mint-300 uppercase font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#120206] via-[#1B040A] to-[#2E0813] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Decorative royal gold & wine ambient glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-burgundy-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full border-b border-gold-500/25 backdrop-blur-md bg-burgundy-950/70 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline-block text-gold-200/80">Northstar Institute (NITX)</span>
            <span className="px-2.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/35 text-gold-300 font-mono text-[11px] shadow-[0_0_10px_rgba(212,175,55,0.2)]">
              v2.4-SecureRBAC
            </span>
          </div>
        </div>
      </header>

      {/* Main Login / Signup Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Platform Branding & 1-Click Demo Accounts */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/35 text-gold-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>One Campus. One Intelligence.</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Enterprise Access <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-amber-200">
                  Role-Based Portal
                </span>
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-gold-100/70 leading-relaxed">
                Log in to your personalized workspace. Students, faculty, campus administrators, and operations staff are automatically routed to their authorized dashboards.
              </p>
            </div>

            {/* Quick 1-Click Demo Logins */}
            <div className="bg-burgundy-900/85 border border-gold-500/35 rounded-2xl p-4 backdrop-blur-xl shadow-xl shadow-black/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-300">
                  ⚡ 1-Click Demo Accounts
                </span>
                <span className="text-[10px] text-gold-400/80 font-mono">Bcrypt Authenticated</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_ACCOUNTS.map((acc) => {
                  const Icon = acc.icon;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      disabled={busy}
                      onClick={() => handleQuickDemoLogin(acc)}
                      className={`text-left p-3 rounded-xl border transition-all duration-200 bg-gradient-to-br ${acc.color} hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 group`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-bold">{acc.label}</span>
                      </div>
                      <p className="text-[11px] text-white/90 font-medium truncate">{acc.name}</p>
                      <p className="text-[10px] text-white/60 font-mono truncate">{acc.email}</p>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 pt-2.5 border-t border-gold-500/20 flex items-center justify-between text-[11px] text-gold-300/80">
                <span>All accounts use password:</span>
                <span className="font-mono bg-burgundy-950 px-2 py-0.5 rounded border border-gold-500/35 text-gold-300 text-[10px]">
                  [Role]@123
                </span>
              </div>
            </div>

            {/* Security Assurance Badges */}
            <div className="flex items-center gap-4 text-xs text-gold-300/90">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Bcrypt Hash</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-gold-400" />
                <span>JWT Sessions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-gold-400" />
                <span>Server-Side RBAC</span>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-burgundy-900/90 border border-gold-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/60 relative">
              {/* Form Tab Switcher */}
              <div className="flex items-center gap-2 p-1 bg-burgundy-950/80 border border-gold-500/30 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setTab("signin");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                    tab === "signin"
                      ? "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-burgundy-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "text-gold-200/70 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab("signup");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                    tab === "signup"
                      ? "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-burgundy-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "text-gold-200/70 hover:text-white"
                  }`}
                >
                  Register Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab("forgot");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                    tab === "forgot"
                      ? "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-burgundy-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "text-gold-200/70 hover:text-white"
                  }`}
                >
                  Reset Password
                </button>
              </div>

              {/* Status Alerts */}
              {errorMsg && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="mb-5 p-3 rounded-xl bg-mint-500/10 border border-mint-500/30 text-mint-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-mint-400 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 1: SIGN IN */}
              {/* ============================================================== */}
              {tab === "signin" && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-mint-200 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-mint-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="you@nitx.demo"
                        className="w-full bg-darkEmerald-950/70 border border-mint-400/25 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-mint-400/30 focus:outline-none focus:border-mint-400 focus:ring-1 focus:ring-mint-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-mint-200">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setTab("forgot");
                          setForgotEmail(signInEmail);
                        }}
                        className="text-[11px] text-mint-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-mint-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-darkEmerald-950/70 border border-mint-400/25 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-mint-400/30 focus:outline-none focus:border-mint-400 focus:ring-1 focus:ring-mint-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mint-400/60 hover:text-mint-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={busy}
                      className="w-full btn-mint-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-mint-500/20 disabled:opacity-50"
                    >
                      {busy ? (
                        <>
                          <div className="w-4 h-4 border-2 border-darkEmerald-950 border-t-transparent rounded-full animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Dashboard</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-2 text-[11px] text-mint-accent/60">
                    New to CAMPUS-NEXUS?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("signup")}
                      className="text-mint-400 font-semibold hover:underline"
                    >
                      Create an account
                    </button>
                  </div>
                </form>
              )}

              {/* ============================================================== */}
              {/* TAB 2: SIGN UP */}
              {/* ============================================================== */}
              {tab === "signup" && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-mint-200 mb-1.5">Full Name</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-mint-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="e.g. Diya Sen"
                        className="w-full bg-darkEmerald-950/70 border border-mint-400/25 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-mint-400/30 focus:outline-none focus:border-mint-400 focus:ring-1 focus:ring-mint-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-mint-200 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-mint-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="e.g. diya.sen@nitx.demo"
                        className="w-full bg-darkEmerald-950/70 border border-mint-400/25 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-mint-400/30 focus:outline-none focus:border-mint-400 focus:ring-1 focus:ring-mint-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Public Role Selector (Admin is strictly disallowed) */}
                  <div>
                    <label className="block text-xs font-medium text-mint-200 mb-1.5">
                      Select Role <span className="text-mint-400/60 font-normal">(Admin is invitation-only)</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSignUpRole("student")}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                          signUpRole === "student"
                            ? "bg-mint-500/20 border-mint-400 text-mint-300 shadow-[0_0_12px_rgba(74,222,154,0.2)]"
                            : "bg-darkEmerald-950/60 border-mint-400/15 text-mint-200/70 hover:border-mint-400/30"
                        }`}
                      >
                        <GraduationCap className="w-4 h-4 text-mint-400" />
                        <span>Student</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignUpRole("faculty")}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                          signUpRole === "faculty"
                            ? "bg-mint-500/20 border-mint-400 text-mint-300 shadow-[0_0_12px_rgba(74,222,154,0.2)]"
                            : "bg-darkEmerald-950/60 border-mint-400/15 text-mint-200/70 hover:border-mint-400/30"
                        }`}
                      >
                        <BookOpenCheck className="w-4 h-4 text-sky-400" />
                        <span>Faculty</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignUpRole("other")}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                          signUpRole === "other"
                            ? "bg-mint-500/20 border-mint-400 text-mint-300 shadow-[0_0_12px_rgba(74,222,154,0.2)]"
                            : "bg-darkEmerald-950/60 border-mint-400/15 text-mint-200/70 hover:border-mint-400/30"
                        }`}
                      >
                        <Wrench className="w-4 h-4 text-pink-400" />
                        <span>Other (Staff)</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-mint-200 mb-1.5">Department</label>
                      <select
                        value={signUpDept}
                        onChange={(e) => setSignUpDept(e.target.value)}
                        className="w-full bg-darkEmerald-950/70 border border-mint-400/25 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-mint-400 transition-all"
                      >
                        <option value="CSE">Computer Science (CSE)</option>
                        <option value="ECE">Electronics (ECE)</option>
                        <option value="Facilities">Facilities & Operations</option>
                        <option value="Administration">General Academics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-mint-200 mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-mint-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="Min 6 chars"
                          className="w-full bg-darkEmerald-950/70 border border-mint-400/25 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder:text-mint-400/30 focus:outline-none focus:border-mint-400 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Toggle password visibility"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mint-400/60 hover:text-mint-300"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={busy}
                      className="w-full btn-mint-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-mint-500/20 disabled:opacity-50"
                    >
                      {busy ? (
                        <>
                          <div className="w-4 h-4 border-2 border-darkEmerald-950 border-t-transparent rounded-full animate-spin" />
                          <span>Registering Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account & Enter</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-1 text-[11px] text-mint-accent/60">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("signin")}
                      className="text-mint-400 font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* ============================================================== */}
              {/* TAB 3: FORGOT PASSWORD */}
              {/* ============================================================== */}
              {tab === "forgot" && (
                <div className="space-y-4">
                  {forgotStep === "request" ? (
                    <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
                      <p className="text-xs text-mint-accent/70 leading-relaxed">
                        Enter your registered email address. We will generate a secure one-time password reset token for your account.
                      </p>
                      <div>
                        <label className="block text-xs font-medium text-mint-200 mb-1.5">Registered Email</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-mint-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="you@nitx.demo"
                            className="w-full bg-darkEmerald-950/70 border border-mint-400/25 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-mint-400/30 focus:outline-none focus:border-mint-400 transition-all"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={busy}
                          className="w-full btn-mint-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-mint-500/20 disabled:opacity-50"
                        >
                          {busy ? (
                            <>
                              <div className="w-4 h-4 border-2 border-darkEmerald-950 border-t-transparent rounded-full animate-spin" />
                              <span>Generating Token...</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-4 h-4" />
                              <span>Request Reset Token</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-mint-200 mb-1.5">Reset Token</label>
                        <input
                          type="text"
                          required
                          value={resetToken}
                          onChange={(e) => setResetToken(e.target.value)}
                          placeholder="e.g. rst-abc123xyz"
                          className="w-full bg-darkEmerald-950/70 border border-mint-400/25 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-mint-400/30 focus:outline-none focus:border-mint-400 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-mint-200 mb-1.5">New Password</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-mint-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full bg-darkEmerald-950/70 border border-mint-400/25 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-mint-400/30 focus:outline-none focus:border-mint-400 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password visibility"
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mint-400/60 hover:text-mint-300"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={busy}
                          className="w-full btn-mint-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-mint-500/20 disabled:opacity-50"
                        >
                          {busy ? (
                            <>
                              <div className="w-4 h-4 border-2 border-darkEmerald-950 border-t-transparent rounded-full animate-spin" />
                              <span>Updating Password...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Set New Password & Sign In</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="text-center pt-2 text-[11px] text-mint-accent/60">
                    Remembered your password?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("signin")}
                      className="text-mint-400 font-semibold hover:underline"
                    >
                      Return to Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-mint-400/10 py-4 px-6 text-center text-xs text-mint-accent/50 backdrop-blur-md bg-darkEmerald-950/60">
        <p>
          CAMPUS-NEXUS · Enterprise Cognitive Campus OS · Multi-Tenant Architecture · Demo seeded for Northstar Institute of Technology
        </p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-darkEmerald-950 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-mint-400">
            <div className="w-8 h-8 border-2 border-mint-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs tracking-wider text-mint-300 uppercase font-medium">Loading Portal...</p>
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
