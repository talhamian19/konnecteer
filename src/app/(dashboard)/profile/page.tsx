"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit3, MapPin, Globe, Users, Calendar, Star, UserCheck,
  Camera, Check,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { VIBE_TAGS, COUNTRIES, LANGUAGES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock current user
const MOCK_USER = {
  id: "current-user",
  name: "Alex Johnson",
  email: "alex@example.com",
  image: null,
  username: "alexj",
  bio: "Football fan traveling the world to watch live matches. Argentina supporter since 2006. Always looking for fellow fans!",
  nationality: "USA",
  favoriteTeam: "Argentina",
  currentCity: "New York",
  languages: ["English", "Spanish"],
  goingAlone: true,
  ageRange: "25-34",
  vibeTags: ["international_traveler", "hardcore_fan"],
  createdAt: new Date("2026-01-01"),
};

const STATS = [
  { label: "Parties Attended", value: "12" },
  { label: "Matches Watched", value: "8" },
  { label: "Connections", value: "47" },
  { label: "Cities Visited", value: "5" },
];

export default function ProfilePage() {
  const [user, setUser] = useState(MOCK_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
    toast.success("Profile updated!");
  };

  const toggleVibe = (vibe: string) => {
    setEditForm((prev) => ({
      ...prev,
      vibeTags: prev.vibeTags.includes(vibe)
        ? prev.vibeTags.filter((v) => v !== vibe)
        : [...prev.vibeTags, vibe],
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Profile hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/20 via-emerald-600/10 to-teal-600/5 border border-white/10 p-8 mb-6"
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-green-500/5 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-green-500/30">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback className="text-3xl font-black">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg">
              <Camera size={14} />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-black text-white">{user.name}</h1>
                <p className="text-white/50">@{user.username}</p>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="gap-2"
              >
                {isEditing ? <Check size={14} /> : <Edit3 size={14} />}
                {isEditing ? "Save Profile" : "Edit Profile"}
              </Button>
            </div>

            <p className="text-white/60 text-sm mt-3 leading-relaxed max-w-lg">{user.bio}</p>

            <div className="flex flex-wrap gap-3 mt-4 text-sm text-white/50">
              {user.currentCity && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} /> {user.currentCity}
                </span>
              )}
              {user.nationality && (
                <span className="flex items-center gap-1.5">
                  <Globe size={13} /> {user.nationality}
                </span>
              )}
              {user.favoriteTeam && (
                <span className="flex items-center gap-1.5">
                  <Star size={13} /> {user.favoriteTeam}
                </span>
              )}
              {user.goingAlone && (
                <span className="flex items-center gap-1.5 text-green-400">
                  <UserCheck size={13} /> Going Alone Mode
                </span>
              )}
            </div>

            {/* Vibe tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {user.vibeTags.map((tag) => {
                const vt = VIBE_TAGS.find((v) => v.value === tag);
                return vt ? (
                  <span key={tag} className="text-xs bg-green-500/15 text-green-400 border border-green-500/25 px-2.5 py-1 rounded-full">
                    {vt.emoji} {vt.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="p-4 text-center">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Edit form */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 space-y-4">
                <h3 className="text-white font-bold">Edit Profile</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/50 mb-1.5 block">Name</label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1.5 block">Username</label>
                    <Input
                      value={editForm.username}
                      onChange={(e) => setEditForm((p) => ({ ...p, username: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1.5 block">Current City</label>
                    <Input
                      value={editForm.currentCity}
                      onChange={(e) => setEditForm((p) => ({ ...p, currentCity: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1.5 block">Nationality</label>
                    <select
                      value={editForm.nationality}
                      onChange={(e) => setEditForm((p) => ({ ...p, nationality: e.target.value }))}
                      className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} className="bg-gray-900">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))}
                    rows={3}
                    className="flex w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-2 block">Fan Vibes</label>
                  <div className="flex flex-wrap gap-2">
                    {VIBE_TAGS.map((tag) => (
                      <button
                        key={tag.value}
                        onClick={() => toggleVibe(tag.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                          editForm.vibeTags.includes(tag.value)
                            ? "bg-green-500/20 border-green-500/40 text-green-400"
                            : "bg-white/5 border-white/10 text-white/50"
                        )}
                      >
                        {tag.emoji} {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <p className="text-sm text-white font-medium">Going Alone Mode</p>
                    <p className="text-xs text-white/40">AI matches you with solo-friendly groups</p>
                  </div>
                  <button
                    onClick={() => setEditForm((p) => ({ ...p, goingAlone: !p.goingAlone }))}
                    className={cn("w-12 h-6 rounded-full transition-all relative", editForm.goingAlone ? "bg-green-500" : "bg-white/10")}
                  >
                    <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm", editForm.goingAlone ? "left-6" : "left-0.5")} />
                  </button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Recent activity */}
          {!isEditing && (
            <Card className="p-5">
              <h3 className="text-white font-bold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: "RSVPd to", target: "International Fan Zone", time: "2h ago", emoji: "✅" },
                  { action: "Joined chat in", target: "Argentina vs France", time: "4h ago", emoji: "💬" },
                  { action: "Created", target: "NYC Watch Party", time: "2d ago", emoji: "🎉" },
                ].map((activity) => (
                  <div key={activity.target} className="flex items-center gap-3 text-sm">
                    <span className="text-xl">{activity.emoji}</span>
                    <div className="flex-1">
                      <span className="text-white/50">{activity.action} </span>
                      <span className="text-white font-medium">{activity.target}</span>
                    </div>
                    <span className="text-white/30 text-xs">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-white font-bold text-sm mb-4">Fan Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Favorite Team</span>
                <span className="text-white font-medium">{user.favoriteTeam}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Age Range</span>
                <span className="text-white font-medium">{user.ageRange}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-white/50">Languages</span>
                <div className="text-right">
                  {user.languages.map((l) => (
                    <span key={l} className="text-white text-xs block">{l}</span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Going Alone</span>
                <span className={user.goingAlone ? "text-green-400 font-medium" : "text-white/50"}>
                  {user.goingAlone ? "Yes 🙋" : "No"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-white font-bold text-sm mb-3">Member since</h3>
            <p className="text-white/50 text-sm">
              {user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
