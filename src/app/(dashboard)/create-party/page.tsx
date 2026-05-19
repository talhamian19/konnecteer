"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MOCK_MATCHES, VIBE_TAGS } from "@/lib/mock-data";
import { PartyVibe } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PARTY_VIBES: { value: PartyVibe; label: string; emoji: string; desc: string }[] = [
  { value: "PARTY", label: "Party", emoji: "🎉", desc: "High energy, music, drinks, celebrating" },
  { value: "HARDCORE", label: "Hardcore", emoji: "🔥", desc: "Die-hard fans, tactical analysis, intense" },
  { value: "CASUAL", label: "Casual", emoji: "😎", desc: "Relaxed, friendly, anyone welcome" },
  { value: "CHILL", label: "Chill", emoji: "🛋️", desc: "Low-key, comfortable, quiet atmosphere" },
  { value: "FAMILY", label: "Family", emoji: "👨‍👩‍👧‍👦", desc: "Kid-friendly, all ages, safe environment" },
  { value: "INTERNATIONAL", label: "International", emoji: "🌍", desc: "Multicultural, diverse, all nationalities" },
];

const STEPS = ["Basic Info", "Location", "Settings", "Preview"];

export default function CreatePartyPage() {
  const [step, setStep] = useState(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    matchId: "",
    vibe: "" as PartyVibe | "",
    address: "",
    maxAttendees: "",
    isPublic: true,
    startTime: "",
    aiSummary: "",
  });

  const update = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const generateAISummary = async () => {
    if (!form.title || !form.vibe) {
      toast.error("Fill in title and vibe first");
      return;
    }
    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/ai/vibe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, description: form.description, vibe: form.vibe }),
      });
      const data = await res.json();
      update("aiSummary", data.aiSummary ?? "Great atmosphere expected for this watch party!");
    } catch {
      update("aiSummary", "AI-powered watch party with amazing atmosphere. Join fellow fans for an unforgettable experience!");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/watch-parties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toast.success("Watch party created! 🎉");
      setTimeout(() => (window.location.href = "/explore"), 1200);
    } catch {
      toast.error("Failed to create party. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-black text-white">Create Watch Party</h1>
        <p className="text-white/50 mt-1">Bring fans together around the beautiful game</p>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0",
                i < step
                  ? "bg-green-500 text-white"
                  : i === step
                  ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                  : "bg-white/5 border border-white/20 text-white/30"
              )}
            >
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            <span className={cn("text-xs font-medium hidden sm:block", i <= step ? "text-white/70" : "text-white/20")}>
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-px", i < step ? "bg-green-500" : "bg-white/10")} />
            )}
          </div>
        ))}
      </div>

      <Card className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Party Title *</label>
                <Input
                  placeholder="e.g. Argentina Mega Watch Party 🇦🇷"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Tell fans what to expect — atmosphere, food, drinks, activities..."
                  rows={4}
                  className="flex w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 mb-3 block">Vibe *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PARTY_VIBES.map((v) => (
                    <button
                      key={v.value}
                      onClick={() => update("vibe", v.value)}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all",
                        form.vibe === v.value
                          ? "bg-green-500/20 border-green-500/40"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      )}
                    >
                      <div className="text-xl mb-1">{v.emoji}</div>
                      <p className={cn("text-xs font-bold", form.vibe === v.value ? "text-green-400" : "text-white")}>
                        {v.label}
                      </p>
                      <p className="text-xs text-white/30 mt-0.5 leading-tight">{v.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Match (optional)</label>
                <select
                  value={form.matchId}
                  onChange={(e) => update("matchId", e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <option value="" className="bg-gray-900">Select match (optional)</option>
                  {MOCK_MATCHES.filter((m) => m.status !== "FINISHED").map((m) => (
                    <option key={m.id} value={m.id} className="bg-gray-900">
                      {m.homeTeam.flag} {m.homeTeam.name} vs {m.awayTeam.flag} {m.awayTeam.name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Address / Location</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <Input
                    placeholder="Enter venue address..."
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-white/30 mt-1.5">
                  💡 Configure Google Maps API key for precise location picking
                </p>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Start Time</label>
                <Input
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) => update("startTime", e.target.value)}
                  className="[color-scheme:dark]"
                />
              </div>

              {/* Map placeholder */}
              <div className="h-48 rounded-2xl bg-white/5 border border-white/10 border-dashed flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="text-white/20 mx-auto mb-2" />
                  <p className="text-white/30 text-sm">Map preview</p>
                  <p className="text-white/20 text-xs mt-1">Requires Google Maps API key</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Settings */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Max Attendees (optional)</label>
                <Input
                  type="number"
                  placeholder="Leave empty for unlimited"
                  value={form.maxAttendees}
                  onChange={(e) => update("maxAttendees", e.target.value)}
                  min="2"
                  max="10000"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-sm text-white font-medium">Public Party</p>
                  <p className="text-xs text-white/40 mt-0.5">Visible to all fans on the map</p>
                </div>
                <button
                  onClick={() => update("isPublic", !form.isPublic)}
                  className={cn("w-12 h-6 rounded-full transition-all relative", form.isPublic ? "bg-green-500" : "bg-white/10")}
                >
                  <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm", form.isPublic ? "left-6" : "left-0.5")} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-400 font-semibold mb-1">✅ Safety Commitment</p>
                <p className="text-xs text-white/60 leading-relaxed">
                  By hosting, you agree to maintain a safe, inclusive environment.
                  Konnecteer has zero tolerance for discrimination or harassment.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-white font-bold text-lg mb-2">{form.title || "Untitled Party"}</h3>
                {form.description && (
                  <p className="text-white/60 text-sm mb-3">{form.description}</p>
                )}
                <div className="flex flex-wrap gap-2 text-xs">
                  {form.vibe && (
                    <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full">
                      {form.vibe}
                    </span>
                  )}
                  {form.address && (
                    <span className="bg-white/10 text-white/60 px-2 py-1 rounded-full flex items-center gap-1">
                      <MapPin size={10} /> {form.address}
                    </span>
                  )}
                  <span className="bg-white/10 text-white/60 px-2 py-1 rounded-full">
                    {form.isPublic ? "🌍 Public" : "🔒 Private"}
                  </span>
                  {form.maxAttendees && (
                    <span className="bg-white/10 text-white/60 px-2 py-1 rounded-full">
                      Max {form.maxAttendees} fans
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-white/50">AI Vibe Summary</label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={generateAISummary}
                    disabled={isGeneratingAI}
                    className="gap-1.5 text-xs"
                  >
                    <Sparkles size={12} />
                    {isGeneratingAI ? "Generating..." : "Generate"}
                  </Button>
                </div>
                <textarea
                  value={form.aiSummary}
                  onChange={(e) => update("aiSummary", e.target.value)}
                  placeholder="AI-generated summary will appear here, or write your own..."
                  rows={3}
                  className="flex w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 gap-3">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ChevronLeft size={16} />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} disabled={step === 0 && (!form.title || !form.vibe)}>
              Next
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "🚀 Launch Party"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
