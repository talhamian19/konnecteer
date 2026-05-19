"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { WatchParty, PartyVibe, SafetyLevel } from "@/types";
import { MOCK_WATCH_PARTIES } from "@/lib/mock-data";
import { WatchPartyCard } from "@/components/watch-party/WatchPartyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const VIBE_OPTIONS: PartyVibe[] = ["HARDCORE", "PARTY", "CASUAL", "CHILL", "FAMILY", "INTERNATIONAL"];
const SAFETY_OPTIONS: SafetyLevel[] = ["SAFE", "MODERATE", "CAUTION"];

const VIBE_LABELS: Record<PartyVibe, string> = {
  HARDCORE: "🔥 Hardcore",
  PARTY: "🎉 Party",
  CASUAL: "😎 Casual",
  CHILL: "🛋️ Chill",
  FAMILY: "👨‍👩‍👧‍👦 Family",
  INTERNATIONAL: "🌍 International",
};

export default function ExplorePage() {
  const [parties, setParties] = useState<WatchParty[]>(MOCK_WATCH_PARTIES);
  const [filtered, setFiltered] = useState<WatchParty[]>(MOCK_WATCH_PARTIES);
  const [search, setSearch] = useState("");
  const [selectedVibes, setSelectedVibes] = useState<PartyVibe[]>([]);
  const [selectedSafety, setSelectedSafety] = useState<SafetyLevel | "">("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    let result = parties;

    if (search) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()) ||
          p.address?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedVibes.length > 0) {
      result = result.filter((p) => selectedVibes.includes(p.vibe));
    }

    if (selectedSafety) {
      result = result.filter((p) => p.safetyLevel === selectedSafety);
    }

    setFiltered(result);
  }, [search, selectedVibes, selectedSafety, parties]);

  const toggleVibe = (vibe: PartyVibe) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const getAIRecommendations = async () => {
    setIsLoading(true);
    setAiMode(true);
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: {}, userQuery: search }),
      });
      const data = await res.json();
      if (data.rankedParties) {
        setFiltered(data.rankedParties);
        setAiSummary(data.summary);
      }
    } catch {
      setFiltered(MOCK_WATCH_PARTIES);
      setAiSummary("Here are the top watch parties for you tonight!");
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedVibes([]);
    setSelectedSafety("");
    setSearch("");
    setAiMode(false);
    setAiSummary("");
    setFiltered(parties);
  };

  const hasFilters = selectedVibes.length > 0 || selectedSafety || search;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white mb-1">Explore Watch Parties</h1>
        <p className="text-white/50">
          {filtered.length} parties found
          {hasFilters && " (filtered)"}
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <Input
            placeholder="Search parties, venues, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filters</span>
          {hasFilters && (
            <span className="w-2 h-2 rounded-full bg-green-400" />
          )}
        </Button>
        <Button
          variant={aiMode ? "default" : "glass"}
          onClick={getAIRecommendations}
          disabled={isLoading}
          className="gap-2"
        >
          <Sparkles size={16} />
          <span className="hidden sm:inline">AI Pick</span>
        </Button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-5 p-4 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <p className="text-xs text-white/50 mb-2 font-semibold uppercase tracking-wider">Vibe</p>
              <div className="flex flex-wrap gap-2">
                {VIBE_OPTIONS.map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() => toggleVibe(vibe)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                      selectedVibes.includes(vibe)
                        ? "bg-green-500/20 border-green-500/40 text-green-400"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                    )}
                  >
                    {VIBE_LABELS[vibe]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-white/50 mb-2 font-semibold uppercase tracking-wider">Safety</p>
              <div className="flex flex-wrap gap-2">
                {SAFETY_OPTIONS.map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setSelectedSafety(selectedSafety === level ? "" : level)
                    }
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                      selectedSafety === level
                        ? "bg-green-500/20 border-green-500/40 text-green-400"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                    )}
                  >
                    {level === "SAFE" ? "✅" : level === "MODERATE" ? "⚠️" : "🚨"} {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <X size={12} />
              Clear all filters
            </button>
          )}
        </motion.div>
      )}

      {/* AI Summary */}
      {aiMode && aiSummary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20"
        >
          <div className="flex items-start gap-2.5">
            <Sparkles size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-green-400 font-semibold mb-0.5">AI Recommendation</p>
              <p className="text-sm text-white/70">{aiSummary}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Party grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-4">🏟️</p>
          <p className="text-white font-bold text-xl mb-2">No parties found</p>
          <p className="text-white/40 mb-6">Try adjusting your filters or search terms</p>
          <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((party, i) => (
            <WatchPartyCard
              key={party.id}
              party={party}
              index={i}
              showAI={aiMode}
              matchScore={(party as WatchParty & { matchScore?: number }).matchScore}
              reasons={(party as WatchParty & { reasons?: string[] }).reasons}
            />
          ))}
        </div>
      )}
    </div>
  );
}
