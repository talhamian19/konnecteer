"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
import { Camera, Loader2, User, Mail, MapPin, FileText, Save } from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch(`/api/users/${session.user.id}`)
        .then((r) => r.json())
        .then((user) => {
          setName(user.name || "");
          setUsername(user.username || "");
          setBio(user.bio || "");
          setLocation(user.location || "");
          setImage(user.image || "");
        });
    }
  }, [session?.user?.id]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "avatars");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const { url } = await res.json();
      setImage(url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!session?.user?.id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, bio, location, image }),
      });
      if (res.ok) {
        await update({ name, image });
        toast.success("Profile updated!");
      } else {
        const { error } = await res.json();
        toast.error(error || "Failed to update");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            {image ? (
              <Image src={image} alt="" width={72} height={72} className="rounded-full object-cover" />
            ) : (
              <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl font-bold text-emerald-400">
                {name?.[0] || "U"}
              </div>
            )}
            <label className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-colors">
              {uploading ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Camera className="w-3.5 h-3.5 text-white" />}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div>
            <p className="text-white font-medium">{name || "Your Name"}</p>
            <p className="text-gray-400 text-sm">{session?.user?.email}</p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Profile Info</h2>

          <div>
            <label className="text-gray-400 text-sm mb-1.5 block flex items-center gap-1"><User className="w-3 h-3" /> Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 text-sm" />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
              <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1.5 block flex items-center gap-1"><FileText className="w-3 h-3" /> Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
              placeholder="Tell people about yourself..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-sm resize-none" />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1.5 block flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-sm" />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl py-3 font-semibold hover:opacity-90 disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
