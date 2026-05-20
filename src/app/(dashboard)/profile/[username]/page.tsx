"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Calendar, Users, MessageSquare, Settings, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { UserProfile, EventWithDetails } from "@/types";

type ProfileData = UserProfile & {
  hostedEvents: EventWithDetails[];
  _count: { hostedEvents: number; attendances: number; tagAlongPosts: number; talkAlongPosts: number };
};

export default function ProfilePage() {
  const { username } = useParams();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"events" | "about">("events");

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then((r) => r.json())
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>;
  if (!profile || (profile as { error?: string }).error) return <div className="text-center py-20 text-gray-400">User not found</div>;

  const isMe = session?.user?.id === profile.id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Profile header */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          {profile.image ? (
            <Image src={profile.image} alt="" width={72} height={72} className="rounded-full flex-shrink-0" />
          ) : (
            <div className="w-18 h-18 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center text-2xl font-bold text-white w-[72px] h-[72px]">
              {profile.name?.[0] || "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-white truncate">{profile.name}</h1>
              {profile.isVerified && <BadgeCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
            </div>
            {profile.username && <p className="text-gray-400 text-sm mb-2">@{profile.username}</p>}
            {profile.bio && <p className="text-gray-300 text-sm mb-3 leading-relaxed">{profile.bio}</p>}
            {profile.location && (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <MapPin className="w-3.5 h-3.5" /> {profile.location}
              </div>
            )}
          </div>
          {isMe && (
            <Link href="/settings" className="flex-shrink-0 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10">
              <Settings className="w-5 h-5" />
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/[0.06]">
          {[
            { label: "Events", value: profile._count?.hostedEvents || 0 },
            { label: "Attended", value: profile._count?.attendances || 0 },
            { label: "Tag Alongs", value: profile._count?.tagAlongPosts || 0 },
            { label: "Talk Alongs", value: profile._count?.talkAlongPosts || 0 },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["events", "about"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}>
            {t === "events" ? "Events" : "About"}
          </button>
        ))}
      </div>

      {/* Events tab */}
      {tab === "events" && (
        <>
          {profile.hostedEvents?.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No events hosted yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.hostedEvents?.map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/explore/${event.id}`}>
                    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 hover:border-white/15 transition-all">
                      {event.coverImage && (
                        <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                          <Image src={event.coverImage} alt="" fill className="object-cover" />
                        </div>
                      )}
                      <h3 className="text-white font-medium text-sm line-clamp-1 mb-1">{event.title}</h3>
                      <p className="text-gray-400 text-xs mb-2">{format(new Date(event.startTime), "MMM d, yyyy")}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" />{event._count?.attendances || 0}</span>
                        <span className={event.isFree ? "text-emerald-400" : "text-white"}>{event.isFree ? "Free" : `$${event.price}`}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* About tab */}
      {tab === "about" && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 space-y-4 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Member since</p>
            <p className="text-white">{format(new Date(profile.createdAt), "MMMM yyyy")}</p>
          </div>
          {profile.bio && (
            <div>
              <p className="text-gray-400 mb-1">Bio</p>
              <p className="text-white leading-relaxed">{profile.bio}</p>
            </div>
          )}
          {profile.location && (
            <div>
              <p className="text-gray-400 mb-1">Location</p>
              <p className="text-white">{profile.location}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
