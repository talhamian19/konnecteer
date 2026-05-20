"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  MapPin, Clock, Users, Ticket, ArrowLeft, Share2,
  Heart, ExternalLink, BadgeCheck, MessageCircle,
  BarChart2, Loader2, QrCode, Zap,
} from "lucide-react";
import { format } from "date-fns";
import type { EventWithDetails } from "@/types";

export default function EventDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [event, setEvent] = useState<EventWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);
  const [attendLoading, setAttendLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setEvent(data);
        if (session?.user?.id) {
          setAttending(data.attendances?.some((a: { userId: string }) => a.userId === session.user.id) || false);
        }
      })
      .finally(() => setLoading(false));
  }, [id, session?.user?.id]);

  async function handleAttend() {
    if (!session) { router.push("/login"); return; }
    setAttendLoading(true);
    try {
      const res = await fetch(`/api/events/${id}/attend`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setAttending(data.attending);
        setEvent((prev) => prev ? {
          ...prev,
          _count: { attendances: (prev._count?.attendances || 0) + (data.attending ? 1 : -1) },
        } : prev);
        toast.success(data.attending ? "You're going!" : "Removed from attendees");
      }
    } finally {
      setAttendLoading(false);
    }
  }

  async function handleBuyTicket() {
    if (!session) { router.push("/login"); return; }
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error("Failed to create checkout");
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>Event not found</p>
        <Link href="/explore" className="text-emerald-400 mt-2 block">← Back to explore</Link>
      </div>
    );
  }

  const isHost = session?.user?.id === event.hostId;
  const coverImg = event.coverImage || event.media?.[0]?.url;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Cover image */}
      {coverImg ? (
        <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
          <Image src={coverImg} alt={event.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {event.isBoosted && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-yellow-500/90 text-black text-xs font-bold px-2 py-1 rounded-full">
              <Zap className="w-3 h-3" /> Boosted
            </div>
          )}
        </div>
      ) : (
        <div className="h-48 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 mb-6 flex items-center justify-center">
          <span className="text-5xl">🎉</span>
        </div>
      )}

      {/* Title & meta */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-2xl font-bold text-white leading-tight">{event.title}</h1>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white flex-shrink-0"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" />
            {event.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            {format(new Date(event.startTime), "EEE, MMM d · h:mm a")}
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" />
            {event._count?.attendances || 0} going
            {event.maxAttendees && ` / ${event.maxAttendees} max`}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 bg-white/[0.06] rounded-lg text-xs text-gray-300">{event.category}</span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${event.isFree ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.06] text-white"}`}>
            {event.isFree ? "Free" : `$${event.price}`}
          </span>
        </div>
      </div>

      {/* Host */}
      <Link href={`/profile/${event.host.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] mb-6 hover:bg-white/[0.06] transition-colors">
        {event.host.image ? (
          <Image src={event.host.image} alt="" width={40} height={40} className="rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            {event.host.name?.[0] || "H"}
          </div>
        )}
        <div>
          <div className="flex items-center gap-1">
            <span className="text-white text-sm font-medium">{event.host.name}</span>
            {event.host.isVerified && <BadgeCheck className="w-4 h-4 text-emerald-400" />}
          </div>
          <p className="text-gray-400 text-xs">Event Host</p>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-500 ml-auto" />
      </Link>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-white font-semibold mb-2">About</h2>
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{event.description}</p>
      </div>

      {/* Hashtags */}
      {event.hashtags && event.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {event.hashtags.map((h) => (
            <span key={h.hashtagId} className="text-emerald-400 text-sm">#{h.hashtag.tag}</span>
          ))}
        </div>
      )}

      {/* Attendees */}
      {event.attendances && event.attendances.length > 0 && (
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-3">Who&apos;s going ({event._count?.attendances})</h2>
          <div className="flex -space-x-2">
            {event.attendances.slice(0, 10).map((a) => (
              <div key={a.userId} className="w-8 h-8 rounded-full border-2 border-gray-950 overflow-hidden bg-emerald-500/20">
                {a.user.image ? (
                  <Image src={a.user.image} alt="" width={32} height={32} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-emerald-400 font-bold">
                    {a.user.name?.[0] || "U"}
                  </div>
                )}
              </div>
            ))}
            {(event._count?.attendances || 0) > 10 && (
              <div className="w-8 h-8 rounded-full border-2 border-gray-950 bg-white/10 flex items-center justify-center text-xs text-gray-400">
                +{(event._count?.attendances || 0) - 10}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {isHost ? (
          <>
            <Link
              href={`/host/${event.id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white rounded-xl py-3 font-semibold hover:bg-emerald-600 transition-colors"
            >
              <BarChart2 className="w-4 h-4" />
              Host Dashboard
            </Link>
            {event.chat && (
              <Link
                href={`/messages/${event.chat.id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white rounded-xl py-3 font-semibold hover:bg-white/10"
              >
                <MessageCircle className="w-4 h-4" />
                Event Chat
              </Link>
            )}
          </>
        ) : event.isFree ? (
          <>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAttend}
              disabled={attendLoading}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all ${
                attending
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90"
              }`}
            >
              {attendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={`w-4 h-4 ${attending ? "fill-current" : ""}`} />}
              {attending ? "Going ✓" : "I'm Going"}
            </motion.button>
            {event.chat && attending && (
              <Link
                href={`/messages/${event.chat.id}`}
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white rounded-xl py-3 px-4 font-semibold hover:bg-white/10"
              >
                <MessageCircle className="w-4 h-4" />
              </Link>
            )}
          </>
        ) : (
          <>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleBuyTicket}
              disabled={checkoutLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl py-3 font-semibold hover:opacity-90 disabled:opacity-70"
            >
              {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
              Buy Ticket — ${event.price}
            </motion.button>
            {attending && event.chat && (
              <Link
                href={`/messages/${event.chat.id}`}
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white rounded-xl py-3 px-4 font-semibold hover:bg-white/10"
              >
                <MessageCircle className="w-4 h-4" />
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
