"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Calendar, Users, MessageSquare, ArrowLeft, ArrowRight,
  Upload, X, Loader2, Hash, MapPin, Clock, DollarSign,
} from "lucide-react";

type CreateType = "event" | "tag-along" | "talk-along";

const CATEGORIES = ["SPORTS", "MUSIC", "FOOD", "HIKE", "PARTY", "TRAVEL", "TECH", "ART", "FITNESS", "NETWORKING", "OTHER"];

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [type, setType] = useState<CreateType>((searchParams.get("type") as CreateType) || "event");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Shared fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  // Event-specific
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("0");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Tag-along specific
  const [activity, setActivity] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [vibeTags, setVibeTags] = useState<string[]>([]);
  const [vibeInput, setVibeInput] = useState("");

  // Talk-along specific
  const [topic, setTopic] = useState("");

  function addHashtag() {
    const tag = hashtagInput.trim().replace(/^#/, "").toLowerCase();
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setHashtagInput("");
    }
  }

  function addVibe() {
    const v = vibeInput.trim().toLowerCase();
    if (v && !vibeTags.includes(v)) {
      setVibeTags([...vibeTags, v]);
      setVibeInput("");
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "events");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const { url } = await res.json();
      setCoverImage(url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!session) { router.push("/login"); return; }
    setLoading(true);
    try {
      let res: Response;
      if (type === "event") {
        res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title, description, location, startTime, endTime: endTime || undefined,
            category, isFree, price: parseFloat(price) || 0,
            maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
            coverImage, hashtags,
          }),
        });
        const data = await res.json();
        if (res.ok) { toast.success("Event created!"); router.push(`/explore/${data.id}`); }
        else toast.error(data.error);
      } else if (type === "tag-along") {
        res = await fetch("/api/tag-along", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title, description, location, activity, scheduledAt, category,
            maxPeople: maxPeople ? parseInt(maxPeople) : undefined,
            vibeTags, hashtags,
          }),
        });
        const data = await res.json();
        if (res.ok) { toast.success("Tag Along posted!"); router.push(`/tag-along/${data.id}`); }
        else toast.error(data.error);
      } else {
        res = await fetch("/api/talk-along", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, topic, hashtags }),
        });
        const data = await res.json();
        if (res.ok) { toast.success("Talk Along started!"); router.push(`/talk-along/${data.id}`); }
        else toast.error(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  const totalSteps = type === "talk-along" ? 2 : 3;
  const canContinue = step === 1 ? !!title :
    step === 2 ? (type === "event" ? !!location && !!startTime : type === "tag-along" ? !!location && !!activity && !!scheduledAt : !!topic) :
    true;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Type picker */}
      {step === 1 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { t: "event" as CreateType, icon: Calendar, label: "Event", color: "from-emerald-500/20" },
            { t: "tag-along" as CreateType, icon: Users, label: "Tag Along", color: "from-blue-500/20" },
            { t: "talk-along" as CreateType, icon: MessageSquare, label: "Talk Along", color: "from-purple-500/20" },
          ].map(({ t, icon: Icon, label, color }) => (
            <button key={t} onClick={() => setType(t)}
              className={`p-4 rounded-2xl border transition-all text-center ${type === t ? `bg-gradient-to-b ${color} to-transparent border-white/20` : "bg-white/[0.03] border-white/[0.07] hover:border-white/15"}`}>
              <Icon className={`w-6 h-6 mx-auto mb-2 ${type === t ? "text-white" : "text-gray-500"}`} />
              <span className={`text-sm font-medium ${type === t ? "text-white" : "text-gray-400"}`}>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < step ? "bg-emerald-500" : "bg-white/10"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-5"
        >
          {/* Step 1 — title & description */}
          {step === 1 && (
            <>
              <div>
                <h1 className="text-xl font-bold text-white mb-1">
                  {type === "event" ? "What's the event?" : type === "tag-along" ? "What's your plan?" : "Start a discussion"}
                </h1>
                <p className="text-gray-400 text-sm">Give it a name and describe it</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={type === "event" ? "e.g. Rooftop Networking Night" : type === "tag-along" ? "e.g. Sunday morning hike to the peak" : "e.g. What's the best tech stack in 2025?"}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-sm"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Tell people what to expect..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-sm resize-none"
                />
              </div>

              {/* Image upload (events) */}
              {type === "event" && (
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Cover Image</label>
                  {coverImage ? (
                    <div className="relative">
                      <img src={coverImage} alt="" className="w-full h-40 object-cover rounded-xl" />
                      <button onClick={() => setCoverImage(null)} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-white/20 hover:text-gray-300 transition-colors"
                    >
                      {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                      <span className="text-sm">Click to upload</span>
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
              )}
            </>
          )}

          {/* Step 2 — location/time/topic */}
          {step === 2 && type === "event" && (
            <>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Location & Time</h2>
                <p className="text-gray-400 text-sm">Where and when is it?</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block flex items-center gap-1"><MapPin className="w-3 h-3" /> Location *</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Address or venue name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block flex items-center gap-1"><Clock className="w-3 h-3" /> Start *</label>
                  <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-emerald-500/50 text-sm" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">End</label>
                  <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-emerald-500/50 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 text-sm">
                  {CATEGORIES.map((c) => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block flex items-center gap-1"><DollarSign className="w-3 h-3" /> Pricing</label>
                <div className="flex gap-3 mb-3">
                  <button onClick={() => setIsFree(true)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${isFree ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-gray-400 border border-white/10"}`}>Free</button>
                  <button onClick={() => setIsFree(false)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${!isFree ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-gray-400 border border-white/10"}`}>Paid</button>
                </div>
                {!isFree && (
                  <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price in USD"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-sm" />
                )}
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Max Attendees (optional)</label>
                <input type="number" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} placeholder="No limit"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-sm" />
              </div>
            </>
          )}

          {step === 2 && type === "tag-along" && (
            <>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Plan Details</h2>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Activity *</label>
                <input value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="e.g. Hiking, Coffee, Concert"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-sm" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Location *</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Where?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-sm" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">When *</label>
                <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none text-sm">
                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Max People</label>
                  <input type="number" value={maxPeople} onChange={(e) => setMaxPeople(e.target.value)} placeholder="Any"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-gray-500 focus:outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Vibe Tags</label>
                <div className="flex gap-2 mb-2">
                  <input value={vibeInput} onChange={(e) => setVibeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addVibe())}
                    placeholder="e.g. chill, adventurous..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none text-sm" />
                  <button onClick={addVibe} className="px-3 py-2 bg-white/10 rounded-xl text-white text-sm">Add</button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {vibeTags.map((v) => (
                    <span key={v} className="flex items-center gap-1 bg-blue-500/15 text-blue-400 text-xs px-2 py-1 rounded-full">
                      {v} <button onClick={() => setVibeTags(vibeTags.filter((t) => t !== v))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && type === "talk-along" && (
            <>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Discussion Topic</h2>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Topic *</label>
                <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Career advice, Travel tips, Tech discussion"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-sm" />
              </div>
            </>
          )}

          {/* Step 3 — hashtags & review */}
          {step === 3 && (
            <>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Hashtags & Review</h2>
                <p className="text-gray-400 text-sm">Add hashtags to help people discover your post</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block flex items-center gap-1"><Hash className="w-3 h-3" /> Hashtags</label>
                <div className="flex gap-2 mb-2">
                  <input value={hashtagInput} onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHashtag())}
                    placeholder="e.g. networking, outdoor..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none text-sm" />
                  <button onClick={addHashtag} className="px-3 py-2 bg-white/10 rounded-xl text-white text-sm">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((h) => (
                    <span key={h} className="flex items-center gap-1 bg-emerald-500/15 text-emerald-400 text-xs px-2.5 py-1 rounded-full">
                      #{h} <button onClick={() => setHashtags(hashtags.filter((t) => t !== h))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Review summary */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-2 text-sm">
                <h3 className="text-white font-medium mb-3">Review</h3>
                <p className="text-gray-300">{title}</p>
                {type === "event" && <p className="text-gray-400">📍 {location} · {startTime && new Date(startTime).toLocaleDateString()}</p>}
                {type === "tag-along" && <p className="text-gray-400">📍 {location} · {activity}</p>}
                {type === "talk-along" && <p className="text-gray-400">💬 {topic}</p>}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        {step < totalSteps ? (
          <button
            disabled={!canContinue}
            onClick={() => setStep(step + 1)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl py-3 font-semibold hover:opacity-90 disabled:opacity-40"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl py-3 font-semibold hover:opacity-90 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {type === "event" ? "Create Event" : type === "tag-along" ? "Post Plan" : "Start Discussion"}
          </button>
        )}
      </div>
    </div>
  );
}
