"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, Plus, Loader2, Flame } from "lucide-react";
import { format } from "date-fns";
import type { TagAlongWithDetails } from "@/types";

const CATEGORIES = ["All", "SPORTS", "MUSIC", "FOOD", "HIKE", "PARTY", "TRAVEL", "TECH", "ART", "FITNESS"];

export default function TagAlongPage() {
  const [posts, setPosts] = useState<TagAlongWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    fetch(`/api/tag-along?${params}`)
      .then((r) => r.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Tag Along</h1>
          <p className="text-gray-400 text-sm">Join spontaneous plans from real people</p>
        </div>
        <Link href="/create?type=tag-along" className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90">
          <Plus className="w-4 h-4" /> Post
        </Link>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${category === c ? "bg-blue-500 text-white" : "bg-white/5 text-gray-400 hover:text-white"}`}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Flame className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p>No tag alongs yet</p>
          <Link href="/create?type=tag-along" className="mt-3 inline-block text-blue-400 text-sm hover:underline">Post the first one →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link href={`/tag-along/${post.id}`}>
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    {post.creator.image ? (
                      <Image src={post.creator.image} alt="" width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                        {post.creator.name?.[0] || "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-300">{post.creator.name}</p>
                      <span className="text-[10px] bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded-full">{post.activity}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">{post.title}</h3>
                  <div className="space-y-1 text-xs text-gray-400">
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{post.location}</div>
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(post.scheduledAt), "MMM d · h:mm a")}</div>
                  </div>
                  {post.vibeTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.vibeTags.slice(0, 3).map((v) => (
                        <span key={v} className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">{v}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 text-xs">
                    <span className="text-gray-500"><Users className="w-3 h-3 inline mr-1" />{post._count?.requests || 0} requests</span>
                    {post.maxPeople && <span className="text-gray-500">Max {post.maxPeople}</span>}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
