"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import {
  MapPin, Clock, Users, Ticket, Tag, MessageSquare,
  ChevronRight, Flame, Zap, Filter, SlidersHorizontal,
  Calendar, TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import type { FeedItem } from "@/types";

const CATEGORIES = ["All", "SPORTS", "MUSIC", "FOOD", "HIKE", "PARTY", "TRAVEL", "TECH", "ART", "FITNESS", "NETWORKING"];
const TYPES = ["all", "events", "tag-along", "talk-along"];

function EventCard({ item }: { item: Extract<FeedItem, { type: "event" }> }) {
  const e = item.data;
  const hasImage = e.coverImage || (e.media && e.media.length > 0);
  const imgUrl = e.coverImage || e.media?.[0]?.url;
  return (
    <Link href={`/explore/${e.id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/[0.15] transition-all"
      >
        {imgUrl ? (
          <div className="relative h-44 overflow-hidden">
            <Image src={imgUrl} alt={e.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {e.isBoosted && (
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-500/90 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3" /> Boosted
              </div>
            )}
            <div className="absolute bottom-2 left-3 right-3">
              <span className="text-xs text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
                {e.category}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-44 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-emerald-400/50" />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm line-clamp-1 mb-1">{e.title}</h3>
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{e.location}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>{format(new Date(e.startTime), "MMM d · h:mm a")}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Users className="w-3 h-3" />
              <span>{e._count?.attendances || 0} going</span>
            </div>
            <span className={`text-xs font-semibold ${e.isFree ? "text-emerald-400" : "text-white"}`}>
              {e.isFree ? "Free" : `$${e.price}`}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function TagAlongCard({ item }: { item: Extract<FeedItem, { type: "tagAlong" }> }) {
  const t = item.data;
  return (
    <Link href={`/tag-along/${t.id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 hover:border-blue-500/30 transition-all"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            {t.creator.image ? (
              <Image src={t.creator.image} alt="" width={32} height={32} className="object-cover" />
            ) : (
              <Users className="w-4 h-4 text-blue-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 truncate">{t.creator.name}</p>
            <span className="text-[10px] bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded-full">Tag Along</span>
          </div>
        </div>
        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2">{t.title}</h3>
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{t.location}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
          <Clock className="w-3 h-3" />
          <span>{format(new Date(t.scheduledAt), "MMM d · h:mm a")}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-blue-400 font-medium">{t.activity}</span>
          <span className="text-gray-500">{t._count?.requests || 0} requests</span>
        </div>
      </motion.div>
    </Link>
  );
}

function TalkAlongCard({ item }: { item: Extract<FeedItem, { type: "talkAlong" }> }) {
  const t = item.data;
  return (
    <Link href={`/talk-along/${t.id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 hover:border-purple-500/30 transition-all"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            {t.creator.image ? (
              <Image src={t.creator.image} alt="" width={32} height={32} className="object-cover" />
            ) : (
              <MessageSquare className="w-4 h-4 text-purple-400" />
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400 truncate">{t.creator.name}</p>
            <span className="text-[10px] bg-purple-500/15 text-purple-400 px-1.5 py-0.5 rounded-full">Talk Along</span>
          </div>
        </div>
        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2">{t.title}</h3>
        <p className="text-gray-400 text-xs line-clamp-2 mb-3">{t.description || t.topic}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-purple-400 font-medium truncate">{t.topic}</span>
          <span className="text-gray-500">{t.memberCount} members</span>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ExplorePage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { ref, inView } = useInView({ threshold: 0 });

  const fetchFeed = useCallback(async (reset = false) => {
    if (!hasMore && !reset) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: selectedType });
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      const res = await fetch(`/api/feed?${params}`);
      const data = await res.json();
      setItems(reset ? data.items : (prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedCategory, hasMore]);

  useEffect(() => {
    setItems([]);
    setHasMore(true);
    fetchFeed(true);
  }, [selectedType, selectedCategory]);

  useEffect(() => {
    if (inView && !loading) fetchFeed();
  }, [inView]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Explore</h1>
        <p className="text-gray-400 text-sm">Discover events, plans, and conversations near you</p>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedType === t
                ? "bg-emerald-500 text-white"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            {t === "all" ? "All" : t === "events" ? "Events" : t === "tag-along" ? "Tag Along" : "Talk Along"}
          </button>
        ))}
      </div>

      {/* Category filter (only for events/all) */}
      {(selectedType === "all" || selectedType === "events") && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === c
                  ? "bg-white/15 text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Feed grid */}
      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Flame className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p>Nothing here yet. Be the first to post!</p>
          <Link href="/create" className="mt-4 inline-block text-emerald-400 text-sm hover:underline">
            Create something →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={`${item.type}-${(item.data as { id: string }).id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {item.type === "event" && <EventCard item={item as Extract<FeedItem, { type: "event" }>} />}
                {item.type === "tagAlong" && <TagAlongCard item={item as Extract<FeedItem, { type: "tagAlong" }>} />}
                {item.type === "talkAlong" && <TalkAlongCard item={item as Extract<FeedItem, { type: "talkAlong" }>} />}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && <div ref={ref} className="h-10" />}
      {!hasMore && items.length > 0 && (
        <p className="text-center text-gray-600 text-sm py-8">You&apos;ve seen it all!</p>
      )}
    </div>
  );
}
