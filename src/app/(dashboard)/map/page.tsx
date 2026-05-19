"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Star, Filter, X, Layers } from "lucide-react";
import { MOCK_WATCH_PARTIES } from "@/lib/mock-data";
import { WatchParty } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVibeBadgeColor, getSafetyColor } from "@/lib/utils";
import Link from "next/link";

// Map pin component (visual representation when Google Maps not configured)
function MapPinMarker({
  party,
  onClick,
  isSelected,
}: {
  party: WatchParty;
  onClick: () => void;
  isSelected: boolean;
}) {
  const VIBE_COLORS: Record<string, string> = {
    HARDCORE: "#ef4444",
    PARTY: "#a855f7",
    CASUAL: "#3b82f6",
    CHILL: "#06b6d4",
    FAMILY: "#22c55e",
    INTERNATIONAL: "#f59e0b",
  };

  const color = VIBE_COLORS[party.vibe] ?? "#22c55e";

  return (
    <button
      onClick={onClick}
      className="absolute transform -translate-x-1/2 -translate-y-full group"
      style={{
        left: `${((party.longitude ?? -74) + 74.1) * 2000 + 100}px`,
        top: `${(40.8 - (party.latitude ?? 40.7)) * 3000 + 50}px`,
      }}
    >
      <div
        className={`relative flex items-center justify-center transition-all ${isSelected ? "scale-150" : "hover:scale-125"}`}
      >
        <div
          className="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {party.currentAttendees}
        </div>
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: `8px solid ${color}`,
          }}
        />
      </div>
    </button>
  );
}

export default function MapPage() {
  const [selectedParty, setSelectedParty] = useState<WatchParty | null>(null);
  const [mapType, setMapType] = useState<"parties" | "heatmap">("parties");

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] relative">
      {/* Map Container */}
      <div className="flex-1 relative bg-gray-900 overflow-hidden">
        {/* Simulated map background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 40%, rgba(34, 197, 94, 0.05) 0%, transparent 60%),
              radial-gradient(ellipse at 70% 60%, rgba(16, 185, 129, 0.05) 0%, transparent 60%),
              linear-gradient(180deg, #030712 0%, #0a1628 50%, #030712 100%)
            `,
          }}
        >
          {/* Grid lines simulating map */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Street-like lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <line x1="20%" y1="0" x2="20%" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            <line x1="75%" y1="0" x2="75%" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="0" y1="30%" x2="100%" y2="30%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="0" y1="60%" x2="100%" y2="60%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            <line x1="0" y1="80%" x2="100%" y2="80%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          </svg>

          {/* Map pins */}
          <div className="relative w-full h-full">
            {MOCK_WATCH_PARTIES.map((party) => (
              <MapPinMarker
                key={party.id}
                party={party}
                onClick={() => setSelectedParty(party)}
                isSelected={selectedParty?.id === party.id}
              />
            ))}
          </div>

          {/* Map overlay message */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <div className="inline-block bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 text-xs text-white/50">
              🗺️ Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable real Google Maps
            </div>
          </div>
        </div>

        {/* Top controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-4 z-10">
          <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <p className="text-white font-bold text-sm">New York City</p>
            <p className="text-white/50 text-xs">{MOCK_WATCH_PARTIES.length} watch parties nearby</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMapType(mapType === "parties" ? "heatmap" : "parties")}
              className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Layers size={12} />
              {mapType === "parties" ? "Heatmap" : "Pins"}
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-16 left-4 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl p-3 z-10">
          <p className="text-xs text-white/50 mb-2 font-semibold">LEGEND</p>
          <div className="space-y-1.5">
            {[
              { color: "#ef4444", label: "Hardcore" },
              { color: "#a855f7", label: "Party" },
              { color: "#3b82f6", label: "Casual" },
              { color: "#22c55e", label: "Family" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-white/60">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected party panel */}
      <AnimatePresence>
        {selectedParty && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-xl border-t border-white/10 p-4 z-20"
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold text-base">{selectedParty.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getVibeBadgeColor(selectedParty.vibe)}`}>
                      {selectedParty.vibe}
                    </span>
                  </div>
                  {selectedParty.address && (
                    <p className="text-xs text-white/50 flex items-center gap-1">
                      <MapPin size={10} />
                      {selectedParty.address}
                    </p>
                  )}
                </div>
                <button onClick={() => setSelectedParty(null)} className="text-white/40 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs text-white/50 flex items-center gap-1">
                  <Users size={12} />
                  {selectedParty.currentAttendees} attending
                </span>
                <span className="text-xs text-amber-400 flex items-center gap-1">
                  <Star size={12} fill="currentColor" />
                  {selectedParty.popularityScore.toFixed(1)}
                </span>
                <span className={`text-xs ${getSafetyColor(selectedParty.safetyLevel)}`}>
                  {selectedParty.safetyLevel}
                </span>
              </div>

              <div className="flex gap-2">
                <Link href={`/explore/${selectedParty.id}`} className="flex-1">
                  <Button className="w-full">View Party</Button>
                </Link>
                <Button variant="outline">
                  Get Directions
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
