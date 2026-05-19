"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin, Users, Star, Shield, Sparkles, ChevronRight, Flame,
} from "lucide-react";
import { WatchParty } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getVibeBadgeColor, getSafetyColor, getPopularityBar, truncate, formatAttendees,
} from "@/lib/utils";

interface WatchPartyCardProps {
  party: WatchParty;
  index?: number;
  showAI?: boolean;
  matchScore?: number;
  reasons?: string[];
}

const VIBE_EMOJIS: Record<string, string> = {
  HARDCORE: "🔥",
  CASUAL: "😎",
  PARTY: "🎉",
  FAMILY: "👨‍👩‍👧‍👦",
  CHILL: "🛋️",
  INTERNATIONAL: "🌍",
};

export function WatchPartyCard({
  party,
  index = 0,
  showAI = false,
  matchScore,
  reasons,
}: WatchPartyCardProps) {
  const capacityPct = party.maxAttendees
    ? (party.currentAttendees / party.maxAttendees) * 100
    : 0;
  const isAlmostFull = capacityPct >= 80;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -2 }}
    >
      <Card className="overflow-hidden hover:border-white/20 transition-all duration-300 group cursor-pointer">
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500" />

        <div className="p-5">
          {/* AI Match Score */}
          {showAI && matchScore !== undefined && (
            <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
              <Sparkles size={14} className="text-green-400" />
              <span className="text-xs text-green-400 font-semibold">
                {Math.round(matchScore * 100)}% AI Match
              </span>
              {reasons?.[0] && (
                <span className="text-xs text-white/40 ml-auto">{reasons[0]}</span>
              )}
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base leading-tight truncate">
                {party.title}
              </h3>
              {party.match && (
                <p className="text-xs text-white/40 mt-0.5">
                  {party.match.homeTeam.flag} {party.match.homeTeam.code} vs{" "}
                  {party.match.awayTeam.flag} {party.match.awayTeam.code}
                </p>
              )}
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${getVibeBadgeColor(party.vibe)}`}
            >
              {VIBE_EMOJIS[party.vibe]} {party.vibe}
            </span>
          </div>

          {/* Description */}
          {party.description && (
            <p className="text-sm text-white/50 mb-3 leading-relaxed">
              {truncate(party.description, 100)}
            </p>
          )}

          {/* AI Summary */}
          {party.aiSummary && !showAI && (
            <div className="flex items-start gap-2 mb-3 p-2.5 rounded-xl bg-white/5">
              <Sparkles size={12} className="text-purple-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-white/50 leading-relaxed">
                {truncate(party.aiSummary, 120)}
              </p>
            </div>
          )}

          {/* Location */}
          {party.address && (
            <div className="flex items-center gap-1.5 text-xs text-white/40 mb-3">
              <MapPin size={12} />
              <span className="truncate">{party.address}</span>
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1 text-xs text-white/50">
              <Users size={12} />
              <span>{formatAttendees(party.currentAttendees, party.maxAttendees)}</span>
              {isAlmostFull && (
                <span className="ml-1 text-orange-400 flex items-center gap-0.5">
                  <Flame size={10} /> Hot
                </span>
              )}
            </div>
            <div className={`flex items-center gap-1 text-xs ${getSafetyColor(party.safetyLevel)}`}>
              <Shield size={12} />
              <span>{party.safetyLevel}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-400 ml-auto">
              <Star size={12} fill="currentColor" />
              <span>{party.popularityScore.toFixed(1)}</span>
            </div>
          </div>

          {/* Capacity bar */}
          {party.maxAttendees && (
            <Progress
              value={capacityPct}
              className={`h-1.5 mb-3 ${isAlmostFull ? "[&>div]:from-orange-500 [&>div]:to-red-500" : ""}`}
            />
          )}

          {/* Nationality distribution */}
          {party.crowdNationalities && (
            <div className="flex flex-wrap gap-1 mb-4">
              {Object.entries(party.crowdNationalities)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([nation, pct]) => (
                  <span
                    key={nation}
                    className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full"
                  >
                    {nation} {pct}%
                  </span>
                ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={party.creator.image ?? undefined} />
                <AvatarFallback className="text-xs">
                  {party.creator.name?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-white/40">
                by {party.creator.name ?? party.creator.username}
              </span>
            </div>

            <Link href={`/explore/${party.id}`}>
              <Button size="sm" className="gap-1">
                Join
                <ChevronRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
