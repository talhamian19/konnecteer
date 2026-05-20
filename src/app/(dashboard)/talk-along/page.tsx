"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageSquare, Users, Plus, Loader2, Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { TalkAlongWithDetails } from "@/types";

export default function TalkAlongPage() {
  const [posts, setPosts] = useState<TalkAlongWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/talk-along")
      .then((r) => r.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Talk Along</h1>
          <p className="text-gray-400 text-sm">Topic-based group discussions with real people</p>
        </div>
        <Link href="/create?type=talk-along" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90">
          <Plus className="w-4 h-4" /> Start
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p>No talk alongs yet</p>
          <Link href="/create?type=talk-along" className="mt-3 inline-block text-purple-400 text-sm hover:underline">Start a discussion →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link href={`/talk-along/${post.id}`}>
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-purple-500/30 transition-all h-full">
                  <div className="flex items-center gap-2 mb-4">
                    {post.creator.image ? (
                      <Image src={post.creator.image} alt="" width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                        {post.creator.name?.[0] || "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-300">{post.creator.name}</p>
                      <p className="text-[10px] text-gray-500">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                    </div>
                  </div>

                  <h3 className="font-semibold text-white mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">{post.description || post.topic}</p>

                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 bg-purple-500/15 text-purple-400 rounded-full">{post.topic}</span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />{post.memberCount} members
                    </span>
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
