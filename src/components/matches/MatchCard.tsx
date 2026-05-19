"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Users, MessageSquare, Clock } from "lucide-react";
import { Match } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import { getStatusBadge, formatMatchTime } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  index?: number;
}

function Countdown({ kickoffTime }: { kickoffTime: Date }) {
  const { hours, minutes, seconds, isLive, isPast } = useCountdown(kickoffTime);

  if (isPast) return <span className="text-white/40 text-sm">Finished</span>;
  if (isLive) return (
    <span className="text-red-400 font-bold text-sm animate-pulse">LIVE NOW</span>
  );

  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      <span className="bg-white/10 rounded px-1.5 py-0.5 text-white">{String(hours).padStart(2, "0")}</span>
      <span className="text-white/40">:</span>
      <span className="bg-white/10 rounded px-1.5 py-0.5 text-white">{String(minutes).padStart(2, "0")}</span>
      <span className="text-white/40">:</span>
      <span className="bg-white/10 rounded px-1.5 py-0.5 text-white">{String(seconds).padStart(2, "0")}</span>
    </div>
  );
}

export function MatchCard({ match, index = 0 }: MatchCardProps) {
  const { label, color } = getStatusBadge(match.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Card className="overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-2xl group">
        {/* Live indicator */}
        {match.status === "LIVE" && (
          <div className="h-0.5 w-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />
        )}

        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${color}`}
              >
                {label}
              </span>
              <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                {match.stage}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/40">
              <Clock size={12} />
              {formatMatchTime(match.kickoffTime)}
            </div>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between mb-4">
            {/* Home Team */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-4xl">{match.homeTeam.flag}</span>
              <div className="text-center">
                <p className="text-white font-bold text-sm">{match.homeTeam.name}</p>
                <p className="text-white/40 text-xs">{match.homeTeam.code}</p>
              </div>
            </div>

            {/* Score / VS */}
            <div className="px-6 text-center">
              {match.status !== "UPCOMING" ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-white">{match.homeScore}</span>
                  <span className="text-white/30 text-lg">—</span>
                  <span className="text-3xl font-black text-white">{match.awayScore}</span>
                </div>
              ) : (
                <span className="text-2xl font-black text-white/20">VS</span>
              )}
              {match.status === "UPCOMING" && (
                <div className="mt-2">
                  <Countdown kickoffTime={match.kickoffTime} />
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-4xl">{match.awayTeam.flag}</span>
              <div className="text-center">
                <p className="text-white font-bold text-sm">{match.awayTeam.name}</p>
                <p className="text-white/40 text-xs">{match.awayTeam.code}</p>
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-1.5 text-xs text-white/40 mb-4">
            <MapPin size={12} />
            <span>{match.venue}, {match.city}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link href={`/explore?matchId=${match.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full gap-1.5">
                <Users size={14} />
                {match.watchPartiesCount ?? 0} Watch Parties
              </Button>
            </Link>
            <Link href={`/matches/${match.id}/chat`}>
              <Button variant="glass" size="sm" className="gap-1.5">
                <MessageSquare size={14} />
                Chat
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
