"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Calendar, Users, MessageSquare, ArrowLeft, Trophy } from "lucide-react";
import { MOCK_MATCHES, MOCK_WATCH_PARTIES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WatchPartyCard } from "@/components/watch-party/WatchPartyCard";
import { getStatusBadge, formatMatchTime } from "@/lib/utils";

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const match = MOCK_MATCHES.find((m) => m.id === id) ?? MOCK_MATCHES[0];
  const parties = MOCK_WATCH_PARTIES.filter((p) => p.match?.id === match.id);
  const { label, color } = getStatusBadge(match.status);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/matches" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors text-sm">
        <ArrowLeft size={14} />
        All Matches
      </Link>

      {/* Match hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-green-950/20 to-gray-900 border border-white/10 p-8 mb-6"
      >
        {match.status === "LIVE" && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />
        )}

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-6">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${color}`}>
              {label}
            </span>
            <span className="text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-full">
              {match.stage}
            </span>
          </div>

          <div className="flex items-center gap-12 mb-8">
            <div className="text-center">
              <span className="text-7xl block mb-3">{match.homeTeam.flag}</span>
              <p className="text-white font-black text-xl">{match.homeTeam.name}</p>
              <p className="text-white/40 text-sm">{match.homeTeam.code}</p>
            </div>

            <div className="text-center">
              {match.status !== "UPCOMING" ? (
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-black text-white">{match.homeScore}</span>
                  <span className="text-white/20 text-2xl">—</span>
                  <span className="text-5xl font-black text-white">{match.awayScore}</span>
                </div>
              ) : (
                <div>
                  <span className="text-3xl font-black text-white/20">VS</span>
                </div>
              )}
            </div>

            <div className="text-center">
              <span className="text-7xl block mb-3">{match.awayTeam.flag}</span>
              <p className="text-white font-black text-xl">{match.awayTeam.name}</p>
              <p className="text-white/40 text-sm">{match.awayTeam.code}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/50 mb-6">
            <span className="flex items-center gap-1.5">
              <Trophy size={14} />
              {match.venue}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {match.city}, {match.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatMatchTime(match.kickoffTime)}
            </span>
          </div>

          <div className="flex gap-3">
            <Link href={`/matches/${match.id}/chat`}>
              <Button size="lg" className="gap-2">
                <MessageSquare size={18} />
                Join Live Chat
              </Button>
            </Link>
            <Link href={`/explore?matchId=${match.id}`}>
              <Button size="lg" variant="outline" className="gap-2">
                <Users size={18} />
                Find Watch Parties ({parties.length})
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Watch parties for this match */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Watch Parties for This Match
        </h2>
        {parties.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-4xl mb-3">🏟️</p>
            <p className="text-white font-semibold mb-2">No parties yet</p>
            <p className="text-white/40 text-sm mb-4">Be the first to host one!</p>
            <Link href="/create-party">
              <Button>Create Watch Party</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {parties.map((party, i) => (
              <WatchPartyCard key={party.id} party={party} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
