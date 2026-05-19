"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MOCK_MATCHES } from "@/lib/mock-data";
import { MatchCard } from "@/components/matches/MatchCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function MatchesPage() {
  const live = MOCK_MATCHES.filter((m) => m.status === "LIVE");
  const upcoming = MOCK_MATCHES.filter((m) => m.status === "UPCOMING");
  const finished = MOCK_MATCHES.filter((m) => m.status === "FINISHED");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-black text-white">Match Schedule</h1>
        <p className="text-white/50 mt-1">FIFA World Cup 2026 — All Matches</p>
      </motion.div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All ({MOCK_MATCHES.length})</TabsTrigger>
          <TabsTrigger value="live">
            🔴 Live ({live.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="finished">Finished ({finished.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {MOCK_MATCHES.map((match, i) => (
              <MatchCard key={match.id} match={match} index={i} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live">
          {live.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">⏱️</p>
              <p className="text-white/50">No live matches right now</p>
            </div>
          ) : (
            <div className="space-y-4">
              {live.map((match, i) => (
                <MatchCard key={match.id} match={match} index={i} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="space-y-4">
            {upcoming.map((match, i) => (
              <MatchCard key={match.id} match={match} index={i} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="finished">
          <div className="space-y-4">
            {finished.map((match, i) => (
              <MatchCard key={match.id} match={match} index={i} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
