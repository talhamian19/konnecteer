"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Flame, Map, Calendar, Users, ArrowRight, Sparkles, TrendingUp, Bell,
} from "lucide-react";
import { MOCK_MATCHES, MOCK_WATCH_PARTIES } from "@/lib/mock-data";
import { MatchCard } from "@/components/matches/MatchCard";
import { WatchPartyCard } from "@/components/watch-party/WatchPartyCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const QUICK_ACTIONS = [
  { icon: Map, label: "Explore Map", href: "/map", color: "from-blue-500 to-cyan-500" },
  { icon: Calendar, label: "Matches", href: "/matches", color: "from-purple-500 to-pink-500" },
  { icon: Users, label: "Find Fans", href: "/explore", color: "from-green-500 to-emerald-500" },
  { icon: Flame, label: "Create Party", href: "/create-party", color: "from-orange-500 to-red-500" },
];

export default function DashboardPage() {
  const liveMatches = MOCK_MATCHES.filter((m) => m.status === "LIVE");
  const upcomingMatches = MOCK_MATCHES.filter((m) => m.status === "UPCOMING").slice(0, 2);
  const topParties = MOCK_WATCH_PARTIES.slice(0, 3);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-white">
            Good day, Fan! ⚽
          </h1>
          <p className="text-white/50 mt-1">
            {liveMatches.length > 0
              ? `🔴 ${liveMatches.length} match${liveMatches.length > 1 ? "es" : ""} live right now!`
              : `${upcomingMatches.length} matches coming up soon`}
          </p>
        </div>
        <Link href="/create-party">
          <Button className="gap-2">
            <Flame size={16} />
            Host Watch Party
          </Button>
        </Link>
      </motion.div>

      {/* AI Recommendation Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500/20 via-emerald-500/15 to-teal-500/10 border border-green-500/20 p-6"
      >
        <div className="absolute right-4 top-4 text-white/5 text-9xl font-black">AI</div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
            <Sparkles size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-400">AI Recommendation for You</p>
            <p className="text-white font-bold text-lg mt-0.5">
              &ldquo;International Fan Zone — 143 fans from 30+ countries nearby!&rdquo;
            </p>
            <p className="text-white/50 text-sm mt-1">
              Based on your profile • 95% match score • Safe venue • Tonight at 7pm
            </p>
          </div>
          <Link href="/explore/wp5">
            <Button size="sm" className="flex-shrink-0">
              View Party <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.2 }}
            >
              <Link href={action.href}>
                <div className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-1 cursor-pointer text-center">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <action.icon size={22} className="text-white" />
                  </div>
                  <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                    {action.label}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Parties Nearby", value: "24", trend: "+5 today", icon: Flame },
          { label: "Live Now", value: "3", trend: "matches", icon: TrendingUp },
          { label: "Fans Online", value: "1.2K", trend: "in your city", icon: Users },
          { label: "Your RSVPs", value: "2", trend: "upcoming", icon: Bell },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 + 0.3 }}
          >
            <Card className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-white/50">{stat.label}</p>
                <stat.icon size={14} className="text-green-400" />
              </div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-white/30 mt-1">{stat.trend}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Live & Upcoming Matches */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              {liveMatches.length > 0 ? "🔴 Live Now" : "Upcoming Matches"}
            </h2>
            <Link href="/matches">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                All Matches <ArrowRight size={12} />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {[...liveMatches, ...upcomingMatches].slice(0, 2).map((match, i) => (
              <MatchCard key={match.id} match={match} index={i} />
            ))}
          </div>
        </div>

        {/* Top Watch Parties */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Top Watch Parties</h2>
            <Link href="/explore">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Explore All <ArrowRight size={12} />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {topParties.slice(0, 2).map((party, i) => (
              <WatchPartyCard key={party.id} party={party} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
