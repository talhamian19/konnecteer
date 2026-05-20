"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  MapPin, Clock, Users, ArrowLeft, MessageCircle,
  BadgeCheck, Loader2, Check, X, ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import type { TagAlongWithDetails } from "@/types";

export default function TagAlongDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<TagAlongWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [myRequest, setMyRequest] = useState<{ id: string; status: string } | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/tag-along/${id}`).then((r) => r.json()),
    ]).then(([data]) => {
      setPost(data);
      if (session?.user?.id && data.requests) {
        const mine = data.requests.find((r: { userId: string; id: string; status: string }) => r.userId === session.user.id);
        if (mine) setMyRequest({ id: mine.id, status: mine.status });
      }
      if (data.chat) setChatId(data.chat.id);
    }).finally(() => setLoading(false));
  }, [id, session?.user?.id]);

  async function handleRequest() {
    if (!session) { router.push("/login"); return; }
    setRequestLoading(true);
    try {
      const res = await fetch(`/api/tag-along/${id}/request`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setMyRequest({ id: data.id, status: data.status });
        toast.success("Request sent!");
      } else {
        const { error } = await res.json();
        toast.error(error);
      }
    } finally {
      setRequestLoading(false);
    }
  }

  async function handleApprove(requestId: string, status: "ACCEPTED" | "DECLINED") {
    const res = await fetch(`/api/tag-along/${id}/request`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status }),
    });
    if (res.ok) {
      toast.success(status === "ACCEPTED" ? "Accepted!" : "Declined");
      setPost((prev) => prev ? {
        ...prev,
        requests: prev.requests?.map((r) => r.id === requestId ? { ...r, status } : r),
      } : prev);
    }
  }

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-6 h-6 animate-spin text-blue-400" /></div>;
  if (!post) return <div className="text-center py-20 text-gray-400">Not found</div>;

  const isCreator = session?.user?.id === post.creatorId;
  const pending = post.requests?.filter((r) => r.status === "PENDING") || [];
  const accepted = post.requests?.filter((r) => r.status === "ACCEPTED") || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Link href={`/profile/${post.creator.id}`}>
            {post.creator.image ? (
              <Image src={post.creator.image} alt="" width={44} height={44} className="rounded-full" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                {post.creator.name?.[0] || "?"}
              </div>
            )}
          </Link>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-white font-medium">{post.creator.name}</span>
              {post.creator.isVerified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
            </div>
            <span className="text-xs bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full">{post.activity}</span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-white mb-3">{post.title}</h1>
        {post.description && <p className="text-gray-300 text-sm mb-4 leading-relaxed">{post.description}</p>}

        <div className="space-y-2 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" />{post.location}</div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" />{format(new Date(post.scheduledAt), "EEEE, MMM d · h:mm a")}</div>
          <div className="flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" />
            {accepted.length} joined{post.maxPeople ? ` / ${post.maxPeople} max` : ""}
          </div>
        </div>

        {post.vibeTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.vibeTags.map((v) => (
              <span key={v} className="text-xs bg-white/5 text-gray-300 px-2.5 py-1 rounded-full">{v}</span>
            ))}
          </div>
        )}

        {/* Action */}
        {!isCreator && (
          <div className="flex gap-3 mt-4">
            {!myRequest ? (
              <button
                onClick={handleRequest}
                disabled={requestLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl py-3 font-semibold hover:opacity-90 disabled:opacity-70"
              >
                {requestLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                Request to Join
              </button>
            ) : (
              <div className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium border ${
                myRequest.status === "PENDING" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                myRequest.status === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                {myRequest.status === "PENDING" ? "⏳ Request Pending" :
                 myRequest.status === "ACCEPTED" ? "✓ Accepted!" : "✗ Declined"}
              </div>
            )}
            {myRequest?.status === "ACCEPTED" && chatId && (
              <Link href={`/messages/${chatId}`} className="flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10">
                <MessageCircle className="w-5 h-5" />
              </Link>
            )}
          </div>
        )}

        {isCreator && chatId && (
          <Link href={`/messages/${chatId}`} className="flex items-center justify-center gap-2 w-full mt-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl py-3 font-semibold hover:bg-blue-500/20">
            <MessageCircle className="w-4 h-4" /> Group Chat
          </Link>
        )}
      </div>

      {/* Requests (host only) */}
      {isCreator && pending.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-4">
          <h2 className="text-white font-semibold mb-4">Pending Requests ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                {r.user.image ? (
                  <Image src={r.user.image} alt="" width={36} height={36} className="rounded-full" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs">{r.user.name?.[0]}</div>
                )}
                <span className="text-white text-sm flex-1">{r.user.name}</span>
                <button onClick={() => handleApprove(r.id, "ACCEPTED")} className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"><Check className="w-4 h-4" /></button>
                <button onClick={() => handleApprove(r.id, "DECLINED")} className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted */}
      {accepted.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Crew ({accepted.length})</h2>
          <div className="flex flex-wrap gap-2">
            {accepted.map((r) => (
              <Link key={r.id} href={`/profile/${r.user.id}`} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-1.5 hover:bg-white/10">
                {r.user.image ? (
                  <Image src={r.user.image} alt="" width={24} height={24} className="rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">{r.user.name?.[0]}</div>
                )}
                <span className="text-white text-xs">{r.user.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
