"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin, Users, Star, Shield, Sparkles, Calendar, Clock,
  Share2, Flag, CheckCircle2, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { MOCK_WATCH_PARTIES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  getVibeBadgeColor, getSafetyColor, formatAttendees, getPopularityBar, formatMatchTime,
} from "@/lib/utils";
import { toast } from "sonner";

export default function WatchPartyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const party = MOCK_WATCH_PARTIES.find((p) => p.id === id) ?? MOCK_WATCH_PARTIES[0];

  const capacityPct = party.maxAttendees
    ? (party.currentAttendees / party.maxAttendees) * 100
    : 0;

  const handleRSVP = () => {
    toast.success("You're going! 🎉 Added to your calendar.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back */}
      <Link href="/explore" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors text-sm">
        <ArrowLeft size={14} />
        Back to Explore
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden"
          >
            <div className="h-48 bg-gradient-to-br from-green-500/30 via-emerald-600/20 to-teal-600/10 flex items-center justify-center relative">
              <div className="text-8xl">
                {party.vibe === "PARTY" ? "🎉" : party.vibe === "HARDCORE" ? "🔥" : party.vibe === "FAMILY" ? "👨‍👩‍👧‍👦" : "⚽"}
              </div>
              <div className="absolute top-4 left-4">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${getVibeBadgeColor(party.vibe)}`}>
                  {party.vibe}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">
                  ⭐ {party.popularityScore.toFixed(1)}
                </span>
              </div>
            </div>

            <Card className="rounded-t-none border-t-0">
              <div className="p-6">
                <h1 className="text-2xl font-black text-white mb-2">{party.title}</h1>
                {party.description && (
                  <p className="text-white/60 leading-relaxed mb-4">{party.description}</p>
                )}

                {party.match && (
                  <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-white/5">
                    <span className="text-2xl">{party.match.homeTeam.flag}</span>
                    <span className="text-white/40">vs</span>
                    <span className="text-2xl">{party.match.awayTeam.flag}</span>
                    <div className="ml-auto text-right">
                      <p className="text-white text-sm font-semibold">
                        {party.match.homeTeam.name} vs {party.match.awayTeam.name}
                      </p>
                      <p className="text-white/40 text-xs">
                        {party.startTime ? formatMatchTime(party.startTime) : "Time TBD"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-sm text-white/50 mb-4">
                  <MapPin size={14} />
                  <span>{party.address ?? "Location TBD"}</span>
                </div>

                {/* AI Summary */}
                {party.aiSummary && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20">
                    <div className="flex items-start gap-2.5">
                      <Sparkles size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-green-400 font-semibold mb-1">AI Vibe Analysis</p>
                        <p className="text-sm text-white/70 leading-relaxed">{party.aiSummary}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Crowd nationality */}
          {party.crowdNationalities && (
            <Card className="p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Users size={16} />
                Fan Nationality Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(party.crowdNationalities)
                  .sort(([, a], [, b]) => b - a)
                  .map(([nation, pct]) => (
                    <div key={nation}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/70">{nation}</span>
                        <span className="text-white font-medium">{pct}%</span>
                      </div>
                      <Progress value={pct} />
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* RSVP card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-5">
              <div className="text-center mb-5">
                <p className="text-3xl font-black text-white">{party.currentAttendees}</p>
                <p className="text-sm text-white/50">attending
                  {party.maxAttendees ? ` of ${party.maxAttendees}` : ""}
                </p>
                {party.maxAttendees && (
                  <Progress value={capacityPct} className="mt-3" />
                )}
              </div>

              <Button onClick={handleRSVP} className="w-full mb-3">
                <CheckCircle2 size={16} />
                Join This Party
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Share2 size={16} />
                Share
              </Button>
            </Card>
          </motion.div>

          {/* Stats */}
          <Card className="p-5 space-y-4">
            <h3 className="text-white font-bold text-sm">Party Details</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50 flex items-center gap-2">
                  <Shield size={14} />
                  Safety Level
                </span>
                <span className={`font-semibold ${getSafetyColor(party.safetyLevel)}`}>
                  {party.safetyLevel}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50 flex items-center gap-2">
                  <Star size={14} />
                  Popularity
                </span>
                <span className="text-amber-400 font-semibold">{party.popularityScore}/10</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50 flex items-center gap-2">
                  <Flag size={14} />
                  Vibe
                </span>
                <span className={`font-semibold text-xs px-2 py-0.5 rounded-full border ${getVibeBadgeColor(party.vibe)}`}>
                  {party.vibe}
                </span>
              </div>

              {party.isPublic !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Access</span>
                  <span className="text-white font-medium">
                    {party.isPublic ? "🌍 Public" : "🔒 Private"}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Creator */}
          <Card className="p-4">
            <p className="text-xs text-white/40 mb-3">Hosted by</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                {party.creator.name?.charAt(0) ?? "?"}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{party.creator.name}</p>
                <p className="text-white/40 text-xs">@{party.creator.username}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
