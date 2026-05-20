"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Users, MessageSquare, Hash, User2, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface SearchResults {
  events: Array<{ id: string; title: string; location: string; startTime: string; isFree: boolean; price: number; host: { name: string; image: string | null } }>;
  users: Array<{ id: string; name: string | null; username: string | null; image: string | null; bio: string | null; isVerified: boolean }>;
  hashtags: Array<{ id: string; tag: string; useCount: number }>;
  tagAlongs: Array<{ id: string; title: string; activity: string; creator: { name: string; image: string | null } }>;
  talkAlongs: Array<{ id: string; title: string; topic: string; creator: { name: string; image: string | null } }>;
}

const TABS = ["all", "events", "users", "hashtags", "tag-along", "talk-along"] as const;

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<typeof TABS[number]>("all");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!q.trim() || q.length < 2) { setResults(null); return; }
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(q)}&type=${tab}`)
        .then((r) => r.json())
        .then(setResults)
        .finally(() => setLoading(false));
    }, 300);
  }, [q, tab]);

  const totalResults = results
    ? (results.events?.length || 0) + (results.users?.length || 0) + (results.hashtags?.length || 0) + (results.tagAlongs?.length || 0) + (results.talkAlongs?.length || 0)
    : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
          placeholder="Search events, people, hashtags..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 text-sm"
        />
        {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />}
      </div>

      {/* Tabs */}
      {q.length >= 2 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${tab === t ? "bg-white/15 text-white" : "text-gray-400 hover:text-white"}`}>
              {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {!q.trim() ? (
          <div className="text-center py-20 text-gray-500">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p>Search for events, people, or topics</p>
          </div>
        ) : q.length < 2 ? (
          <div className="text-center py-10 text-gray-500 text-sm">Type at least 2 characters</div>
        ) : results && totalResults === 0 ? (
          <div className="text-center py-20 text-gray-500">No results for &ldquo;{q}&rdquo;</div>
        ) : results ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Events */}
            {results.events?.length > 0 && (tab === "all" || tab === "events") && (
              <div>
                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Events
                </h3>
                <div className="space-y-2">
                  {results.events.map((e) => (
                    <Link key={e.id} href={`/explore/${e.id}`}>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.07] transition-all">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{e.title}</p>
                          <p className="text-gray-400 text-xs">{e.location} · {format(new Date(e.startTime), "MMM d")}</p>
                        </div>
                        <span className={`text-xs font-medium ${e.isFree ? "text-emerald-400" : "text-white"}`}>{e.isFree ? "Free" : `$${e.price}`}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Users */}
            {results.users?.length > 0 && (tab === "all" || tab === "users") && (
              <div>
                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User2 className="w-3 h-3" /> People
                </h3>
                <div className="space-y-2">
                  {results.users.map((u) => (
                    <Link key={u.id} href={`/profile/${u.id}`}>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.07] transition-all">
                        {u.image ? (
                          <Image src={u.image} alt="" width={40} height={40} className="rounded-full flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {u.name?.[0] || "?"}
                          </div>
                        )}
                        <div>
                          <p className="text-white text-sm font-medium">{u.name}</p>
                          {u.username && <p className="text-gray-400 text-xs">@{u.username}</p>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Hashtags */}
            {results.hashtags?.length > 0 && (tab === "all" || tab === "hashtags") && (
              <div>
                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {results.hashtags.map((h) => (
                    <div key={h.id} className="px-3 py-1.5 bg-white/5 rounded-full text-emerald-400 text-sm hover:bg-white/10 cursor-pointer">
                      #{h.tag} <span className="text-gray-500 text-xs ml-1">{h.useCount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tag Alongs */}
            {results.tagAlongs?.length > 0 && (tab === "all" || tab === "tag-along") && (
              <div>
                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Users className="w-3 h-3" /> Tag Alongs
                </h3>
                <div className="space-y-2">
                  {results.tagAlongs.map((t) => (
                    <Link key={t.id} href={`/tag-along/${t.id}`}>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.07] transition-all">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{t.title}</p>
                          <p className="text-gray-400 text-xs">{t.activity}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Talk Alongs */}
            {results.talkAlongs?.length > 0 && (tab === "all" || tab === "talk-along") && (
              <div>
                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" /> Talk Alongs
                </h3>
                <div className="space-y-2">
                  {results.talkAlongs.map((t) => (
                    <Link key={t.id} href={`/talk-along/${t.id}`}>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.07] transition-all">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{t.title}</p>
                          <p className="text-gray-400 text-xs">{t.topic}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
