"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Zap, Chrome, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COUNTRIES, LANGUAGES, VIBE_TAGS, AGE_RANGES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STEPS = [
  { id: 1, label: "Account" },
  { id: 2, label: "Profile" },
  { id: 3, label: "Preferences" },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
    nationality: "",
    favoriteTeam: "",
    currentCity: "",
    languages: [] as string[],
    goingAlone: false,
    ageRange: "",
    vibeTags: [] as string[],
    bio: "",
  });

  const update = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleArrayItem = (key: "languages" | "vibeTags", item: string) => {
    const arr = form[key];
    setForm((prev) => ({
      ...prev,
      [key]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item],
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // In production: create user via API
    toast.success("Account created! Welcome to Konnecteer 🎉");
    setTimeout(() => (window.location.href = "/dashboard"), 1200);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-green-500/8 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-black text-white">Konnecteer</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">Create your fan profile</h1>
          <p className="text-white/40 text-sm mt-1">Join thousands of fans worldwide</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  step > s.id
                    ? "bg-green-500 text-white"
                    : step === s.id
                    ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                    : "bg-white/5 border border-white/20 text-white/30"
                )}
              >
                {step > s.id ? <Check size={14} /> : s.id}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  step >= s.id ? "text-white/70" : "text-white/20"
                )}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={cn("w-8 h-px", step > s.id ? "bg-green-500" : "bg-white/10")} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Button
                  onClick={() => toast.info("Google OAuth — configure in .env.local")}
                  variant="outline"
                  size="lg"
                  className="w-full gap-3"
                >
                  <Chrome size={18} />
                  Sign up with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-transparent px-4 text-xs text-white/30">or with email</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Full Name</label>
                  <Input
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Username</label>
                  <Input
                    placeholder="@yourusername"
                    value={form.username}
                    onChange={(e) => update("username", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Current City</label>
                  <Input
                    placeholder="e.g. New York"
                    value={form.currentCity}
                    onChange={(e) => update("currentCity", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Nationality</label>
                  <select
                    value={form.nationality}
                    onChange={(e) => update("nationality", e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    <option value="" className="bg-gray-900">Select nationality</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} className="bg-gray-900">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Favorite Team</label>
                  <select
                    value={form.favoriteTeam}
                    onChange={(e) => update("favoriteTeam", e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    <option value="" className="bg-gray-900">Select team</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} className="bg-gray-900">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Bio (optional)</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => update("bio", e.target.value)}
                    placeholder="Tell other fans about yourself..."
                    rows={3}
                    className="flex w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Your Fan Vibe (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {VIBE_TAGS.map((tag) => (
                      <button
                        key={tag.value}
                        onClick={() => toggleArrayItem("vibeTags", tag.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                          form.vibeTags.includes(tag.value)
                            ? "bg-green-500/20 border-green-500/40 text-green-400"
                            : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                        )}
                      >
                        {tag.emoji} {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-2 block">Languages Spoken</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.slice(0, 10).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => toggleArrayItem("languages", lang)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                          form.languages.includes(lang)
                            ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                            : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-2 block">Age Range</label>
                  <div className="flex gap-2 flex-wrap">
                    {AGE_RANGES.map((range) => (
                      <button
                        key={range}
                        onClick={() => update("ageRange", range)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                          form.ageRange === range
                            ? "bg-purple-500/20 border-purple-500/40 text-purple-400"
                            : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                        )}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <p className="text-sm text-white font-medium">Going alone? 🙋</p>
                    <p className="text-xs text-white/40 mt-0.5">AI will find solo-friendly groups for you</p>
                  </div>
                  <button
                    onClick={() => update("goingAlone", !form.goingAlone)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      form.goingAlone ? "bg-green-500" : "bg-white/10"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm",
                        form.goingAlone ? "left-6.5" : "left-0.5"
                      )}
                    />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 gap-3">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ChevronLeft size={16} />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>
                Next
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account 🎉"}
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-green-400 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
